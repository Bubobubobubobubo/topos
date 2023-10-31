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


type Param = number | number[];

export type SoundParams = {
  dur: number;
  s?: string;
};

export class SoundEvent extends AudibleEvent {
  nudge: number;

  constructor(sound: string | object | (string | object)[], public app: Editor) {
    super(app);
    this.nudge = app.dough_nudge / 100;
    if (Array.isArray(sound)) {
      this.values = sound.map(s => this.initializeSound(s));
    } else {
      this.values = this.initializeSound(sound);
    }
  }

  private initializeSound(sound: string | object): object {
    if (typeof sound === "string") {
      if (sound.includes(":")) {
        return {
          s: sound.split(":")[0],
          n: sound.split(":")[1],
          dur: this.app.clock.convertPulseToSecond(this.app.clock.ppqn),
          analyze: true,
        };
      } else {
        return { s: sound, dur: 0.5, analyze: true };
      }
    } else {
      return sound;
    }
  }

  public updateValue = <T>(key: string, value: T): this => {
    if (Array.isArray(this.values)) {
      if (Array.isArray(value)) {
        let originalLength = this.values.length;
        for (let i = 0; i < value.length; i++) {
          if (i >= originalLength) {
            let newObject = { ...this.values[i % originalLength] };
            this.values.push(newObject);
          }
          this.values[i][key] = value[i];
        }
      } else {
        this.values.forEach(obj => obj[key] = value);
      }
    } else {
      this.values[key] = value;
    }
    return this;
  }


  // ================================================================================
  // ZZFX Sound Parameters
  // ================================================================================


  public volume = (value: Param) => this.updateValue("volume", value);
  public vol = this.volume;
  public zrand = (value: Param) => this.updateValue("zrand", value);
  public curve = (value: Param) => this.updateValue("curve", value);
  public slide = (value: Param) => this.updateValue("slide", value);
  public sld = this.slide;
  public deltaSlide = (value: number | number[]) => this.updateValue("deltaSlide", value);
  public dslide = this.deltaSlide;
  public pitchJump = (value: number) => this.updateValue("pitchJump", value);
  public pj = this.pitchJump;
  public pitchJumpTime = (value: number) =>
    this.updateValue("pitchJumpTime", value);
  public pjt = this.pitchJumpTime;
  public lfo = (value: Param) => this.updateValue("lfo", value);
  public znoise = (value: Param) => this.updateValue("znoise", value);
  public noise = (value: Param) => this.updateValue("noise", value);
  public zmod = (value: Param) => this.updateValue("zmod", value);
  public zcrush = (value: Param) => this.updateValue("zcrush", value);
  public zdelay = (value: Param) => this.updateValue("zdelay", value);
  public sustainVolume = (value: Param) =>
    this.updateValue("sustainVolume", value);
  public tremolo = (value: Param) => this.updateValue("tremolo", value);
  public dur = (value: Param) => this.updateValue("dur", value);
  public zzfx = (value: Param[]) => this.updateValue("zzfx", value);

  // ================================================================================
  // Basic Audio Engine Parameters
  // ================================================================================

  // FM Synthesis
  public fmi = (value: Param) => this.updateValue("fmi", value);
  public fmh = (value: Param) => this.updateValue("fmh", value);
  public fmenv = (value: "lin" | "exp") => this.updateValue("fmenv", value);
  public fmattack = (value: Param) => this.updateValue("fmattack", value);
  public fmatk = this.fmattack;
  public fmdecay = (value: Param) => this.updateValue("fmdecay", value);
  public fmdec = this.fmdecay;
  public fmsustain = (value: Param) => this.updateValue("fmsustain", value);
  public fmsus = this.fmsustain;
  public fmrelease = (value: Param) => this.updateValue("fmrelease", value);
  public fmrel = this.fmrelease;
  public fmvelocity = (value: Param) => this.updateValue("fmvelocity", value);
  public fmvel = this.fmvelocity;
  public fmwave = (value: "sine" | "triangle" | "sawtooth" | "square") =>
    this.updateValue("fmwave", value);
  public fmw = this.fmwave;

  // Filter type
  public ftype = (value: "12db" | "24db") => this.updateValue("ftype", value);
  public fanchor = (value: Param) => this.updateValue("fanchor", value);

  // Amplitude Envelope
  public attack = (value: Param) => this.updateValue("attack", value);
  public atk = this.attack;
  public decay = (value: Param) => this.updateValue("decay", value);
  public dec = this.decay;
  public sustain = (value: Param) => this.updateValue("sustain", value);
  public sus = this.sustain;
  public release = (value: Param) => this.updateValue("release", value);
  public rel = this.release;
  public adsr = (a: Param, d: Param, s: Param, r: Param) => {
    this.attack(a);
    this.decay(d);
    this.sustain(s);
    this.release(r);
    return this;
  };
  public ad = (a: Param, d: Param) => {
    this.attack(a);
    this.decay(d);
    this.sustain(0.0);
    this.release(0.0);
    return this;
  };

  // Lowpass filter
  public lpenv = (value: Param) => this.updateValue("lpenv", value);
  public lpe = (value: Param) => this.updateValue("lpenv", value);
  public lpattack = (value: Param) => this.updateValue("lpattack", value);
  public lpa = this.lpattack;
  public lpdecay = (value: Param) => this.updateValue("lpdecay", value);
  public lpd = this.lpdecay;
  public lpsustain = (value: Param) => this.updateValue("lpsustain", value);
  public lps = this.lpsustain;
  public lprelease = (value: Param) => this.updateValue("lprelease", value);
  public lpr = this.lprelease;
  public cutoff = (value: Param, resonance?: Param) => {
    this.updateValue("cutoff", value);
    if (resonance) {
      this.resonance(resonance)
    }
    return this;
  }
  public lpf = this.cutoff;
  public resonance = (value: Param | number) => {
    if (value >= 0 && value <= 1) {
      this.updateValue(
        "resonance",
        50 * value
      );
    }
    return this;
  }
  public lpq = this.resonance;
  public lpadsr = (
    depth: Param,
    a: Param,
    d: Param,
    s: Param,
    r: Param
  ) => {
    this.lpenv(depth);
    this.lpattack(a);
    this.lpdecay(d);
    this.lpsustain(s);
    this.lprelease(r);
    return this;
  };
  public lpad = (
    depth: Param,
    a: Param,
    d: Param,
  ) => {
    this.lpenv(depth);
    this.lpattack(a);
    this.lpdecay(d);
    this.lpsustain(0);
    this.lprelease(0);
    return this;
  };


  // Highpass filter

  public hpenv = (value: Param) => this.updateValue("hpenv", value);
  public hpe = (value: Param) => this.updateValue("hpe", value);
  public hpattack = (value: Param) => this.updateValue("hpattack", value);
  public hpa = this.hpattack;
  public hpdecay = (value: Param) => this.updateValue("hpdecay", value);
  public hpd = this.hpdecay;
  public hpsustain = (value: Param) => this.updateValue("hpsustain", value);
  public hpsus = this.hpsustain;
  public hprelease = (value: Param) => this.updateValue("hprelease", value);
  public hpr = this.hprelease;
  public hcutoff = (value: Param) => this.updateValue("hcutoff", value);
  public hpf = this.hcutoff;
  public hresonance = (value: Param, resonance?: Param) => {
    this.updateValue("hresonance", value);
    if (resonance) {
      this.resonance(resonance)
    }
    return this;
  }
  public hpq = this.hresonance;
  public hpadsr = (
    depth: Param,
    a: Param,
    d: Param,
    s: Param,
    r: Param
  ) => {
    this.hpenv(depth);
    this.hpattack(a);
    this.hpdecay(d);
    this.hpsustain(s);
    this.hprelease(r);
    return this;
  };
  public hpad = (
    depth: Param,
    a: Param,
    d: Param,
  ) => {
    this.hpenv(depth);
    this.hpattack(a);
    this.hpdecay(d);
    this.hpsustain(0);
    this.hprelease(0);
    return this;
  };

  // Bandpass filter

  public bpenv = (value: Param) => this.updateValue("bpenv", value);
  public bpe = (value: Param) => this.updateValue("bpe", value);
  public bpattack = (value: Param) => this.updateValue("bpattack", value);
  public bpa = this.bpattack;
  public bpdecay = (value: Param) => this.updateValue("bpdecay", value);
  public bpd = this.bpdecay;
  public bpsustain = (value: Param) => this.updateValue("bpsustain", value);
  public bps = this.bpsustain;
  public bprelease = (value: Param) => this.updateValue("bprelease", value);
  public bpr = this.bprelease;
  public bandf = (value: Param, resonance?: Param) => {
    this.updateValue("bandf", value);
    if (resonance) {
      this.resonance(resonance)
    }
    return this;
  }
  public bpf = this.bandf;
  public bandq = (value: Param) => this.updateValue("bandq", value);
  public bpq = this.bandq;
  public bpadsr = (
    depth: Param,
    a: Param,
    d: Param,
    s: Param,
    r: Param
  ) => {
    this.bpenv(depth);
    this.bpattack(a);
    this.bpdecay(d);
    this.bpsustain(s);
    this.bprelease(r);
    return this;
  };
  public bpad = (
    depth: Param,
    a: Param,
    d: Param,
  ) => {
    this.bpenv(depth);
    this.bpattack(a);
    this.bpdecay(d);
    this.bpsustain(0);
    this.bprelease(0);
    return this;
  };


  public freq = (value: Param) => this.updateValue("freq", value);
  public f = this.freq;
  public vib = (value: Param) => this.updateValue("vib", value);
  public vibmod = (value: Param) => this.updateValue("vibmod", value);
  public fm = (value: Param | string) => {
    if (typeof value === "number") {
      this.values["fmi"] = value;
    } else {
      let values = value.split(":");
      this.values["fmi"] = parseFloat(values[0]);
      if (values.length > 1) this.values["fmh"] = parseFloat(values[1]);
    }
    return this;
  };

  // Sampler looping
  public loop = (value: Param) => this.updateValue("loop", value);
  public loopBegin = (value: Param) => this.updateValue("loopBegin", value);
  public loopEnd = (value: Param) => this.updateValue("loopEnd", value);
  public begin = (value: Param) => this.updateValue("begin", value);
  public end = (value: Param) => this.updateValue("end", value);

  // Gain management
  public gain = (value: Param) => this.updateValue("gain", value);
  public dbgain = (value: Param) =>
    this.updateValue("gain", Math.min(Math.pow(10, value / 20), 10));
  public db = this.dbgain;
  public velocity = (value: Param) => this.updateValue("velocity", value);
  public vel = this.velocity;

  // Panoramic control (stereo)
  public pan = (value: Param) => this.updateValue("pan", value);

  // Frequency management

  public sound = (value: string) => this.updateValue("s", value);
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
  public snd = this.sound;
  public cut = (value: Param) => this.updateValue("cut", value);
  public clip = (value: Param) => this.updateValue("clip", value);
  public n = (value: Param) => this.updateValue("n", value);
  public note = (value: Param | string | null) => {
    if (typeof value === "string") {
      return this.updateValue("note", noteNameToMidi(value));
    } else if (typeof value == null || value == undefined) {
      return this.updateValue("note", 0).updateValue("gain", 0);
    } else {
      return this.updateValue("note", value);
    }
  };
  public speed = (value: Param) => this.updateValue("speed", value);
  public spd = this.speed;

  // Creative sampler effects
  public coarse = (value: Param) => this.updateValue("coarse", value);
  public crush = (value: Param) => this.updateValue("crush", value);
  public shape = (value: Param) => this.updateValue("shape", value);
  public vowel = (value: Param) => this.updateValue("vowel", value);
  public vow = this.vowel;

  // Delay control
  public delay = (value: Param) => this.updateValue("delay", value);
  public del = this.delay;
  public delayfeedback = (value: Param) =>
    this.updateValue("delayfeedback", value);
  public delayfb = this.delayfeedback;
  public delaytime = (value: Param) => this.updateValue("delaytime", value);
  public delayt = this.delaytime;

  // Orbit management
  public orbit = (value: Param) => this.updateValue("orbit", value);
  public o = this.orbit;

  // Reverb management
  public room = (value: Param) => this.updateValue("room", value);
  public rm = this.room;
  public roomfade = (value: Param) => this.updateValue("roomfade", value);
  public rfade = this.roomfade;
  public roomlp = (value: Param) => this.updateValue("roomlp", value);
  public rlp = this.roomlp;
  public roomdim = (value: Param) => this.updateValue("roomdim", value);
  public rdim = this.roomdim;
  public size = (value: Param) => this.updateValue("roomsize", value);
  public sz = this.size;
  public rev = (room: Param, size: Param, fade?: Param, lp?: Param, dim?: Param) => {
    this.updateValue("room", room)
    this.updateValue("roomsize", size)
    if (fade)
      this.updateValue("roomfade", fade)
    if (lp)
      this.updateValue("roomlp", lp)
    if (dim)
      this.updateValue("roomdim", dim)

    return this;
  }

  // Compressor
  public comp = (value: Param) => this.updateValue("compressor", value);
  public cmp = this.comp;
  public ratio = (value: Param) => this.updateValue("compressorRatio", value);
  public rt = this.ratio;
  public knee = (value: Param) => this.updateValue("compressorKnee", value);
  public kn = this.knee;
  public compAttack = (value: Param) =>
    this.updateValue("compressorAttack", value);
  public cmpa = this.compAttack;
  public compRelease = (value: Param) =>
    this.updateValue("compressorRelease", value);
  public cmpr = this.compRelease;

  // Unit
  public stretch = (beat: Param) => {
    this.updateValue("unit", "c");
    this.updateValue("speed", 1 / beat);
    this.updateValue("cut", beat);
    return this;
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
    const [note, _] = noteFromPc(
      this.values.key || "C4",
      this.values.pitch || 0,
      this.values.parsedScale || "MAJOR",
      this.values.octave || 0
    );
    this.values.freq = midiToFreq(note);
  };

  out = (): void => {
    console.log(this.values)
    if (Array.isArray(this.values)) {
      this.values.forEach((soundObj) => {
        superdough(soundObj, this.nudge, soundObj.dur);
      });
    } else {
      superdough(this.values, this.nudge, this.values.dur);
    }
  };



}
