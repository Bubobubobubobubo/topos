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
   */
  vimMode: boolean;
  theme: string;
  font: string;
  font_size: number;
  universes: Universes;
  selected_universe: string;
  line_numbers: boolean;
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
   */

  public vimMode: boolean = false;
  public theme: string = "materialDark";
  public font: string = "SpaceMono";
  public font_size: number = 22;
  public universes: Universes;
  public selected_universe: string = "Default";
  public line_numbers: boolean = true;

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
    localStorage.setItem("topos", JSON.stringify(this.data));
  }
}
