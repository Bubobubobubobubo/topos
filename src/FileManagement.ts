// import { tutorial_universe } from "./universes/tutorial";
import { gzipSync, decompressSync, strFromU8 } from "fflate";
import { examples } from "./examples/excerpts";
import { type Editor } from "./main";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { tryEvaluate } from "./Evaluator";
export type Universes = { [key: string]: Universe };

export interface Universe {
  /**
   * Universe is a collection of files.
   *
   * @param global - Global file
   * @param locals - Local files
   * @param init - Init file
   * @param notes - Notes file
   */
  global: File;
  locals: { [key: number]: File };
  init: File;
  notes: File;
  example?: File;
}

export interface File {
  /**
   * A File is a set of the same text in different states.
   *
   * @param candidate - The text that is being edited
   * @param committed - The text that has been committed (e.g. stable)
   * @param evaluations - The number of times the text has been evaluated
   */
  candidate: string;
  committed?: string;
  evaluations?: number;
}

export interface Settings {
  /**
   * Settings for the Topos application.
   *
   * @param vimMode - Whether or not to use vim keybindings
   * @param theme - The name of the theme to use
   * @param font - The name of the font to use
   * @param font_size - The size of the font to use
   * @param universes - The set universes to use (e.g. saved files)
   * @param selected_universe - The name of the selected universe
   * @param line_numbers - Whether or not to show line numbers
   * @param time_position - Whether or not to show time position
   * @param tips - Whether or not to show tips
   * @param completions- Whether or not to show completions
   * @param send_clock - Whether or not to send midi clock
   * @param midi_channels_scripts - Whether midi input channels fires scripts
   * @param midi_clock_input - The name of the midi clock input
   * @param midi_clock_ppqn - The pulses per quarter note for midi clock
   * @param default_midi_input - The default midi input for incoming messages
   */
  vimMode: boolean;
  theme: string;
  font: string;
  font_size: number;
  universes: Universes;
  selected_universe: string;
  line_numbers: boolean;
  time_position: boolean;
  load_demo_songs: boolean;
  tips: boolean;
  completions: boolean;
  send_clock: boolean;
  midi_channels_scripts: boolean;
  midi_clock_input: string | undefined;
  midi_clock_ppqn: number;
  default_midi_input: string | undefined;
}

export const template_universe = {
  global: { candidate: "", committed: "", evaluations: 0 },
  locals: {
    1: { candidate: "", committed: "", evaluations: 0 },
    2: { candidate: "", committed: "", evaluations: 0 },
    3: { candidate: "", committed: "", evaluations: 0 },
    4: { candidate: "", committed: "", evaluations: 0 },
    5: { candidate: "", committed: "", evaluations: 0 },
    6: { candidate: "", committed: "", evaluations: 0 },
    7: { candidate: "", committed: "", evaluations: 0 },
    8: { candidate: "", committed: "", evaluations: 0 },
    9: { candidate: "", committed: "", evaluations: 0 },
  },
  init: { candidate: "", committed: "", evaluations: 0 },
  example: { candidate: "", committed: "", evaluations: 0 },
  notes: { candidate: "" },
};

export const template_universes = {
  Welcome: {
    global: { candidate: "", committed: "", evaluations: 0 },
    locals: {
      1: { candidate: "", committed: "", evaluations: 0 },
      2: { candidate: "", committed: "", evaluations: 0 },
      3: { candidate: "", committed: "", evaluations: 0 },
      4: { candidate: "", committed: "", evaluations: 0 },
      5: { candidate: "", committed: "", evaluations: 0 },
      6: { candidate: "", committed: "", evaluations: 0 },
      7: { candidate: "", committed: "", evaluations: 0 },
      8: { candidate: "", committed: "", evaluations: 0 },
      9: { candidate: "", committed: "", evaluations: 0 },
    },
    init: { candidate: "", committed: "", evaluations: 0 },
    example: { candidate: "", committed: "", evaluations: 0 },
    notes: { candidate: "" },
  },
  //Help: tutorial_universe,
};

export class AppSettings {
  /**
   * AppSettings is a class that stores the settings for the Topos application.
   * It is in charge of reading and writing to local storage and exposing that
   * information to the main application.
   *
   * @param vimMode - Whether or not to use vim keybindings
   * @param theme - The name of the theme to use
   * @param font - The name of the font to use
   * @param font_size - The size of the font to use
   * @param universes - The set universes to use (e.g. saved files)
   * @param selected_universe - The name of the selected universe
   * @param line_numbers - Whether or not to show line numbers
   * @param time_position - Whether or not to show time position
   * @param tips - Whether or not to show tips
   * @param completions - Whether or not to show completions
   * @param send_clock - Whether or not to send midi clock
   * @param midi_channels_scripts - Whether midi input channels fires scripts
   * @param midi_clock_input - The name of the midi clock input
   * @param midi_clock_ppqn - The pulses per quarter note for midi clock
   * @param default_midi_input - The default midi input for incoming messages
   */

  public vimMode: boolean = false;
  public theme: string = "toposTheme";
  public font: string = "IBM Plex Mono";
  public font_size: number = 24;
  public universes: Universes;
  public selected_universe: string = "Default";
  public line_numbers: boolean = true;
  public time_position: boolean = true;
  public tips: boolean = false;
  public completions: boolean = false;
  public send_clock: boolean = false;
  public midi_channels_scripts: boolean = true;
  public midi_clock_input: string | undefined = undefined;
  public default_midi_input: string | undefined = undefined;
  public midi_clock_ppqn: number = 24;
  public load_demo_songs: boolean = true;

  constructor() {
    const settingsFromStorage = JSON.parse(
      localStorage.getItem("topos") || "{}"
    );

    if (settingsFromStorage && Object.keys(settingsFromStorage).length !== 0) {
      // let settings = JSON.parse(localStorage.getItem("topos") as string)
      this.vimMode = settingsFromStorage.vimMode;
      this.theme = settingsFromStorage.theme;
      this.font = settingsFromStorage.font;
      this.font_size = settingsFromStorage.font_size;
      this.universes = settingsFromStorage.universes;
      this.selected_universe = settingsFromStorage.selected_universe;
      this.line_numbers = settingsFromStorage.line_numbers;
      this.time_position = settingsFromStorage.time_position;
      this.tips = settingsFromStorage.tips;
      this.completions = settingsFromStorage.completions;
      this.send_clock = settingsFromStorage.send_clock;
      this.midi_channels_scripts = settingsFromStorage.midi_channels_scripts;
      this.midi_clock_input = settingsFromStorage.midi_clock_input;
      this.midi_clock_ppqn = settingsFromStorage.midi_clock_ppqn || 24;
      this.default_midi_input = settingsFromStorage.default_midi_input;
      this.load_demo_songs = settingsFromStorage.load_demo_songs;
    } else {
      this.universes = template_universes;
    }
  }

  get_universe() {
    this.universes.universe_name;
  }

  get data(): Settings {
    /**
     * Returns the settings as a Settings object.
     */
    return {
      vimMode: this.vimMode,
      theme: this.theme,
      font: this.font,
      font_size: this.font_size,
      universes: this.universes,
      selected_universe: this.selected_universe,
      line_numbers: this.line_numbers,
      time_position: this.time_position,
      tips: this.tips,
      completions: this.completions,
      send_clock: this.send_clock,
      midi_channels_scripts: this.midi_channels_scripts,
      midi_clock_input: this.midi_clock_input,
      midi_clock_ppqn: this.midi_clock_ppqn,
      default_midi_input: this.default_midi_input,
      load_demo_songs: this.load_demo_songs,
    };
  }

  saveApplicationToLocalStorage(
    universes: Universes,
    settings: Settings
  ): void {
    /**
     * Main method to store the application to local storage.
     *
     * @param universes - The universes to save
     * @param settings - The settings to save
     */
    this.universes = universes;
    this.vimMode = settings.vimMode;
    this.font = settings.font;
    this.font_size = settings.font_size;
    this.selected_universe = settings.selected_universe;
    this.line_numbers = settings.line_numbers;
    this.time_position = settings.time_position;
    this.tips = settings.tips;
    this.completions = settings.completions;
    this.send_clock = settings.send_clock;
    this.midi_channels_scripts = settings.midi_channels_scripts;
    this.midi_clock_input = settings.midi_clock_input;
    this.midi_clock_ppqn = settings.midi_clock_ppqn;
    this.default_midi_input = settings.default_midi_input;
    this.load_demo_songs = settings.load_demo_songs;
    localStorage.setItem("topos", JSON.stringify(this.data));
  }
}

export const initializeSelectedUniverse = (app: Editor): void => {
  /**
   * Initializes the selected universe. If there is no selected universe, it
   * will create a new one. If there is a selected universe, it will load it.
   *
   * @param app - The main application
   * @returns void
   */
  if (app.settings.load_demo_songs) {
    let random_example = examples[Math.floor(Math.random() * examples.length)];
    app.selected_universe = "Demo";
    app.universes[app.selected_universe] = structuredClone(template_universe);
    app.universes[app.selected_universe].global.committed = random_example;
    app.universes[app.selected_universe].global.candidate = random_example;
  } else {
    try {
      app.selected_universe = app.settings.selected_universe;
      if (app.universes[app.selected_universe] === undefined)
        app.universes[app.selected_universe] =
          structuredClone(template_universe);
    } catch (error) {
      app.settings.selected_universe = "Welcome";
      app.selected_universe = app.settings.selected_universe;
      app.universes[app.selected_universe] = structuredClone(template_universe);
    }
  }
  (app.interface.universe_viewer as HTMLInputElement).placeholder! = `${app.selected_universe}`;
};

export const emptyUrl = () => {
  window.history.replaceState({}, document.title, "/");
};

export const share = async (app: Editor) => {
  async function bufferToBase64(buffer: Uint8Array) {
    const base64url: string = await new Promise((r) => {
      const reader = new FileReader();
      reader.onload = () => r(reader.result as string);
      reader.readAsDataURL(new Blob([buffer]));
    });
    return base64url.slice(base64url.indexOf(",") + 1);
  }
  let data = JSON.stringify({
    universe: app.settings.universes[app.selected_universe],
  });
  let encoded_data = gzipSync(new TextEncoder().encode(data), { level: 9 });
  const hashed_table = await bufferToBase64(encoded_data);
  const url = new URL(window.location.href);
  url.searchParams.set("universe", hashed_table);
  window.history.replaceState({}, "", url.toString());
  // Copy the text inside the text field
  navigator.clipboard.writeText(url.toString());
};

export const loadUniverserFromUrl = (app: Editor): void => {
  /**
   * Loads a universe from the URL bar.
   * @param app - The main application
   * @returns void
   */
  // Loading from URL bar
  let url = new URLSearchParams(window.location.search);
  if (url !== undefined) {
    let new_universe;
    if (url !== null) {
      const universeParam = url.get("universe");
      if (universeParam !== null) {
        let data = Uint8Array.from(atob(universeParam), (c) => c.charCodeAt(0));
        new_universe = JSON.parse(strFromU8(decompressSync(data)));
        const randomName: string = uniqueNamesGenerator({
          length: 2,
          separator: "_",
          dictionaries: [colors, animals],
        });
        loadUniverse(app, randomName, new_universe["universe"]);
        emptyUrl();
      }
    }
  }
};

export const loadUniverse = (
  app: Editor,
  universeName: string,
  universe: Universe = template_universe
): void => {
  let selectedUniverse = universeName.trim();
  if (app.universes[selectedUniverse] === undefined) {
    // Pushing a freshly cloned template universe to:
    // 1) the current session 2) the settings
    const freshUniverse = structuredClone(universe);
    app.universes[selectedUniverse] = freshUniverse;
    app.settings.universes[selectedUniverse] = freshUniverse;
  }
  // Updating references to the currently selected universe
  app.settings.selected_universe = selectedUniverse;
  app.selected_universe = selectedUniverse;
  (app.interface.universe_viewer as HTMLInputElement).placeholder! = `${selectedUniverse}`;
  // Updating the editor View to reflect the selected universe
  app.updateEditorView();
  // Evaluating the initialisation script for the selected universe
  tryEvaluate(app, app.universes[app.selected_universe.toString()].init);
};

export const openUniverseModal = (): void => {
  // If the modal is hidden, unhide it and hide the editor
  if (
    document.getElementById("modal-buffers")!.classList.contains("invisible")
  ) {
    document.getElementById("editor")!.classList.add("invisible");
    document.getElementById("modal-buffers")!.classList.remove("invisible");
    document.getElementById("buffer-search")!.focus();
  } else {
    closeUniverseModal();
  }
};

export const closeUniverseModal = (): void => {
  // @ts-ignore
  document.getElementById("buffer-search")!.value = "";
  document.getElementById("editor")!.classList.remove("invisible");
  document.getElementById("modal-buffers")!.classList.add("invisible");
};

export const openSettingsModal = (): void => {
  if (
    document.getElementById("modal-settings")!.classList.contains("invisible")
  ) {
    document.getElementById("editor")!.classList.add("invisible");
    document.getElementById("modal-settings")!.classList.remove("invisible");
  } else {
    closeSettingsModal();
  }
};

export const closeSettingsModal = (): void => {
  document.getElementById("editor")!.classList.remove("invisible");
  document.getElementById("modal-settings")!.classList.add("invisible");
};
