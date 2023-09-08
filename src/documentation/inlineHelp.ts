import { hoverTooltip } from "@codemirror/view";
import { type EditorView } from "@codemirror/view";

interface InlineCompletion {
  name: string;
  category: string;
  description: string;
  example: string;
}

type CompletionDatabase = {
  [key: string]: InlineCompletion;
};

const completionDatabase: CompletionDatabase = {
  attack: {
    name: "attack",
    category: "synthesis",
    description: "ADSR envelope attack time (in seconds)",
    example: "sound('sawtooth').attack(.5).out()",
  },
  decay: {
    name: "decay",
    category: "synthesis",
    description: "ADSR envelope decay time (in seconds)",
    example: "sound('sawtooth').decay(.5).out()",
  },
  sustain: {
    name: "sustain",
    category: "synthesis",
    description: "ADSR envelope sustain level (0-1)",
    example: "sound('sawtooth').sustain(.5).out()",
  },
  release: {
    name: "release",
    category: "synthesis",
    description: "ADSR envelope release time (in seconds)",
    example: "sound('sawtooth').release(.5).out()",
  },
  fmwave: {
    name: "fmwave",
    category: "synthesis",
    description: "FM synth modulator waveform",
    example: "sound('fm').fmwave('sine').out()",
  },
  fmi: {
    name: "fmi",
    category: "audio",
    description: "FM synth modulator index",
    example: "sound('fm').fmi([1,2].beat()).out()",
  },
  fmh: {
    name: "fmh",
    category: "audio",
    description: "FM synth modulator ratio",
    example: "sound('fm').fmi(2).fmh(2).out()",
  },
  repeatAll: {
    name: "repeatAll",
    category: "patterns",
    description: "Repeat every array elements <i>n</i> times",
    example: "[0,1,2,3].repeatAll(2)",
  },
  quant: {
    name: "quant",
    category: "functions",
    description: "Quantize a value in the given array",
    example: "quant(30, [0,1,2,3])",
  },
  log: {
    name: "log",
    category: "javascript",
    description: "Log a value in the console",
    example: "log('Hello, world')",
  },
  div: {
    name: "div",
    category: "patterns",
    description:
      "Returns next value every <i>n</i> beats or true and false alternatively",
    example: "div(4, 50) // 2 beats of true, 2 beats of false, 50/50.",
  },
  n: {
    name: "n",
    category: "audio",
    description: "Sample number or synth oscillator partials count",
    example: "sound('dr').n([1,2].beat()).out()",
  },
  note: {
    name: "note",
    category: "patterns",
    description: "MIDI note number (0-127)",
    example: "sound('jvbass').note(50).out()",
  },
  vel: {
    name: "vel",
    category: "audio",
    description: "Velocity or sound volume (0-1)",
    example: "sound('cp').vel(.5).out()",
  },
  palindrome: {
    name: "palindrome",
    category: "patterns",
    description: "Returns palindrome of the current array",
    example: "[0,1,2,3].palindrome()",
  },
  cutoff: {
    name: "cutoff",
    category: "filter",
    description: "Lowpass filter cutoff frequency",
    example: "sound('cp').cutoff(1000).out()",
  },
  speed: {
    name: "speed",
    category: "sampling",
    description: "Sample playback speed",
    example: "sound('cp').speed(.5).out()",
  },
  delay: {
    name: "delay",
    category: "effect",
    description: "Delay effect dry/wet",
    example: "sound('cp').delay(.5).out()",
  },
  delayfb: {
    name: "delayfb",
    category: "effect",
    description: "Delay effect feedback amount (0-1)",
    example: "sound('cp').delay(0.2).delayfb(.5).out()",
  },
  delaytime: {
    name: "delaytime",
    category: "effect",
    description: "Delay effect delay time (in seconds)",
    example: "sound('cp').delay(0.2).delaytime(.5).out()",
  },
  gain: {
    name: "gain",
    category: "audio",
    description: "Playback volume",
    example: "sound('cp').gain(.5).out()",
  },
  bar: {
    name: "bar",
    category: "patterns",
    description: "Returns list index for the current bar (with wrapping)",
    example: "[0,1,2,3].bar()",
  },
  beat: {
    name: "beat",
    category: "patterns",
    description: "Returns list index for the current beat (with wrapping)",
    example: "[0,1,2,3].beat()",
  },
  room: {
    name: "room",
    category: "effect",
    description: "Reverb effect room amount",
    example: "sound('cp').room(.5).out()",
  },
  size: {
    name: "size",
    category: "effect",
    description: "Reverb effect room size",
    example: "sound('cp').size(.5).out()",
  },
  usine: {
    name: "usine",
    category: "modulation",
    description: "Unipolar sinusoïdal low-frequency oscillator",
    example: "usine(5) // 5 hz oscillation",
  },
  sine: {
    name: "usine",
    category: "modulation",
    description: "Sinusoïdal low-frequency oscillator",
    example: "usine(5) // 5 hz oscillation",
  },
  utriangle: {
    name: "utriangle",
    category: "modulation",
    description: "Unipolar triangular low-frequency oscillator",
    example: "utriangle(5) // 5 hz oscillation",
  },
  triangle: {
    name: "triangle",
    category: "modulation",
    description: "Triangular low-frequency oscillator",
    example: "triangle(5) // 5 hz oscillation",
  },
  usaw: {
    name: "usaw",
    category: "modulation",
    description: "Unipolar sawtooth low-frequency oscillator",
    example: "usaw(5) // 5 hz oscillation",
  },
  saw: {
    name: "saw",
    category: "modulation",
    description: "Sawtooth low-frequency oscillator",
    example: "saw(5) // 5 hz oscillation",
  },
  square: {
    name: "square",
    category: "modulation",
    description: "Square low-frequency oscillator",
    example: "square(5) // 5 hz oscillation",
  },
  usquare: {
    name: "usquare",
    category: "modulation",
    description: "Unipolar square low-frequency oscillator",
    example: "usquare(5) // 5 hz oscillation",
  },
  rhythm: {
    name: "rhythm",
    category: "rhythm",
    description: "Variant of the euclidian algorithm function",
    example: "rhythm(.5, 3, 8) // time, pulses, steps",
  },
  let: {
    name: "let",
    category: "javascript",
    description: "Variable assignation",
    example: "let baba = 10",
  },
  onbeat: {
    name: "onbeat",
    category: "rhythm",
    description: "Return true when targetted beat(s) is/are reached",
    example: "onbeat([1,2,3]) // true on beats 1, 2 and 3",
  },
  oncount: {
    name: "oncount",
    category: "rhythm",
    description:
      "Return true when targetted beat(s) is/are reached in the given period",
    example:
      "oncount([1,2,3], 4) // true on beats 1, 2 and 3 in a 4 beats period",
  },
  mod: {
    name: "mod",
    category: "rhythm",
    description: "return true every <i>n</i> pulsations.",
    example: "mod(1) :: log(rand(1,5))",
  },
  modp: {
    name: "modp",
    category: "rhythm",
    description: "return true every <i>n</i> ticks.",
    example: "modp(8) :: log(rand(1,5))",
  },
  euclid: {
    name: "euclid",
    category: "rhythm",
    description: "Iterator-based euclidian rhythm generator",
    example: "euclid($(1), 3, 8) // iterator, pulses",
  },
  oneuclid: {
    name: "oneuclid",
    category: "rhythm",
    description: "Variant of the euclidian rhythm generator",
    example: "oneuclid(3, 8) // iterator, pulses",
  },
  bin: {
    name: "bin",
    category: "rhythm",
    description: "Convert a decimal number to binary rhythm generator",
    example: "bin($(1), 9223) // iterator, number to convert",
  },
  binrhythm: {
    name: "binrhythm",
    category: "rhythm",
    description: "Binary rhythm generator",
    example: "binrhythm(9223) :: sound('cp').out()",
  },
  rand: {
    name: "rand",
    category: "randomness",
    description: "random floating point number between x and y",
    example: "rand(1, 10) // between 1 and 10",
  },
  irand: {
    name: "irand",
    category: "randomness",
    description: "random integer number between x and y",
    example: "irand(1, 10) // between 1 and 10",
  },
  pick: {
    name: "pick",
    category: "randomness",
    description: "Pick a value in the given array",
    example: "[1,4,10].pick()",
  },
  sound: {
    name: "sound",
    category: "audio",
    description: "Base function to play audio (samples / synths)",
    example: "sound('bd').out()",
  },
  snd: {
    name: "snd",
    category: "audio",
    description:
      "Base function to play audio (samples / synths). Alias for <code>sound<code>.",
    example: "sound('bd').out()",
  },
  bpm: {
    name: "bpm",
    category: "time",
    description: "Get or set the current beats per minute.",
    example: "bpm(135) // set the bpm to 135",
  },
  out: {
    name: "out",
    category: "audio",
    description: "Connect the <code>sound()</code> chain to the output",
    example: "sound('clap').out()",
  },
  script: {
    name: "script",
    category: "core",
    description: "Execute one or more local scripts",
    example: "mod(1) :: script(1)",
  },
};

export const inlineHoveringTips = hoverTooltip(
  (view: any, pos: any, side: any) => {
    let { from, to, text } = view.state.doc.lineAt(pos);
    let start = pos,
      end = pos;
    while (start > from && /\w/.test(text[start - from - 1])) start--;
    while (end < to && /\w/.test(text[end - from])) end++;
    if ((start == pos && side < 0) || (end == pos && side > 0)) return null;
    return {
      pos: start,
      end,
      above: true,
      create(view: EditorView) {
        if (
          text.slice(start - from, end - from) in completionDatabase ===
          false
        ) {
          return { dom: document.createElement("div") };
        }
        let completion =
          completionDatabase[text.slice(start - from, end - from)] || {};
        let divContent = `
      <h1 class="text-orange-300 text-base pb-1">${completion.name} [<em class="text-white">${completion.category}</em>]</h1>
      <p class="text-base pl-4">${completion.description}</p>
      <pre class="-mt-2"><code class="pl-4 text-base">${completion.example}</code></pre></div>
      `;
        let dom = document.createElement("div");
        dom.classList.add("px-4", "py-2", "bg-neutral-700", "rounded-lg");
        dom.innerHTML = divContent;
        return { dom };
      },
    };
  }
);
