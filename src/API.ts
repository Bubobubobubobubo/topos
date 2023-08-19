import { Pitch, Chord, Rest, Event, cachedPattern } from "zifferjs";
import { MidiConnection } from "./IO/MidiConnection";
import { tryEvaluate } from "./Evaluator";
import { DrunkWalk } from "./Utils/Drunk";
import { LRUCache } from "lru-cache";
import { scale } from "./Scales";
import { Editor } from "./main";
import { Sound } from "./Sound";
import {
  samples,
  initAudioOnFirstClick,
  registerSynthSounds,
  // @ts-ignore
} from "superdough";

// This is an LRU cache used for storing persistent patterns
const cache = new LRUCache({ max: 1000, ttl: 1000 * 60 * 5 });

interface ControlChange {
  channel: number;
  control: number;
  value: number;
}

interface Pattern<T> {
  pattern: any[];
  options: {
    [key: string]: T;
  };
}

/**
 * This is an override of the basic "includes" method.
 */
declare global {
  interface Array<T> {
    in(value: T): boolean;
  }
}
Array.prototype.in = function <T>(this: T[], value: T): boolean {
  return this.includes(value);
};

async function loadSamples() {
  const ds = "https://raw.githubusercontent.com/felixroos/dough-samples/main/";
  return Promise.all([
    initAudioOnFirstClick(),
    samples("github:Bubobubobubobubo/Topos-Samples/main"),
    samples(`${ds}/tidal-drum-machines.json`),
    samples(`${ds}/piano.json`),
    samples(`${ds}/Dirt-Samples.json`),
    samples(`${ds}/EmuSP12.json`),
    samples(`${ds}/vcsl.json`),
    registerSynthSounds(),
  ]);
}

loadSamples();

export class UserAPI {
  /**
   * The UserAPI class is the interface between the user's code and the backend. It provides
   * access to the AudioContext, to the MIDI Interface, to internal variables, mouse position,
   * useful functions, etc... This is the class that is exposed to the user's action and any
   * function destined to the user should be placed here.
   */

  private variables: { [key: string]: any } = {};
  private iterators: { [key: string]: any } = {};
  private _drunk: DrunkWalk = new DrunkWalk(-100, 100, false);

  MidiConnection: MidiConnection = new MidiConnection();
  load: samples;

  constructor(public app: Editor) {
    this.load = samples("github:tidalcycles/Dirt-Samples/master");
  }

  // =============================================================
  // Time functions
  // =============================================================

  public time = (): number => {
    /**
     * @returns the current AudioContext time (wall clock)
     */
    return this.app.audioContext.currentTime;
  };

  // =============================================================
  // Mouse functions
  // =============================================================

  public mouseX = (): number => {
    /**
     * @returns The current x position of the mouse
     */
    return this.app._mouseX;
  };

  public mouseY = (): number => {
    /**
     * @returns The current y position of the mouse
     */
    return this.app._mouseY;
  };

  // =============================================================
  // Utility functions
  // =============================================================

  script = (...args: number[]): void => {
    /**
     * Evaluates 1-n local script(s)
     *
     * @param args - The scripts to evaluate
     * @returns The result of the evaluation
     */
    args.forEach((arg) => {
      tryEvaluate(
        this.app,
        this.app.universes[this.app.selected_universe].locals[arg]
      );
    });
  };
  s = this.script;

  clear_script = (script: number): void => {
    /**
     * Clears a local script
     *
     * @param script - The script to clear
     */
    this.app.universes[this.app.selected_universe].locals[script] = {
      candidate: "",
      committed: "",
      evaluations: 0,
    };
  };
  cs = this.clear_script;

  copy_script = (from: number, to: number): void => {
    /**
     * Copy from a local script to another local script
     *
     * @param from - The script to copy from
     * @param to - The script to copy to
     */
    this.app.universes[this.app.selected_universe].locals[to] =
      this.app.universes[this.app.selected_universe].locals[from];
  };
  cps = this.copy_script;

  // =============================================================
  // MIDI related functions
  // =============================================================

  public midi_outputs = (): Array<MIDIOutput> => {
    /**
     * Prints a list of available MIDI outputs in the console.
     *
     * @returns A list of available MIDI outputs
     */
    console.log(this.MidiConnection.listMidiOutputs());
    return this.MidiConnection.midiOutputs;
  };

  public midi_output = (outputName: string): void => {
    /**
     * Switches the MIDI output to the specified output.
     *
     * @param outputName - The name of the MIDI output to switch to
     */
    if (!outputName) {
      console.log(this.MidiConnection.getCurrentMidiPort());
    } else {
      this.MidiConnection.switchMidiOutput(outputName);
    }
  };

  public note = (
    note: number,
    options: { [key: string]: number } = {}
  ): void => {
    /**
     * Sends a MIDI note to the current MIDI output.
     *
     * @param note - the MIDI note number to send
     * @param options - an object containing options for that note
     *                { channel: 0, velocity: 100, duration: 0.5 }
     */
    const channel = options.channel ? options.channel : 0;
    const velocity = options.velocity ? options.velocity : 100;
    const duration = options.duration ? options.duration : 0.5;
    this.MidiConnection.sendMidiNote(note, channel, velocity, duration);
  };

  public sysex = (data: Array<number>): void => {
    /**
     * Sends a MIDI sysex message to the current MIDI output.
     *
     * @param data - The sysex data to send
     */
    this.MidiConnection.sendSysExMessage(data);
  };

  public pitch_bend = (value: number, channel: number): void => {
    /**
     * Sends a MIDI pitch bend to the current MIDI output.
     *
     * @param value - The value of the pitch bend
     * @param channel - The MIDI channel to send the pitch bend on
     *
     * @returns The value of the pitch bend
     */
    this.MidiConnection.sendPitchBend(value, channel);
  };

  public program_change = (program: number, channel: number): void => {
    /**
     * Sends a MIDI program change to the current MIDI output.
     *
     * @param program - The MIDI program to send
     * @param channel - The MIDI channel to send the program change on
     */
    this.MidiConnection.sendProgramChange(program, channel);
  };

  public midi_clock = (): void => {
    /**
     * Sends a MIDI clock to the current MIDI output.
     */
    this.MidiConnection.sendMidiClock();
  };

  public control_change = ({
    control = 20,
    value = 0,
    channel = 0,
  }: ControlChange): void => {
    /**
     * Sends a MIDI control change to the current MIDI output.
     *
     * @param control - The MIDI control to send
     * @param value - The value of the control
     */
    this.MidiConnection.sendMidiControlChange(control, value, channel);
  };

  public midi_panic = (): void => {
    /**
     * Sends a MIDI panic message to the current MIDI output.
     */
    this.MidiConnection.panic();
  };

  // =============================================================
  // Ziffers related functions
  // =============================================================

  public zn = (
    input: string,
    options: { [key: string]: string | number } = {}
  ): Event => {
    const pattern = cachedPattern(input, options);
    //@ts-ignore
    if (pattern.hasStarted()) {
      const event = pattern.peek();

      // Check if event is modified
      const node = event!.modifiedEvent ? event!.modifiedEvent : event;
      const channel = (options.channel ? options.channel : 0) as number;
      const velocity = (options.velocity ? options.velocity : 100) as number;
      const sustain = (options.sustain ? options.sustain : 0.5) as number;

      if (node instanceof Pitch) {
        if (node.bend) this.MidiConnection.sendPitchBend(node.bend, channel);
        this.MidiConnection.sendMidiNote(
          node.note!,
          channel,
          velocity,
          sustain
        );
        if (node.bend) this.MidiConnection.sendPitchBend(8192, channel);
      } else if (node instanceof Chord) {
        node.pitches.forEach((pitch: Pitch) => {
          if (pitch.bend)
            this.MidiConnection.sendPitchBend(pitch.bend, channel);
          this.MidiConnection.sendMidiNote(
            pitch.note!,
            channel,
            velocity,
            sustain
          );
          if (pitch.bend) this.MidiConnection.sendPitchBend(8192, channel);
        });
      } else if (node instanceof Rest) {
        // do nothing for now ...
      }

      // Remove old modified event
      if (event!.modifiedEvent) event!.modifiedEvent = undefined;
    }
    //@ts-ignore
    return pattern.next();
  };

  // =============================================================
  // Iterator related functions
  // =============================================================

  public iterator = (name: string, limit?: number, step?: number): number => {
    /**
     * Returns the current value of an iterator, and increments it by the step value.
     *
     * @param name - The name of the iterator
     * @param limit - The upper limit of the iterator
     * @param step - The step value of the iterator
     * @returns The current value of the iterator
     */

    if (!(name in this.iterators)) {
      // Create new iterator with default step of 1
      this.iterators[name] = {
        value: 0,
        step: step ?? 1,
        limit,
      };
    } else {
      // Check if limit has changed
      if (this.iterators[name].limit !== limit) {
        // Reset value to 0 and update limit
        this.iterators[name].value = 0;
        this.iterators[name].limit = limit;
      }

      // Check if step has changed
      if (this.iterators[name].step !== step) {
        // Update step
        this.iterators[name].step = step ?? this.iterators[name].step;
      }

      // Increment existing iterator by step value
      this.iterators[name].value += this.iterators[name].step;

      // Check for limit overshoot
      if (
        this.iterators[name].limit !== undefined &&
        this.iterators[name].value > this.iterators[name].limit
      ) {
        this.iterators[name].value = 0;
      }
    }

    // Return current iterator value
    return this.iterators[name].value;
  };
  $ = this.iterator;

  // =============================================================
  // Drunk mechanism
  // =============================================================

  public drunk = (n?: number) => {
    /**
     *
     * This function sets or returns the current drunk
     * mechanism's value.
     *
     * @param n - [optional] The value to set the drunk mechanism to
     * @returns The current value of the drunk mechanism
     */
    if (n !== undefined) {
      this._drunk.position = n;
      return this._drunk.getPosition();
    }
    this._drunk.step();
    return this._drunk.getPosition();
  };

  public drunk_max = (max: number) => {
    /**
     * Sets the maximum value of the drunk mechanism.
     *
     * @param max - The maximum value of the drunk mechanism
     */
    this._drunk.max = max;
  };

  public drunk_min = (min: number) => {
    /**
     * Sets the minimum value of the drunk mechanism.
     *
     * @param min - The minimum value of the drunk mechanism
     */
    this._drunk.min = min;
  };

  public drunk_wrap = (wrap: boolean) => {
    /**
     * Sets whether the drunk mechanism should wrap around
     *
     * @param wrap - Whether the drunk mechanism should wrap around
     */
    this._drunk.toggleWrap(wrap);
  };

  // =============================================================
  // Variable related functions
  // =============================================================

  public variable = (a: number | string, b?: any): any => {
    /**
     * Sets or returns the value of a variable internal to API.
     *
     * @param a - The name of the variable
     * @param b - [optional] The value to set the variable to
     * @returns The value of the variable
     */
    if (typeof a === "string" && b === undefined) {
      return this.variables[a];
    } else {
      this.variables[a] = b;
      return this.variables[a];
    }
  };
  v = this.variable;

  public delete_variable = (name: string): void => {
    /**
     * Deletes a variable internal to API.
     *
     * @param name - The name of the variable to delete
     */
    delete this.variables[name];
  };
  dv = this.delete_variable;

  public clear_variables = (): void => {
    /**
     * Clears all variables internal to API.
     *
     * @remarks
     * This function will delete all variables without warning.
     * Use with caution.
     */
    this.variables = {};
  };
  cv = this.clear_variables;

  // =============================================================
  // Sequencer related functions
  // =============================================================

  private _sequence_key_generator(pattern: any[]) {
    /**
     * Generates a key for the sequence function.
     *
     * @param input - The input to generate a key for
     * @returns A key for the sequence function
     */
    // Make the pattern base64
    return btoa(JSON.stringify(pattern));
  }

  public slice = (chunk: number): boolean => {
    const time_pos = this.epulse();
    const current_chunk = Math.floor(time_pos / chunk);
    return current_chunk % 2 === 0;
  };

  public barslice = (chunk: number): boolean => {
    const time_pos = this.bar() - 1;
    const current_chunk = Math.floor(time_pos / chunk);
    return current_chunk % 2 === 0;
  };

  public seqslice = (...args: any): any => {
    const chunk_size = args[0]; // Get the first argument (chunk size)
    const elements = args.slice(1); // Get the rest of the arguments as an array
    const timepos = this.epulse();
    const slice_count = Math.floor(timepos / chunk_size);
    return elements[slice_count % elements.length];
  };

  public seqmod = (...input: any[]) => {
    if (cache.has(this._sequence_key_generator(input))) {
      let sequence = cache.get(
        this._sequence_key_generator(input)
      ) as Pattern<any>;

      sequence.options.currentIteration++;

      if (sequence.options.currentIteration === sequence.options.nextTarget) {
        sequence.options.index++;
        sequence.options.nextTarget =
          input[sequence.options.index % input.length];
        sequence.options.currentIteration = 0;
      }

      cache.set(this._sequence_key_generator(input), {
        pattern: input as any[],
        options: sequence.options,
      });

      return sequence.options.currentIteration === 0;
    } else {
      let pattern_options = {
        index: -1,
        nextTarget: this.app.clock.ticks_before_new_bar,
        currentIteration: 0,
      };
      if (typeof input[input.length - 1] === "object") {
        pattern_options = {
          ...input.pop(),
          ...(pattern_options as object),
        };
      }

      // pattern_options.currentIteration++;
      // TEST
      pattern_options.nextTarget = this.app.clock.ticks_before_new_bar;

      if (pattern_options.currentIteration === pattern_options.nextTarget) {
        pattern_options.index++;
        pattern_options.nextTarget =
          input[pattern_options.index % input.length];
        pattern_options.currentIteration = 0;
      }

      cache.set(this._sequence_key_generator(input), {
        pattern: input as any[],
        options: pattern_options,
      });

      return pattern_options.currentIteration === 0;
    }
  };

  public seq = (...input: any[]) => {
    /**
     * Returns a value in a sequence stored using an LRU Cache.
     * The sequence is stored in the cache with an hash identifier
     * made from a base64 encoding of the pattern. The pattern itself
     * is composed of the pattern itself (a list of arbitrary typed
     * values) and a set of options (an object) detailing how the pattern
     * should be iterated on.
     *
     * @param input - The input to generate a key for
     *        Note that the last element of the input can be an object
     *       containing options for the sequence function.
     * @returns A value in a sequence stored using an LRU Cache
     */
    if (cache.has(this._sequence_key_generator(input))) {
      let sequence = cache.get(
        this._sequence_key_generator(input)
      ) as Pattern<any>;
      sequence.options.index += 1;
      cache.set(this._sequence_key_generator(input), sequence);
      return sequence.pattern[sequence.options.index % sequence.pattern.length];
    } else {
      let pattern_options = { index: 0 };
      if (typeof input[input.length - 1] === "object") {
        pattern_options = { ...input.pop(), ...(pattern_options as object) };
      }
      cache.set(this._sequence_key_generator(input), {
        pattern: input as any[],
        options: pattern_options,
      });
      return cache.get(this._sequence_key_generator(input));
    }
  };

  pick = <T>(...array: T[]): T => {
    /**
     * Returns a random element from an array.
     *
     * @param array - The array of values to pick from
     */
    return array[Math.floor(Math.random() * array.length)];
  };

  seqbeat = <T>(...array: T[]): T => {
    /**
     * Returns an element from an array based on the current beat.
     *
     * @param array - The array of values to pick from
     */
    return array[this.ebeat() % array.length];
  };

  mel = <T>(iterator: number, array: T[]): T => {
    /**
     * Returns an element from an array based on the current value of an iterator.
     *
     * @param iterator - The name of the iterator
     * @param array - The array of values to pick from
     */
    return array[iterator % array.length];
  };

  seqbar = <T>(...array: T[]): T => {
    /**
     * Returns an element from an array based on the current bar.
     *
     * @param array - The array of values to pick from
     */
    return array[(this.app.clock.time_position.bar + 1) % array.length];
  };

  seqpulse = <T>(...array: T[]): T => {
    /**
     * Returns an element from an array based on the current pulse.
     *
     * @param array - The array of values to pick from
     */
    return array[this.app.clock.time_position.pulse % array.length];
  };

  // =============================================================
  // Randomness functions
  // =============================================================

  randI = (min: number, max: number): number => {
    /**
     * Returns a random integer between min and max.
     *
     * @param min - The minimum value of the random number
     * @param max - The maximum value of the random number
     * @returns A random integer between min and max
     */
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  rand = (min: number, max: number): number => {
    /**
     * Returns a random float between min and max.
     *
     * @param min - The minimum value of the random number
     * @param max - The maximum value of the random number
     * @returns A random float between min and max
     */
    return Math.random() * (max - min) + min;
  };
  rI = this.randI;
  r = this.rand;

  // =============================================================
  // Quantification functions
  // =============================================================

  public quantize = (value: number, quantization: number[]): number => {
    /**
     * Returns the closest value in an array to a given value.
     *
     * @param value - The value to quantize
     * @param quantization - The array of values to quantize to
     * @returns The closest value in the array to the given value
     */
    if (quantization.length === 0) {
      return value;
    }
    let closest = quantization[0];
    quantization.forEach((q) => {
      if (Math.abs(q - value) < Math.abs(closest - value)) {
        closest = q;
      }
    });
    return closest;
  };
  quant = this.quantize;

  public clamp = (value: number, min: number, max: number): number => {
    /**
     * Returns a value clamped between min and max.
     *
     * @param value - The value to clamp
     * @param min - The minimum value of the clamped value
     * @param max - The maximum value of the clamped value
     * @returns A value clamped between min and max
     */
    return Math.min(Math.max(value, min), max);
  };
  cmp = this.clamp;

  // =============================================================
  // Transport functions
  // =============================================================

  public bpm = (n?: number): number => {
    /**
     * Sets or returns the current bpm.
     *
     * @param bpm - [optional] The bpm to set
     * @returns The current bpm
     */
    if (n === undefined) return this.app.clock.bpm;

    if (n < 1 || n > 500) console.log(`Setting bpm to ${n}`);
    this.app.clock.bpm = n;
    return n;
  };
  tempo = this.bpm;

  public bpb = (n?: number): number => {
    /**
     * Sets or returns the number of beats per bar.
     *
     * @param bpb - [optional] The number of beats per bar to set
     * @returns The current bpb
     */
    if (n === undefined) return this.app.clock.time_signature[0];

    if (n < 1) console.log(`Setting bpb to ${n}`);
    this.app.clock.time_signature[0] = n;
    return n;
  };

  public ppqn = (n?: number) => {
    /**
     * Sets or returns the number of pulses per quarter note.
     */
    if (n === undefined) return this.app.clock.ppqn;

    if (n < 1) console.log(`Setting ppqn to ${n}`);
    this.app.clock.ppqn = n;
    return n;
  };

  public time_signature = (numerator: number, denominator: number): void => {
    /**
     * Sets the time signature.
     *
     * @param numerator - The numerator of the time signature
     * @param denominator - The denominator of the time signature
     * @returns The current time signature
     */
    this.app.clock.time_signature = [numerator, denominator];
  };

  // =============================================================
  // Probability functions
  // =============================================================

  public almostNever = (): boolean => {
    /**
     * Returns true 10% of the time.
     *
     * @returns True 10% of the time
     */
    return Math.random() > 0.9;
  };

  public sometimes = (): boolean => {
    /**
     * Returns true 50% of the time.
     *
     * @returns True 50% of the time
     */
    return Math.random() > 0.5;
  };

  public rarely = (): boolean => {
    /**
     * Returns true 25% of the time.
     *
     * @returns True 25% of the time
     */
    return Math.random() > 0.75;
  };

  public often = (): boolean => {
    /**
     * Returns true 75% of the time.
     *
     * @returns True 75% of the time
     */
    return Math.random() > 0.25;
  };

  public almostAlways = (): boolean => {
    /**
     * Returns true 90% of the time.
     *
     * @returns True 90% of the time
     */
    return Math.random() > 0.1;
  };

  public dice = (sides: number): number => {
    /**
     * Returns the value of a dice roll with n sides.
     *
     * @param sides - The number of sides on the dice
     * @returns The value of a dice roll with n sides
     */
    return Math.floor(Math.random() * sides) + 1;
  };

  // =============================================================
  // Iterator functions (for loops, with evaluation count, etc...)
  // =============================================================

  i = (n?: number) => {
    /**
     * Returns the current iteration of global file.
     *
     * @returns The current iteration of global file
     */
    if (n !== undefined) {
      this.app.universes[this.app.selected_universe].global.evaluations = n;
      return this.app.universes[this.app.selected_universe];
    }
    return this.app.universes[this.app.selected_universe].global
      .evaluations as number;
  };

  // =============================================================
  // Time markers
  // =============================================================

  bar = (): number => {
    /**
     * Returns the current bar number
     *
     * @returns The current bar number
     */
    return this.app.clock.time_position.bar;
  };

  tick = (): number => {
    /**
     * Returns the current tick number
     *
     * @returns The current tick number
     */
    return this.app.clock.tick;
  };

  pulse = (): number => {
    /**
     * Returns the current pulse number
     *
     * @returns The current pulse number
     */
    return this.app.clock.time_position.pulse;
  };

  beat = (): number => {
    /**
     * Returns the current beat number
     *
     * @returns The current beat number
     */
    return this.app.clock.time_position.beat;
  };

  ebeat = (): number => {
    /**
     * Returns the current beat number since the origin of time
     */
    return this.app.clock.beats_since_origin;
  };

  epulse = (): number => {
    /**
     * Returns the current number of pulses elapsed since origin of time
     */
    return this.app.clock.pulses_since_origin;
  };

  onbar = (n: number, ...bar: number[]): boolean => {
    // n is acting as a modulo on the bar number
    const bar_list = [...Array(n).keys()].map((i) => i + 1);
    console.log(bar.some((b) => bar_list.includes(b % n)));
    return bar.some((b) => bar_list.includes(b % n));
  };

  onbeat = (...beat: number[]): boolean => {
    /**
     * Returns true if the current beat is in the given list of beats.
     *
     * @remarks
     * This function can also operate with decimal beats!
     *
     * @param beat - The beats to check
     * @returns True if the current beat is in the given list of beats
     */
    let final_pulses: boolean[] = [];
    beat.forEach((b) => {
      b = (b % this.app.clock.time_signature[0]) + 1;
      let integral_part = Math.floor(b);
      let decimal_part = b - integral_part;
      final_pulses.push(
        integral_part === this.app.clock.time_position.beat &&
          this.app.clock.time_position.pulse ===
            decimal_part * this.app.clock.ppqn
      );
    });
    return final_pulses.some((p) => p == true);
  };

  stop = (): void => {
    /**
     * Stops the clock.
     *
     * @see silence
     * @see hush
     */
    this.app.clock.pause();
    this.app.setButtonHighlighting("pause", true);
  };
  silence = this.stop;
  hush = this.stop;

  prob = (p: number): boolean => {
    /**
     * Returns true p% of the time.
     *
     * @param p - The probability of returning true
     * @returns True p% of the time
     */
    return Math.random() * 100 < p;
  };

  toss = (): boolean => {
    /**
     * Returns true 50% of the time.
     *
     * @returns True 50% of the time
     * @see sometimes
     * @see rarely
     * @see often
     * @see almostAlways
     * @see almostNever
     */
    return Math.random() > 0.5;
  };

  min = (...values: number[]): number => {
    /**
     * Returns the minimum value of a list of numbers.
     *
     * @param values - The list of numbers
     * @returns The minimum value of the list of numbers
     */
    return Math.min(...values);
  };

  max = (...values: number[]): number => {
    /**
     * Returns the maximum value of a list of numbers.
     *
     * @param values - The list of numbers
     * @returns The maximum value of the list of numbers
     */
    return Math.max(...values);
  };

  limit = (value: number, min: number, max: number): number => {
    /**
     * Limits a value between a minimum and a maximum.
     *
     * @param value - The value to limit
     * @param min - The minimum value
     * @param max - The maximum value
     * @returns The limited value
     */
    return Math.min(Math.max(value, min), max);
  };

  delay = (ms: number, func: Function): void => {
    /**
     * Delays the execution of a function by a given number of milliseconds.
     *
     * @param ms - The number of milliseconds to delay the function by
     * @param func - The function to execute
     * @returns The current time signature
     */
    setTimeout(func, ms);
  };

  delayr = (ms: number, nb: number, func: Function): void => {
    /**
     * Delays the execution of a function by a given number of milliseconds, repeated a given number of times.
     *
     * @param ms - The number of milliseconds to delay the function by
     * @param nb - The number of times to repeat the delay
     * @param func - The function to execute
     * @returns The current time signature
     */
    const list = [...Array(nb).keys()].map((i) => ms * i);
    list.forEach((ms, _) => {
      setTimeout(func, ms);
    });
  };

  public mod = (...n: number[]): boolean => {
    const results: boolean[] = n.map((value) => this.epulse() % value === 0);
    return results.some((value) => value === true);
  };

  public modbar = (...n: number[]): boolean => {
    const results: boolean[] = n.map((value) => this.bar() % value === 0);
    return results.some((value) => value === true);
  };

  // mod = (...pulse: number[]): boolean => {
  //   /**
  //    * Returns true if the current pulse is a modulo of any of the given pulses.
  //    *
  //    * @param pulse - The pulse to check for
  //    * @returns True if the current pulse is a modulo of any of the given pulses
  //    */
  //   return pulse.some((p) => this.app.clock.time_position.pulse % p === 0);
  // };

  // =============================================================
  // Rythmic generators
  // =============================================================

  euclid = (
    iterator: number,
    pulses: number,
    length: number,
    rotate: number = 0
  ): boolean => {
    /**
     * Returns a euclidean cycle of size length, with n pulses, rotated or not.
     *
     * @param iterator - Iteration number in the euclidian cycle
     * @param pulses - The number of pulses in the cycle
     * @param length - The length of the cycle
     * @param rotate - Rotation of the euclidian sequence
     * @returns boolean value based on the euclidian sequence
     */
    return this._euclidean_cycle(pulses, length, rotate)[iterator % length];
  };

  _euclidean_cycle(
    pulses: number,
    length: number,
    rotate: number = 0
  ): boolean[] {
    if (pulses == length) return Array.from({ length }, () => true);
    function startsDescent(list: number[], i: number): boolean {
      const length = list.length;
      const nextIndex = (i + 1) % length;
      return list[i] > list[nextIndex] ? true : false;
    }
    if (pulses >= length) return [true];
    const resList = Array.from(
      { length },
      (_, i) => (((pulses * (i - 1)) % length) + length) % length
    );
    let cycle = resList.map((_, i) => startsDescent(resList, i));
    if (rotate != 0) {
      cycle = cycle.slice(rotate).concat(cycle.slice(0, rotate));
    }
    return cycle;
  }

  bin = (iterator: number, n: number): boolean => {
    /**
     * Returns a binary cycle of size n.
     *
     * @param iterator - Iteration number in the binary cycle
     * @param n - The number to convert to binary
     * @returns boolean value based on the binary sequence
     */
    let convert: string = n.toString(2);
    let tobin: boolean[] = convert.split("").map((x: string) => x === "1");
    return tobin[iterator % tobin.length];
  };

  // =============================================================
  // Low Frequency Oscillators
  // =============================================================

  line = (start: number, end: number, step: number = 1): number[] => {
    /**
     * Returns an array of values between start and end, with a given step.
     *
     * @param start - The start value of the array
     * @param end - The end value of the array
     * @param step - The step value of the array
     * @returns An array of values between start and end, with a given step
     */
    const result: number[] = [];

    if ((end > start && step > 0) || (end < start && step < 0)) {
      for (let value = start; value <= end; value += step) {
        result.push(value);
      }
    } else {
      console.error("Invalid range or step provided.");
    }

    return result;
  };

  sine = (freq: number = 1, offset: number = 0): number => {
    /**
     * Returns a sine wave between -1 and 1.
     *
     * @param freq - The frequency of the sine wave
     * @param offset - The offset of the sine wave
     * @returns A sine wave between -1 and 1
     */
    return (
      Math.sin(this.app.clock.ctx.currentTime * Math.PI * 2 * freq) + offset
    );
  };

  usine = (freq: number = 1, offset: number = 0): number => {
    /**
     * Returns a sine wave between 0 and 1.
     *
     * @param freq - The frequency of the sine wave
     * @param offset - The offset of the sine wave
     * @returns A sine wave between 0 and 1
     * @see sine
     */
    return (this.sine(freq, offset) + 1) / 2;
  };

  saw = (freq: number = 1, offset: number = 0): number => {
    /**
     * Returns a saw wave between -1 and 1.
     *
     * @param freq - The frequency of the saw wave
     * @param offset - The offset of the saw wave
     * @returns A saw wave between -1 and 1
     * @see triangle
     * @see square
     * @see sine
     * @see noise
     */
    return ((this.app.clock.ctx.currentTime * freq) % 1) * 2 - 1 + offset;
  };

  usaw = (freq: number = 1, offset: number = 0): number => {
    /**
     * Returns a saw wave between 0 and 1.
     *
     * @param freq - The frequency of the saw wave
     * @param offset - The offset of the saw wave
     * @returns A saw wave between 0 and 1
     * @see saw
     */
    return (this.saw(freq, offset) + 1) / 2;
  };

  triangle = (freq: number = 1, offset: number = 0): number => {
    /**
     * Returns a triangle wave between -1 and 1.
     *
     * @returns A triangle wave between -1 and 1
     * @see saw
     * @see square
     * @see sine
     * @see noise
     */
    return Math.abs(this.saw(freq, offset)) * 2 - 1;
  };

  utriangle = (freq: number = 1, offset: number = 0): number => {
    /**
     * Returns a triangle wave between 0 and 1.
     *
     * @param freq - The frequency of the triangle wave
     * @param offset - The offset of the triangle wave
     * @returns A triangle wave between 0 and 1
     * @see triangle
     */
    return (this.triangle(freq, offset) + 1) / 2;
  };

  square = (freq: number = 1, offset: number = 0): number => {
    /**
     * Returns a square wave between -1 and 1.
     *
     * @returns A square wave between -1 and 1
     * @see saw
     * @see triangle
     * @see sine
     * @see noise
     */
    return this.saw(freq, offset) > 0 ? 1 : -1;
  };

  usquare = (freq: number = 1, offset: number = 0): number => {
    /**
     * Returns a square wave between 0 and 1.
     *
     * @param freq - The frequency of the square wave
     * @param offset - The offset of the square wave
     * @returns A square wave between 0 and 1
     * @see square
     */
    return (this.square(freq, offset) + 1) / 2;
  };

  noise = (): number => {
    /**
     * Returns a random value between -1 and 1.
     *
     * @returns A random value between -1 and 1
     * @see saw
     * @see triangle
     * @see square
     * @see sine
     * @see noise
     */
    return Math.random() * 2 - 1;
  };

  // =============================================================
  // Math functions
  // =============================================================

  abs = Math.abs;

  // =============================================================
  // Trivial functions
  // =============================================================

  sound = (sound: string) => {
    return new Sound(sound, this.app);
  };

  samples = samples;

  log = console.log;

  scale = scale;

  rate = (rate: number): void => {
    rate = rate;
    // TODO: Implement this. This function should change the rate at which the global script
    // is evaluated. This is useful for slowing down the script, or speeding it up. The default
    // would be 1.0, which is the current rate (very speedy).
  };
}
