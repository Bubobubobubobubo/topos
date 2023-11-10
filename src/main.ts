import { OscilloscopeConfig, runOscilloscope } from "./AudioVisualisation";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { Extension } from "@codemirror/state";
import {
  initializeSelectedUniverse,
  AppSettings,
  Universe,
  loadUniverserFromUrl,
} from "./FileManagement";
import { singleElements, buttonGroups, ElementMap } from "./DomElements";
import { registerFillKeys, registerOnKeyDown } from "./KeyActions";
import { installEditor } from "./EditorSetup";
import { documentation_factory } from "./Documentation";
import { EditorView } from "codemirror";
import { Clock } from "./Clock";
import { loadSamples, UserAPI } from "./API";
import * as oeis from 'jisg'
import * as zpatterns from 'zifferjs/src/patterns.ts'
import { makeArrayExtensions } from "./extensions/ArrayExtensions";
import "./style.css";
import { Universes, File, template_universes } from "./FileManagement";
import { tryEvaluate } from "./Evaluator";
// @ts-ignore
import showdown from "showdown";
import { makeStringExtensions } from "./extensions/StringExtensions";
import { installInterfaceLogic } from "./InterfaceLogic";
import { installWindowBehaviors, saveBeforeExit } from "./WindowBehavior";
import { drawEmptyBlinkers } from "./AudioVisualisation";
import { makeNumberExtensions } from "./extensions/NumberExtensions";
// @ts-ignore
import { registerSW } from "virtual:pwa-register";

if ("serviceWorker" in navigator) {
  registerSW();
}

export class Editor {
  // Universes and settings
  settings: AppSettings = new AppSettings();
  universes: Universes = template_universes;
  selected_universe: string = "Welcome";

  fill: boolean = false;
  local_index: number = 1;

  // Editor logic
  editor_mode: "global" | "local" | "init" | "notes" = "global";
  fontSize!: Compartment;
  withLineNumbers!: Compartment;
  vimModeCompartment!: Compartment;
  hoveringCompartment!: Compartment;
  completionsCompartment!: Compartment;
  chosenLanguage!: Compartment;
  dynamicPlugins!: Compartment;
  currentDocumentationPane: string = "introduction";
  exampleCounter: number = 0;
  exampleIsPlaying: boolean = false;
  editorExtensions: Extension[] = [];
  userPlugins: Extension[] = [];
  state!: EditorState;
  view!: EditorView;
  selectedExample: string | null = "";
  docs: { [key: string]: string } = {};
  public _mouseX: number = 0;
  public _mouseY: number = 0;
  show_error: boolean = false;
  buttonElements: Record<string, HTMLButtonElement[]> = {};
  interface: ElementMap = {};
  blinkTimeouts: Record<number, number> = {};
  osc: OscilloscopeConfig = {
    enabled: false,
    color: "#fdba74",
    thickness: 4,
    refresh: 1,
    fftSize: 1024,
    orientation: "horizontal",
    is3D: false,
    size: 1,
  };

  // UserAPI
  api: UserAPI;

  // Audio stuff
  audioContext: AudioContext;
  clock: Clock;
  dough_nudge: number = 20;
  manualPlay: boolean = false;
  isPlaying: boolean = false;

  // Hydra
  public hydra_backend: any;
  public hydra: any;

  constructor() {
    // ================================================================================
    // Build user interface
    // ================================================================================

    this.initializeElements();
    this.initializeButtonGroups();
    this.setCanvas(this.interface.feedback as HTMLCanvasElement);
    this.setCanvas(this.interface.scope as HTMLCanvasElement);
    try {
      this.loadHydraSynthAsync();
    } catch (error) {
      console.log("Couldn't start Hydra: ", error);
    }

    // ================================================================================
    // Loading the universe from local storage
    // ================================================================================

    this.universes = {
      ...this.settings.universes,
      ...template_universes,
    };
    initializeSelectedUniverse(this);

    // ================================================================================
    // Audio context and clock
    // ================================================================================

    this.audioContext = new AudioContext({ latencyHint: "playback" });
    this.clock = new Clock(this, this.audioContext);

    // ================================================================================
    // User API
    // ================================================================================

    this.api = new UserAPI(this);
    makeArrayExtensions(this.api);
    makeStringExtensions(this.api);
    makeNumberExtensions(this.api);

    // Passing the API to the User
    Object.entries(this.api).forEach(([name, value]) => {
      (globalThis as Record<string, any>)[name] = value;
    });

    // Passing OEIS generators to the User
    Object.entries(oeis).forEach(([name, value]) => {
      (globalThis as Record<string, any>)[name] = value;
    });

    // Passing ziffers sequences to the User
    Object.entries(zpatterns).forEach(([name, value]) => {
      (globalThis as Record<string, any>)[name] = value;
    });

    // ================================================================================
    // Building Documentation
    // ================================================================================

    let pre_loading = async () => {
      await loadSamples();
    };
    pre_loading();
    this.docs = documentation_factory(this);

    // ================================================================================
    // Application event listeners
    // ================================================================================

    registerFillKeys(this);
    registerOnKeyDown(this);
    installInterfaceLogic(this);
    drawEmptyBlinkers(this);

    // ================================================================================
    // Building CodeMirror Editor
    // ================================================================================

    installEditor(this);
    runOscilloscope(this.interface.scope as HTMLCanvasElement, this);

    // First evaluation of the init file
    tryEvaluate(this, this.universes[this.selected_universe.toString()].init);

    // Changing to global when opening
    this.changeModeFromInterface("global");

    // Loading universe from URL (if needed)
    loadUniverserFromUrl(this);

    this.setPeriodicSave(5000);
  }

  private getBuffer(type: string): any {
    const universe = this.universes[this.selected_universe.toString()];
    return type === "locals"
      ? universe[type][this.local_index]
      : universe[type as keyof Universe];
  }

  get note_buffer() {
    return this.getBuffer("notes");
  }

  get example_buffer() {
    return this.getBuffer("example");
  }

  get global_buffer() {
    return this.getBuffer("global");
  }

  get init_buffer() {
    return this.getBuffer("init");
  }

  get local_buffer() {
    return this.getBuffer("locals");
  }

  updateKnownUniversesView = () => {
    let itemTemplate = document.getElementById(
      "ui-known-universe-item-template"
    ) as HTMLTemplateElement;
    if (!itemTemplate) {
      console.warn("Missing template #ui-known-universe-item-template");
      return;
    }

    let existing_universes = document.getElementById("existing-universes");
    if (!existing_universes) {
      console.warn("Missing element #existing-universes");
      return;
    }

    let list = document.createElement("ul");
    list.className =
      "lg:h-80 lg:text-normal text-sm h-auto lg:w-80 w-auto lg:pb-2 lg:pt-2 overflow-y-scroll text-white lg:mb-4 border rounded-lg bg-neutral-800";

    list.append(
      ...Object.keys(this.universes).map((it) => {
        let item = itemTemplate.content.cloneNode(true) as DocumentFragment;
        let api = window as unknown as UserAPI; // It's dirty but okey
        item.querySelector(".universe-name")!.textContent = it;
        item
          .querySelector(".load-universe")
          ?.addEventListener("click", () => api._loadUniverseFromInterface(it));
        item
          .querySelector(".delete-universe")
          ?.addEventListener("click", () =>
            api._deleteUniverseFromInterface(it)
          );
        return item;
      })
    );

    existing_universes.innerHTML = "";
    existing_universes.append(list);
  };

  changeToLocalBuffer(i: number) {
    // Updating the CSS accordingly
    const tabs = document.querySelectorAll('[id^="tab-"]');
    const tab = tabs[i] as HTMLElement;
    tab.classList.add("bg-orange-300");
    for (let j = 0; j < tabs.length; j++) {
      if (j != i) tabs[j].classList.remove("bg-orange-300");
    }
    let tab_id = tab.id.split("-")[1];
    this.local_index = parseInt(tab_id);
    this.updateEditorView();
  }

  changeModeFromInterface(mode: "global" | "local" | "init" | "notes") {
    const interface_buttons: HTMLElement[] = [
      this.interface.local_button,
      this.interface.global_button,
      this.interface.init_button,
      this.interface.note_button,
    ];

    let changeColor = (button: HTMLElement) => {
      interface_buttons.forEach((button) => {
        let svg = button.children[0] as HTMLElement;
        if (svg.classList.contains("text-orange-300")) {
          svg.classList.remove("text-orange-300");
          button.classList.remove("text-orange-300");
        }
      });
      button.children[0].classList.remove("text-white");
      button.children[0].classList.add("text-orange-300");
      button.classList.add("text-orange-300");
      button.classList.add("fill-orange-300");
    };

    switch (mode) {
      case "local":
        if (this.interface.local_script_tabs.classList.contains("hidden")) {
          this.interface.local_script_tabs.classList.remove("hidden");
        }
        this.editor_mode = "local";
        this.local_index = 0;
        document.getElementById("editor")!.style.height = "calc(100% - 100px)";
        this.changeToLocalBuffer(this.local_index);
        changeColor(this.interface.local_button);
        break;
      case "global":
        if (!this.interface.local_script_tabs.classList.contains("hidden")) {
          this.interface.local_script_tabs.classList.add("hidden");
        }
        this.editor_mode = "global";
        document.getElementById("editor")!.style.height = "100%";
        changeColor(this.interface.global_button);
        break;
      case "init":
        if (!this.interface.local_script_tabs.classList.contains("hidden")) {
          this.interface.local_script_tabs.classList.add("hidden");
        }
        this.editor_mode = "init";
        changeColor(this.interface.init_button);
        break;
      case "notes":
        if (!this.interface.local_script_tabs.classList.contains("hidden")) {
          this.interface.local_script_tabs.classList.add("hidden");
        }
        this.editor_mode = "notes";
        changeColor(this.interface.note_button);
        break;
    }

    // If the editor is in notes mode, we need to update the selectedLanguage

    this.view.dispatch({
      effects: this.chosenLanguage.reconfigure(
        this.editor_mode == "notes" ? [markdown()] : [javascript()]
      ),
    });

    this.updateEditorView();
  }

  setButtonHighlighting(
    button: "play" | "pause" | "stop" | "clear",
    highlight: boolean
  ) {
    document.getElementById("play-label")!.textContent =
      button !== "pause" ? "Pause" : "Play";
    if (button !== "pause") {
      document.getElementById("pause-icon")!.classList.remove("hidden");
      document.getElementById("play-icon")!.classList.add("hidden");
    } else {
      document.getElementById("pause-icon")!.classList.add("hidden");
      document.getElementById("play-icon")!.classList.remove("hidden");
    }

    if (button === "stop") {
      this.isPlaying == false;
      document.getElementById("play-label")!.textContent = "Play";
      document.getElementById("pause-icon")!.classList.add("hidden");
      document.getElementById("play-icon")!.classList.remove("hidden");
    }

    this.flashBackground("#404040", 200);
    const possible_selectors = [
      '[id^="play-button-"]',
      '[id^="clear-button-"]',
      '[id^="stop-button-"]',
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
      case "stop":
        selector = 3;
        break;
    }
    document
      .querySelectorAll(possible_selectors[selector])
      .forEach((button) => {
        if (highlight) button.children[0].classList.add("animate-pulse");
      });
    // All other buttons must lose the highlighting
    document
      .querySelectorAll(
        possible_selectors.filter((_, index) => index != selector).join(",")
      )
      .forEach((button) => {
        button.children[0].classList.remove("animate-pulse");
        button.children[1].classList.remove("animate-pulse");
      });
  }

  unfocusPlayButtons() {
    document.querySelectorAll('[id^="play-button-"]').forEach((button) => {
      button.children[0].classList.remove("fill-orange-300");
      button.children[0].classList.remove("animate-pulse");
    });
  }

  updateEditorView(): void {
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.toString().length,
        insert: this.currentFile().candidate,
      },
    });
  }

  currentFile(): File {
    switch (this.editor_mode) {
      case "global":
        return this.global_buffer;
      case "local":
        return this.local_buffer;
      case "init":
        return this.init_buffer;
      case "notes":
        return this.note_buffer;
    }
  }

  /**
   * Flashes the background of the view and its gutters.
   * @param {string} color - The color to set.
   * @param {number} duration - Duration in milliseconds to maintain the color.
   */
  flashBackground(color: string, duration: number): void {
    const domElement = this.view.dom;
    const gutters = domElement.getElementsByClassName(
      "cm-gutter"
    ) as HTMLCollectionOf<HTMLElement>;

    domElement.classList.add("fluid-bg-transition");
    Array.from(gutters).forEach((gutter) =>
      gutter.classList.add("fluid-bg-transition")
    );

    domElement.style.backgroundColor = color;
    Array.from(gutters).forEach(
      (gutter) => (gutter.style.backgroundColor = color)
    );

    setTimeout(() => {
      domElement.style.backgroundColor = "";
      Array.from(gutters).forEach(
        (gutter) => (gutter.style.backgroundColor = "")
      );

      domElement.classList.remove("fluid-bg-transition");
      Array.from(gutters).forEach((gutter) =>
        gutter.classList.remove("fluid-bg-transition")
      );
    }, duration);
  }

  private initializeElements(): void {
    for (const [key, value] of Object.entries(singleElements)) {
      this.interface[key] = document.getElementById(
        value
      ) as ElementMap[keyof ElementMap];
    }
  }

  private initializeButtonGroups(): void {
    for (const [key, ids] of Object.entries(buttonGroups)) {
      this.buttonElements[key] = ids.map(
        (id) => document.getElementById(id) as HTMLButtonElement
      );
    }
  }

  private loadHydraSynthAsync(): void {
    var script = document.createElement("script");
    script.src = "https://unpkg.com/hydra-synth";
    script.async = true;
    script.onload = () => {
      console.log("Hydra loaded successfully");
      this.initializeHydra();
    };
    script.onerror = function() {
      console.error("Error loading Hydra script");
    };
    document.head.appendChild(script);
  }

  private initializeHydra(): void {
    // @ts-ignore
    this.hydra_backend = new Hydra({
      canvas: this.interface.hydra_canvas as HTMLCanvasElement,
      detectAudio: false,
      enableStreamCapture: false,
    });
    this.hydra = this.hydra_backend.synth;
  }

  private setCanvas(canvas: HTMLCanvasElement): void {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;

    // Assuming the canvas takes up the whole window
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }

  private setPeriodicSave(interval: number): void {
    setInterval(() => saveBeforeExit(this), interval)
  }
}

let app = new Editor();
installWindowBehaviors(app, window, false);
