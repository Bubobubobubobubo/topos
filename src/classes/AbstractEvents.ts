import { type Editor } from "../main";
import {
  freqToMidi,
  chord as parseChord,
  noteNameToMidi,
  resolvePitchBend,
  safeScale,
} from "zifferjs";
import { SkipEvent } from "./SkipEvent";
import { SoundParams } from "./SoundEvent";
import { centsToSemitones, edoToSemitones, ratiosToSemitones } from "zifferjs/src/scale";

export type EventOperation<T> = (instance: T, ...args: any[]) => void;

export interface AbstractEvent {
  [key: string]: any;
}

export class AbstractEvent {
  /**
   * The Event class is the base class for all events. It provides a set of
   * functions that can be used to transform an Event. The functions are used
   * to create a chain of transformations that are applied to the Event.
   */

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

  evenbar = (func: Function) => {
    /**
     * Returns a transformed Event if the current bar is even.
     *
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    if (this.app.clock.time_position.bar % 2 === 0) {
      return this.modify(func);
    } else {
      return this;
    }
  };

  even = (func: Function) => {
    /**
     * Returns a transformed Event if the current beat is even.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     *
     */
    if (this.app.clock.time_position.beat % 2 === 0) {
      return this.modify(func);
    } else {
      return this;
    }
  };

  odd = (func: Function) => {
    /**
     * Returns a transformed Event if the current beat is odd.
     *
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    if (this.app.clock.time_position.beat % 2 !== 0) {
      return this.modify(func);
    } else {
      return this;
    }
  };

  odds = (probability: number, func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a given probability.
     *
     * @param probability - The probability of the Event being transformed
     * @param func - The function to be applied to the Event
     */
    if (this.randomGen() < probability) {
      return this.modify(func);
    }
    return this;
  };

  // @ts-ignore
  never = (func: Function): AbstractEvent => {
    /**
     * Never return a transformed Event.
     *
     * @param func - The function to be applied to the Event
     * @remarks This function is here for user convenience.
     */
    return this;
  };

  almostNever = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a probability of 0.025.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.025, func);
  };

  rarely = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a probability of 0.1.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.1, func);
  };

  scarcely = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a probability of 0.25.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.25, func);
  };

  sometimes = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a probability of 0.5.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.5, func);
  };

  often = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a probability of 0.75.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.75, func);
  };

  frequently = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a probability of 0.9.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.9, func);
  };

  almostAlways = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a probability of 0.985.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.985, func);
  };

  always = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event with a probability of 1.
     * @param func - The function to be applied to the Event
     * @remarks This function is here for user convenience.
     */
    return this.modify(func);
  };

  modify = (func: Function): AbstractEvent => {
    /**
     * Returns a transformed Event. This function is used internally by the
     * other functions of this class. It is just a wrapper for the function
     * application.
     */
    return func(this);
  };

  seed = (value: string | number): AbstractEvent => {
    /**
     * This function is used to set the seed of the random number generator.
     * @param value - The seed value
     * @returns The Event
     */
    this.seedValue = value.toString();
    this.randomGen = this.app.api.localSeededRandom(this.seedValue);
    return this;
  };

  clear = (): AbstractEvent => {
    /**
     * This function is used to clear the seed of the random number generator.
     * @returns The Event
     */
    this.app.api.clearLocalSeed(this.seedValue);
    return this;
  };

  apply = (func: Function): AbstractEvent => {
    /**
     * This function is used to apply a function to the Event.
     * Simple function applicator
     *
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.modify(func);
  };

  noteLength = (
    value: number | number[],
    ...kwargs: number[]
  ): AbstractEvent => {
    /**
     * This function is used to set the note length of the Event.
     */
    if (kwargs.length > 0) {
      value = Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs];
    }
    if (Array.isArray(value)) {
      this.values.dur = value.map((v) =>
        this.app.clock.convertPulseToSecond(v * 4 * this.app.clock.ppqn),
      );
    } else {
      this.values.dur = this.app.clock.convertPulseToSecond(
        value * 4 * this.app.clock.ppqn,
      );
    }
    if(this.current) {
      value = Array.isArray(value) ? value[this.index%value.length] : value;
      this.current.duration = value;
    }
    return this;
  };

  protected processSound = (
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
}

export abstract class AudibleEvent extends AbstractEvent {
  constructor(app: Editor) {
    super(app);
  }

  pitch = (value: number | number[], ...kwargs: number[]): this => {
    /*
     * This function is used to set the pitch of the Event.
     * @param value - The pitch value
     * @returns The Event
     */
    if (kwargs.length > 0) {
      value = Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs];
    }
    this.values["pitch"] = value;
    this.values["originalPitch"] = value;
    this.defaultPitchKeyScale();
    this.update();
    return this;
  };

  pc = this.pitch;

  octave = (value: number | number[], ...kwargs: number[]): this => {
    /*
     * This function is used to set the octave of the Event.
     * @param value - The octave value
     * @returns The Event
     */
    if (kwargs.length > 0) {
      value = Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs];
    }
    this.values["paramOctave"] = value;
    if (
      this.values.key &&
      (this.values.pitch || this.values.pitch === 0) &&
      this.values.parsedScale
    )
      this.update();
    return this;
  };

  key = (value: string | string[], ...kwargs: string[]): this => {
    /*
     * This function is used to set the key of the Event.
     * @param value - The key value
     * @returns The Event
     */
    if (kwargs.length > 0) {
      value = Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs];
    }
    this.values["key"] = value;
    if (
      (this.values.pitch || this.values.pitch === 0) &&
      this.values.parsedScale
    )
      this.update();
    return this;
  };

  defaultPitchKeyScale() {
    if (!this.values.key) this.values.key = 60;
    if (!(this.values.pitch || this.values.pitch === 0)) this.values.pitch = 0;
    if (!this.values.parsedScale) this.values.parsedScale = safeScale("major");
  }

  scale = (
    value: string | number | (number | string)[],
    ...kwargs: (string | number)[]
  ): this => {
    /*
     * This function is used to set the scale of the Event.
     * @param value - The scale value
     * @returns The Event
     */
    if (kwargs.length > 0) {
      value = Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs];
    }
    if (typeof value === "string" || typeof value === "number") {
      this.values.parsedScale = safeScale(value) as number[];
    } else if (Array.isArray(value)) {
      this.values.parsedScale = value.map((v) => safeScale(v));
    }
    this.defaultPitchKeyScale();
    this.update();
    return this;
  };

  semitones(values: number|number[], ...rest: number[]) {
    const scaleValues = typeof values === "number" ? [values, ...rest] : values;
    this.values.parsedScale = safeScale(scaleValues);
    this.defaultPitchKeyScale();
    this.update();
    return this;
  }
  steps = this.semitones;

  cents(values: number|number[], ...rest: number[]) {
    const scaleValues = typeof values === "number" ? [values, ...rest] : values;
    this.values.parsedScale = safeScale(centsToSemitones(scaleValues));
    this.defaultPitchKeyScale();
    this.update();
    return this;
  }

  ratios(values: number|number[], ...rest: number[]) {
    const scaleValues = typeof values === "number" ? [values, ...rest] : values;
    this.values.parsedScale = safeScale(ratiosToSemitones(scaleValues));
    this.defaultPitchKeyScale();
    this.update();
    return this;
  }

  edo(value: number, intervals: string|number[] = new Array(value).fill(1)) {
    this.values.parsedScale = edoToSemitones(value, intervals);
    this.defaultPitchKeyScale();
    this.update();
    return this;
  } 

  protected updateValue<T>(key: string, value: T | T[] | null): this {
    if (value == null) return this;
    this.values[key] = value;
    return this;
  }

  public note = (
    value: number | string | null,
    ...kwargs: number[] | string[]
  ) => {
    if (typeof value === "string") {
      const parsedNote = noteNameToMidi(value);
      return this.updateValue("note", [parsedNote, ...kwargs].flat(Infinity));
    } else if (typeof value == null || value == undefined) {
      return new SkipEvent();
    } else {
      return this.updateValue("note", [value, ...kwargs].flat(Infinity));
    }
  };

  public chord = (value: number | string, ...kwargs: number[]) => {
    if (typeof value === "string") {
      const chord = parseChord(value);
      return this.updateValue("note", chord);
    } else {
      const chord = [value, ...kwargs].flat(Infinity);
      return this.updateValue("note", chord);
    }
  };

  public invert = (howMany: number = 0) => {
    if(howMany === 0) return this;
    if (this.values.note) {
      let notes = [...this.values.note];
      notes = howMany < 0 ? [...notes].reverse() : notes;
      for (let i = 0; i < Math.abs(howMany); i++) {
        notes[i % notes.length] += howMany <= 0 ? -12 : 12;
      }
      return this.updateValue("note", notes);
    } else {
      return this;
    }
  };

  public log = (key: string|string[], ...args: string[]) => {
    /*
     * Log values from values using log()
     *
     * @param key - The key(s) to log
     * @returns this and logs the values
     */
    if (typeof key === "string") {
      if(args && args.length > 0) {
        this.app.api.log([key, ...args].map((k) => this.values[k]));
      } else {
         this.app.api.log(this.values[key]);
      }
    } else {
      this.app.api.log([...key, ...args].map((k) => this.values[k]));
    }
    return this;
  }

  public draw = (lambda: Function) => {
    lambda(this.values);
    return this;
  }

  public clear = () => {
    this.app.api.clear();
    return this;
  }

  freq = (value: number | number[], ...kwargs: number[]): this => {
    /*
     * This function is used to set the frequency of the Event.
     * @param value - The frequency value
     * @returns The Event
     */
    if (kwargs.length > 0) {
      value = Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs];
    }
    this.values["freq"] = value;
    if (Array.isArray(value)) {
      this.values["note"] = [];
      this.values["bend"] = [];
      for (const v of value) {
        const midiNote = freqToMidi(v);
        if (midiNote % 1 !== 0) {
          this.values["note"].push(Math.floor(midiNote));
          this.values["bend"].push(resolvePitchBend(midiNote)[1]);
        } else {
          this.values["note"].push(midiNote);
        }
      }
      if (this.values.bend.length === 0) delete this.values.bend;
    } else {
      const midiNote = freqToMidi(value);
      if (midiNote % 1 !== 0) {
        this.values["note"] = Math.floor(midiNote);
        this.values["bend"] = resolvePitchBend(midiNote)[1];
      } else {
        this.values["note"] = midiNote;
      }
    }
    return this;
  };

  update = (): void => {
    // Overwrite in subclasses
  };

  cue = (functionName: string|Function): this => {
    this.app.api.cue(functionName);
    return this;
  }
}
