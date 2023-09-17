import { type Editor } from "../main";
import { AudibleEvent } from "./AbstractEvents";
import { midiToFreq, noteFromPc } from "zifferjs";

import {
  superdough,
  // @ts-ignore
} from "superdough";

export class SoundEvent extends AudibleEvent {
  constructor(sound: string | object, public app: Editor) {
    super(app);
    if (typeof sound === "string") {
      if (sound.includes(":")) {
        this.values = {
          s: sound.split(":")[0],
          n: sound.split(":")[1],
          dur: 0.5,
        };
      } else {
        this.values = { s: sound, dur: 0.5 };
      }
    } else {
      this.values = sound;
    }
  }

  private updateValue<T>(key: string, value: T): this {
    this.values[key] = value;
    return this;
  }

  // ================================================================================
  // ZZFX Sound Parameters
  // ================================================================================

  public volume = (value: number) => this.updateValue("volume", value);
  public vol = this.volume;
  public zrand = (value: number) => this.updateValue("zrand", value);
  public curve = (value: number) => this.updateValue("curve", value);
  public slide = (value: number) => this.updateValue("slide", value);
  public sld = this.slide;
  public deltaSlide = (value: number) => this.updateValue("deltaSlide", value);
  public dslide = this.deltaSlide;
  public pitchJump = (value: number) => this.updateValue("pitchJump", value);
  public pj = this.pitchJump;
  public pitchJumpTime = (value: number) =>
    this.updateValue("pitchJumpTime", value);
  public pjt = this.pitchJumpTime;
  public lfo = (value: number) => this.updateValue("lfo", value);
  public noise = (value: number) => this.updateValue("noise", value);
  public zmod = (value: number) => this.updateValue("zmod", value);
  public zcrush = (value: number) => this.updateValue("zcrush", value);
  public zdelay = (value: number) => this.updateValue("zdelay", value);
  public sustainVolume = (value: number) =>
    this.updateValue("sustainVolume", value);
  public tremolo = (value: number) => this.updateValue("tremolo", value);
  public duration = (value: number) => this.updateValue("duration", value);
  public zzfx = (value: number[]) => this.updateValue("zzfx", value);

  // ================================================================================
  // Basic Audio Engine Parameters
  // ================================================================================

  // FM Synthesis
  public fmi = (value: number) => this.updateValue("fmi", value);
  public fmh = (value: number) => this.updateValue("fmh", value);
  public fmenv = (value: "lin" | "exp") => this.updateValue("fmenv", value);
  public fmattack = (value: number) => this.updateValue("fmattack", value);
  public fmatk = this.fmattack;
  public fmdecay = (value: number) => this.updateValue("fmdecay", value);
  public fmdec = this.fmdecay;
  public fmsustain = (value: number) => this.updateValue("fmsustain", value);
  public fmsus = this.fmsustain;
  public fmrelease = (value: number) => this.updateValue("fmrelease", value);
  public fmrel = this.fmrelease;
  public fmvelocity = (value: number) => this.updateValue("fmvelocity", value);
  public fmvel = this.fmvelocity;
  public fmwave = (value: "sine" | "triangle" | "sawtooth" | "square") =>
    this.updateValue("fmwave", value);
  public fmw = this.fmwave;

  // Filter type
  public ftype = (value: "12db" | "24db") => this.updateValue("ftype", value);
  public fanchor = (value: number) => this.updateValue("fanchor", value);

  // Amplitude Envelope
  public attack = (value: number) => this.updateValue("attack", value);
  public atk = this.attack;
  public decay = (value: number) => this.updateValue("decay", value);
  public dec = this.decay;
  public sustain = (value: number) => this.updateValue("sustain", value);
  public sus = this.sustain;
  public release = (value: number) => this.updateValue("release", value);
  public rel = this.release;

  // Lowpass filter
  public lpenv = (value: number) => this.updateValue("lpenv", value);
  public lpe = (value: number) => this.updateValue("lpe", value);
  public lpattack = (value: number) => this.updateValue("lpattack", value);
  public lpa = this.lpattack;
  public lbdecay = (value: number) => this.updateValue("lbdecay", value);
  public lbd = this.lbdecay;
  public lpsustain = (value: number) => this.updateValue("lpsustain", value);
  public lpsus = this.lpsustain;
  public lprelease = (value: number) => this.updateValue("lprelease", value);
  public lpr = this.lprelease;
  public cutoff = (value: number) => this.updateValue("cutoff", value);
  public lpf = this.cutoff;
  public resonance = (value: number) =>
    this.updateValue("resonance", Math.min(Math.max(value, 0), 50));
  public lpq = this.resonance;

  // Highpass filter

  public hpenv = (value: number) => this.updateValue("hpenv", value);
  public hpe = (value: number) => this.updateValue("hpe", value);
  public hpattack = (value: number) => this.updateValue("hpattack", value);
  public hpa = this.hpattack;
  public hpdecay = (value: number) => this.updateValue("hpdecay", value);
  public hpd = this.hpdecay;
  public hpsustain = (value: number) => this.updateValue("hpsustain", value);
  public hpsus = this.hpsustain;
  public hprelease = (value: number) => this.updateValue("hprelease", value);
  public hpr = this.hprelease;
  public hcutoff = (value: number) => this.updateValue("hcutoff", value);
  public hpf = this.hcutoff;
  public hresonance = (value: number) => this.updateValue("hresonance", value);
  public hpq = this.hresonance;

  // Bandpass filter

  public bpenv = (value: number) => this.updateValue("bpenv", value);
  public bpe = (value: number) => this.updateValue("bpe", value);
  public bpattack = (value: number) => this.updateValue("bpattack", value);
  public bpa = this.bpattack;
  public bpdecay = (value: number) => this.updateValue("bpdecay", value);
  public bpd = this.bpdecay;
  public bpsustain = (value: number) => this.updateValue("bpsustain", value);
  public bps = this.bpsustain;
  public bprelease = (value: number) => this.updateValue("bprelease", value);
  public bpr = this.bprelease;
  public bandf = (value: number) => this.updateValue("bandf", value);
  public bpf = this.bandf;
  public bandq = (value: number) => this.updateValue("bandq", value);
  public bpq = this.bandq;

  public freq = (value: number) => this.updateValue("freq", value);
  public f = this.freq;
  public vib = (value: number) => this.updateValue("vib", value);
  public vibmod = (value: number) => this.updateValue("vibmod", value);
  public fm = (value: number | string) => {
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
  public loop = (value: number) => this.updateValue("loop", value);
  public loopBegin = (value: number) => this.updateValue("loopBegin", value);
  public loopEnd = (value: number) => this.updateValue("loopEnd", value);
  public begin = (value: number) => this.updateValue("begin", value);
  public end = (value: number) => this.updateValue("end", value);

  // Gain management
  public gain = (value: number) => this.updateValue("gain", value);
  public dbgain = (value: number) =>
    this.updateValue("gain", Math.min(Math.pow(10, value / 20), 10));
  public db = this.dbgain;
  public velocity = (value: number) => this.updateValue("velocity", value);
  public vel = this.velocity;

  // Panoramic control (stereo)
  public pan = (value: number) => this.updateValue("pan", value);

  // Frequency management

  public sound = (value: string) => this.updateValue("s", value);
  public chord = (value: number[]) => this.updateValue("chord", value);
  public snd = this.sound;
  public nudge = (value: number) => this.updateValue("nudge", value);
  public cut = (value: number) => this.updateValue("cut", value);
  public clip = (value: number) => this.updateValue("clip", value);
  public n = (value: number) => this.updateValue("n", value);
  public note = (value: number) => this.updateValue("note", value);
  public speed = (value: number) => this.updateValue("speed", value);
  public spd = this.speed;

  // Creative sampler effects
  public coarse = (value: number) => this.updateValue("coarse", value);
  public crush = (value: number) => this.updateValue("crush", value);
  public shape = (value: number) => this.updateValue("shape", value);
  public vowel = (value: number) => this.updateValue("vowel", value);
  public vow = this.vowel;

  // Delay control
  public delay = (value: number) => this.updateValue("delay", value);
  public del = this.delay;
  public delayfeedback = (value: number) =>
    this.updateValue("delayfeedback", value);
  public delayfb = this.delayfeedback;
  public delaytime = (value: number) => this.updateValue("delaytime", value);
  public delayt = this.delaytime;

  // Orbit management
  public orbit = (value: number) => this.updateValue("orbit", value);
  public o = this.orbit;

  // Reverb management
  public room = (value: number) => this.updateValue("room", value);
  public rm = this.room;
  public size = (value: number) => this.updateValue("size", value);
  public sz = this.size;

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
    if (this.values.chord) {
      this.values.chord.forEach((freq: number) => {
        const copy = { ...this.values };
        copy.freq = freq;
        superdough(copy, 1 / 4, this.values.dur || 0.5);
      });
    } else {
      superdough(this.values, 1 / 4, this.values.dur || 0.5);
    }
  };
}
