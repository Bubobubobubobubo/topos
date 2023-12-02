import { type Editor } from "../main";
import { AudibleEvent } from "./AbstractEvents";
import {
  filterObject,
  arrayOfObjectsToObjectWithArrays,
  objectWithArraysToArrayOfObjects,
} from "../Utils/Generic";
import { midiToFreq, noteFromPc } from "zifferjs";

import {
  superdough,
  // @ts-ignore
} from "superdough";
// import { Sound } from "zifferjs/src/types";

export type SoundParams = {
  dur: number | number[];
  s?: undefined | string | string[];
  n?: undefined | number | number[];
  analyze?: boolean;
  note?: number | number[];
  freq?: number | number[];
  pitch?: number | number[];
  key?: string;
  scale?: string;
  parsedScale?: number[];
  octave?: number | number[];
};

export class SoundEvent extends AudibleEvent {
  nudge: number;
  sound: any;

  private static methodMap = {
    volume: ["volume", "vol"],
    zrand: ["zrand", "zr"],
    curve: ["curve"],
    bank: ["bank"],
    slide: ["slide", "sld"],
    deltaSlide: ["deltaSlide", "dslide"],
    pitchJump: ["pitchJump", "pj"],
    pitchJumpTime: ["pitchJumpTime", "pjt"],
    lfo: ["lfo"],
    znoise: ["znoise"],
    noise: ["noise"],
    zmod: ["zmod"],
    zcrush: ["zcrush"],
    zdelay: ["zdelay"],
    sustainVolume: ["sustainVolume"],
    tremolo: ["tremolo"],
    dur: ["dur"],
    zzfx: ["zzfx"],
    fmi: ["fmi"],
    fmh: ["fmh"],
    fmenv: ["fmenv"],
    fmattack: ["fmattack", "fmatk"],
    fmdecay: ["fmdecay", "fmdec"],
    fmsustain: ["fmsustain", "fmsus"],
    fmrelease: ["fmrelease", "fmrel"],
    fmvelocity: ["fmvelocity", "fmvel"],
    fmwave: ["fmwave", "fmw"],
    phaser: ["phaser", "phas"],
    phaserDepth: ["phaserDepth", "phasdepth"],
    phaserSweep: ["phaserSweep", "phassweep"],
    phaserCenter: ["phaserCenter", "phascenter"],
    fmadsr: function (
      self: SoundEvent,
      a: number,
      d: number,
      s: number,
      r: number,
    ) {
      self.updateValue("fmattack", a);
      self.updateValue("fmdecay", d);
      self.updateValue("fmsustain", s);
      self.updateValue("fmrelease", r);
      return self;
    },
    fmad: function (self: SoundEvent, a: number, d: number) {
      self.updateValue("fmattack", a);
      self.updateValue("fmdecay", d);
      return self;
    },
    ftype: ["ftype"],
    fanchor: ["fanchor"],
    attack: ["attack", "atk"],
    decay: ["decay", "dec"],
    sustain: ["sustain", "sus"],
    release: ["release", "rel"],
    adsr: function (
      self: SoundEvent,
      a: number,
      d: number,
      s: number,
      r: number,
    ) {
      self.updateValue("attack", a);
      self.updateValue("decay", d);
      self.updateValue("sustain", s);
      self.updateValue("release", r);
      return self;
    },
    ad: function (self: SoundEvent, a: number, d: number) {
      self.updateValue("attack", a);
      self.updateValue("decay", d);
      self.updateValue("sustain", 0.0);
      self.updateValue("release", 0.0);
      return self;
    },
    scope: function (self: SoundEvent) {
      self.updateValue("analyze", true);
      return self;
    },
    debug: function (self: SoundEvent, callback?: Function) {
      self.updateValue("debug", true);
      if (callback) {
        self.updateValue("debugFunction", callback);
      }
      return self;
    },
    lpenv: ["lpenv", "lpe"],
    lpattack: ["lpattack", "lpa"],
    lpdecay: ["lpdecay", "lpd"],
    lpsustain: ["lpsustain", "lps"],
    lprelease: ["lprelease", "lpr"],
    cutoff: function (self: SoundEvent, value: number, resonance?: number) {
      self.updateValue("cutoff", value);
      if (resonance) {
        self.updateValue("resonance", resonance);
      }
      return self;
    },
    lpf: function (self: SoundEvent, value: number, resonance?: number) {
      self.updateValue("cutoff", value);
      if (resonance) {
        self.updateValue("resonance", resonance);
      }
      return self;
    },
    resonance: function (self: SoundEvent, value: number) {
      if (value >= 0 && value <= 1) {
        self.updateValue("resonance", 50 * value);
      }
      return self;
    },
    lpadsr: function (
      self: SoundEvent,
      depth: number,
      a: number,
      d: number,
      s: number,
      r: number,
    ) {
      self.updateValue("lpenv", depth);
      self.updateValue("lpattack", a);
      self.updateValue("lpdecay", d);
      self.updateValue("lpsustain", s);
      self.updateValue("lprelease", r);
      return self;
    },
    lpad: function (self: SoundEvent, depth: number, a: number, d: number) {
      self.updateValue("lpenv", depth);
      self.updateValue("lpattack", a);
      self.updateValue("lpdecay", d);
      self.updateValue("lpsustain", 0);
      self.updateValue("lprelease", 0);
      return self;
    },
    hpenv: ["hpenv", "hpe"],
    hpattack: ["hpattack", "hpa"],
    hpdecay: ["hpdecay", "hpd"],
    hpsustain: ["hpsustain", "hpsus"],
    hprelease: ["hprelease", "hpr"],
    hcutoff: function (self: SoundEvent, value: number, resonance?: number) {
      self.updateValue("hcutoff", value);
      if (resonance) {
        self.updateValue("hresonance", resonance);
      }
      return self;
    },
    hpf: function (self: SoundEvent, value: number, resonance?: number) {
      self.updateValue("hcutoff", value);
      if (resonance) {
        self.updateValue("hresonance", resonance);
      }
      return self;
    },
    hpq: function (self: SoundEvent, value: number) {
      self.updateValue("hresonance", value);
      return self;
    },
    hpadsr: function (
      self: SoundEvent,
      depth: number,
      a: number,
      d: number,
      s: number,
      r: number,
    ) {
      self.updateValue("hpenv", depth);
      self.updateValue("hpattack", a);
      self.updateValue("hpdecay", d);
      self.updateValue("hpsustain", s);
      self.updateValue("hprelease", r);
      return self;
    },
    hpad: function (self: SoundEvent, depth: number, a: number, d: number) {
      self.updateValue("hpenv", depth);
      self.updateValue("hpattack", a);
      self.updateValue("hpdecay", d);
      self.updateValue("hpsustain", 0);
      self.updateValue("hprelease", 0);
      return self;
    },
    bpenv: ["bpenv", "bpe"],
    bpattack: ["bpattack", "bpa"],
    bpdecay: ["bpdecay", "bpd"],
    bpsustain: ["bpsustain", "bps"],
    bprelease: ["bprelease", "bpr"],
    bandf: function (self: SoundEvent, value: number, resonance?: number) {
      self.updateValue("bandf", value);
      if (resonance) {
        self.updateValue("bandq", resonance);
      }
      return self;
    },
    bpf: function (self: SoundEvent, value: number, resonance?: number) {
      self.updateValue("bandf", value);
      if (resonance) {
        self.updateValue("bandq", resonance);
      }
      return self;
    },
    bandq: ["bandq", "bpq"],
    bpadsr: function (
      self: SoundEvent,
      depth: number,
      a: number,
      d: number,
      s: number,
      r: number,
    ) {
      self.updateValue("bpenv", depth);
      self.updateValue("bpattack", a);
      self.updateValue("bpdecay", d);
      self.updateValue("bpsustain", s);
      self.updateValue("bprelease", r);
      return self;
    },
    bpad: function (self: SoundEvent, depth: number, a: number, d: number) {
      self.updateValue("bpenv", depth);
      self.updateValue("bpattack", a);
      self.updateValue("bpdecay", d);
      self.updateValue("bpsustain", 0);
      self.updateValue("bprelease", 0);
      return self;
    },
    vib: ["vib"],
    vibmod: ["vibmod"],
    fm: function (self: SoundEvent, value: number | string) {
      if (typeof value === "number") {
        self.values["fmi"] = value;
      } else {
        let values = value.split(":");
        self.values["fmi"] = parseFloat(values[0]);
        if (values.length > 1) self.values["fmh"] = parseFloat(values[1]);
      }
      return self;
    },
    loop: ["loop"],
    loopBegin: ["loopBegin", "loopb"],
    loopEnd: ["loopEnd", "loope"],
    begin: ["begin"],
    end: ["end"],
    gain: ["gain"],
    dbgain: function (self: SoundEvent, value: number) {
      self.updateValue("gain", Math.min(Math.pow(10, value / 20), 10));
      return self;
    },
    db: function (self: SoundEvent, value: number) {
      self.updateValue("gain", Math.min(Math.pow(10, value / 20), 10));
      return self;
    },
    velocity: ["velocity", "vel"],
    pan: ["pan"],
    cut: ["cut"],
    clip: ["clip"],
    n: ["n"],
    speed: ["speed", "spd"],
    coarse: ["coarse"],
    crush: ["crush"],
    shape: ["shape"],
    vowel: ["vowel", "vow"],
    delay: ["delay", "del"],
    delayfeedback: ["delayfeedback", "delayfb"],
    delaytime: ["delaytime", "delayt"],
    orbit: ["orbit", "o"],
    room: ["room", "rm"],
    roomfade: ["roomfade", "rfade"],
    roomlp: ["roomlp", "rlp"],
    roomdim: ["roomdim", "rdim"],
    sound: ["s", "sound"],
    size: function (self: SoundEvent, value: number) {
      self.updateValue("roomsize", value);
      return self;
    },
    sz: function (self: SoundEvent, value: number) {
      self.updateValue("roomsize", value);
      return self;
    },
    comp: ["compressor", "cmp"],
    ratio: function (self: SoundEvent, value: number) {
      self.updateValue("compressorRatio", value);
      return self;
    },
    knee: function (self: SoundEvent, value: number) {
      self.updateValue("compressorKnee", value);
      return self;
    },
    compAttack: function (self: SoundEvent, value: number) {
      self.updateValue("compressorAttack", value);
      return self;
    },
    compRelease: function (self: SoundEvent, value: number) {
      self.updateValue("compressorRelease", value);
      return self;
    },
    stretch: function (self: SoundEvent, beat: number) {
      self.updateValue("unit", "c");
      self.updateValue("speed", 1 / beat);
      self.updateValue("cut", beat);
      return self;
    },
  };

  constructor(
    sound: string | string[] | SoundParams,
    public app: Editor,
  ) {
    super(app);
    this.nudge = app.dough_nudge / 100;

    for (const [methodName, keys] of Object.entries(SoundEvent.methodMap)) {
      if (typeof keys === "object" && Symbol.iterator in Object(keys)) {
        for (const key of keys as string[]) {
          // Using arrow function to maintain 'this' context
          this[key] = (value: number) => this.updateValue(keys[0], value);
        }
      } else {
        // @ts-ignore
        this[methodName] = (...args) => keys(this, ...args);
      }
    }

    // for (const [methodName, keys] of Object.entries(SoundEvent.methodMap)) {
    //   if (typeof keys === "object" && Symbol.iterator in Object(keys)) {
    //     for (const key of keys as string[]) {
    //       // @ts-ignore
    //       this[key] = (value: number) => this.updateValue(this, keys[0], value);
    //     }
    //   } else {
    //     // @ts-ignore
    //     this[methodName] = keys;
    //   }
    // }
    this.values = this.processSound(sound);
  }

  private processSound = (
    sound: string | string[] | SoundParams | SoundParams[],
  ): SoundParams => {
    if (Array.isArray(sound) && typeof sound[0] === "string") {
      const s: string[] = [];
      const n: number[] = [];
      sound.forEach((str) => {
        const parts = (str as string).split(":");
        s.push(parts[0]);
        if (parts[1]) {
          n.push(parseInt(parts[1]));
        }
      });
      return {
        s,
        n: n.length > 0 ? n : undefined,
        dur: this.app.clock.convertPulseToSecond(this.app.clock.ppqn),
      };
    } else if (typeof sound === "object") {
      const validatedObj: SoundParams = {
        dur: this.app.clock.convertPulseToSecond(this.app.clock.ppqn),
        ...(sound as Partial<SoundParams>),
      };
      return validatedObj;
    } else {
      if (sound.includes(":")) {
        const vals = sound.split(":");
        const s = vals[0];
        const n = parseInt(vals[1]);
        return {
          s,
          n,
          dur: this.app.clock.convertPulseToSecond(this.app.clock.ppqn),
        };
      } else {
        return { s: sound, dur: 0.5 };
      }
    }
  };

  // ================================================================================
  // AbstactEvent overrides
  // ================================================================================

  modify = (func: Function): this => {
    const funcResult = func(this);
    if (funcResult instanceof Object) return funcResult;
    else {
      func(this.values);
      this.update();
      return this;
    }
  };

  update = (): void => {
    const filteredValues = filterObject(this.values, [
      "key",
      "pitch",
      "parsedScale",
      "octave",
    ]);
    const events = objectWithArraysToArrayOfObjects(filteredValues, [
      "parsedScale",
    ]);
    events.forEach((event) => {
      const [note, _] = noteFromPc(
        (event.key as number) || "C4",
        (event.pitch as number) || 0,
        (event.parsedScale as number[]) || event.scale || "MAJOR",
        (event.octave as number) || 0,
      );
      event.note = note;
      event.freq = midiToFreq(note);
    });

    const newArrays = arrayOfObjectsToObjectWithArrays(events) as SoundParams;

    this.values.note = newArrays.note;
    this.values.freq = newArrays.freq;
  };

  out = (orbit?: number | number[]): void => {
    if (orbit) this.values["orbit"] = orbit;
    const events = objectWithArraysToArrayOfObjects(this.values, [
      "parsedScale",
    ]);

    for (const event of events) {
      // Filter non superdough parameters
      // TODO: Should filter relevant fields for superdough
      // const filteredEvent = filterObject(event, ["analyze","note","dur","freq","s"]);
      const filteredEvent = event;
      // No need for note if there is freq
      if (filteredEvent.freq) {
        delete filteredEvent.note;
      }
      if (this.values["debug"]) {
        if (this.values["debugFunction"]) {
          this.values["debugFunction"](filteredEvent);
        } else {
          console.log(filteredEvent);
        }
      }
      superdough(filteredEvent, this.app.clock.deadline, filteredEvent.dur);
    }
  };
}
