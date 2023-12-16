import { type Editor } from "./main";

export type ElementMap = {
  [key: string]:
    | HTMLElement
    | HTMLButtonElement
    | HTMLDivElement
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLCanvasElement
    | HTMLFormElement
    | HTMLInputElement;
};

export const singleElements = {
  topos_logo: "topos-logo",
  fill_viewer: "fillviewer",
  load_universe_button: "load-universe-button",
  download_universe_button: "download-universes",
  upload_universe_button: "upload-universes",
  destroy_universes_button: "destroy-universes",
  documentation_button: "doc-button-1",
  eval_button: "eval-button-1",
  local_button: "local-button",
  global_button: "global-button",
  init_button: "init-button",
  note_button: "note-button",
  settings_button: "settings-button",
  close_settings_button: "close-settings-button",
  close_universes_button: "close-universes-button",
  universe_viewer: "universe-viewer",
  buffer_modal: "modal-buffers",
  buffer_search: "buffer-search",
  universe_creator: "universe-creator",
  local_script_tabs: "local-script-tabs",
  font_size_input: "font-size-input",
  font_family_selector: "font-family",
  vim_mode_checkbox: "vim-mode",
  line_numbers_checkbox: "show-line-numbers",
  time_position_checkbox: "show-time-position",
  tips_checkbox: "show-tips",
  completion_checkbox: "show-completions",
  midi_clock_checkbox: "send-midi-clock",
  midi_channels_scripts: "midi-channels-scripts",
  midi_clock_ppqn: "midi-clock-ppqn-input",
  theme_selector: "theme-selector",
  theme_previewer: "theme-previewer",
  load_demo_songs: "load-demo-songs",
  normal_mode_button: "normal-mode",
  vim_mode_button: "vim-mode",
  share_button: "share-button",
  audio_nudge_range: "audio_nudge",
  dough_nudge_range: "dough_nudge",
  error_line: "error_line",
  hydra_canvas: "hydra-bg",
  feedback: "feedback",
  scope: "scope",
};

export const buttonGroups = {
  play_buttons: ["play-button-1"],
  stop_buttons: ["stop-button-1"],
  clear_buttons: ["clear-button-1"],
};

//@ts-ignore
export const createDocumentationStyle = (app: Editor) => {
  /**
   * Creates a documentation style object.
   * @param {Editor} app - The editor object.
   * @returns {Object} - The documentation style object.
   */

  return {
    h1: "text-brightwhite lg:text-4xl text-xl lg:ml-4 lg:mx-4 mx-2 lg:my-4 my-2 lg:mb-4 mb-4 border-b-4 pt-4 pb-3 px-2",
    h2: "text-brightwhite lg:text-3xl text-xl lg:ml-4 lg:mx-4 mx-2 lg:my-4 my-2 lg:mb-4 mb-4 border-b-2 pt-12 pb-3 px-2",
    h3: "text-brightwhite lg:text-2xl text-xl lg:ml-4 lg:mx-4 mx-2 lg:my-4 my-2 border-l-2 border-b-2 lg:mb-4 mb-4 pb-2 px-2 lg:mt-16",
    ul: "text-underline ml-12",
    li: "list-disc lg:text-2xl text-base text-white lg:mx-4 mx-2 my-4 my-2 leading-normal",
    p: "lg:text-2xl text-base text-white lg:mx-6 mx-2 my-4 leading-normal",
    warning:
      "animate-pulse lg:text-2xl font-bold text-brightred lg:mx-6 mx-2 my-4 leading-normal",
    a: "lg:text-2xl text-base text-white",
    code: `lg:my-4 sm:my-1 text-base lg:text-xl block whitespace-pre overflow-x-hidden`,
    icode:
      "lg:my-1 my-1 lg:text-xl sm:text-xs text-brightwhite font-mono bg-brightblack",
    ic: "lg:my-1 my-1 lg:text-xl sm:text-xs text-brightwhite font-mono bg-brightblack",
    blockquote: "text-brightwhite border-l-4 border-white pl-4 my-4 mx-4",
    details:
      "lg:mx-20 py-2 px-6 lg:text-2xl text-white border-l-8 box-border bg-selection_foreground",
    summary: "font-semibold text-xl",
    table:
      "justify-center lg:my-12 my-2 lg:mx-12 mx-2 lg:text-2xl text-base w-full text-left text-white border-collapse",
    thead:
      "text-xs text-gray-700 uppercase",
    th: "",
    td: "",
    tr: "",
    box: "border bg-red",
  };
};
