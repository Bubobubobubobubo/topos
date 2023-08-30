import { type Editor } from "../main";
import {
  freqToMidi,
  resolvePitchBend,
  getScale,
  isScale,
  parseScala,
} from "zifferjs";

export abstract class Event {
  seedValue: string | undefined = undefined;
  randomGen: Function = Math.random;
  app: Editor;
  values: { [key: string]: any } = {};

  constructor(app: Editor) {
    this.app = app;
    if (this.app.api.currentSeed) {
      this.randomGen = this.app.api.randomGen;
    }
  }

  odds = (probability: number, func: Function): Event => {
    if (this.randomGen() < probability) {
      return this.modify(func);
    }
    return this;
  };

  almostNever = (func: Function): Event => {
    return this.odds(0.025, func);
  };

  rarely = (func: Function): Event => {
    return this.odds(0.1, func);
  };

  scarcely = (func: Function): Event => {
    return this.odds(0.25, func);
  };

  sometimes = (func: Function): Event => {
    return this.odds(0.5, func);
  };

  often = (func: Function): Event => {
    return this.odds(0.75, func);
  };

  frequently = (func: Function): Event => {
    return this.odds(0.9, func);
  };

  almostAlways = (func: Function): Event => {
    return this.odds(0.985, func);
  };

  modify = (func: Function): Event => {
    return func(this);
  };

  seed = (value: string | number): Event => {
    this.seedValue = value.toString();
    this.randomGen = this.app.api.localSeededRandom(this.seedValue);
    return this;
  };

  clear = (): Event => {
    this.app.api.clearLocalSeed(this.seedValue);
    return this;
  };

  apply = (func: Function): Event => {
    return this.modify(func);
  };

  duration = (value: number): Event => {
    this.values["duration"] = value;
    return this;
  };
}

export abstract class AudibleEvent extends Event {
  constructor(app: Editor) {
    super(app);
  }

  octave = (value: number): this => {
    this.values["octave"] = value;
    this.update();
    return this;
  };

  key = (value: string): this => {
    this.values["key"] = value;
    this.update();
    return this;
  };

  scale = (value: string): this => {
    if (!isScale(value)) {
      this.values.parsedScale = parseScala(value) as number[];
    } else {
      this.values.scaleName = value;
      this.values.parsedScale = getScale(value) as number[];
    }
    this.update();
    return this;
  };

  freq = (value: number): this => {
    this.values["freq"] = value;
    const midiNote = freqToMidi(value);
    if (midiNote % 1 !== 0) {
      this.values["note"] = Math.floor(midiNote);
      this.values["bend"] = resolvePitchBend(midiNote)[1];
    } else {
      this.values["note"] = midiNote;
    }
    return this;
  };

  update = (): void => {
    // Overwrite in subclasses
  };
}
