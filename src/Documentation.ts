import { type Editor } from "./main";
// Basics
import { introduction } from "./documentation/basics/welcome";
import { loading_samples } from "./documentation/samples/loading_samples";
import { amplitude } from "./documentation/audio_engine/amplitude";
import { distortion } from "./documentation/audio_engine/distortion";
import { reverb } from "./documentation/audio_engine/reverb_delay";
import { sampler } from "./documentation/audio_engine/sampler";
import { sample_banks } from "./documentation/samples/sample_banks";
import { audio_basics } from "./documentation/audio_engine/audio_basics";
import { sample_list } from "./documentation/samples/sample_list";
import { software_interface } from "./documentation/basics/interface";
import { shortcuts } from "./documentation/basics/keyboard";
import { code } from "./documentation/basics/code";
import { mouse } from "./documentation/basics/mouse";
// More
import { oscilloscope } from "./documentation/more/oscilloscope";
import { synchronisation } from "./documentation/more/synchronisation";
import { about } from "./documentation/more/about";
import { bonus } from "./documentation/more/bonus";
import { samples } from "./documentation/samples";
import { chaining } from "./documentation/chaining";
import { interaction } from "./documentation/interaction";
import { time } from "./documentation/time/time";
import { linear_time } from "./documentation/time/linear_time";
import { cyclical_time } from "./documentation/time/cyclical_time";
import { long_forms } from "./documentation/long_forms";
import { midi } from "./documentation/midi";
import { sound } from "./documentation/engine";
import { patterns } from "./documentation/patterns";
import { functions } from "./documentation/functions";
import { variables } from "./documentation/variables";
import { probabilities } from "./documentation/probabilities";
import { lfos } from "./documentation/lfos";
import { ziffers } from "./documentation/ziffers";
import { reference } from "./documentation/reference";
import { synths } from "./documentation/synths";

// Setting up the Markdown converter with syntax highlighting
import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import { createDocumentationStyle } from "./DomElements";
showdown.setFlavor("github");

export const key_shortcut = (shortcut: string): string => {
  return `<kbd class="lg:px-2 lg:py-1.5 px-1 py-1 lg:text-sm text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">${shortcut}</kbd>`;
};

export const makeExampleFactory = (application: Editor): Function => {
  const make_example = (
    description: string,
    code: string,
    open: boolean = false
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
  // Initialize a data structure to store code examples by their unique IDs
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
    sound: sound(application),
    samples: samples(application),
    synths: synths(application),
    chaining: chaining(application),
    patterns: patterns(application),
    ziffers: ziffers(application),
    midi: midi(application),
    lfos: lfos(application),
    variables: variables(application),
    probabilities: probabilities(application),
    functions: functions(application),
    reference: reference(),
    shortcuts: shortcuts(application),
    amplitude: amplitude(application),
    distortion: distortion(application),
    reverb_delay: reverb(application),
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
  if (document.getElementById("app")?.classList.contains("hidden")) {
    document.getElementById("app")?.classList.remove("hidden");
    document.getElementById("documentation")?.classList.add("hidden");
    app.exampleIsPlaying = false;
  } else {
    document.getElementById("app")?.classList.add("hidden");
    document.getElementById("documentation")?.classList.remove("hidden");
    // Load and convert Markdown content from the documentation file
    let style = createDocumentationStyle(app);
    let bindings = Object.keys(style).map((key) => ({
      type: "output",
      regex: new RegExp(`<${key}([^>]*)>`, "g"),
      //@ts-ignore
      replace: (match, p1) => `<${key} class="${style[key]}" ${p1}>`,
    }));
    updateDocumentationContent(app, bindings);
  }
};

export const hideDocumentation = () => {
  if (document.getElementById("app")?.classList.contains("hidden")) {
    document.getElementById("app")?.classList.remove("hidden");
    document.getElementById("documentation")?.classList.add("hidden");
  }
};

export const updateDocumentationContent = (app: Editor, bindings: any) => {
  const converter = new showdown.Converter({
    emoji: true,
    moreStyling: true,
    backslashEscapesHTMLTags: true,
    extensions: [showdownHighlight({ auto_detection: true }), ...bindings],
  });
  const converted_markdown = converter.makeHtml(
    app.docs[app.currentDocumentationPane]
  );
  document.getElementById("documentation-content")!.innerHTML =
    converted_markdown;
};
