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
    if (typeof sound === "string") this.values = { s: sound, dur: 0.5 };
    else this.values = sound;
  }

  private updateValue<T>(key: string, value: T): this {
    this.values[key] = value;
    return this;
  }

  // ================================================================================
  // ZZFX Sound Parameters
  // ================================================================================

  volume = (value: number) => this.updateValue("volume", value);
  vol = this.volume;
  zrand = (value: number) => this.updateValue("zrand", value);
  curve = (value: number) => this.updateValue("curve", value);
  slide = (value: number) => this.updateValue("slide", value);
  deltaSlide = (value: number) => this.updateValue("deltaSlide", value);
  dslide = this.deltaSlide;
  pitchJump = (value: number) => this.updateValue("pitchJump", value);
  pj = this.pitchJump;
  pitchJumpTime = (value: number) => this.updateValue("pitchJumpTime", value);
  pjt = this.pitchJumpTime;
  lfo = (value: number) => this.updateValue("lfo", value);
  noise = (value: number) => this.updateValue("noise", value);
  zmod = (value: number) => this.updateValue("zmod", value);
  zcrush = (value: number) => this.updateValue("zcrush", value);
  zdelay = (value: number) => this.updateValue("zdelay", value);
  sustainVolume = (value: number) => this.updateValue("sustainVolume", value);
  decay = (value: number) => this.updateValue("decay", value);
  tremolo = (value: number) => this.updateValue("tremolo", value);

  // ================================================================================
  // Basic Audio Engine Parameters
  // ================================================================================

  fmi = (value: number) => this.updateValue("fmi", value);
  fmh = (value: number) => this.updateValue("fmh", value);
  fmenv = (value: "lin" | "exp") => this.updateValue("fmenv", value);
  fmattack = (value: number) => this.updateValue("fmattack", value);
  fmatk = this.fmattack;
  fmdecay = (value: number) => this.updateValue("fmdecay", value);
  fmdec = this.fmdecay;
  fmsustain = (value: number) => this.updateValue("fmsustain", value);
  fmsus = this.fmsustain;
  fmrelease = (value: number) => this.updateValue("fmrelease", value);
  fmrel = this.fmrelease;
  fmvelocity = (value: number) => this.updateValue("fmvelocity", value);
  fmvel = this.fmvelocity;
  fmwave = (value: "sine" | "triangle" | "sawtooth" | "square") =>
    this.updateValue("fmwave", value);
  fmw = this.fmwave;
  attack = (value: number) => this.updateValue("attack", value);
  atk = this.attack;
  decay = (value: number) => this.updateValue("decay", value);
  dec = this.decay;
  release = (value: number) => this.updateValue("release", value);
  rel = this.release;
  sustain = (value: number) => this.updateValue("sustain", value);
  sus = this.sustain;
  unit = (value: number) => this.updateValue("unit", value);
  u = this.unit;
  freq = (value: number) => this.updateValue("freq", value);
  f = this.freq;
  fm = (value: number | string) => {
    if (typeof value === "number") {
      this.values["fmi"] = value;
    } else {
      let values = value.split(":");
      this.values["fmi"] = parseFloat(values[0]);
      if (values.length > 1) this.values["fmh"] = parseFloat(values[1]);
    }
    return this;
  };
  sound = (value: string) => this.updateValue("s", value);
  snd = this.sound;
  nudge = (value: number) => this.updateValue("nudge", value);
  cut = (value: number) => this.updateValue("cut", value);
  loop = (value: number) => this.updateValue("loop", value);
  clip = (value: number) => this.updateValue("clip", value);
  n = (value: number) => this.updateValue("n", value);
  note = (value: number) => this.updateValue("note", value);
  speed = (value: number) => this.updateValue("speed", value);
  spd = this.speed;
  begin = (value: number) => this.updateValue("begin", value);
  end = (value: number) => this.updateValue("end", value);
  gain = (value: number) => this.updateValue("gain", value);
  cutoff = (value: number) => this.updateValue("cutoff", value);
  lpf = this.cutoff;
  resonance = (value: number) => this.updateValue("resonance", value);
  lpq = this.resonance;
  hcutoff = (value: number) => this.updateValue("hcutoff", value);
  hpf = this.hcutoff;
  hresonance = (value: number) => this.updateValue("hresonance", value);
  hpq = this.hresonance;
  bandf = (value: number) => this.updateValue("bandf", value);
  bpf = this.bandf;
  bandq = (value: number) => this.updateValue("bandq", value);
  bpq = this.bandq;
  coarse = (value: number) => this.updateValue("coarse", value);
  crush = (value: number) => this.updateValue("crush", value);
  shape = (value: number) => this.updateValue("shape", value);
  pan = (value: number) => this.updateValue("pan", value);
  vowel = (value: number) => this.updateValue("vowel", value);
  vow = this.vowel;
  delay = (value: number) => this.updateValue("delay", value);
  del = this.delay;
  delayfeedback = (value: number) => this.updateValue("delayfeedback", value);
  delayfb = this.delayfeedback;
  delaytime = (value: number) => this.updateValue("delaytime", value);
  delayt = this.delaytime;
  orbit = (value: number) => this.updateValue("orbit", value);
  o = this.orbit;
  room = (value: number) => this.updateValue("room", value);
  rm = this.room;
  size = (value: number) => this.updateValue("size", value);
  sz = this.size;
  velocity = (value: number) => this.updateValue("velocity", value);
  vel = this.velocity;

  update = (): void => {
    const [note, _] = noteFromPc(
      this.values.key || "C4",
      this.values.pitch || 0,
      this.values.parsedScale || "MAJOR",
      this.values.octave || 0
    );
    this.values.freq = midiToFreq(note);
  };

  out = (): object => {
    return superdough(
      this.values,
      this.app.clock.pulse_duration,
      this.values.dur || 0.5
    );
  };
}
