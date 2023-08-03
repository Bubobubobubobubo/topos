import { tutorial_universe } from "./universes/tutorial"

export type Universes = { [key: string]: Universe }

export interface Universe {
  global: File
  locals: { [key: number]: File }
  init: File
  notes: File
}

export interface File {
  candidate: string
  committed?: string
  evaluations?: number
}

export interface Settings {
    vimMode: boolean
    theme: string
    font: string
    font_size: number
    universes: Universes
    selected_universe: string
}

export const template_universe = {
  global: { candidate: "", committed: "", evaluations: 0 },
  locals: {
    1: { candidate: "", committed: "", evaluations: 0},
    2: { candidate: "", committed: "", evaluations: 0},
    3: { candidate: "", committed: "", evaluations: 0},
    4: { candidate: "", committed: "", evaluations: 0},
    5: { candidate: "", committed: "", evaluations: 0},
    6: { candidate: "", committed: "", evaluations: 0},
    7: { candidate: "", committed: "", evaluations: 0},
    8: { candidate: "", committed: "", evaluations: 0},
    9: { candidate: "", committed: "", evaluations: 0},
  },
  init: { candidate: "", committed: "", evaluations: 0 },
  notes: { candidate: "" },
}

export const template_universes = {
  "Default": {
    global: { candidate: "", committed: "", evaluations: 0 },
    locals: {
      1: { candidate: "", committed: "", evaluations: 0},
      2: { candidate: "", committed: "", evaluations: 0},
      3: { candidate: "", committed: "", evaluations: 0},
      4: { candidate: "", committed: "", evaluations: 0},
      5: { candidate: "", committed: "", evaluations: 0},
      6: { candidate: "", committed: "", evaluations: 0},
      7: { candidate: "", committed: "", evaluations: 0},
      8: { candidate: "", committed: "", evaluations: 0},
      9: { candidate: "", committed: "", evaluations: 0},
    },
    init: { candidate: "", committed: "", evaluations: 0 },
    notes: { candidate: "// NOTES" },
  },
  "Help": tutorial_universe,
}
 
  
export class AppSettings {

  public vimMode: boolean = false
  public theme: string = "materialDark"
  public font: string = "SpaceMono"
  public font_size: number = 22 
  public universes: Universes
  public selected_universe: string = "Default"

  constructor() {

    const settingsFromStorage = JSON.parse(localStorage.getItem('topos') || "{}");

   if (settingsFromStorage && Object.keys(settingsFromStorage).length !== 0) {
      // let settings = JSON.parse(localStorage.getItem("topos") as string)
      this.vimMode = settingsFromStorage.vimMode
      this.theme = settingsFromStorage.theme
      this.font = settingsFromStorage.font
      this.font_size = settingsFromStorage.font_size
      this.universes = settingsFromStorage.universes
      this.selected_universe = settingsFromStorage.selected_universe
    } else {
      this.universes = template_universes
    }

  }


  get data(): Settings {
    return {
      vimMode: this.vimMode,
      theme: this.theme,
      font: this.font,
      font_size: this.font_size,
      universes: this.universes,
      selected_universe: this.selected_universe
    }
  }

  saveApplicationToLocalStorage(universes: Universes, settings: Settings): void{
    this.universes = universes;
    this.vimMode = settings.vimMode;
    this.font = settings.font;
    this.font_size = settings.font_size;
    this.selected_universe = settings.selected_universe;
    localStorage.setItem('topos', JSON.stringify(this.data))
  }
}