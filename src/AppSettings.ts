import { tutorial_universe } from "./universes/tutorial";

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
   * @param send_clock - Whether or not to send midi clock
   * @param midi_clock_input - The name of the midi clock input
   * @param midi_clock_ppqn - The pulses per quarter note for midi clock
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
  send_clock: boolean;
  midi_clock_input: string|undefined;
  midi_clock_ppqn: number;
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
  Help: tutorial_universe,
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
   * @param send_clock - Whether or not to send midi clock
   * @param midi_clock_input - The name of the midi clock input
   * @param midi_clock_ppqn - The pulses per quarter note for midi clock

   */

  public vimMode: boolean = false;
  public theme: string = "materialDark";
  public font: string = "Victor Mono";
  public font_size: number = 24;
  public universes: Universes;
  public selected_universe: string = "Default";
  public line_numbers: boolean = true;
  public time_position: boolean = true;
  public tips: boolean = true;
  public send_clock: boolean = false;
  public midi_clock_input: string|undefined = undefined;
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
      this.send_clock = settingsFromStorage.send_clock;
      this.midi_clock_input = settingsFromStorage.midi_clock_input;
      this.midi_clock_ppqn = settingsFromStorage.midi_clock_ppqn || 24;
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
      send_clock: this.send_clock,
      midi_clock_input: this.midi_clock_input,
      midi_clock_ppqn: this.midi_clock_ppqn,
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
    this.send_clock = settings.send_clock;
    this.midi_clock_input = settings.midi_clock_input;
    this.midi_clock_ppqn = settings.midi_clock_ppqn;
    this.load_demo_songs = settings.load_demo_songs;
    localStorage.setItem("topos", JSON.stringify(this.data));
  }
}
