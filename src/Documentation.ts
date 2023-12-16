import { type Editor } from "./main";
// Basics
import { introduction } from "./documentation/basics/welcome";
import { loading_samples } from "./documentation/learning/samples/loading_samples";
import { amplitude } from "./documentation/learning/audio_engine/amplitude";
import { effects } from "./documentation/learning/audio_engine/effects";
import { sampler } from "./documentation/learning/audio_engine/sampler";
import { sample_banks } from "./documentation/learning/samples/sample_banks";
import { audio_basics } from "./documentation/learning/audio_engine/audio_basics";
import { sample_list } from "./documentation/learning/samples/sample_list";
import { software_interface } from "./documentation/basics/interface";
import { shortcuts } from "./documentation/basics/keyboard";
import { code } from "./documentation/basics/code";
import { mouse } from "./documentation/basics/mouse";
// More
import { oscilloscope } from "./documentation/more/oscilloscope";
import { synchronisation } from "./documentation/more/synchronisation";
import { about } from "./documentation/more/about";
import { bonus } from "./documentation/more/bonus";
import { chaining } from "./documentation/patterns/chaining";
import { interaction } from "./documentation/basics/interaction";
import { time } from "./documentation/learning/time/time";
import { linear_time } from "./documentation/learning/time/linear_time";
import { cyclical_time } from "./documentation/learning/time/cyclical_time";
import { long_forms } from "./documentation/learning/time/long_forms";
import { midi } from "./documentation/learning/midi";
import { osc } from "./documentation/learning/osc";
import { patterns } from "./documentation/patterns/patterns";
import { functions } from "./documentation/patterns/functions";
import { generators } from "./documentation/patterns/generators";
import { variables } from "./documentation/patterns/variables";
import { probabilities } from "./documentation/patterns/probabilities";
import { lfos } from "./documentation/patterns/lfos";
import { ziffers_basics } from "./documentation/patterns/ziffers/ziffers_basics";
import { ziffers_scales } from "./documentation/patterns/ziffers/ziffers_scales";
import { ziffers_rhythm } from "./documentation/patterns/ziffers/ziffers_rhythm";
import { ziffers_algorithmic } from "./documentation/patterns/ziffers/ziffers_algorithmic";
import { ziffers_tonnetz } from "./documentation/patterns/ziffers/ziffers_tonnetz";
import { ziffers_syncing } from "./documentation/patterns/ziffers/ziffers_syncing";

import { synths } from "./documentation/learning/audio_engine/synths";

// Setting up the Markdown converter with syntax highlighting
import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import { createDocumentationStyle } from "./DomElements";
import { filters } from "./documentation/learning/audio_engine/filters";
showdown.setFlavor("github");

export const key_shortcut = (shortcut: string): string => {
  return `<kbd class="lg:px-2 lg:py-1.5 px-1 py-1 lg:text-sm text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">${shortcut}</kbd>`;
};

export const makeExampleFactory = (application: Editor): Function => {
  const make_example = (
    description: string,
    code: string,
    open: boolean = false,
  ) => {
    const codeId = `codeExample${application.exampleCounter++}`;
    // Store the code snippet in the data structure
    application.api.codeExamples[codeId] = code;

    return `
<details ${open ? "open" : ""}>
  <summary >${description}
    <button class="ml-4 py-1 align-top text-base px-4 hover:bg-green-700 bg-emerald-600 inline-block" onclick="app.api._playDocExample(app.api.codeExamples['${codeId}'])">▶️ Play</button>
    <button class="py-1 text-base px-4 hover:bg-neutral-600 bg-neutral-500 inline-block " onclick="app.api._stopDocExample()">&#x23f8;&#xFE0F; Pause</button>
    <button class="py-1 text-base px-4 hover:bg-neutral-900 bg-neutral-800 inline-block " onclick="navigator.clipboard.writeText(app.api.codeExamples['${codeId}'])">📎 Copy</button>
  </summary>
  \`\`\`javascript
  ${code}
  \`\`\`
</details>
`;
  };
  return make_example;
};

export const documentation_factory = (application: Editor) => {
  /**
   * Creates the documentation for the given application.
   * @param application The editor application.
   * @returns An object containing various documentation sections.
   */
  application.api.codeExamples = {};

  return {
    introduction: introduction(application),
    interface: software_interface(application),
    interaction: interaction(application),
    code: code(application),
    time: time(application),
    linear: linear_time(application),
    cyclic: cyclical_time(application),
    longform: long_forms(application),
    synths: synths(application),
    filters: filters(application),
    chaining: chaining(application),
    patterns: patterns(application),
    ziffers_basics: ziffers_basics(application),
    ziffers_scales: ziffers_scales(application),
    ziffers_algorithmic: ziffers_algorithmic(application),
    ziffers_rhythm: ziffers_rhythm(application),
    ziffers_tonnetz: ziffers_tonnetz(application),
    ziffers_syncing: ziffers_syncing(application),
    midi: midi(application),
    osc: osc(application),
    lfos: lfos(application),
    variables: variables(application),
    probabilities: probabilities(application),
    functions: functions(application),
    generators: generators(application),
    shortcuts: shortcuts(application),
    amplitude: amplitude(application),
    effects: effects(application),
    sampler: sampler(application),
    mouse: mouse(application),
    oscilloscope: oscilloscope(application),
    audio_basics: audio_basics(application),
    synchronisation: synchronisation(application),
    bonus: bonus(application),
    sample_list: sample_list(application),
    sample_banks: sample_banks(application),
    loading_samples: loading_samples(application),
    about: about(),
  };
};

export const showDocumentation = (app: Editor) => {
  /**
   * Shows or hides the documentation based on the current state of the app.
   * @param app - The Editor instance.
   */
  if (document.getElementById("app")?.classList.contains("hidden")) {
    document.getElementById("app")?.classList.remove("hidden");
    document.getElementById("documentation")?.classList.add("hidden");
    app.exampleIsPlaying = false;
  } else {
    document.getElementById("app")?.classList.add("hidden");
    document.getElementById("documentation")?.classList.remove("hidden");
    // Load and convert Markdown content from the documentation file
    let style = createDocumentationStyle(app);

    function update_and_assign(callback: Function) {
      let bindings = Object.keys(style).map((key) => ({
        type: "output",
        regex: new RegExp(`<${key}([^>]*)>`, "g"),
        //@ts-ignore
        replace: (match, p1) => `<${key} class="${style[key]}" ${p1}>`,
      }));
      callback(bindings)
    }
    update_and_assign((e: Object) => updateDocumentationContent(app, e));
  }
};

export const hideDocumentation = () => {
  /**
   * Hides the documentation section and shows the main application.
   */
  if (document.getElementById("app")?.classList.contains("hidden")) {
    document.getElementById("app")?.classList.remove("hidden");
    document.getElementById("documentation")?.classList.add("hidden");
  }
};

export const updateDocumentationContent = (app: Editor, bindings: any) => {
  /**
   * Updates the content of the documentation pane with the converted markdown.
   *
   * @param app - The editor application.
   * @param bindings - Additional bindings for the showdown converter.
   */
  let loading_message: string = "<h1 class='border-4 py-2 px-2 mx-48 mt-48 text-center text-2xl text-white'>Loading! <b class='text-red'>Clic to refresh!</b></h1>";
  const converter = new showdown.Converter({
    emoji: true,
    moreStyling: true,
    backslashEscapesHTMLTags: true,
    extensions: [showdownHighlight({ auto_detection: true }), ...bindings],
  });
  console.log(app.currentDocumentationPane);

  function _update_and_assign(callback: Function) {
    const converted_markdown = converter.makeHtml(
      app.docs[app.currentDocumentationPane],
    );
    callback(converted_markdown)
  }
  _update_and_assign((e: string)=> { 
    let display_content = e === undefined ? loading_message : e;
    document.getElementById("documentation-content")!.innerHTML = display_content; 
  })
  if (document.getElementById("documentation-content")!.innerHTML.replace(/"/g, "'") == loading_message.replace(/"/g, "'")) {
    setTimeout(() => {
      updateDocumentationContent(app, bindings);
    }, 100);
  }
}