import "./style.css";
import { EditorView } from "codemirror";
import { editorSetup } from "./EditorSetup";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { Clock } from "./Clock";
import { vim } from "@replit/codemirror-vim";
import { AppSettings } from "./AppSettings";
import { ViewUpdate } from "@codemirror/view";
import {
  highlightSelection,
  unhighlightSelection,
  rangeHighlighting,
} from "./highlightSelection";
import { UserAPI } from "./API";
import { Extension } from "@codemirror/state";
import {
  Universes,
  File,
  template_universe,
  template_universes,
} from "./AppSettings";
import { tryEvaluate } from "./Evaluator";
import { oneDark } from "@codemirror/theme-one-dark";


export class Editor {
  // Data structures for editor text management
  universes: Universes = template_universes;
  selected_universe: string;
  local_index: number = 1;
  editor_mode: "global" | "local" | "init" = "local";
  fontSize: Compartment;
  vimModeCompartment : Compartment;
  

  settings = new AppSettings();
  editorExtensions: Extension[] = [];
  userPlugins: Extension[] = [];
  state: EditorState;
  api: UserAPI;

  // Audio stuff
  audioContext: AudioContext;
  view: EditorView;
  clock: Clock;
  manualPlay: boolean = false;

  // Transport elements
  play_buttons: HTMLButtonElement[] = [
    document.getElementById("play-button-1") as HTMLButtonElement,
    document.getElementById("play-button-2") as HTMLButtonElement,
  ];
  pause_buttons: HTMLButtonElement[] = [
    document.getElementById("pause-button-1") as HTMLButtonElement,
    document.getElementById("pause-button-2") as HTMLButtonElement,
  ];
  clear_buttons: HTMLButtonElement[] = [
    document.getElementById("clear-button-1") as HTMLButtonElement,
    document.getElementById("clear-button-2") as HTMLButtonElement,
  ];

  // Script selection elements
  local_button: HTMLButtonElement = document.getElementById(
    "local-button"
  ) as HTMLButtonElement;
  global_button: HTMLButtonElement = document.getElementById(
    "global-button"
  ) as HTMLButtonElement;
  init_button: HTMLButtonElement = document.getElementById(
    "init-button"
  ) as HTMLButtonElement;
  settings_button: HTMLButtonElement = document.getElementById(
    "settings-button"
  ) as HTMLButtonElement;
  close_settings_button: HTMLButtonElement = document.getElementById(
    'close-settings-button'
  ) as HTMLButtonElement;
  universe_viewer: HTMLDivElement = document.getElementById(
    "universe-viewer"
  ) as HTMLDivElement;

  // Buffer modal
  buffer_modal: HTMLDivElement = document.getElementById(
    "modal-buffers"
  ) as HTMLDivElement;
  buffer_search: HTMLInputElement = document.getElementById(
    "buffer-search"
  ) as HTMLInputElement;

  // Local script tabs
  local_script_tabs: HTMLDivElement = document.getElementById(
    "local-script-tabs"
  ) as HTMLDivElement;

  // Font Size Slider
  font_size_slider: HTMLInputElement = document.getElementById('font-size-slider') as HTMLInputElement;
  font_size_witness: HTMLSpanElement = document.getElementById('font-size-witness') as HTMLSpanElement;

  // Editor mode selection
  normal_mode_button: HTMLButtonElement = document.getElementById('normal-mode') as HTMLButtonElement;
  vim_mode_button: HTMLButtonElement = document.getElementById('vim-mode') as HTMLButtonElement;

  constructor() {
    // ================================================================================
    // Loading the universe from local storage
    // ================================================================================

    this.selected_universe = this.settings.selected_universe;
    this.universe_viewer.innerHTML = `Topos: ${this.selected_universe}`;
    this.universes = { ...template_universes, ...this.settings.universes };

    // ================================================================================
    // Audio context and clock
    // ================================================================================

    this.audioContext = new AudioContext({ latencyHint: "playback" });
    this.clock = new Clock(this, this.audioContext);

    // ================================================================================
    // User API
    // ================================================================================

    this.api = new UserAPI(this);

    // ================================================================================
    // CodeMirror Management
    // ================================================================================

    console.log(this.settings)

    this.fontSize = new Compartment();
    this.vimModeCompartment = new Compartment();
    const vimPlugin = this.settings.vimMode ? vim() : [];
    const fontSizeModif = EditorView.theme( { 
      "&": { 
        fontSize: `${this.settings.font_size}px`,
       },
       ".cm-gutters": {
          fontSize: `${this.settings.font_size}px`,
       }
    })

    this.editorExtensions = [
      this.fontSize.of(fontSizeModif),
      this.vimModeCompartment.of(vimPlugin),
      editorSetup,
			oneDark,
      rangeHighlighting(),
      javascript(),
      EditorView.updateListener.of((v: ViewUpdate) => {
        v;
        // This is the event listener for the editor
      }),
    ];

    let dynamicPlugins = new Compartment();
    this.state = EditorState.create({
      extensions: [
        ...this.editorExtensions,
        EditorView.lineWrapping,
        dynamicPlugins.of(this.userPlugins),
      ],
      doc: this.universes[this.selected_universe].locals[this.local_index]
        .candidate,
    });

    this.view = new EditorView({
      parent: document.getElementById("editor") as HTMLElement,
      state: this.state,
    });

    // ================================================================================
    // Application event listeners
    // ================================================================================

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      // TAB should do nothing
      if (event.key === "Tab") {
        event.preventDefault();
      }

      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        this.setButtonHighlighting("pause", true);
        this.clock.pause();
      }
      if (event.ctrlKey && event.key === "p") {
        event.preventDefault();
        this.setButtonHighlighting("play", true);
        this.clock.start();
      }

      // Ctrl + Shift + V: Vim Mode
      if (
        (event.key === "v" || event.key === "V") &&
        event.ctrlKey &&
        event.shiftKey
      ) {
        this.settings.vimMode = !this.settings.vimMode;
        event.preventDefault();
        this.userPlugins = this.settings.vimMode ? [] : [vim()];
        this.view.dispatch({
          effects: dynamicPlugins.reconfigure(this.userPlugins),
        });
      }

      // Ctrl + Enter or Return: Evaluate the hovered code block
      if ((event.key === "Enter" || event.key === "Return") && event.ctrlKey) {
        event.preventDefault();
        // const code = this.getCodeBlock();
        this.currentFile.candidate = this.view.state.doc.toString();
        // tryEvaluate(this, this.currentFile);
      }

      // Shift + Enter or Ctrl + E: evaluate the line
      if (
        (event.key === "Enter" && event.shiftKey) ||
        (event.key === "e" && event.ctrlKey)
      ) {
        event.preventDefault(); // Prevents the addition of a new line
        this.currentFile.candidate = this.view.state.doc.toString();
        // const code = this.getSelectedLines();
      }

      // This is the modal to switch between universes
      if (event.ctrlKey && event.key === "b") {
        this.openBuffersModal();
      }

      // This is the modal that opens up the settings
      if (event.shiftKey && event.key === "Escape") {
        this.openSettingsModal();
      }

      // Switch to local files
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        this.changeModeFromInterface("local");
      }
      if (event.ctrlKey && event.key === "g") {
        event.preventDefault();
        this.changeModeFromInterface("global");
      }
      if (event.ctrlKey && event.key === "i") {
        event.preventDefault();
        this.changeModeFromInterface("init");
        this.changeToLocalBuffer(0);
      }
      [112, 113, 114, 115, 116, 117, 118, 119, 120].forEach(
        (keycode, index) => {
          if (event.keyCode === keycode) {
            event.preventDefault();
            if (event.ctrlKey) { 
              this.api.script(keycode - 111)
            } else {
              this.changeModeFromInterface("local");
              this.changeToLocalBuffer(index);
            }
          }
        }
      );

    if (event.keyCode == 121) { this.changeModeFromInterface("global"); }
    if (event.keyCode == 122) { this.changeModeFromInterface("init"); }
    });

    // ================================================================================
    // Interface buttons
    // ================================================================================

    const tabs = document.querySelectorAll('[id^="tab-"]');
    // Iterate over the tabs with an index
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", (event) => {
        // Updating the CSS accordingly
        tabs[i].classList.add("bg-orange-300");
        for (let j = 0; j < tabs.length; j++) {
          if (j != i) tabs[j].classList.remove("bg-orange-300");
        }
        this.currentFile.candidate = this.view.state.doc.toString();

        let tab = event.target as HTMLElement;
        let tab_id = tab.id.split("-")[1];
        this.local_index = parseInt(tab_id);
        this.updateEditorView();
      });
    }

    this.play_buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setButtonHighlighting("play", true);
        this.clock.start();
      });
    });

    this.clear_buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setButtonHighlighting("clear", true);
        if (confirm("Do you want to reset the current universe?")) {
          this.universes[this.selected_universe] = template_universe;
          this.updateEditorView();
        }
      });
    });

    this.pause_buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setButtonHighlighting("pause", true);
        this.clock.pause();
      });
    });

    this.local_button.addEventListener("click", () =>
      this.changeModeFromInterface("local")
    );
    this.global_button.addEventListener("click", () =>
      this.changeModeFromInterface("global")
    );
    this.init_button.addEventListener("click", () =>
      this.changeModeFromInterface("init")
    );

    this.settings_button.addEventListener("click", () => {
      this.font_size_slider.value = this.settings.font_size.toString();
      this.font_size_witness.innerHTML = `Font Size: ${this.settings.font_size}px`
      this.font_size_witness?.setAttribute('style', `font-size: ${this.settings.font_size}px;`)
      let modal_settings = document.getElementById('modal-settings');
      let editor = document.getElementById('editor');
      modal_settings?.classList.remove('invisible')
      editor?.classList.add('invisible')
    })

    this.close_settings_button.addEventListener("click", () => {
      let modal_settings = document.getElementById('modal-settings');
      let editor = document.getElementById('editor');
      modal_settings?.classList.add('invisible')
      editor?.classList.remove('invisible')
    })

    this.font_size_slider.addEventListener("input", () => {
      const new_value = this.font_size_slider.value;
      this.settings.font_size = parseInt(new_value);
      this.font_size_witness.style.fontSize = `${new_value}px`;
      this.font_size_witness.innerHTML = `Font Size: ${new_value}px`;

      let new_font_size = EditorView.theme({
        "&": { fontSize : new_value + "px", },
        ".cm-gutters": { fontSize : new_value + "px", },
      });
      this.view.dispatch({
        effects: this.fontSize.reconfigure(new_font_size)
      });
      this.settings.font_size = parseInt(new_value);
    })

    this.normal_mode_button.addEventListener("click", () => {
      this.settings.vimMode = false;
      this.view.dispatch({effects: this.vimModeCompartment.reconfigure([])});
    })

    this.vim_mode_button.addEventListener("click", () => {
      this.settings.vimMode = true;
      this.view.dispatch({effects: this.vimModeCompartment.reconfigure(vim())});
    })

    this.buffer_search.addEventListener("keydown", (event) => {
      this.changeModeFromInterface("local");
      if (event.key === "Enter") {
        let query = this.buffer_search.value;
        if (query.length > 2 && query.length < 20) {
          this.loadUniverse(query);
          this.settings.selected_universe = query;
          this.buffer_search.value = "";
          this.closeBuffersModal();
          // Focus on the editor
          this.view.focus();
        }
      }
    });
  }

  get global_buffer() {
    return this.universes[this.selected_universe.toString()].global;
  }

  get init_buffer() {
    return this.universes[this.selected_universe.toString()].init;
  }

  changeToLocalBuffer(i: number) {
    // Updating the CSS accordingly
    const tabs = document.querySelectorAll('[id^="tab-"]');
    const tab = tabs[i] as HTMLElement;
    tab.classList.add("bg-orange-300");
    for (let j = 0; j < tabs.length; j++) {
      if (j != i) tabs[j].classList.remove("bg-orange-300");
    }
    this.currentFile.candidate = this.view.state.doc.toString();

    let tab_id = tab.id.split("-")[1];
    this.local_index = parseInt(tab_id);
    this.updateEditorView();
  }

  changeModeFromInterface(mode: "global" | "local" | "init") {
    const interface_buttons: HTMLElement[] = [
      this.local_button,
      this.global_button,
      this.init_button,
    ];

    let changeColor = (button: HTMLElement) => {
      interface_buttons.forEach((button) => {
        let svg = button.children[0] as HTMLElement;
        if (svg.classList.contains("text-orange-300")) {
          svg.classList.remove("text-orange-300");
          svg.classList.add("text-white");
        }
      });
      button.children[0].classList.add("text-orange-300");
    };

    if (mode === this.editor_mode) return;
    switch (mode) {
      case "local":
        if (this.local_script_tabs.classList.contains("hidden")) {
          this.local_script_tabs.classList.remove("hidden");
        }
        this.currentFile.candidate = this.view.state.doc.toString();
        changeColor(this.local_button);
        this.editor_mode = "local";
        break;
      case "global":
        if (!this.local_script_tabs.classList.contains("hidden")) {
          this.local_script_tabs.classList.add("hidden");
        }
        this.currentFile.candidate = this.view.state.doc.toString();
        changeColor(this.global_button);
        this.editor_mode = "global";
        break;
      case "init":
        if (!this.local_script_tabs.classList.contains("hidden")) {
          this.local_script_tabs.classList.add("hidden");
        }
        this.currentFile.candidate = this.view.state.doc.toString();
        changeColor(this.init_button);
        this.changeToLocalBuffer(0);
        this.editor_mode = "init";
        break;
    }
    this.updateEditorView();
  }

  setButtonHighlighting(
    button: "play" | "pause" | "clear",
    highlight: boolean
  ) {
    const possible_selectors = [
      '[id^="play-button-"]',
      '[id^="pause-button-"]',
      '[id^="clear-button-"]',
    ];
    let selector: number;
    switch (button) {
      case "play":
        selector = 0;
        break;
      case "pause":
        selector = 1;
        break;
      case "clear":
        selector = 2;
        break;
    }
    document
      .querySelectorAll(possible_selectors[selector])
      .forEach((button) => {
        if (highlight) button.children[0].classList.add("fill-orange-300");
      });
    // All other buttons must lose the highlighting
    document
      .querySelectorAll(
        possible_selectors.filter((_, index) => index != selector).join(",")
      )
      .forEach((button) => {
        button.children[0].classList.remove("fill-orange-300");
        button.children[0].classList.remove("text-orange-300");
        button.children[0].classList.remove("bg-orange-300");
      });
  }

  unfocusPlayButtons() {
    document.querySelectorAll('[id^="play-button-"]').forEach((button) => {
      button.children[0].classList.remove("fill-orange-300");
    });
  }

  updateEditorView(): void {
    // Remove everything from the editor
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.toString().length,
        insert: "",
      },
    });

    // Insert something
    this.view.dispatch({
      changes: {
        from: 0,
        insert: this.currentFile.candidate,
      },
    });
  }

  get currentFile(): File {
    switch (this.editor_mode) {
      case "global":
        return this.global_buffer;
      case "local":
        return this.universes[this.selected_universe].locals[this.local_index];
      case "init":
        return this.init_buffer;
    }
  }

  loadUniverse(universeName: string) {
    this.currentFile.candidate = this.view.state.doc.toString();

    let selectedUniverse = universeName.trim();
    if (this.universes[selectedUniverse] === undefined) {
      this.universes[selectedUniverse] = template_universe;
    }
    this.selected_universe = this.settings.selected_universe;
    this.universe_viewer.innerHTML = `Topos: ${selectedUniverse}`;
    // We should also update the editor accordingly
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.toString().length,
        insert: "",
      },
    });
    this.view.dispatch({
      changes: { from: 0, insert: this.currentFile.candidate },
    });
  }

  getCodeBlock(): string {
    // Capture the position of the cursor
    let cursor = this.view.state.selection.main.head;
    const state = this.view.state;
    const { head } = state.selection.main;
    const currentLine = state.doc.lineAt(head);
    let startLine = currentLine;
    while (
      startLine.number > 1 &&
      !/^\s*$/.test(state.doc.line(startLine.number - 1).text)
    ) {
      startLine = state.doc.line(startLine.number - 1);
    }
    let endLine = currentLine;
    while (
      endLine.number < state.doc.lines &&
      !/^\s*$/.test(state.doc.line(endLine.number + 1).text)
    ) {
      endLine = state.doc.line(endLine.number + 1);
    }

    // this.view.dispatch({selection: {anchor: 0 + startLine.from, head: endLine.to}});
    highlightSelection(this.view);

    setTimeout(() => {
      unhighlightSelection(this.view);
      this.view.dispatch({ selection: { anchor: cursor, head: cursor } });
    }, 200);

    let result_string = state.doc.sliceString(startLine.from, endLine.to);
    result_string = result_string
      .split("\n")
      .map((line, index, lines) => {
        const trimmedLine = line.trim();
        if (
          index === lines.length - 1 ||
          /^\s/.test(lines[index + 1]) ||
          trimmedLine.startsWith("@")
        ) {
          return line;
        } else {
          return line + ";\\";
        }
      })
      .join("\n");
    return result_string;
  }

  getSelectedLines = (): string => {
    const state = this.view.state;
    const { from, to } = state.selection.main;
    const fromLine = state.doc.lineAt(from);
    const toLine = state.doc.lineAt(to);
    this.view.dispatch({
      selection: { anchor: 0 + fromLine.from, head: toLine.to },
    });
    // Release the selection and get the cursor back to its original position

    // Blink the text!
    highlightSelection(this.view);

    setTimeout(() => {
      unhighlightSelection(this.view);
      this.view.dispatch({ selection: { anchor: from, head: from } });
    }, 200);
    return state.doc.sliceString(fromLine.from, toLine.to);
  };

  openSettingsModal() {
    if (
      document.getElementById("modal-settings")!.classList.contains("invisible")
    ) {
      document.getElementById("editor")!.classList.add("invisible");
      document.getElementById("modal-settings")!.classList.remove("invisible");
    } else {
      this.closeSettingsModal();
    }
  }

  closeSettingsModal() {
    document.getElementById("editor")!.classList.remove("invisible");
    document.getElementById("modal-settings")!.classList.add("invisible");
  }

  openBuffersModal() {
    // If the modal is hidden, unhide it and hide the editor
    if (
      document.getElementById("modal-buffers")!.classList.contains("invisible")
    ) {
      document.getElementById("editor")!.classList.add("invisible");
      document.getElementById("modal-buffers")!.classList.remove("invisible");
      document.getElementById("buffer-search")!.focus();
    } else {
      this.closeBuffersModal();
    }
  }

  closeBuffersModal() {
    // @ts-ignore
    document.getElementById("buffer-search")!.value = "";
    document.getElementById("editor")!.classList.remove("invisible");
    document.getElementById("modal")!.classList.add("invisible");
    document.getElementById("modal-buffers")!.classList.add("invisible");
  }
}

const app = new Editor();

function startClock() {
  document.getElementById("editor")!.classList.remove("invisible");
  document.getElementById("modal")!.classList.add("hidden");
  document
    .getElementById("modal-container")!
    .classList.remove("motion-safe:animate-pulse");
  document
    .getElementById("start-button")!
    .removeEventListener("click", startClock);
  document.removeEventListener("keydown", startOnEnter);
  app.clock.start();
  app.view.focus();
  app.setButtonHighlighting("play", true);
}

function startOnEnter(e: KeyboardEvent) {
  if (e.code === "Enter" || e.code === "Space") startClock();
}

document.addEventListener("keydown", startOnEnter);
document.getElementById("start-button")!.addEventListener("click", startClock);

// When the user leaves the page, all the universes should be saved in the localStorage
window.addEventListener("beforeunload", () => {
  event.preventDefault();
  event.returnValue = "";
  // Iterate over all local files and set the candidate to the committed
  app.currentFile.candidate = app.view.state.doc.toString();
  app.currentFile.committed = app.view.state.doc.toString();
  app.settings.saveApplicationToLocalStorage(app.universes, app.settings);
});
