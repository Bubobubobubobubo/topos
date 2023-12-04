import { EditorView } from "codemirror";
import { vim } from "@replit/codemirror-vim";
import { type Editor } from "./main";
import {
  documentation_factory,
  hideDocumentation,
  showDocumentation,
  updateDocumentationContent,
} from "./Documentation";
import {
  type Universe,
  template_universe,
  template_universes,
  loadUniverse,
  emptyUrl,
  share,
  closeUniverseModal,
  openUniverseModal,
} from "./FileManagement";
import { loadSamples } from "./API";
import { tryEvaluate } from "./Evaluator";
import { inlineHoveringTips } from "./documentation/inlineHelp";
import { lineNumbers } from "@codemirror/view";
import { jsCompletions } from "./EditorSetup";
import { createDocumentationStyle } from "./DomElements";
import { saveState } from "./WindowBehavior";

export const installInterfaceLogic = (app: Editor) => {
  // Initialize style
  const documentationStyle = createDocumentationStyle(app);
  const bindings = Object.keys(documentationStyle).map((key) => ({
    type: "output",
    regex: new RegExp(`<${key}([^>]*)>`, "g"),
    //@ts-ignore
    replace: (match, p1) => `<${key} class="${documentationStyle[key]}" ${p1}>`,
  }));

  (app.interface.line_numbers_checkbox as HTMLInputElement).checked =
    app.settings.line_numbers;
  (app.interface.time_position_checkbox as HTMLInputElement).checked =
    app.settings.time_position;
  (app.interface.tips_checkbox as HTMLInputElement).checked = app.settings.tips;
  (app.interface.completion_checkbox as HTMLInputElement).checked =
    app.settings.completions;

  (app.interface.midi_clock_checkbox as HTMLInputElement).checked =
    app.settings.send_clock;
  (app.interface.midi_channels_scripts as HTMLInputElement).checked =
    app.settings.midi_channels_scripts;
  (app.interface.midi_clock_ppqn as HTMLInputElement).value =
    app.settings.midi_clock_ppqn.toString();
  (app.interface.load_demo_songs as HTMLInputElement).checked =
    app.settings.load_demo_songs;

  const tabs = document.querySelectorAll('[id^="tab-"]');
  // Iterate over the tabs with an index
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", (event) => {
      // Updating the CSS accordingly
      tabs[i].classList.add("bg-orange-300");
      for (let j = 0; j < tabs.length; j++) {
        if (j != i) tabs[j].classList.remove("bg-orange-300");
      }
      app.currentFile().candidate = app.view.state.doc.toString();

      let tab = event.target as HTMLElement;
      let tab_id = tab.id.split("-")[1];
      app.local_index = parseInt(tab_id);
      app.updateEditorView();
    });
  }

  app.interface.topos_logo.addEventListener("click", () => {
    hideDocumentation();
    app.updateKnownUniversesView();
    openUniverseModal();
  });

  app.buttonElements.play_buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (app.isPlaying) {
        app.setButtonHighlighting("pause", true);
        app.isPlaying = !app.isPlaying;
        app.clock.pause();
        app.api.MidiConnection.sendStopMessage();
      } else {
        app.setButtonHighlighting("play", true);
        app.isPlaying = !app.isPlaying;
        app.clock.start();
        app.api.MidiConnection.sendStartMessage();
      }
    });
  });

  app.buttonElements.clear_buttons.forEach((button) => {
    button.addEventListener("click", () => {
      app.setButtonHighlighting("clear", true);
      if (confirm("Do you want to reset the current universe?")) {
        app.universes[app.selected_universe] =
          structuredClone(template_universe);
        app.updateEditorView();
      }
    });
  });

  app.interface.documentation_button.addEventListener("click", () => {
    showDocumentation(app);
  });

  app.interface.destroy_universes_button.addEventListener("click", () => {
    if (confirm("Do you want to destroy all universes?")) {
      app.universes = {
        ...template_universes,
      };
      app.updateKnownUniversesView();
    }
  });

  app.interface.universe_viewer.addEventListener("keydown", (event: any) => {
    if (event.key === "Enter") {
      let content = (
        app.interface.universe_viewer as HTMLInputElement
      ).value.trim();
      if (content.length > 2 && content.length < 40) {
        if (content !== app.selected_universe) {
          Object.defineProperty(
            app.universes,
            content,
            // @ts-ignore
            Object.getOwnPropertyDescriptor(
              app.universes,
              app.selected_universe,
            ),
          );
          delete app.universes[app.selected_universe];
        }
        app.selected_universe = content;
        loadUniverse(app, app.selected_universe);
        (app.interface.universe_viewer as HTMLInputElement).placeholder =
          content;
        (app.interface.universe_viewer as HTMLInputElement).value = "";
      }
    }
  });

  app.interface.audio_nudge_range.addEventListener("input", () => {
    // TODO: rebuild this
    // app.clock.nudge = parseInt(
    //   (app.interface.audio_nudge_range as HTMLInputElement).value,
    // );
  });

  app.interface.dough_nudge_range.addEventListener("input", () => {
    app.dough_nudge = parseInt(
      (app.interface.dough_nudge_range as HTMLInputElement).value,
    );
  });

  app.interface.upload_universe_button.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.addEventListener("change", (event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = (evt) => {
          const data = JSON.parse(evt.target!.result as string);
          for (const [key, value] of Object.entries(data)) {
            app.universes[key] = value as Universe;
          }
        };
        reader.onerror = (evt) => {
          console.error("An error occurred reading the file:", evt);
        };
      }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  });

  app.interface.download_universe_button.addEventListener("click", () => {
    // Trigger save of the universe before downloading
    app.settings.saveApplicationToLocalStorage(app.universes, app.settings);

    // Generate a file name based on timestamp
    let fileName = `topos-universes-${Date.now()}.json`;

    // Create Blob and Object URL
    const blob = new Blob([JSON.stringify(app.settings.universes)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the Object URL to free resources
    URL.revokeObjectURL(url);
  });

  app.interface.load_universe_button.addEventListener("click", () => {
    let query = (app.interface.buffer_search as HTMLInputElement).value;
    if (query.length > 2 && query.length < 20 && !query.includes(" ")) {
      app.settings.selected_universe = query;
      loadUniverse(app, query);
      (app.interface.buffer_search as HTMLInputElement).value = "";
      closeUniverseModal();
      app.view.focus();
      emptyUrl();
    }
  });

  app.interface.eval_button.addEventListener("click", () => {
    app.currentFile().candidate = app.view.state.doc.toString();
    app.flashBackground("#404040", 200);
  });

  app.buttonElements.stop_buttons.forEach((button) => {
    button.addEventListener("click", () => {
      app.setButtonHighlighting("stop", true);
      app.isPlaying = false;
      app.clock.stop();
    });
  });

  app.interface.local_button.addEventListener("click", () =>
    app.changeModeFromInterface("local"),
  );
  app.interface.global_button.addEventListener("click", () =>
    app.changeModeFromInterface("global"),
  );
  app.interface.init_button.addEventListener("click", () =>
    app.changeModeFromInterface("init"),
  );
  app.interface.note_button.addEventListener("click", () =>
    app.changeModeFromInterface("notes"),
  );

  app.interface.font_family_selector.addEventListener("change", () => {
    //@ts-ignore
    let new_font = (app.interface.font_family_selector as HTMLSelectElement)
      .value;
    console.log("Picking new font : " + new_font);
    app.settings.font = new_font;

    app.view.dispatch({
      effects: app.fontSize.reconfigure(
        EditorView.theme({
          "&": { fontSize: app.settings.font_size + "px" },
          ".cm-content": {
            fontFamily: new_font,
            fontSize: app.settings.font_size + "px",
          },
          ".cm-gutters": { fontSize: app.settings.font_size + "px" },
        }),
      ),
    });
  });

  app.interface.font_size_input.addEventListener("input", () => {
    let new_value: string | number = (
      app.interface.font_size_input as HTMLInputElement
    ).value;
    app.settings.font_size = parseInt(new_value);
    // TODO: update the font size
    app.view.dispatch({
      effects: app.fontSize.reconfigure(
        EditorView.theme({
          "&": { fontSize: app.settings.font_size + "px" },
          ".cm-content": {
            fontFamily: app.settings.font,
            fontSize: app.settings.font_size + "px",
          },
          ".cm-gutters": { fontSize: app.settings.font_size + "px" },
        }),
      ),
    });
  });

  app.interface.settings_button.addEventListener("click", () => {
    // Populate the font selector
    const fontFamilySelect = document.getElementById(
      "font-family",
    ) as HTMLSelectElement | null;
    if (fontFamilySelect) {
      fontFamilySelect.value = app.settings.font;
    }

    // Populate the font family selector
    const doughNudgeRange = app.interface.dough_nudge_range as HTMLInputElement;
    doughNudgeRange.value = app.dough_nudge.toString();
    // @ts-ignore
    const doughNumber = document.getElementById(
      "doughnumber",
    ) as HTMLInputElement;
    doughNumber.value = app.dough_nudge.toString();
    if (app.settings.font_size === null) {
      app.settings.font_size = 12;
    }
    const fontSizeInput = app.interface.font_size_input as HTMLInputElement;
    fontSizeInput.value = app.settings.font_size.toString();

    // Get the right value to update graphical widgets
    const lineNumbersCheckbox = app.interface
      .line_numbers_checkbox as HTMLInputElement;
    lineNumbersCheckbox.checked = app.settings.line_numbers;
    const timePositionCheckbox = app.interface
      .time_position_checkbox as HTMLInputElement;
    timePositionCheckbox.checked = app.settings.time_position;
    const tipsCheckbox = app.interface.tips_checkbox as HTMLInputElement;
    tipsCheckbox.checked = app.settings.tips;
    const midiClockCheckbox = app.interface
      .midi_clock_checkbox as HTMLInputElement;
    midiClockCheckbox.checked = app.settings.send_clock;
    const midiChannelsScripts = app.interface
      .midi_channels_scripts as HTMLInputElement;
    midiChannelsScripts.checked = app.settings.midi_channels_scripts;
    const midiClockPpqn = app.interface.midi_clock_ppqn as HTMLInputElement;
    midiClockPpqn.value = app.settings.midi_clock_ppqn.toString();
    const loadDemoSongs = app.interface.load_demo_songs as HTMLInputElement;
    loadDemoSongs.checked = app.settings.load_demo_songs;
    const vimModeCheckbox = app.interface.vim_mode_checkbox as HTMLInputElement;
    vimModeCheckbox.checked = app.settings.vimMode;

    let modal_settings = document.getElementById("modal-settings");
    let editor = document.getElementById("editor");
    modal_settings?.classList.remove("invisible");

    editor?.classList.add("invisible");
  });

  app.interface.close_settings_button.addEventListener("click", () => {
    let modal_settings = document.getElementById("modal-settings");
    let editor = document.getElementById("editor");
    modal_settings?.classList.add("invisible");
    editor?.classList.remove("invisible");
    let new_value: string = (app.interface.font_size_input as HTMLInputElement)
      .value;
    app.settings.font_size = parseInt(new_value);
    // Update fontSize compartment with new font size value
    app.view.dispatch({
      effects: app.fontSize.reconfigure(
        EditorView.theme({
          "&": { fontSize: app.settings.font_size + "px" },
          ".cm-content": {
            fontFamily: app.settings.font,
            fontSize: app.settings.font_size + "px",
          },
          ".cm-gutters": { fontSize: app.settings.font_size + "px" },
        }),
      ),
    });
  });

  app.interface.close_universes_button.addEventListener("click", () => {
    saveState(app);
    openUniverseModal();
  });

  app.interface.share_button.addEventListener("click", async () => {
    // trigger a manual save
    app.currentFile().candidate = app.view.state.doc.toString();
    app.currentFile().committed = app.view.state.doc.toString();
    app.settings.saveApplicationToLocalStorage(app.universes, app.settings);
    // encode as a blob!
    await share(app);
  });

  app.interface.vim_mode_checkbox.addEventListener("change", () => {
    let checked = (app.interface.vim_mode_checkbox as HTMLInputElement).checked
      ? true
      : false;
    app.settings.vimMode = checked;
    app.view.dispatch({
      effects: app.vimModeCompartment.reconfigure(checked ? vim() : []),
    });
  });

  app.interface.line_numbers_checkbox.addEventListener("change", () => {
    let lineNumbersCheckbox = app.interface
      .line_numbers_checkbox as HTMLInputElement;
    let checked = lineNumbersCheckbox.checked ? true : false;
    app.settings.line_numbers = checked;
    app.view.dispatch({
      effects: app.withLineNumbers.reconfigure(checked ? [lineNumbers()] : []),
    });
  });

  app.interface.time_position_checkbox.addEventListener("change", () => {
    let timeviewer = document.getElementById("timeviewer") as HTMLElement;
    let checked = (app.interface.time_position_checkbox as HTMLInputElement)
      .checked
      ? true
      : false;
    app.settings.time_position = checked;
    checked
      ? timeviewer.classList.remove("hidden")
      : timeviewer.classList.add("hidden");
  });

  app.interface.tips_checkbox.addEventListener("change", () => {
    let checked = (app.interface.tips_checkbox as HTMLInputElement).checked
      ? true
      : false;
    app.settings.tips = checked;
    app.view.dispatch({
      effects: app.hoveringCompartment.reconfigure(
        checked ? inlineHoveringTips : [],
      ),
    });
  });

  app.interface.completion_checkbox.addEventListener("change", () => {
    let checked = (app.interface.completion_checkbox as HTMLInputElement)
      .checked
      ? true
      : false;
    app.settings.completions = checked;
    app.view.dispatch({
      effects: app.completionsCompartment.reconfigure(
        checked ? jsCompletions : [],
      ),
    });
  });

  app.interface.midi_clock_checkbox.addEventListener("change", () => {
    let checked = (app.interface.midi_clock_checkbox as HTMLInputElement)
      .checked
      ? true
      : false;
    app.settings.send_clock = checked;
  });

  app.interface.midi_channels_scripts.addEventListener("change", () => {
    let checked = (app.interface.midi_channels_scripts as HTMLInputElement)
      .checked
      ? true
      : false;
    app.settings.midi_channels_scripts = checked;
  });

  app.interface.midi_clock_ppqn.addEventListener("change", () => {
    let value = parseInt(
      (app.interface.midi_clock_ppqn as HTMLInputElement).value,
    );
    app.settings.midi_clock_ppqn = value;
  });

  app.interface.load_demo_songs.addEventListener("change", () => {
    let checked = (app.interface.load_demo_songs as HTMLInputElement).checked
      ? true
      : false;
    app.settings.load_demo_songs = checked;
  });

  app.interface.universe_creator.addEventListener("submit", (event) => {
    event.preventDefault();

    let data = new FormData(app.interface.universe_creator as HTMLFormElement);
    let universeName = data.get("universe") as string | null;

    if (universeName) {
      if (universeName.length > 2 && universeName.length < 20) {
        universeName = universeName.trim();
        app.settings.selected_universe = universeName;
        app.selected_universe = universeName;
        loadUniverse(app, universeName);
        (app.interface.buffer_search as HTMLInputElement).value = "";
        closeUniverseModal();
        app.view.focus();
      }
    }
  });

  tryEvaluate(app, app.universes[app.selected_universe.toString()].init);

  [
    "introduction",
    "sampler",
    "amplitude",
    "audio_basics",
    "reverb_delay",
    "interface",
    "interaction",
    "code",
    "time",
    "linear",
    "cyclic",
    "longform",
    "synths",
    "chaining",
    "patterns",
    "ziffers",
    "midi",
    "osc",
    "functions",
    "lfos",
    "probabilities",
    "variables",
    "synchronisation",
    "mouse",
    "shortcuts",
    "about",
    "bonus",
    "oscilloscope",
    "sample_list",
    "loading_samples",
  ].forEach((e) => {
    let name = `docs_` + e;
    document.getElementById(name)!.addEventListener("click", async () => {
      if (name !== "docs_sample_list") {
        app.currentDocumentationPane = e;
        updateDocumentationContent(app, bindings);
      } else {
        console.log("Loading samples!");
        await loadSamples().then(() => {
          app.docs = documentation_factory(app);
          app.currentDocumentationPane = e;
          updateDocumentationContent(app, bindings);
        });
      }
    });
  });
};
