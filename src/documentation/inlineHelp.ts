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
  seed: {
    name: "seed",
    category: "randomness",
    description: "Seed the random generator",
    example: "seed(1234)",
  },
  delayr: {
    name: "delayr",
    category: "time",
    description: "Delay a function <i>n</i> times by <i>t</i> ms",
    example: "delayr(50, 3, () => beat(1) :: log('delayed'))",
  },
  toss: {
    name: "toss",
    category: "randomness",
    description: "Toss a coin, true or false",
    example: "toss() : log('heads')",
  },
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
  fmattack: {
    name: "fmattack",
    category: "synthesis",
    description: "FM synth modulator ADSR envelope attack time (in seconds)",
    example: "sound('sine').fmi(2).fmattack(.5).out()",
  },
  fmdecay: {
    name: "fmdecay",
    category: "synthesis",
    description: "FM synth modulator ADSR envelope decay time (in seconds)",
    example: "sound('sine').fmi(2).fmdecay(.5).out()",
  },
  fmsustain: {
    name: "fmsustain",
    category: "synthesis",
    description: "FM synth modulator ADSR envelope sustain level (0-1)",
    example: "sound('sine').fmi(2).fmsustain(.5).out()",
  },
  fmrelease: {
    name: "fmrelease",
    category: "synthesis",
    description: "FM synth modulator ADSR envelope release time (in seconds)",
    example: "sound('sine').fmi(2).fmrelease(.5).out()",
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
  flip: {
    name: "flip",
    category: "patterns",
    description:
      "Returns  true and false alternatively or next value every <i>n</i> beats (arrays)",
    example: "flip(4, 50) // 2 beats of true, 2 beats of false, 50/50.",
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
  resonance: {
    name: "resonance",
    category: "filter",
    description: "Lowpass filter resonance",
    example: "sound('cp').resonance(1).out()",
  },
  hcutoff: {
    name: "hcutoff",
    category: "filter",
    description: "Highpass filter cutoff frequency",
    example: "sound('cp').hcutoff(1000).out()",
  },
  hresonance: {
    name: "hresonance",
    category: "filter",
    description: "Highpass filter resonance",
    example: "sound('cp').hresonance(1).out()",
  },
  bandf: {
    name: "bandf",
    category: "filter",
    description: "Bandpass filter cutoff frequency",
    example: "sound('cp').bandf(1000).out()",
  },
  bandq: {
    name: "bandq",
    category: "filter",
    description: "Bandpass filter resonance",
    example: "sound('cp').bandq(1).out()",
  },
  vowel: {
    name: "vowel",
    category: "filter",
    description: "Vowel filter type",
    example: "sound('cp').vowel('a').out()",
  },
  coarse: {
    name: "coarse",
    category: "synthesis",
    description: "Artificial sample-rate lowering",
    example: "beat(.5)::snd('pad').coarse($(1) % 16).clip(.5).out();",
  },
  crush: {
    name: "crush",
    category: "synthesis",
    description:
      "Bitcrushing effect. <i>1</i> is extreme, superior values are more subtle.",
    example: "",
  },
  speed: {
    name: "speed",
    category: "sampling",
    description: "Sample playback speed",
    example: "sound('cp').speed(.5).out()",
  },
  shape: {
    name: "shape",
    category: "synthesis",
    description: "Waveshaping distorsion",
    example: "sound('cp').shape(.5).out()",
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
  beat: {
    name: "beat",
    category: "rhythm",
    description: "return true every <i>n</i> beats.",
    example: "beat(1) :: log(rand(1,5))",
  },
  pulse: {
    name: "pulse",
    category: "rhythm",
    description: "return true every <i>n</i> pulses.",
    example: "pulse(8) :: log(rand(1,5))",
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
    description: "Binary rhythm generator (time, number)",
    example: "binrhythm(.5, 9223) :: sound('cp').out()",
  },
  prob: {
    name: "prob",
    category: "randomness",
    description: "Return true with a probability of <i>n</i> %",
    example: "prob(50) // 50% probability",
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
  odds: {
    name: "odds",
    category: "randomness",
    description: "Return true with a probability of <i>n</i> %",
    example: "odds(1/2) // 50% probability",
  },
  never: {
    name: "never",
    category: "randomness",
    description: "Return false",
    example: "never() // false",
  },
  almostNever: {
    name: "almostNever",
    category: "randomness",
    description: "Return true with a probability of 2.5%",
    example: "almostNever() // 2.5% chance",
  },
  rarely: {
    name: "rarely",
    category: "randomness",
    description: "Return true with a probability of 10%",
    example: "rarely() // 10% chance",
  },
  scarcely: {
    name: "scarcely",
    category: "randomness",
    description: "Return true with a probability of 25%",
    example: "scarcely() // 25% chance",
  },
  sometimes: {
    name: "sometimes",
    category: "randomness",
    description: "Return true with a probability of 50%",
    example: "sometimes() // 50% chance",
  },
  often: {
    name: "often",
    category: "randomness",
    description: "Return true with a probability of 75%",
    example: "often() // 75% chance",
  },
  frequently: {
    name: "frequently",
    category: "randomness",
    description: "Return true with a probability of 90%",
    example: "frequently() // chance",
  },
  almostAlways: {
    name: "almostAlways",
    category: "randomness",
    description: "Return true with a probability of 98.5%",
    example: "almostAlways() // 98.5% chance",
  },
  always: {
    name: "always",
    category: "randomness",
    description: "Return true",
    example: "always() // true",
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
    example: "beat(1) :: script(1)",
  },
  clear_script: {
    name: "clear_script",
    category: "core",
    description: "Deletes the given script",
    example: "clear_script(2)",
  },
  copy_script: {
    name: "copy_script",
    category: "core",
    description: "Copy the script <i>from</i> to the script <i>to</i>",
    example: "copy_script(1, 2)",
  },
  warp: {
    name: "warp",
    category: "core",
    description: "jumps to the <i>n</i> tick of the clock.",
    example: "warp(1) :: log('back to the big bang!')",
  },
  beat_warp: {
    name: "beat_warp",
    category: "core",
    description: "jumps to the <i>n</i> beat of the clock.",
    example: "beat_warp(1) :: log('back to the first beat!')",
  },
  divbar: {
    name: "divbar",
    category: "time",
    description:
      "works just like <i>flip</i> but at the level of bars instead of beats",
    example: "divbar(2)::beat(1)::snd('kick').out()",
  },
  onbar: {
    name: "onbar",
    category: "time",
    description: "return true when targetted bar(s) is/are reached in period",
    example: "onbar(4, 4)::beat(.5)::snd('hh').out();",
  },
  begin: {
    name: "begin",
    category: "sampling",
    description: "Audio playback start time (0-1)",
    example: "sound('cp').begin(.5).out()",
  },
  end: {
    name: "end",
    category: "sampling",
    description: "Audio playback end time (0-1)",
    example: "sound('cp').end(.5).out()",
  },
  mouseX: {
    name: "mouseX",
    category: "mouse",
    description: "Mouse X position (big float)",
    example: "log(mouseX())",
  },
  mouseY: {
    name: "mouseY",
    category: "mouse",
    description: "Mouse Y position (big float)",
    example: "log(mouseY())",
  },
  noteX: {
    name: "noteX",
    category: "mouse",
    description: "Mouse X position (as MIDI note)",
    example: "log(noteX())",
  },
  noteY: {
    name: "noteY",
    category: "mouse",
    description: "Mouse Y position (as MIDI note)",
    example: "log(noteY())",
  },
  cut: {
    name: "cut",
    category: "sampling",
    description: "Cutting sample when other sample met on same orbit (0 or 1)",
    example: "sound('cp').cut(1).out()",
  },
  pan: {
    name: "pan",
    category: "audio",
    description: "Stereo panning (-1 to 1)",
    example: "sound('cp').pan(-1).out()",
  },
  zrand: {
    name: "zrand",
    category: "synthesis",
    description: "ZzFX randomisation factor",
    example: "sound('zzfx').zrand(.5).out()",
  },
  curve: {
    name: "curve",
    category: "synthesis",
    description: "ZzFX waveshaping (0-3)",
    example: "sound('zzfx').curve(1).out()",
  },
  slide: {
    name: "slide",
    category: "synthesis",
    description: "ZzFX pitch slide",
    example: "sound('zzfx').slide(1).out()",
  },
  deltaSlide: {
    name: "deltaSlide",
    category: "synthesis",
    description: "ZzFX pitch delta slide",
    example: "sound('zzfx').deltaSlide(1).out()",
  },
  pitchJump: {
    name: "pitchJump",
    category: "synthesis",
    description: "ZzFX pitch jump",
    example: "sound('zzfx').pitchJump(1).out()",
  },
  pitchJumpTime: {
    name: "pitchJumpTime",
    category: "synthesis",
    description: "ZzFX pitch jump time (time before jump)",
    example: "sound('zzfx').pitchJumpTime(1).out()",
  },
  zcrush: {
    name: "zcrush",
    category: "synthesis",
    description: "ZzFX bitcrushing",
    example: "sound('zzfx').zcrush(1).out()",
  },
  zdelay: {
    name: "zdelay",
    category: "synthesis",
    description: "ZzFX delay",
    example: "sound('zzfx').zdelay(1).out()",
  },
  tremolo: {
    name: "tremolo",
    category: "synthesis",
    description: "ZzFX weird tremolo effect",
    example: "sound('zzfx').tremolo(1).out()",
  },
  speak: {
    name: "speak",
    category: "synthesis",
    description: "Text to speech synthesizer",
    example: "beat(2) :: speak('Topos!','fr',irand(0,5))",
  },
  midi_outputs: {
    name: "midi_outputs",
    category: "midi",
    description: "List of available MIDI outputs",
    example: "midi_outputs()",
  },
  midi_output: {
    name: "midi_output",
    category: "midi",
    description: "Set the current MIDI output",
    example: "midi_output('IAC Driver Bus 1')",
  },
  midi: {
    name: "midi",
    category: "midi",
    description: "Send a MIDI message",
    example: "midi(144, 60, 100)",
  },
  control_change: {
    name: "control_change",
    category: "midi",
    description: "Send a MIDI control change message",
    example: "control_change({control: 1, value: 60, channel: 10})",
  },
  program_change: {
    name: "program_change",
    category: "midi",
    description: "Send a MIDI program change message",
    example: "program_change(1, 10)",
  },
  sysex: {
    name: "sysex",
    category: "midi",
    description: "Send a MIDI sysex message",
    example: "sysex(0xF0, 0x7D, 0x00, 0x06, 0x01, 0xF7)",
  },
  midi_clock: {
    name: "midi_clock",
    category: "midi",
    description: "Send a MIDI clock message",
    example: "midi_clock()",
  },
  degrade: {
    name: "degrade",
    category: "patterns",
    description: "Removes <i>n</i>% of the given array randomly",
    example: "[0,1,2,3].degrade(20)",
  },
  loop: {
    name: "loop",
    category: "patterns",
    description: "Loop over the given array using an iterator",
    example: "[0,1,2,3].loop($(1))",
  },
  $: {
    name: "$",
    category: "patterns",
    description: "Iterator",
    example: "[0,1,2,3].loop($(1))",
  },
  counter: {
    name: "counter",
    category: "patterns",
    description: "Counter/iterator",
    example: "counter('my_counter_, 20, 1)",
  },
  drunk: {
    name: "drunk",
    category: "patterns",
    description: "Returns the next value in a drunk walk",
    example: "drunk()",
  },
  drunk_max: {
    name: "drunk_max",
    category: "patterns",
    description: "Sets the maximum value of the drunk walk",
    example: "drunk_max(10)",
  },
  drunk_min: {
    name: "drunk_min",
    category: "patterns",
    description: "Sets the minimum value of the drunk walk",
    example: "drunk_min(0)",
  },
  drunk_wrap: {
    name: "drunk_wrap",
    category: "patterns",
    description: "Wraps (or not) of the drunk walk (boolean)",
    example: "drunk_wrap(true)",
  },
  v: {
    name: "v",
    category: "variable",
    description: "Global Variable setter or getter",
    example: "v('my_var', 10) // Sets global variable 'my_var' to 10",
  },
  delete_variable: {
    name: "delete_variable",
    category: "variable",
    description: "Deletes the given global variable",
    example: "delete_variable('my_var')",
  },
  clear_variables: {
    name: "clear_variables",
    category: "variable",
    description: "Clears all global variables",
    example: "clear_variables()",
  },
  shuffle: {
    name: "shuffle",
    category: "patterns",
    description: "Shuffle the given array",
    example: "[0,1,2,3].shuffle()",
  },
  rotate: {
    name: "rotate",
    category: "patterns",
    description: "Rotate the given array to the right for <i>n</i> indexes",
    example: "[0,1,2,3].rotate(2)",
  },
  unique: {
    name: "unique",
    category: "patterns",
    description: "Remove duplicates from the given array",
    example: "[0,1,2,3,3,3].unique()",
  },
  add: {
    name: "add",
    category: "patterns",
    description: "Add a value to each element of the given array",
    example: "[0,1,2,3].add(1)",
  },
  sub: {
    name: "sub",
    category: "patterns",
    description: "Substract a value to each element of the given array",
    example: "[0,1,2,3].sub(1)",
  },
  mul: {
    name: "mul",
    category: "patterns",
    description: "Multiply each element of the given array by a value",
    example: "[0,1,2,3].mul(2)",
  },
  div: {
    name: "div",
    category: "patterns",
    description: "Divide each element of the given array by a value",
    example: "[0,1,2,3].div(2)",
  },
  scale: {
    name: "scale",
    category: "patterns",
    description: "Scale setter used by Ziffers",
    example: "z0('0 1 2 3').scale('major').out()",
  },
  zzfx: {
    name: "zzfx",
    category: "synthesis",
    description: "ZzFX sound generator",
    example: "sound('zzfx').zzfx(...).out()",
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
      // @ts-ignore
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
