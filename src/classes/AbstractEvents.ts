import { type Editor } from "../main";
import {
  freqToMidi,
  resolvePitchBend,
  getScale,
  isScale,
  parseScala,
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

  private modify = (func: Function): Event => {
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

  length = (value: number): Event => {
    this.values["length"] = value;
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
