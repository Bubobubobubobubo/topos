import { type Editor } from "../main";
import { AudibleEvent } from "./AbstractEvents";
import {
  chord as parseChord,
  midiToFreq,
  noteFromPc,
  noteNameToMidi,
} from "zifferjs";

import {
  superdough,
  // @ts-ignore
} from "superdough";

type EventObj = { [key: string]: number | number[] };

export type SoundParams = {
  dur: number;
  s?: string;
};

type ValuesType = {
  s: string | string[];
  n?: string | string[];
  dur: number;
  analyze: boolean;
};

export class SoundEvent extends AudibleEvent {
  nudge: number;

  private methodMap = {
    volume: ["volume", "vol"],
    zrand: ["zrand", "zr"],
    curve: ["curve"],
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
    fmadsr: (a: number, d: number, s: number, r: number) => {
      this.updateValue("fmattack", a);
      this.updateValue("fmdecay", d);
      this.updateValue("fmsustain", s);
      this.updateValue("fmrelease", r);
      return this;
    },
    fmad: (a: number, d: number) => {
      this.updateValue("fmattack", a);
      this.updateValue("fmdecay", d);
      return this;
    },
    ftype: ["ftype"],
    fanchor: ["fanchor"],
    attack: ["attack", "atk"],
    decay: ["decay", "dec"],
    sustain: ["sustain", "sus"],
    release: ["release", "rel"],
    adsr: (a: number, d: number, s: number, r: number) => {
      this.updateValue("attack", a);
      this.updateValue("decay", d);
      this.updateValue("sustain", s);
      this.updateValue("release", r);
      return this;
    },
    ad: (a: number, d: number) => {
      this.updateValue("attack", a);
      this.updateValue("decay", d);
      this.updateValue("sustain", 0.0);
      this.updateValue("release", 0.0);
      return this;
    },
    lpenv: ["lpenv", "lpe"],
    lpattack: ["lpattack", "lpa"],
    lpdecay: ["lpdecay", "lpd"],
    lpsustain: ["lpsustain", "lps"],
    lprelease: ["lprelease", "lpr"],
    cutoff: (value: number, resonance?: number) => {
      this.updateValue("cutoff", value);
      if (resonance) {
        this.updateValue("resonance", resonance);
      }
      return this;
    },
    lpf: (value: number, resonance?: number) => {
      this.updateValue("cutoff", value);
      if (resonance) {
        this.updateValue("resonance", resonance);
      }
      return this;
    },
    resonance: (value: number) => {
      if (value >= 0 && value <= 1) {
        this.updateValue("resonance", 50 * value);
      }
      return this;
    },
    lpadsr: (depth: number, a: number, d: number, s: number, r: number) => {
      this.updateValue("lpenv", depth);
      this.updateValue("lpattack", a);
      this.updateValue("lpdecay", d);
      this.updateValue("lpsustain", s);
      this.updateValue("lprelease", r);
      return this;
    },
    lpad: (depth: number, a: number, d: number) => {
      this.updateValue("lpenv", depth);
      this.updateValue("lpattack", a);
      this.updateValue("lpdecay", d);
      this.updateValue("lpsustain", 0);
      this.updateValue("lprelease", 0);
      return this;
    },
    hpenv: ["hpenv", "hpe"],
    hpattack: ["hpattack", "hpa"],
    hpdecay: ["hpdecay", "hpd"],
    hpsustain: ["hpsustain", "hpsus"],
    hprelease: ["hprelease", "hpr"],
    hcutoff: (value: number, resonance?: number) => {
      this.updateValue("hcutoff", value);
      if (resonance) {
        this.updateValue("hresonance", resonance);
      }
      return this;
    },
    hpq: (value: number) => {
      this.updateValue("hresonance", value);
      return this;
    },
    hpadsr: (depth: number, a: number, d: number, s: number, r: number) => {
      this.updateValue("hpenv", depth);
      this.updateValue("hpattack", a);
      this.updateValue("hpdecay", d);
      this.updateValue("hpsustain", s);
      this.updateValue("hprelease", r);
      return this;
    },
    hpad: (depth: number, a: number, d: number) => {
      this.updateValue("hpenv", depth);
      this.updateValue("hpattack", a);
      this.updateValue("hpdecay", d);
      this.updateValue("hpsustain", 0);
      this.updateValue("hprelease", 0);
      return this;
    },
    bpenv: ["bpenv", "bpe"],
    bpattack: ["bpattack", "bpa"],
    bpdecay: ["bpdecay", "bpd"],
    bpsustain: ["bpsustain", "bps"],
    bprelease: ["bprelease", "bpr"],
    bandf: (value: number, resonance?: number) => {
      this.updateValue("bandf", value);
      if (resonance) {
        this.updateValue("bandq", resonance);
      }
      return this;
    },
    bpf: (value: number, resonance?: number) => {
      this.updateValue("bandf", value);
      if (resonance) {
        this.updateValue("bandq", resonance);
      }
      return this;
    },
    bandq: ["bandq", "bpq"],
    bpadsr: (depth: number, a: number, d: number, s: number, r: number) => {
      this.updateValue("bpenv", depth);
      this.updateValue("bpattack", a);
      this.updateValue("bpdecay", d);
      this.updateValue("bpsustain", s);
      this.updateValue("bprelease", r);
      return this;
    },
    bpad: (depth: number, a: number, d: number) => {
      this.updateValue("bpenv", depth);
      this.updateValue("bpattack", a);
      this.updateValue("bpdecay", d);
      this.updateValue("bpsustain", 0);
      this.updateValue("bprelease", 0);
      return this;
    },
    vib: ["vib"],
    vibmod: ["vibmod"],
    fm: (value: number | string) => {
      if (typeof value === "number") {
        this.values["fmi"] = value;
      } else {
        let values = value.split(":");
        this.values["fmi"] = parseFloat(values[0]);
        if (values.length > 1) this.values["fmh"] = parseFloat(values[1]);
      }
      return this;
    },
    loop: ["loop"],
    loopBegin: ["loopBegin", "loopb"],
    loopEnd: ["loopEnd", "loope"],
    begin: ["begin"],
    end: ["end"],
    gain: ["gain"],
    dbgain: (value: number) => {
      this.updateValue("gain", Math.min(Math.pow(10, value / 20), 10));
      return this;
    },
    db: (value: number) => {
      this.updateValue("gain", Math.min(Math.pow(10, value / 20), 10));
      return this;
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
    sound: ["sound", "s"],
    size: (value: number) => {
      this.updateValue("roomsize", value);
      return this;
    },
    sz: (value: number) => {
      this.updateValue("roomsize", value);
      return this;
    },
    comp: ["compressor", "cmp"],
    ratio: (value: number) => {
      this.updateValue("compressorRatio", value);
      return this;
    },
    knee: (value: number) => {
      this.updateValue("compressorKnee", value);
      return this;
    },
    compAttack: (value: number) => {
      this.updateValue("compressorAttack", value);
      return this;
    },
    compRelease: (value: number) => {
      this.updateValue("compressorRelease", value);
      return this;
    },
    stretch: (beat: number) => {
      this.updateValue("unit", "c");
      this.updateValue("speed", 1 / beat);
      this.updateValue("cut", beat);
      return this;
    },
  };


  constructor(sound: string | string[] | object, public app: Editor) {
    super(app);
    this.nudge = app.dough_nudge / 100;

    for (const [methodName, keys] of Object.entries(this.methodMap)) {
      if (Symbol.iterator in Object(keys)) {
        for (const key of keys as string[]) {
          // @ts-ignore
          this[key] = (value: number) => this.updateValue(keys[0], value);
        }
      } else {
        // @ts-ignore
        this[methodName] = keys;
      }
    }
    this.values = this.processSound(sound);
  }

  private processSound = (sound: string | string[] | object): ValuesType => {
    if (Array.isArray(sound)) {
      const s: string[] = [];
      const n: string[] = [];
      sound.forEach(str => {
        const parts = str.split(":");
        s.push(parts[0]);
        if (parts[1]) {
          n.push(parts[1]);
        }
      });
      return {
        s,
        n: n.length > 0 ? n : undefined,
        dur: this.app.clock.convertPulseToSecond(this.app.clock.ppqn),
        analyze: true
      };
    } else if (typeof sound === 'object') {
      console.log(sound)
      const validatedObj: ValuesType = {
        dur: this.app.clock.convertPulseToSecond(this.app.clock.ppqn),
        analyze: true,
        ...sound as Partial<ValuesType>
      };
      return validatedObj;
    } else {
      if (sound.includes(":")) {
        const [s, n] = sound.split(":");
        return {
          s,
          n,
          dur: this.app.clock.convertPulseToSecond(this.app.clock.ppqn),
          analyze: true
        };
      } else {
        return { s: sound, dur: 0.5, analyze: true };
      }
    }
  }


  private updateValue<T>(key: string, value: T | T[] | null): this {
    if (value == null) return this;
    this.values[key] = value;
    return this;
  }

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
    const [note, _] = noteFromPc(
      this.values.key || "C4",
      this.values.pitch || 0,
      this.values.parsedScale || "MAJOR",
      this.values.octave || 0
    );
    this.values.freq = midiToFreq(note);
  };

  generateEvents = (input: EventObj): EventObj[] => {
    const keys = Object.keys(input);
    const maxLength = Math.max(
      ...keys.map((k) =>
        Array.isArray(input[k]) ? (input[k] as number[]).length : 1
      )
    );

    const output: EventObj[] = [];

    for (let i = 0; i < maxLength; i++) {
      const event: EventObj = {};
      for (const k of keys) {
        if (Array.isArray(input[k])) {
          // @ts-ignore
          event[k] = input[k][i % (input[k] as number[]).length];
        } else {
          event[k] = input[k];
        }
      }
      output.push(event);
    }

    return output;
  };

  public chord = (
    value: string | object[] | number[] | number,
    ...kwargs: number[]
  ) => {
    if (typeof value === "string") {
      const chord = parseChord(value);
      value = chord.map((note: number) => {
        return { note: note, freq: midiToFreq(note) };
      });
    } else if (value instanceof Array && typeof value[0] === "number") {
      value = (value as number[]).map((note: number) => {
        return { note: note, freq: midiToFreq(note) };
      });
    } else if (typeof value === "number" && kwargs.length > 0) {
      value = [value, ...kwargs].map((note: number) => {
        return { note: note, freq: midiToFreq(note) };
      });
    }
    return this.updateValue("chord", value);
  };
  public invert = (howMany: number = 0) => {
    if (this.values.chord) {
      let notes = this.values.chord.map(
        (obj: { [key: string]: number }) => obj.note
      );
      notes = howMany < 0 ? [...notes].reverse() : notes;
      for (let i = 0; i < Math.abs(howMany); i++) {
        notes[i % notes.length] += howMany <= 0 ? -12 : 12;
      }
      const chord = notes.map((note: number) => {
        return { note: note, freq: midiToFreq(note) };
      });
      return this.updateValue("chord", chord);
    } else {
      return this;
    }
  };
  public note = (value: number | string | null) => {
    if (typeof value === "string") {
      return this.updateValue("note", noteNameToMidi(value));
    } else if (typeof value == null || value == undefined) {
      return this.updateValue("note", 0).updateValue("gain", 0);
    } else {
      return this.updateValue("note", value);
    }
  };



  out = (): void => {
    const input = this.values.chord || this.values;
    const events = this.generateEvents(input);
    console.log(events);
    for (const event of events) {
      superdough(
        { ...event, ...{ freq: event.freq, dur: this.values.dur } },
        this.nudge,
        this.values.dur
      );
    }
  };
}
