import { type Editor } from "../main";
import { AudibleEvent } from "./AbstractEvents";
import * as zzfx from "zzfx";

interface ZZFXValues {
  volume: number;
  randomness: number;
  frequency: number;
  attack: number;
  sustain: number;
  release: number;
  shape: number;
  shapeCurve: number;
  slide: number;
  deltaSlide: number;
  pitchJump: number;
  pitchJumpTime: number;
  repeatTime: number;
  noise: number;
  modulation: number;
  bitCrush: number;
  delay: number;
  sustainVolume: number;
  decay: number;
  tremolo: number;
}

export class ZZFX extends AudibleEvent {
  /**
   * This class facilitates the creation of ZZFX Synth events
   * using method chaining. It leverages ZZFX for having another
   * synth to play with
   */
  values: ZZFXValues;
  constructor(sound: object, public app: Editor) {
    super(app);
    this.values =
      {
        volume: 1,
        randomness: 0.05,
        frequency: 220,
        attack: 0,
        sustain: 0,
        release: 0.1,
        shape: 0,
        shapeCurve: 1,
        slide: 0,
        deltaSlide: 0,
        pitchJump: 0,
        pitchJumpTime: 0,
        repeatTime: 0,
        noise: 0,
        modulation: 0,
        bitCrush: 0,
        delay: 0,
        sustainVolume: 1,
        decay: 0,
        tremolo: 0,
      } || sound;
  }

  volume = (value: number): this => {
    this.values["volume"] = value;
    return this;
  };
  vol = this.volume;

  randomness = (value: number): this => {
    this.values["randomness"] = value;
    return this;
  };
  rand = this.randomness;

  frequency = (value: number): this => {
    this.values["frequency"] = value;
    return this;
  };
  freq = this.frequency;

  attack = (value: number): this => {
    this.values["attack"] = value;
    return this;
  };
  att = this.attack;

  sustain = (value: number): this => {
    this.values["sustain"] = value;
    return this;
  };
  sus = this.sustain;

  release = (value: number): this => {
    this.values["release"] = value;
    return this;
  };
  rel = this.release;

  shape = (value: number): this => {
    this.values["shape"] = value;
    return this;
  };
  shp = this.shape;

  shapeCurve = (value: number): this => {
    this.values["shapeCurve"] = value;
    return this;
  };
  shpCurve = this.shapeCurve;

  slide = (value: number): this => {
    this.values["slide"] = value;
    return this;
  };
  sld = this.slide;

  deltaSlide = (value: number): this => {
    this.values["deltaSlide"] = value;
    return this;
  };
  dsld = this.deltaSlide;

  pitchJump = (value: number): this => {
    this.values["pitchJump"] = value;
    return this;
  };
  pitchj = this.pitchJump;

  pitchJumpTime = (value: number): this => {
    this.values["pitchJumpTime"] = value;
    return this;
  };
  pitchjt = this.pitchJumpTime;

  repeatTime = (value: number): this => {
    this.values["repeatTime"] = value;
    return this;
  };
  rept = this.repeatTime;

  noise = (value: number): this => {
    this.values["noise"] = value;
    return this;
  };
  nois = this.noise;

  modulation = (value: number): this => {
    this.values["modulation"] = value;
    return this;
  };
  mod = this.modulation;

  bitCrush = (value: number): this => {
    this.values["bitCrush"] = value;
    return this;
  };
  bitc = this.bitCrush;

  delay = (value: number): this => {
    this.values["delay"] = value;
    return this;
  };
  del = this.delay;

  sustainVolume = (value: number): this => {
    this.values["sustainVolume"] = value;
    return this;
  };
  susvol = this.sustainVolume;

  decay = (value: number): this => {
    this.values["decay"] = value;
    return this;
  };
  dec = this.decay;

  tremolo = (value: number): this => {
    this.values["tremolo"] = value;
    return this;
  };
  trem = this.tremolo;

  play = (): void => {
    zzfx(...Object.values(this.values));
  };
}
