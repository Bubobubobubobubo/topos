import { tutorial_universe } from "./universes/tutorial"

export type Universes = { [key: string]: Universe }

export interface Universe {
  global: File
  locals: { [key: number]: File }
  init: File
}

export interface File {
  candidate: string
  committed: string
  evaluations: number
}

export interface Settings {
    vimMode: boolean
    theme: string
    font: string
    universes: Universes
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
  init: { candidate: "", committed: "", evaluations: 0 }
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
    init: { candidate: "", committed: "", evaluations: 0 }
  },
  "Help": tutorial_universe,
}
 
  
export class AppSettings {

  public vimMode: boolean = false
  public theme: string = "materialDark"
  public font: string = "SpaceMono"
  public universes: Universes

  constructor() {

    const settingsFromStorage = JSON.parse(localStorage.getItem('topos') || "{}");

   if (settingsFromStorage && Object.keys(settingsFromStorage).length !== 0) {
      // let settings = JSON.parse(localStorage.getItem("topos") as string)
      this.vimMode = settingsFromStorage.vimMode
      this.theme = settingsFromStorage.theme
      this.font = settingsFromStorage.font
      this.universes = settingsFromStorage.universes
    } else {
      this.universes = template_universes
    }

  }


  get data(): Settings {
    return {
      vimMode: this.vimMode,
      theme: this.theme,
      font: this.font,
      universes: this.universes
    }
  }

  saveApplicationToLocalStorage(universes: Universes, settings: Settings): void{
    this.universes = universes;
    this.vimMode = settings.vimMode;
    this.font = settings.font;
    localStorage.setItem('topos', JSON.stringify(this.data))
  }
}