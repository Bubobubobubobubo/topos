import { type Editor } from "../main";
import {
  freqToMidi,
  resolvePitchBend,
  safeScale
} from "zifferjs";

export abstract class Event {
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

  odds = (probability: number, func: Function): Event => {
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
  never = (func: Function): Event => {
    /**
     * Never return a transformed Event.
     *
     * @param func - The function to be applied to the Event
     * @remarks This function is here for user convenience.
     */
    return this;
  };

  almostNever = (func: Function): Event => {
    /**
     * Returns a transformed Event with a probability of 0.025.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.025, func);
  };

  rarely = (func: Function): Event => {
    /**
     * Returns a transformed Event with a probability of 0.1.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.1, func);
  };

  scarcely = (func: Function): Event => {
    /**
     * Returns a transformed Event with a probability of 0.25.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.25, func);
  };

  sometimes = (func: Function): Event => {
    /**
     * Returns a transformed Event with a probability of 0.5.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.5, func);
  };

  often = (func: Function): Event => {
    /**
     * Returns a transformed Event with a probability of 0.75.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.75, func);
  };

  frequently = (func: Function): Event => {
    /**
     * Returns a transformed Event with a probability of 0.9.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.9, func);
  };

  almostAlways = (func: Function): Event => {
    /**
     * Returns a transformed Event with a probability of 0.985.
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.odds(0.985, func);
  };

  always = (func: Function): Event => {
    /**
     * Returns a transformed Event with a probability of 1.
     * @param func - The function to be applied to the Event
     * @remarks This function is here for user convenience.
     */
    return this.modify(func);
  };

  modify = (func: Function): Event => {
    /**
     * Returns a transformed Event. This function is used internally by the
     * other functions of this class. It is just a wrapper for the function
     * application.
     */
    return func(this);
  };

  seed = (value: string | number): Event => {
    /**
     * This function is used to set the seed of the random number generator.
     * @param value - The seed value
     * @returns The Event
     */
    this.seedValue = value.toString();
    this.randomGen = this.app.api.localSeededRandom(this.seedValue);
    return this;
  };

  clear = (): Event => {
    /**
     * This function is used to clear the seed of the random number generator.
     * @returns The Event
     */
    this.app.api.clearLocalSeed(this.seedValue);
    return this;
  };

  apply = (func: Function): Event => {
    /**
     * This function is used to apply a function to the Event.
     * Simple function applicator
     *
     * @param func - The function to be applied to the Event
     * @returns The transformed Event
     */
    return this.modify(func);
  };

  noteLength = (value: number | number[], ...kwargs: number[]): Event => {
    /**
     * This function is used to set the note length of the Event.
     */
    if(kwargs.length > 0) {
      value = (Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs]);
    }
    if(Array.isArray(value)) {
      this.values["noteLength"] = value;
      this.values.dur = value.map((v) => this.app.clock.convertPulseToSecond(v*4*this.app.clock.ppqn));
    } else {
      this.values["noteLength"] = value;
      this.values.dur = this.app.clock.convertPulseToSecond(value*4*this.app.clock.ppqn);
    }
    return this;
  };
}

export abstract class AudibleEvent extends Event {
  constructor(app: Editor) {
    super(app);
  }

  pitch = (value: number | number[], ...kwargs: number[]): this => {
    /* 
      * This function is used to set the pitch of the Event.
      * @param value - The pitch value
      * @returns The Event
      */
    if(kwargs.length > 0) {
      value = (Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs]);
    }
    this.values["pitch"] = value;
    if(this.values.key && this.values.parsedScale) this.update();
    return this;
  }

  pc = this.pitch;

  octave = (value: number | number[], ...kwargs: number[]): this => {
    /*
      * This function is used to set the octave of the Event.
      * @param value - The octave value
      * @returns The Event
      */
    if(kwargs.length > 0) {
      value = (Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs]);
    }
    this.values["octave"] = value;
    if(this.values.key && (this.values.pitch || this.values.pitch === 0) && this.values.parsedScale) this.update();
    return this;
  };

  key = (value: string | string[], ...kwargs: string[]): this => {
    /* 
      * This function is used to set the key of the Event.
      * @param value - The key value
      * @returns The Event
      */
    if(kwargs.length > 0) {
      value = (Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs]);
    }
    this.values["key"] = value;
    if((this.values.pitch || this.values.pitch === 0) && this.values.parsedScale) this.update();
    return this;
  };

  scale = (value: string | number | (number|string)[], ...kwargs: (string|number)[]): this => {
    /*
      * This function is used to set the scale of the Event.
      * @param value - The scale value
      * @returns The Event
    */
    if(kwargs.length > 0) {
      value = (Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs]);
    }
    if (typeof value === "string" || typeof value === "number") {
      this.values.parsedScale = safeScale(value) as number[];
    } else if(Array.isArray(value)) {
      this.values.parsedScale = value.map((v) => safeScale(v));
    }
    if(this.values.key && (this.values.pitch || this.values.pitch === 0)) {
     this.update();
    }
    return this;
  };

  freq = (value: number | number[], ...kwargs: number[]): this => {
    /*
      * This function is used to set the frequency of the Event.
      * @param value - The frequency value
      * @returns The Event
    */
    if(kwargs.length > 0) {
      value = (Array.isArray(value) ? value.concat(kwargs) : [value, ...kwargs]);
    }
    this.values["freq"] = value;
    if(Array.isArray(value)) {
      this.values["note"] = [];
      this.values["bend"] = [];
      for(const v of value) {
        const midiNote = freqToMidi(v);
        if (midiNote % 1 !== 0) {
          this.values["note"].push(Math.floor(midiNote));
          this.values["bend"].push(resolvePitchBend(midiNote)[1]);
        } else {
          this.values["note"].push(midiNote);
        }
      }
      if(this.values.bend.length === 0) delete this.values.bend;
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
}
