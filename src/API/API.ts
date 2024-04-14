import * as Transport from './Transport';
import * as Mouse from './Mouse';
import * as Theme from './Theme';
import * as Canvas from './Canvas';
import * as Cache from './Cache';
import * as Script from './Script';
import * as Drunk from './Drunk';
import * as Warp from './Warp';
import * as Mathematics from './Math';
import * as Ziffers from './Ziffers';
import * as Filters from './Filters';
import * as LFO from './LFO';
import * as Probability from './Probabilities';
import * as OSC from './OSC';
import * as Randomness from './Randomness';
import * as Counter from './Counter';
import * as Sound from './Sound';
import * as Console from './Console';
import { type SoundEvent } from '../Classes/SoundEvent';
import { type SkipEvent } from '../Classes/SkipEvent';
import { OscilloscopeConfig } from "../DOM/Visuals/Oscilloscope";
import { Player } from "../Classes/ZPlayer";
import { InputOptions } from "../Classes/ZPlayer";
import { type ShapeObject } from "../DOM/Visuals/CanvasVisuals";
import { nearScales } from "zifferjs";
import { MidiConnection } from "../IO/MidiConnection";
import { evaluateOnce } from "../Evaluator";
import { DrunkWalk } from "../Utils/Drunk";
import { Editor } from "../main";
import { LRUCache } from "lru-cache";
import {
  loadUniverse,
  openUniverseModal,
} from "../Editor/FileManagement";
import {
  samples,
  initAudioOnFirstClick,
  registerSynthSounds,
  registerZZFXSounds,
  soundMap,
  // @ts-ignore
} from "superdough";
import { getScaleNotes } from "zifferjs";
import drums from "../tidal-drum-machines.json";

export async function loadSamples() {
  return Promise.all([
    initAudioOnFirstClick(),
    samples("github:tidalcycles/Dirt-Samples/master", undefined, {
      tag: "Tidal",
    }).then(() => registerSynthSounds()),
    registerZZFXSounds(),
    samples(drums, "github:ritchse/tidal-drum-machines/main/machines/", {
      tag: "Machines",
    }),
    samples("github:Bubobubobubobubo/Dough-Fox/main", undefined, {
      tag: "FoxDot",
    }),
    samples("github:Bubobubobubobubo/Dough-Samples/main", undefined, {
      tag: "Pack",
    }),
    samples("github:Bubobubobubobubo/Dough-Amiga/main", undefined, {
      tag: "Amiga",
    }),
    samples("github:Bubobubobubobubo/Dough-Juj/main", undefined, {
      tag: "Juliette",
    }),
    samples("github:Bubobubobubobubo/Dough-Amen/main", undefined, {
      tag: "Amen",
    }),
    samples("github:Bubobubobubobubo/Dough-Waveforms/main", undefined, {
      tag: "Waveforms",
    }),
  ]);
}

export class UserAPI {
  /**
   * The UserAPI class is the interface between the user's code and the backend. It provides
   * access to the AudioContext, to the MIDI Interface, to internal variables, mouse position,
   * useful functions, etc... This class is exposed to the user's action and any function 
   * destined to the user should be placed here.
   */

  public codeExamples: { [key: string]: string } = {};
  public counters: { [key: string]: any } = {};
  //@ts-ignore
  public _drunk: DrunkWalk = new DrunkWalk(-100, 100, false);
  public randomGen = Math.random;
  public currentSeed: string | undefined = undefined;
  public localSeeds = new Map<string, Function>();
  public patternCache = new LRUCache({ max: 10000, ttl: 10000 * 60 * 5 });
  public invalidPatterns: { [key: string]: boolean } = {};
  public cueTimes: { [key: string]: number } = {};
  private errorTimeoutID: number = 0;
  private printTimeoutID: number = 0;
  public MidiConnection: MidiConnection;
  public scale_aid: string | number | undefined = undefined;
  public hydra: any;
  public onceEvaluator: boolean = true;
  public forceEvaluator: boolean = false;

  load: samples;
  public global: { [key: string]: any };
  time: () => number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  silence: () => void;
  onMouseMove: (e: MouseEvent) => void;
  mouseX: () => number;
  mouseY: () => number;
  noteX: () => number;
  noteY: () => number;
  tempo: (n?: number | undefined) => number;
  bpb: (n?: number | undefined) => number;
  ppqn: (n?: number | undefined) => number;
  time_signature: (numerator: number, denominator: number) => void;
  theme: (color_scheme: string) => void;
  themeName: () => string;
  randomTheme: () => void;
  nextTheme: () => void;
  getThemes: () => string[];
  pulseLocation: () => number;
  clear: () => boolean;
  w: () => number;
  h: () => number;
  hc: () => number;
  wc: () => number;
  background: (color: string | number, ...gb: number[]) => boolean;
  linearGradient: (x1: number, y1: number, x2: number, y2: number, ...stops: (number | string)[]) => CanvasGradient;
  radialGradient: (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, ...stops: (number | string)[]) => CanvasGradient;
  conicGradient: (x: number, y: number, angle: number, ...stops: (number | string)[]) => CanvasGradient;
  draw: (func: Function) => boolean;
  balloid: (curves: number | ShapeObject, radius: number, curve: number, fillStyle: string, secondary: string, x: number, y: number) => boolean;
  equilateral: (radius: number | ShapeObject, fillStyle: string, rotation: number, x: number, y: number) => boolean;
  triangular: (width: number | ShapeObject, height: number, fillStyle: string, rotation: number, x: number, y: number) => boolean;
  ball: (radius: number | ShapeObject, fillStyle: string, x: number, y: number) => boolean;
  circle: (radius: number | ShapeObject, fillStyle: string, x: number, y: number) => boolean;
  donut: (slices: number | ShapeObject, eaten: number, radius: number, hole: number, fillStyle: string, secondary: string, stroke: string, rotation: number, x: number, y: number) => boolean;
  pie: (slices: number | ShapeObject, eaten: number, radius: number, fillStyle: string, secondary: string, stroke: string, rotation: number, x: number, y: number) => boolean;
  star: (points: number | ShapeObject, radius: number, fillStyle: string, rotation: number, outerRadius: number, x: number, y: number) => boolean;
  stroke: (width: number | ShapeObject, strokeStyle: string, rotation: number, x1: number, y1: number, x2: number, y2: number) => boolean;
  box: (width: number | ShapeObject, height: number, fillStyle: string, rotation: number, x: number, y: number) => boolean;
  smiley: (happiness: number | ShapeObject, radius: number, eyeSize: number, fillStyle: string, rotation: number, x: number, y: number) => boolean;
  text: (text: string | ShapeObject, fontSize: number, rotation: number, font: string, x: number, y: number, fillStyle: string, filter: string) => boolean;
  image: (url: string | ShapeObject, width: number, height: number, rotation: number, x: number, y: number, filter: string) => boolean;
  randomChar: (length: number, min: number, max: number) => string;
  randomFromRange: (min: number, max: number) => string;
  emoji: (n: number) => string;
  food: (n: number) => string;
  animals: (n: number) => string;
  expressions: (n: number) => string;
  generateCacheKey: (...args: any[]) => string;
  resetAllFromCache: () => void;
  clearPatternCache: () => void;
  removePatternFromCache: (id: string) => void;
  script: (...args: number[]) => void;
  s: (...args: number[]) => void;
  delete_script: (script: number) => void;
  cs: (script: number) => void;
  copy_script: (from: number, to: number) => void;
  cps: (from: number, to: number) => void;
  copy_universe: (from: string, to: string) => void;
  delete_universe: (universe: string) => void;
  big_bang: () => void;
  drunk: (n?: number | undefined) => number;
  drunk_max: (max: number) => void;
  drunk_min: (min: number) => void;
  drunk_wrap: (wrap: boolean) => void;
  warp: (n: number) => void;
  beat_warp: (beat: number) => void;
  min: (...values: number[]) => number;
  max: (...values: number[]) => number;
  mean: (...values: number[]) => number;
  limit: (value: number, min: number, max: number) => number;
  abs: (value: number) => number;
  z: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  fullseq: (sequence: string, duration: number) => boolean | boolean[];
  seq: (expr: string, duration?: number) => boolean;
  beat: (n?: number | number[], nudge?: number) => boolean;
  bar: (n?: number | number[], nudge?: number) => boolean;
  pulse: (n?: number | number[], nudge?: number) => boolean;
  tick: (tick: number | number[], offset?: number) => boolean;
  dur: (n: number | number[]) => boolean;
  flip: (chunk: number, ratio?: number) => boolean;
  flipbar: (chunk?: number) => boolean;
  onbar: (bars: number | number[], n?: number) => boolean;
  onbeat: (...beat: number[]) => boolean;
  oncount: (beats: number | number[], count: number) => boolean;
  oneuclid: (pulses: number, length: number, rotate?: number) => boolean;
  euclid: (iterator: number, pulses: number, length: number, rotate?: number) => boolean;
  ec: any;
  rhythm: (div: number, pulses: number, length: number, rotate?: number) => boolean;
  ry: any;
  nrhythm: (div: number, pulses: number, length: number, rotate?: number) => boolean;
  nry: any;
  bin: (iterator: number, n: number) => boolean;
  binrhythm: (div: number, n: number) => boolean;
  bry: any;
  line: any;
  sine: any;
  usine: any;
  saw: any;
  usaw: any;
  triangle: any;
  utriangle: any;
  square: any;
  usquare: any;
  noise: any;
  unoise: any;
  prob: (p: number) => boolean;
  toss: () => boolean;
  odds: (n: number, beats?: number) => boolean;
  never: (beats?: number) => boolean;
  almostNever: (beats?: number) => boolean;
  rarely: (beats?: number) => boolean;
  scarcely: (beats?: number) => boolean;
  sometimes: (beats?: number) => boolean;
  often: (beats?: number) => boolean;
  frequently: (beats?: number) => boolean;
  almostAlways: (beats?: number) => boolean;
  always: (beats?: number) => boolean;
  dice: (sides: number) => number;
  osc: (address: string, port: number, ...args: any[]) => void;
  getOSC: (address?: string | undefined) => any[];
  gif: (options: any) => void;
  scope: (config: OscilloscopeConfig) => void;
  randI: any;
  rand: any;
  seed: any;
  localSeededRandom: any;
  clearLocalSeed: any;
  once: () => boolean;
  counter: (name: string | number, limit?: number | undefined, step?: number | undefined) => number;
  $: any;
  count: any;
  i: (n?: number | undefined) => any;
  sound: (sound: string | string[] | null | undefined) => SoundEvent | SkipEvent;
  snd: any;
  log: (message: any) => void;
  logOnce: (message: any) => void;
  speak: (text: string, lang?: string, voiceIndex?: number, rate?: number, pitch?: number) => void;
  cbar: () => number;
  ctick: () => number;
  cpulse: () => number;
  cbeat: () => number;
  ebeat: () => number;
  epulse: () => number;
  nominator: () => number;
  meter: () => number;
  denominator: () => number;
  pulsesForBar: () => number;
  z0!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z1!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z2!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z3!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z4!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z5!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z6!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z7!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z8!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z9!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z10!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z11!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z12!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z13!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z14!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z15!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;
  z16!: (input: string | Generator<number>, options: InputOptions, id: number | string) => Player;

  constructor(public app: Editor) {
    this.MidiConnection = new MidiConnection(this, app.settings);
    this.global = {};
    this.g = this.global;
    this.time = Transport.time(this);
    this.play = Transport.play(this);
    this.pause = Transport.pause(this);
    this.stop = Transport.stop(this);
    this.silence = Transport.silence(this);
    this.tempo = Transport.tempo(this.app);
    this.bpb = Transport.bpb(this.app);
    this.ppqn = Transport.ppqn(this.app);
    this.time_signature = Transport.time_signature(this.app);
    this.onMouseMove = Mouse.onmousemove(this.app);
    this.mouseX = Mouse.mouseX(this.app);
    this.mouseY = Mouse.mouseY(this.app);
    this.noteX = Mouse.noteX(this.app);
    this.noteY = Mouse.noteY(this.app);
    this.theme = Theme.theme(this.app);
    this.themeName = Theme.themeName(this.app);
    this.randomTheme = Theme.randomTheme(this.app);
    this.nextTheme = Theme.nextTheme(this.app);
    this.getThemes = Theme.getThemes();
    this.pulseLocation = Canvas.pulseLocation(this.app);
    this.clear = Canvas.clear(this.app);
    this.w = Canvas.w(this.app);
    this.h = Canvas.h(this.app);
    this.hc = Canvas.hc(this.app);
    this.wc = Canvas.wc(this.app);
    this.background = Canvas.background(this.app);
    this.linearGradient = Canvas.linearGradient(this.app);
    this.radialGradient = Canvas.radialGradient(this.app);
    this.conicGradient = Canvas.conicGradient(this.app);
    this.draw = Canvas.draw(this.app);
    this.balloid = Canvas.balloid(this.app);
    this.equilateral = Canvas.equilateral(this.app);
    this.triangular = Canvas.triangular(this.app);
    this.ball = Canvas.ball(this.app);
    this.circle = Canvas.circle(this.app);
    this.donut = Canvas.donut(this.app);
    this.pie = Canvas.pie(this.app);
    this.star = Canvas.star(this.app);
    this.stroke = Canvas.stroke(this.app);
    this.box = Canvas.box(this.app);
    this.smiley = Canvas.smiley(this.app);
    this.text = Canvas.text(this.app);
    this.image = Canvas.image(this.app);
    this.randomChar = Canvas.randomChar();
    this.randomFromRange = Canvas.randomFromRange();
    this.emoji = Canvas.emoji();
    this.food = Canvas.food();
    this.animals = Canvas.animals();
    this.expressions = Canvas.expressions();
    this.generateCacheKey = Cache.generateCacheKey();
    this.resetAllFromCache = Cache.resetAllFromCache(this);
    this.clearPatternCache = Cache.clearPatternCache(this);
    this.removePatternFromCache = Cache.removePatternFromCache(this);
    this.script = Script.script(this.app);
    this.s = this.script;
    this.delete_script = Script.delete_script(this.app);
    this.cs = this.delete_script;
    this.copy_script = Script.copy_script(this.app);
    this.cps = this.copy_script;
    this.copy_universe = Script.copy_universe(this.app);
    this.delete_universe = Script.delete_universe(this.app);
    this.big_bang = Script.big_bang(this.app);
    this.drunk = Drunk.drunk(this);
    this.drunk_max = Drunk.drunk_max(this);
    this.drunk_min = Drunk.drunk_min(this);
    this.drunk_wrap = Drunk.drunk_wrap(this);
    this.warp = Warp.warp(this.app);
    this.beat_warp = Warp.beat_warp(this.app);
    this.min = Mathematics.min();
    this.max = Mathematics.max();
    this.mean = Mathematics.mean();
    this.limit = Mathematics.limit();
    this.abs = Mathematics.abs();
    this.z = Ziffers.z(this.app);
    Object.assign(this, Ziffers.generateZFunctions(this.app));
    this.fullseq = Filters.fullseq();
    this.seq = Filters.seq(this.app);
    this.beat = Filters.beat(this.app);
    this.bar = Filters.bar(this.app);
    this.pulse = Filters.pulse(this.app);
    this.tick = Filters.tick(this.app);
    this.dur = Filters.dur(this.app);
    this.flip = Filters.flip(this.app);
    this.flipbar = Filters.flipbar(this.app);
    this.onbar = Filters.onbar(this.app);
    this.onbeat = Filters.onbeat(this);
    this.oncount = Filters.oncount(this.app);
    this.oneuclid = Filters.oneuclid(this.app);
    this.euclid = Filters.euclid();
    this.ec = this.euclid;
    this.rhythm = Filters.rhythm(this.app);
    this.ry = this.rhythm;
    this.nrhythm = Filters.nrhythm(this.app);
    this.nry = this.nrhythm;
    this.bin = Filters.bin();
    this.binrhythm = Filters.binrhythm(this.app);
    this.bry = this.binrhythm;
    this.line = LFO.line();
    this.sine = LFO.sine(this.app);
    this.usine = LFO.usine(this.app);
    this.saw = LFO.saw(this.app);
    this.usaw = LFO.usaw(this.app);
    this.triangle = LFO.triangle(this.app);
    this.utriangle = LFO.utriangle(this.app);
    this.square = LFO.square(this.app);
    this.usquare = LFO.usquare(this.app);
    this.noise = LFO.noise(this);
    this.unoise = LFO.unoise(this);
    this.prob = Probability.prob(this);
    this.toss = Probability.toss(this);
    this.odds = Probability.odds(this);
    this.never = Probability.never();
    this.almostNever = Probability.almostNever(this);
    this.rarely = Probability.rarely(this);
    this.scarcely = Probability.scarcely(this);
    this.sometimes = Probability.sometimes(this);
    this.often = Probability.often(this);
    this.frequently = Probability.frequently(this);
    this.almostAlways = Probability.almostAlways(this);
    this.always = Probability.always();
    this.dice = Probability.dice(this);
    this.osc = OSC.osc(this.app);
    this.getOSC = OSC.getOSC(this.app);
    this.gif = Canvas.gif(this.app);
    this.scope = Canvas.scope(this.app);
    this.randI = Randomness.randI(this.app);
    this.rand = Randomness.rand(this.app);
    this.seed = Randomness.seed(this.app);
    this.localSeededRandom = Randomness.localSeededRandom(this.app);
    this.clearLocalSeed = Randomness.clearLocalSeed(this.app);
    this.once = Counter.once(this);
    this.counter = Counter.counter(this);
    this.$ = this.counter;
    this.count = this.counter;
    this.i = Counter.i(this.app);
    this.sound = Sound.sound(this.app);
    this.snd = this.sound;
    this.speak = Sound.speak();
    this.log = Console.log(this);
    this.logOnce = Console.logOnce(this);
    this.cbar = Transport.cbar(this.app);
    this.ctick = Transport.ctick(this.app);
    this.cpulse = Transport.cpulse(this.app);
    this.cbeat = Transport.cbeat(this.app);
    this.ebeat = Transport.ebeat(this.app);
    this.epulse = Transport.epulse(this.app);
    this.nominator = Transport.nominator(this.app);
    this.meter = Transport.meter(this.app);
    this.denominator = Transport.denominator(this.app);  // Alias for meter
    this.pulsesForBar = Transport.pulsesForBar(this.app);

  }

  public g: any;

  _loadUniverseFromInterface = (universe: string) => {
    this.app.selected_universe = universe.trim();
    this.app.settings.selected_universe = universe.trim();
    loadUniverse(this.app, universe as string);
    openUniverseModal();
  };

  _deleteUniverseFromInterface = (universe: string) => {
    delete this.app.universes[universe];
    if (this.app.settings.selected_universe === universe) {
      this.app.settings.selected_universe = "Welcome";
      this.app.selected_universe = "Welcome";
    }
    this.app.settings.saveApplicationToLocalStorage(
      this.app.universes,
      this.app.settings,
    );
    this.app.updateKnownUniversesView();
  };

  _playDocExample = (code?: string) => {
    /**
     * Play an example from the documentation. The example is going
     * to be stored in the example buffer belonging to the universe.
     * This buffer is going to be cleaned everytime the user press
     * pause or leaves the documentation window.
     *
     * @param code - The code example to play (identifier)
     */
    let current_universe = this.app.universes[this.app.selected_universe];
    this.app.exampleIsPlaying = true;
    if (!current_universe.example) {
      current_universe.example = {
        candidate: "",
        committed: "",
        evaluations: 0,
      };
      current_universe.example.candidate! = code
        ? code
        : (this.app.selectedExample as string);
    } else {
      current_universe.example.candidate! = code
        ? code
        : (this.app.selectedExample as string);
    }
    this.patternCache.clear();
    this.stop();
    this.play();
  };

  _stopDocExample = () => {
    let current_universe = this.app.universes[this.app.selected_universe];
    if (current_universe?.example !== undefined) {
      this.app.exampleIsPlaying = false;
      current_universe.example.candidate! = "";
      current_universe.example.committed! = "";
    }
    this.clearPatternCache();
    this.stop();
  };

  _playDocExampleOnce = (code?: string) => {
    let current_universe = this.app.universes[this.app.selected_universe];
    if (current_universe?.example !== undefined) {
      current_universe.example.candidate! = "";
      current_universe.example.committed! = "";
    }
    this.clearPatternCache();
    this.stop();
    this.play();
    this.app.exampleIsPlaying = true;
    evaluateOnce(this.app, code as string);
  };

  _all_samples = (): object => {
    return soundMap.get();
  };

  _reportError = (error: any): void => {
    const extractLineAndColumn = (error: Error) => {
      const stackLines = error.stack?.split("\n");
      if (stackLines) {
        for (const line of stackLines) {
          if (line.includes("<anonymous>")) {
            const match = line.match(/<anonymous>:(\d+):(\d+)/);
            if (match)
              return {
                line: parseInt(match[1], 10),
                column: parseInt(match[2], 10),
              };
          }
        }
      }
      return { line: null, column: null };
    };

    const { line, column } = extractLineAndColumn(error);
    const errorMessage =
      line && column
        ? `${error.message} (Line: ${line - 2}, Column: ${column})`
        : error.message;

    clearTimeout(this.errorTimeoutID);
    clearTimeout(this.printTimeoutID);
    this.app.interface.error_line.innerHTML = errorMessage;
    this.app.interface.error_line.style.color = "red";
    this.app.interface.error_line.classList.remove("hidden");
    // @ts-ignore
    this.errorTimeoutID = setTimeout(
      () => this.app.interface.error_line.classList.add("hidden"),
      2000,
    );
  };

  _logMessage = (message: any, error: boolean = false): void => {
    console.log(message);
    clearTimeout(this.printTimeoutID);
    clearTimeout(this.errorTimeoutID);
    this.app.interface.error_line.innerHTML = message as string;
    this.app.interface.error_line.style.color = error ? "red" : "white";
    this.app.interface.error_line.classList.remove("hidden");
    // @ts-ignore
    this.printTimeoutID = setTimeout(
      () => this.app.interface.error_line.classList.add("hidden"),
      4000,
    );
  };

  // =============================================================
  // Quantification functions
  // =============================================================

  public quantize = (value: number, quantization: number[]): number => {
    /**
     * Returns the closest value in an array to a given value.
     *
     * @param value - The value to quantize
     * @param quantization - The array of values to quantize to
     * @returns The closest value in the array to the given value
     */
    if (quantization.length === 0) {
      return value;
    }
    let closest = quantization[0];
    quantization.forEach((q) => {
      if (Math.abs(q - value) < Math.abs(closest - value)) {
        closest = q;
      }
    });
    return closest;
  };
  quant = this.quantize;

  public clamp = (value: number, min: number, max: number): number => {
    /**
     * Returns a value clamped between min and max.
     *
     * @param value - The value to clamp
     * @param min - The minimum value of the clamped value
     * @param max - The maximum value of the clamped value
     * @returns A value clamped between min and max
     */
    return Math.min(Math.max(value, min), max);
  };
  cmp = this.clamp;

  // =============================================================
  // Time markers
  // =============================================================

  // =============================================================
  // Fill
  // =============================================================

  public fill = (): boolean => this.app.fill;

  scale = getScaleNotes;
  nearScales = nearScales;

  public cue = (functionName: string | Function): void => {
    functionName = typeof functionName === "function" ? functionName.name : functionName;
    this.cueTimes[functionName] = this.app.clock.pulses_since_origin;
  };
}
