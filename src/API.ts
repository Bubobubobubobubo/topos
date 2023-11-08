import { EditorView } from '@codemirror/view';
import { getAllScaleNotes, seededRandom } from "zifferjs";
import {
  MidiCCEvent,
  MidiConnection,
  MidiNoteEvent,
} from "./IO/MidiConnection";
import { tryEvaluate, evaluateOnce } from "./Evaluator";
import { DrunkWalk } from "./Utils/Drunk";
import { Editor } from "./main";
import { SoundEvent } from "./classes/SoundEvent";
import { MidiEvent, MidiParams } from "./classes/MidiEvent";
import { LRUCache } from "lru-cache";
import { InputOptions, Player } from "./classes/ZPlayer";
import {
  loadUniverse,
  openUniverseModal,
  template_universes,
} from "./FileManagement";
import {
  samples,
  initAudioOnFirstClick,
  registerSynthSounds,
  registerZZFXSounds,
  soundMap,
  // @ts-ignore
} from "superdough";
import { Speaker } from "./StringExtensions";
import { getScaleNotes } from "zifferjs";
import { OscilloscopeConfig, blinkScript } from "./AudioVisualisation";
import { SkipEvent } from './classes/SkipEvent';

interface ControlChange {
  channel: number;
  control: number;
  value: number;
}

export async function loadSamples() {
  return Promise.all([
    initAudioOnFirstClick(),
    samples("github:tidalcycles/Dirt-Samples/master").then(() =>
      registerSynthSounds()
    ),
    registerZZFXSounds(),
    samples("github:Bubobubobubobubo/Dough-Fox/main"),
    samples("github:Bubobubobubobubo/Dough-Samples/main"),
    samples("github:Bubobubobubobubo/Dough-Amiga/main"),
    samples("github:Bubobubobubobubo/Dough-Amen/main"),
    samples("github:Bubobubobubobubo/Dough-Waveforms/main"),
  ]);
}

export class UserAPI {
  /**
   * The UserAPI class is the interface between the user's code and the backend. It provides
   * access to the AudioContext, to the MIDI Interface, to internal variables, mouse position,
   * useful functions, etc... This is the class that is exposed to the user's action and any
   * function destined to the user should be placed here.
   */

  private variables: { [key: string]: any } = {};
  public codeExamples: { [key: string]: string } = {};
  private counters: { [key: string]: any } = {};
  private _drunk: DrunkWalk = new DrunkWalk(-100, 100, false);
  public randomGen = Math.random;
  public currentSeed: string | undefined = undefined;
  public localSeeds = new Map<string, Function>();
  public patternCache = new LRUCache({ max: 1000, ttl: 1000 * 60 * 5 });
  private errorTimeoutID: number = 0;
  private printTimeoutID: number = 0;
  public MidiConnection: MidiConnection;
  public scale_aid: string | number | undefined = undefined;
  load: samples;

  constructor(public app: Editor) {
    this.MidiConnection = new MidiConnection(this, app.settings);
  }

  _loadUniverseFromInterface = (universe: string) => {
    loadUniverse(this.app, universe as string);
    openUniverseModal();
  };

  _deleteUniverseFromInterface = (universe: string) => {
    delete this.app.universes[universe];
    this.app.settings.saveApplicationToLocalStorage(
      this.app.universes,
      this.app.settings
    );
    this.app.updateKnownUniversesView();
  };

  _playDocExample = (code?: string) => {
    /**
     * Play an example from the documentation. The example is going
     * to be stored in the example buffer belonging to the universe.
     * This buffer is going to be cleaned everytime the user press
     * pause or leaves the documentation window.
     *
     * @param code - The code example to play (identifier)
     */
    let current_universe = this.app.universes[this.app.selected_universe];
    this.app.exampleIsPlaying = true;
    if (!current_universe.example) {
      current_universe.example = {
        candidate: "",
        committed: "",
        evaluations: 0,
      };
      current_universe.example.candidate! = code
        ? code
        : (this.app.selectedExample as string);
    } else {
      current_universe.example.candidate! = code
        ? code
        : (this.app.selectedExample as string);
    }
    this.stop();
    this.play();
  };

  _stopDocExample = () => {
    let current_universe = this.app.universes[this.app.selected_universe];
    if (current_universe?.example !== undefined) {
      this.app.exampleIsPlaying = false;
      current_universe.example.candidate! = "";
      current_universe.example.committed! = "";
    }
    this.stop();
  };

  _playDocExampleOnce = (code?: string) => {
    let current_universe = this.app.universes[this.app.selected_universe];
    if (current_universe?.example !== undefined) {
      current_universe.example.candidate! = "";
      current_universe.example.committed! = "";
    }
    this.stop();
    this.play();
    this.app.exampleIsPlaying = true;
    evaluateOnce(this.app, code as string);
  };

  _all_samples = (): object => {
    return soundMap.get();
  };

  _reportError = (error: any): void => {
    const extractLineAndColumn = (error: Error) => {
      const stackLines = error.stack?.split("\n");
      if (stackLines) {
        for (const line of stackLines) {
          if (line.includes('<anonymous>')) {
            const match = line.match(/<anonymous>:(\d+):(\d+)/);
            if (match) return { line: parseInt(match[1], 10), column: parseInt(match[2], 10) };
          }
        }
      }
      return { line: null, column: null };
    };

    const { line, column } = extractLineAndColumn(error);
    const errorMessage = line && column
      ? `${error.message} (Line: ${line - 2}, Column: ${column})`
      : error.message;


    clearTimeout(this.errorTimeoutID);
    clearTimeout(this.printTimeoutID);
    this.app.interface.error_line.innerHTML = errorMessage;
    this.app.interface.error_line.style.color = "color-red-800";
    this.app.interface.error_line.classList.remove("hidden");
    this.errorTimeoutID = setTimeout(
      () => this.app.interface.error_line.classList.add("hidden"),
      2000
    );
  };

  _logMessage = (message: any): void => {
    console.log(message);
    clearTimeout(this.printTimeoutID);
    clearTimeout(this.errorTimeoutID);
    this.app.interface.error_line.innerHTML = message as string;
    this.app.interface.error_line.style.color = "white";
    this.app.interface.error_line.classList.remove("hidden");
    this.printTimeoutID = setTimeout(
      () => this.app.interface.error_line.classList.add("hidden"),
      4000
    );
  };

  // =============================================================
  // Time functions
  // =============================================================

  public time = (): number => {
    /**
     * @returns the current AudioContext time (wall clock)
     */
    return this.app.audioContext.currentTime;
  };

  public play = (): void => {
    this.app.setButtonHighlighting("play", true);
    this.MidiConnection.sendStartMessage();
    this.app.clock.start();
  };

  public pause = (): void => {
    this.app.setButtonHighlighting("pause", true);
    this.app.clock.pause();
  };

  public stop = (): void => {
    this.app.setButtonHighlighting("stop", true);
    this.app.clock.stop();
  };
  silence = this.stop;
  hush = this.stop;

  // =============================================================
  // Time warp functions
  // =============================================================

  public warp = (n: number): void => {
    /**
     * Time-warp the clock by using the tick you wish to jump to.
     */
    this.app.clock.tick = n;
    this.app.clock.time_position = this.app.clock.convertTicksToTimeposition(n);
  };

  public beat_warp = (beat: number): void => {
    /**
     * Time-warp the clock by using the tick you wish to jump to.
     */
    this.app.clock.tick = beat * this.app.clock.ppqn;
    this.app.clock.time_position = this.app.clock.convertTicksToTimeposition(
      beat * this.app.clock.ppqn
    );
  };

  // =============================================================
  // Mouse functions
  // =============================================================

  onmousemove = (e: MouseEvent) => {
    this.app._mouseX = e.pageX;
    this.app._mouseY = e.pageY;
  };

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

  public noteX = (): number => {
    /**
     * @returns The current x position scaled to 0-127 using screen width
     */
    return Math.floor((this.app._mouseX / document.body.clientWidth) * 127);
  };

  public noteY = (): number => {
    /**
     * @returns The current y position scaled to 0-127 using screen height
     */
    return Math.floor((this.app._mouseY / document.body.clientHeight) * 127);
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
      if (arg >= 1 && arg <= 9) {
        blinkScript(this.app, "local", arg);
        tryEvaluate(
          this.app,
          this.app.universes[this.app.selected_universe].locals[arg]
        );
      }
    });
  };
  s = this.script;

  delete_script = (script: number): void => {
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
  cs = this.delete_script;

  copy_script = (from: number, to: number): void => {
    /**
     * Copy from a local script to another local script
     *
     * @param from - The script to copy from
     * @param to - The script to copy to
     */
    this.app.universes[this.app.selected_universe].locals[to] = {
      ...this.app.universes[this.app.selected_universe].locals[from],
    };
  };
  cps = this.copy_script;

  copy_universe = (from: string, to: string): void => {
    this.app.universes[to] = {
      ...this.app.universes[from],
    };
  };

  delete_universe = (universe: string): void => {
    if (this.app.selected_universe === universe) {
      this.app.selected_universe = "Default";
    }
    delete this.app.universes[universe];
    this.app.settings.saveApplicationToLocalStorage(
      this.app.universes,
      this.app.settings
    );
    this.app.updateKnownUniversesView();
  };

  big_bang = (): void => {
    /**
     * Clears all universes
     * TODO: add documentation. This doesn't work super well.
     */
    if (confirm("Are you sure you want to delete all universes?")) {
      this.app.universes = {
        ...template_universes,
      };
      this.app.settings.saveApplicationToLocalStorage(
        this.app.universes,
        this.app.settings
      );
    }
    this.app.selected_universe = "Default";
    this.app.updateKnownUniversesView();
  };

  // =============================================================
  // MIDI related functions
  // =============================================================

  public midi_outputs = (): void => {
    /**
     * Prints a list of available MIDI outputs in the console.
     *
     * @returns A list of available MIDI outputs
     */
    this._logMessage(this.MidiConnection.listMidiOutputs());
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

  public midi = (
    value: number | number[] = 60,
    velocity?: number | number[],
    channel?: number | number[],
    port?: number | string | number[] | string[]
  ): MidiEvent => {
    /**
     * Sends a MIDI note to the current MIDI output.
     *
     * @param note - the MIDI note number to send
     * @param options - an object containing options for that note
     *                { channel: 0, velocity: 100, duration: 0.5 }
     */

    const event = { note: value, velocity, channel, port } as MidiParams

    return new MidiEvent(event, this.app);
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

  public active_note_events = (
    channel?: number
  ): MidiNoteEvent[] | undefined => {
    /**
     * @returns A list of currently active MIDI notes
     */
    let events;
    if (channel) {
      events = this.MidiConnection.activeNotesFromChannel(channel);
    } else {
      events = this.MidiConnection.activeNotes;
    }
    if (events.length > 0) return events;
    else return undefined;
  };

  public transmission(): boolean {
    /**
     * Returns true if there are active notes
     */
    return this.MidiConnection.activeNotes.length > 0;
  }

  public active_notes = (channel?: number): number[] | undefined => {
    /**
     * @returns A list of currently active MIDI notes
     */
    const notes = this.active_note_events(channel);
    if (notes && notes.length > 0) return notes.map((e) => e.note);
    else return undefined;
  };

  public kill_active_notes = (): void => {
    /**
     * Clears all active notes
     */
    this.MidiConnection.activeNotes = [];
  };

  public sticky_notes = (channel?: number): number[] | undefined => {
    /**
     *
     * @param channel
     * @returns
     */
    let notes;
    if (channel) notes = this.MidiConnection.stickyNotesFromChannel(channel);
    else notes = this.MidiConnection.stickyNotes;
    if (notes.length > 0) return notes.map((e) => e.note);
    else return undefined;
  };

  public kill_sticky_notes = (): void => {
    /**
     * Clears all sticky notes
     */
    this.MidiConnection.stickyNotes = [];
  };

  public buffer = (channel?: number): boolean => {
    /**
     * Return true if there is last note event
     */
    if (channel)
      return (
        this.MidiConnection.findNoteFromBufferInChannel(channel) !== undefined
      );
    else return this.MidiConnection.noteInputBuffer.length > 0;
  };

  public buffer_event = (channel?: number): MidiNoteEvent | undefined => {
    /**
     * @returns Returns latest unlistened note event
     */
    if (channel)
      return this.MidiConnection.findNoteFromBufferInChannel(channel);
    else return this.MidiConnection.noteInputBuffer.shift();
  };

  public buffer_note = (channel?: number): number | undefined => {
    /**
     * @returns Returns latest received note
     */
    const note = this.buffer_event(channel);
    return note ? note.note : undefined;
  };

  public last_note_event = (channel?: number): MidiNoteEvent | undefined => {
    /**
     * @returns Returns last received note
     */
    if (channel) return this.MidiConnection.lastNoteInChannel[channel];
    else return this.MidiConnection.lastNote;
  };

  public last_note = (channel?: number): number => {
    /**
     * @returns Returns last received note
     */
    const note = this.last_note_event(channel);
    return note ? note.note : 60;
  };

  public last_cc = (control: number, channel?: number): number => {
    /**
     * @returns Returns last received cc
     */
    if (channel) {
      if (this.MidiConnection.lastCCInChannel[channel]) {
        return this.MidiConnection.lastCCInChannel[channel][control];
      } else return 0;
    } else return this.MidiConnection.lastCC[control] || 0;
  };

  public has_cc = (channel?: number): boolean => {
    /**
     * Return true if there is last cc event
     */
    if (channel)
      return (
        this.MidiConnection.findCCFromBufferInChannel(channel) !== undefined
      );
    else return this.MidiConnection.ccInputBuffer.length > 0;
  };

  public buffer_cc = (channel?: number): MidiCCEvent | undefined => {
    /**
     * @returns Returns latest unlistened cc event
     */
    if (channel) return this.MidiConnection.findCCFromBufferInChannel(channel);
    else return this.MidiConnection.ccInputBuffer.shift();
  };

  public show_scale = (
    root: number | string,
    scale: number | string,
    channel: number = 0,
    port: number | string = this.MidiConnection.currentOutputIndex || 0,
    soundOff: boolean = false
  ): void => {
    /**
     * Sends given scale to midi output for visual aid
     */
    if (!this.scale_aid || scale !== this.scale_aid) {
      this.hide_scale(root, scale, channel, port);
      const scaleNotes = getAllScaleNotes(scale, root);
      // Send each scale note to current midi out
      scaleNotes.forEach((note) => {
        this.MidiConnection.sendMidiOn(note, channel, 1, port);
        if (soundOff) this.MidiConnection.sendAllSoundOff(channel, port);
      });

      this.scale_aid = scale;
    }
  };

  public hide_scale = (
    // @ts-ignore
    root: number | string = 0,
    // @ts-ignore
    scale: number | string = 0,
    channel: number = 0,
    port: number | string = this.MidiConnection.currentOutputIndex || 0
  ): void => {
    /**
     * Hides all notes by sending all notes off to midi output
     */
    const allNotes = Array.from(Array(128).keys());
    // Send each scale note to current midi out
    allNotes.forEach((note) => {
      this.MidiConnection.sendMidiOff(note, channel, port);
    });
    this.scale_aid = undefined;
  };

  midi_notes_off = (
    channel: number = 0,
    port: number | string = this.MidiConnection.currentOutputIndex || 0
  ): void => {
    /**
     * Sends all notes off to midi output
     */
    this.MidiConnection.sendAllNotesOff(channel, port);
  };

  midi_sound_off = (
    channel: number = 0,
    port: number | string = this.MidiConnection.currentOutputIndex || 0
  ): void => {
    /**
     * Sends all sound off to midi output
     */
    this.MidiConnection.sendAllSoundOff(channel, port);
  };

  // =============================================================
  // Ziffers related functions
  // =============================================================

  public generateCacheKey = (...args: any[]): string => {
    return args.map((arg) => JSON.stringify(arg)).join(",");
  };

  public resetAllFromCache = (): void => {
    this.patternCache.forEach((player) => (player as Player).reset());
  }

  public z = (
    input: string,
    options: InputOptions = {},
    id: number | string = ""
  ): Player => {
    const zid = "z" + id.toString();
    const key = id === "" ? this.generateCacheKey(input, options) : zid;

    let player;

    if (this.app.api.patternCache.has(key)) {
      player = this.app.api.patternCache.get(key) as Player;
      if (player.input !== input) {
        player = undefined;
      }
    }

    if (!player) {
      player = new Player(input, options, this.app, zid);
      this.app.api.patternCache.set(key, player);
    }

    if (typeof id === "number") player.zid = zid;

    player.updateLastCallTime();

    if (id !== "" && zid !== "z0") {
      // Sync named patterns to z0 by default
      player.sync("z0");
    }

    return player;
  };

  public z0 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 0);
  public z1 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 1);
  public z2 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 2);
  public z3 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 3);
  public z4 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 4);
  public z5 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 5);
  public z6 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 6);
  public z7 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 7);
  public z8 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 8);
  public z9 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 9);
  public z10 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 10);
  public z11 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 11);
  public z12 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 12);
  public z13 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 13);
  public z14 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 14);
  public z15 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 15);
  public z16 = (input: string, opts: InputOptions = {}) =>
    this.z(input, opts, 16);

  // =============================================================
  // Counter and iteration
  // =============================================================

  public counter = (
    name: string | number,
    limit?: number,
    step?: number
  ): number => {
    /**
     * Returns the current value of a counter, and increments it by the step value.
     *
     * @param name - The name of the counter
     * @param limit - The upper limit of the counter
     * @param step - The step value of the counter
     * @returns The current value of the counter
     */

    if (!(name in this.counters)) {
      // Create new counter with default step of 1
      this.counters[name] = {
        value: 0,
        step: step ?? 1,
        limit,
      };
    } else {
      // Check if limit has changed
      if (this.counters[name].limit !== limit) {
        // Reset value to 0 and update limit
        this.counters[name].value = 0;
        this.counters[name].limit = limit;
      }

      // Check if step has changed
      if (this.counters[name].step !== step) {
        // Update step
        this.counters[name].step = step ?? this.counters[name].step;
      }

      // Increment existing iterator by step value
      this.counters[name].value += this.counters[name].step;

      // Check for limit overshoot
      if (
        this.counters[name].limit !== undefined &&
        this.counters[name].value > this.counters[name].limit
      ) {
        this.counters[name].value = 0;
      }
    }

    // Return current iterator value
    return this.counters[name].value;
  };
  $ = this.counter;

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
    return Math.floor(this.randomGen() * (max - min + 1)) + min;
  };

  rand = (min: number, max: number): number => {
    /**
     * Returns a random float between min and max.
     *
     * @param min - The minimum value of the random number
     * @param max - The maximum value of the random number
     * @returns A random float between min and max
     */
    return this.randomGen() * (max - min) + min;
  };

  irand = this.randI;
  rI = this.randI;
  r = this.rand;
  ir = this.randI;

  seed = (seed: string | number): void => {
    /**
     * Seed the random numbers globally in UserAPI.
     *  @param seed - The seed to use
     */
    if (typeof seed === "number") seed = seed.toString();
    if (this.currentSeed !== seed) {
      this.currentSeed = seed;
      this.randomGen = seededRandom(seed);
    }
  };

  localSeededRandom = (seed: string | number): Function => {
    if (typeof seed === "number") seed = seed.toString();
    if (this.localSeeds.has(seed)) return this.localSeeds.get(seed) as Function;
    const newSeededRandom = seededRandom(seed);
    this.localSeeds.set(seed, newSeededRandom);
    return newSeededRandom;
  };

  clearLocalSeed = (seed: string | number | undefined = undefined): void => {
    if (seed) this.localSeeds.delete(seed.toString());
    this.localSeeds.clear();
  };

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

  public nudge = (nudge?: number): number => {
    /**
     * Sets or returns the current clock nudge.
     *
     * @param nudge - [optional] the nudge to set
     * @returns The current nudge
     */
    if (nudge) {
      this.app.clock.nudge = nudge;
    }
    return this.app.clock.nudge;
  };

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

  public prob = (p: number): boolean => {
    /**
     * Returns true p% of the time.
     *
     * @param p - The probability of returning true
     * @returns True p% of the time
     */
    return this.randomGen() * 100 < p;
  };

  public toss = (): boolean => {
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
    return this.randomGen() > 0.5;
  };

  public odds = (n: number, beats: number = 1): boolean => {
    /**
     * Returns true n% of the time.
     *
     * @param n - The probability of returning true. 1/4 = 25% = 0.25, 80/127 = 62.9% = 0.6299212598425197, etc...
     * @param beats - The time frame in beats
     * @returns True n% of the time
     */
    return this.randomGen() < (n * this.ppqn()) / (this.ppqn() * beats);
  };

  // @ts-ignore
  public never = (beats: number = 1): boolean => {
    /**
     * Returns false
     * @param beats - Doesn't give a * about beats
     * @returns False
     */
    return false;
  };

  public almostNever = (beats: number = 1): boolean => {
    /**
     * Returns true 2.5% of the time in given time frame.
     *
     * @param beats - The time frame in beats
     * @returns True 2.5% of the time
     */
    return this.randomGen() < (0.025 * this.ppqn()) / (this.ppqn() * beats);
  };

  public rarely = (beats: number = 1): boolean => {
    /**
     * Returns true 10% of the time.
     *
     * @param beats - The time frame in beats
     * @returns True 10% of the time.
     */
    return this.randomGen() < (0.1 * this.ppqn()) / (this.ppqn() * beats);
  };

  public scarcely = (beats: number = 1): boolean => {
    /**
     * Returns true 25% of the time.
     *
     * @param beats - The time frame in beats
     * @returns True 25% of the time
     */
    return this.randomGen() < (0.25 * this.ppqn()) / (this.ppqn() * beats);
  };

  public sometimes = (beats: number = 1): boolean => {
    /**
     * Returns true 50% of the time.
     *
     * @param beats - The time frame in beats
     * @returns True 50% of the time
     */
    return this.randomGen() < (0.5 * this.ppqn()) / (this.ppqn() * beats);
  };

  public often = (beats: number = 1): boolean => {
    /**
     * Returns true 75% of the time.
     *
     * @param beats - The time frame in beats
     * @returns True 75% of the time
     */
    return this.randomGen() < (0.75 * this.ppqn()) / (this.ppqn() * beats);
  };

  public frequently = (beats: number = 1): boolean => {
    /**
     * Returns true 90% of the time.
     *
     * @param beats - The time frame in beats
     * @returns True 90% of the time
     */
    return this.randomGen() < (0.9 * this.ppqn()) / (this.ppqn() * beats);
  };

  public almostAlways = (beats: number = 1): boolean => {
    /**
     * Returns true 98.5% of the time.
     *
     * @param beats - The time frame in beats
     * @returns True 98.5% of the time
     */
    return this.randomGen() < (0.985 * this.ppqn()) / (this.ppqn() * beats);
  };

  // @ts-ignore
  public always = (beats: number = 1): boolean => {
    /**
     * Returns true 100% of the time.
     * @param beats - Doesn't give a * about beats
     * @returns true
     */
    return true;
  };

  public dice = (sides: number): number => {
    /**
     * Returns the value of a dice roll with n sides.
     *
     * @param sides - The number of sides on the dice
     * @returns The value of a dice roll with n sides
     */
    return Math.floor(this.randomGen() * sides) + 1;
  };

  // =============================================================
  // Time markers
  // =============================================================

  cbar = (): number => {
    /**
     * Returns the current bar number
     *
     * @returns The current bar number
     */
    return this.app.clock.time_position.bar + 1;
  };

  ctick = (): number => {
    /**
     * Returns the current tick number
     *
     * @returns The current tick number
     */
    return this.app.clock.tick + 1;
  };

  cpulse = (): number => {
    /**
     * Returns the current pulse number
     *
     * @returns The current pulse number
     */
    return this.app.clock.time_position.pulse + 1;
  };

  cbeat = (): number => {
    /**
     * Returns the current beat number
     *
     * @returns The current beat number
     */
    return this.app.clock.time_position.beat + 1;
  };

  ebeat = (): number => {
    /**
     * Returns the current beat number since the origin of time
     */
    return this.app.clock.beats_since_origin + 1;
  };

  epulse = (): number => {
    /**
     * Returns the current number of pulses elapsed since origin of time
     */
    return this.app.clock.pulses_since_origin + 1;
  };

  nominator = (): number => {
    /**
     * Returns the current nominator of the time signature
     */
    return this.app.clock.time_signature[0];
  };

  meter = (): number => {
    /**
     * Returns the current meter (denominator of the time signature)
     */
    return this.app.clock.time_signature[1];
  };

  denominator = this.meter;

  // =============================================================
  // Fill
  // =============================================================

  public fill = (): boolean => this.app.fill;

  // =============================================================
  // Time Filters
  // =============================================================

  public fullseq = (sequence: string, duration: number) => {
    if (sequence.split('').every(c => c === 'x' || c === 'o')) {
      return [...sequence].map(c => c === 'x').beat(duration);
    } else {
      return false
    }
  }

  public seq = (expr: string, duration: number = 0.5): boolean => {
    let len = expr.length * duration
    let output: number[] = [];

    for (let i = 1; i <= len + 1; i += duration) {
      output.push(Math.floor(i * 10) / 10);
    }
    output.pop()

    output = output.filter((_, idx) => {
      const exprIdx = idx % expr.length;
      return expr[exprIdx] === 'x';
    });

    return this.oncount(output, len)
  }


  public beat = (n: number | number[] = 1, nudge: number = 0): boolean => {
    /**
     * Determine if the current pulse is on a specified beat, with optional nudge.
     * @param n Single beat multiplier or array of beat multipliers
     * @param nudge Offset in pulses to nudge the beat forward or backward
     * @returns True if the current pulse is on one of the specified beats (considering nudge), false otherwise
     */
    const nArray = Array.isArray(n) ? n : [n];
    const results: boolean[] = nArray.map(
      (value) =>
        (this.app.clock.pulses_since_origin - Math.floor(nudge * this.ppqn())) %
        Math.floor(value * this.ppqn()) ===
        0
    );
    return results.some((value) => value === true);
  };
  b = this.beat;

  public bar = (n: number | number[] = 1, nudge: number = 0): boolean => {
    /**
     * Determine if the current pulse is on a specified bar, with optional nudge.
     * @param n Single bar multiplier or array of bar multipliers
     * @param nudge Offset in bars to nudge the bar forward or backward
     * @returns True if the current pulse is on one of the specified bars (considering nudge), false otherwise
     */
    const nArray = Array.isArray(n) ? n : [n];
    const barLength = this.app.clock.time_signature[1] * this.ppqn();
    const nudgeInPulses = Math.floor(nudge * barLength);
    const results: boolean[] = nArray.map(
      (value) =>
        (this.app.clock.pulses_since_origin - nudgeInPulses) %
        Math.floor(value * barLength) ===
        0
    );
    return results.some((value) => value === true);
  };
  B = this.bar;

  public pulse = (n: number | number[] = 1, nudge: number = 0): boolean => {
    /**
     * Determine if the current pulse is on a specified pulse count, with optional nudge.
     * @param n Single pulse count or array of pulse counts
     * @param nudge Offset in pulses to nudge the pulse forward or backward
     * @returns True if the current pulse is on one of the specified pulse counts (considering nudge), false otherwise
     */
    const nArray = Array.isArray(n) ? n : [n];
    const results: boolean[] = nArray.map(
      (value) => (this.app.clock.pulses_since_origin - nudge) % value === 0
    );
    return results.some((value) => value === true);
  };
  p = this.pulse;

  public tick = (tick: number | number[], offset: number = 0): boolean => {
    const nArray = Array.isArray(tick) ? tick : [tick];
    const results: boolean[] = nArray.map(
      (value) => this.app.clock.time_position.pulse === value + offset
    );
    return results.some((value) => value === true);
  };

  // =============================================================
  // Modulo based time filters
  // =============================================================

  // =============================================================
  // Other core temporal functions
  // =============================================================

  public flip = (chunk: number, ratio: number = 50): boolean => {
    /**
     * Determines if the current time position is in the first
     * or second half of a given time chunk.
     * @param chunk Time chunk to consider
     * @param ratio Optional ratio to influence the true/false output (0-100)
     * @returns Whether the function returns true or false based on ratio and time chunk
     */
    let realChunk = chunk * 2;
    const time_pos = this.app.clock.pulses_since_origin;
    const full_chunk = Math.floor(realChunk * this.ppqn());
    // const current_chunk = Math.floor(time_pos / full_chunk);
    const threshold = Math.floor((ratio / 100) * full_chunk);
    const pos_within_chunk = time_pos % full_chunk;
    return pos_within_chunk < threshold;
  };

  public flipbar = (chunk: number = 1): boolean => {
    let realFlip = chunk * 2;
    const time_pos = this.app.clock.time_position.bar;
    const current_chunk = Math.floor(time_pos / realFlip);
    return current_chunk % 2 === 0;
  };

  // =============================================================
  // "On" Filters
  // =============================================================

  public onbar = (
    bars: number[] | number,
    n: number = this.app.clock.time_signature[0]
  ): boolean => {
    let current_bar = (this.app.clock.time_position.bar % n) + 1;
    return typeof bars === "number"
      ? bars === current_bar
      : bars.some((b) => b == current_bar);
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
      let beat = b % this.nominator() || this.nominator();
      let integral_part = Math.floor(beat);
      integral_part = integral_part == 0 ? this.nominator() : integral_part;
      let decimal_part = Math.floor((beat - integral_part) * this.ppqn() + 1);
      // This was once revelead to me in a dream
      if (decimal_part <= 0)
        decimal_part = decimal_part + this.ppqn() * this.nominator();
      final_pulses.push(
        integral_part === this.cbeat() && this.cpulse() === decimal_part
      );
    });
    return final_pulses.some((p) => p == true);
  };

  oncount = (beats: number[] | number, count: number): boolean => {
    /**
     * Returns true if the current beat is in the given list of beats.
     *
     * @remarks
     * This function can also operate with decimal beats!
     *
     * @param beat - The beats to check
     * @returns True if the current beat is in the given list of beats
     */
    if (typeof beats === "number") beats = [beats];
    const origin = this.app.clock.pulses_since_origin;
    let final_pulses: boolean[] = [];
    beats.forEach((b) => {
      b = b < 1 ? 0 : b - 1;
      const beatInTicks = Math.ceil(b * this.ppqn());
      const meterPosition = origin % (this.ppqn() * count);
      return final_pulses.push(meterPosition === beatInTicks);
    });
    return final_pulses.some((p) => p == true);
  };

  oneuclid = (pulses: number, length: number, rotate: number = 0): boolean => {
    /**
     * Returns true if the current beat is in the given euclid sequence.
     * @param pulses - The number of pulses in the cycle
     * @param length - The length of the cycle
     * @param rotate - Rotation of the euclidian sequence
     * @returns True if the current beat is in the given euclid sequence
     */
    const cycle = this._euclidean_cycle(pulses, length, rotate);
    const beats = cycle.reduce((acc: number[], x: boolean, i: number) => {
      if (x) acc.push(i + 1);
      return acc;
    }, []);
    return this.oncount(beats, length);
  };

  // ======================================================================
  // Delay related functions
  // ======================================================================

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

  // =============================================================
  // Rythmic generators
  // =============================================================

  public euclid = (
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
  ec: Function = this.euclid;

  public rhythm = (
    div: number,
    pulses: number,
    length: number,
    rotate: number = 0
  ): boolean => {
    return (
      this.beat(div) && this._euclidean_cycle(pulses, length, rotate).beat(div)
    );
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

  public binrhythm = (div: number, n: number): boolean => {
    /**
     * Returns a binary cycle of size n, divided by div.
     *
     * @param div - The divisor of the binary cycle
     * @param n - The number to convert to binary
     * @returns boolean value based on the binary sequence
     */
    let convert: string = n.toString(2);
    let tobin: boolean[] = convert.split("").map((x: string) => x === "1");
    return this.beat(div) && tobin.beat(div);
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

  sine = (freq: number = 1, times: number = 1, offset: number = 0): number => {
    /**
     * Returns a sine wave between -1 and 1.
     *
     * @param freq - The frequency of the sine wave
     * @param offset - The offset of the sine wave
     * @returns A sine wave between -1 and 1
     */
    return (
      (Math.sin(this.app.clock.ctx.currentTime * Math.PI * 2 * freq) + offset) *
      times
    );
  };

  usine = (freq: number = 1, times: number = 1, offset: number = 0): number => {
    /**
     * Returns a sine wave between 0 and 1.
     *
     * @param freq - The frequency of the sine wave
     * @param offset - The offset of the sine wave
     * @returns A sine wave between 0 and 1
     * @see sine
     */
    return ((this.sine(freq, times, offset) + 1) / 2) * times;
  };

  saw = (freq: number = 1, times: number = 1, offset: number = 0): number => {
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
    return (
      (((this.app.clock.ctx.currentTime * freq) % 1) * 2 - 1 + offset) * times
    );
  };

  usaw = (freq: number = 1, times: number = 1, offset: number = 0): number => {
    /**
     * Returns a saw wave between 0 and 1.
     *
     * @param freq - The frequency of the saw wave
     * @param offset - The offset of the saw wave
     * @returns A saw wave between 0 and 1
     * @see saw
     */
    return ((this.saw(freq, times, offset) + 1) / 2) * times;
  };

  triangle = (
    freq: number = 1,
    times: number = 1,
    offset: number = 0
  ): number => {
    /**
     * Returns a triangle wave between -1 and 1.
     *
     * @returns A triangle wave between -1 and 1
     * @see saw
     * @see square
     * @see sine
     * @see noise
     */
    return (Math.abs(this.saw(freq, times, offset)) * 2 - 1) * times;
  };

  utriangle = (
    freq: number = 1,
    times: number = 1,
    offset: number = 0
  ): number => {
    /**
     * Returns a triangle wave between 0 and 1.
     *
     * @param freq - The frequency of the triangle wave
     * @param offset - The offset of the triangle wave
     * @returns A triangle wave between 0 and 1
     * @see triangle
     */
    return ((this.triangle(freq, times, offset) + 1) / 2) * times;
  };

  square = (
    freq: number = 1,
    times: number = 1,
    offset: number = 0,
    duty: number = 0.5
  ): number => {
    /**
     * Returns a square wave with a specified duty cycle between -1 and 1.
     *
     * @returns A square wave with a specified duty cycle between -1 and 1
     * @see saw
     * @see triangle
     * @see sine
     * @see noise
     */
    const period = 1 / freq;
    const t = (Date.now() / 1000 + offset) % period;
    return (t / period < duty ? 1 : -1) * times;
  };

  usquare = (
    freq: number = 1,
    times: number = 1,
    offset: number = 0,
    duty: number = 0.5
  ): number => {
    /**
     * Returns a square wave between 0 and 1.
     *
     * @param freq - The frequency of the square wave
     * @param offset - The offset of the square wave
     * @returns A square wave between 0 and 1
     * @see square
     */
    return ((this.square(freq, times, offset, duty) + 1) / 2) * times;
  };

  noise = (times: number = 1): number => {
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
    return (this.randomGen() * 2 - 1) * times;
  };

  // =============================================================
  // Math functions
  // =============================================================

  public min = (...values: number[]): number => {
    /**
     * Returns the minimum value of a list of numbers.
     *
     * @param values - The list of numbers
     * @returns The minimum value of the list of numbers
     */
    return Math.min(...values);
  };

  public max = (...values: number[]): number => {
    /**
     * Returns the maximum value of a list of numbers.
     *
     * @param values - The list of numbers
     * @returns The maximum value of the list of numbers
     */
    return Math.max(...values);
  };

  public mean = (...values: number[]): number => {
    /**
     * Returns the mean of a list of numbers.
     *
     * @param values - The list of numbers
     * @returns The mean value of the list of numbers
     */
    const sum = values.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return sum / values.length;
  };

  public range = (
    inputY: number,
    yMin: number,
    yMax: number,
    xMin: number,
    xMax: number
  ): number => {
    const percent = (inputY - yMin) / (yMax - yMin);
    const outputX = percent * (xMax - xMin) + xMin;
    return outputX;
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

  abs = Math.abs;

  // =============================================================
  // Speech synthesis
  // =============================================================

  speak = (
    text: string,
    lang: string = "en-US",
    voice: number = 0,
    rate: number = 1,
    pitch: number = 1
  ): void => {
    /*
     * Speaks the given text using the browser's speech synthesis API.
     * @param text - The text to speak
     * @param voice - The index of the voice to use
     * @param rate - The rate at which to speak the text
     * @param pitch - The pitch at which to speak the text
     *
     */
    const speaker = new Speaker({
      text: text,
      lang: lang,
      voice: voice,
      rate: rate,
      pitch: pitch,
    });
    speaker
      .speak()
      .then(() => {
        // Done speaking
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // =============================================================
  // Hydra integration
  // =============================================================

  stop_hydra = (): void => {
    /**
     * Empties the buffer of the Hydra sketch.
     */
    this.app.hydra.hush();
  };

  // =============================================================
  // Trivial functions
  // =============================================================

  sound = (sound: string | string[] | null | undefined) => {
    if (sound) return new SoundEvent(sound, this.app);
    else return new SkipEvent();
  };

  snd = this.sound;
  samples = samples;

  log = (message: any) => {
    console.log(message);
    this._logMessage(message);
  };

  scale = getScaleNotes;

  rate = (rate: number): void => {
    rate = rate;
    // TODO: Implement this. This function should change the rate at which the global script
    // is evaluated. This is useful for slowing down the script, or speeding it up. The default
    // would be 1.0, which is the current rate (very speedy).
  };

  // =============================================================
  // Legacy functions
  // =============================================================

  public divseq = (...args: any): any => {
    const chunk_size = args[0]; // Get the first argument (chunk size)
    const elements = args.slice(1); // Get the rest of the arguments as an array
    const timepos = this.app.clock.pulses_since_origin;
    const slice_count = Math.floor(
      timepos / Math.floor(chunk_size * this.ppqn())
    );
    return elements[slice_count % elements.length];
  };

  public seqbeat = <T>(...array: T[]): T => {
    /**
     * Returns an element from an array based on the current beat.
     *
     * @param array - The array of values to pick from
     */
    return array[this.app.clock.time_position.beat % array.length];
  };

  public seqbar = <T>(...array: T[]): T => {
    /**
     * Returns an element from an array based on the current bar.
     *
     * @param array - The array of values to pick from
     */
    return array[(this.app.clock.time_position.bar + 1) % array.length];
  };

  // =============================================================
  // High Order Functions
  // =============================================================

  public shuffle = <T>(array: T[]): T[] => {
    /**
     * Returns a shuffled version of an array.
     * @param array - The array to shuffle
     * @returns A shuffled version of the array
     */
    return array.sort(() => this.randomGen() - 0.5);
  };

  public reverse = <T>(array: T[]): T[] => {
    /**
     * Returns a reversed version of an array.
     * @param array - The array to reverse
     * @returns A reversed version of the array
     */
    return array.reverse();
  };

  public rotate = <T>(n: number): Function => {
    /**
     * Returns a partially applied function that rotates an array by n.
     *
     */

    return (array: T[]): T[] => {
      return array.slice(n, array.length).concat(array.slice(0, n));
    };
  };

  public repeat = <T>(n: number): Function => {
    /**
     * Returns a partially applied function that repeats each element of an array n times.
     *
     */
    return (array: T[]): T[] => {
      return array.flatMap((x) => Array(n).fill(x));
    };
  };

  public repeatOdd = <T>(n: number): Function => {
    /**
     * Returns a partially applied function that repeats  each even element of an array n times.
     *
     */
    return (array: T[]): T[] => {
      return array.flatMap((x, i) => (i % 2 === 0 ? Array(n).fill(x) : x));
    };
  };

  public repeatEven = <T>(n: number): Function => {
    /**
     * Returns a partially applied function that repeats  each even element of an array n times.
     *
     */
    return (array: T[]): T[] => {
      return array.flatMap((x, i) => (i % 2 !== 0 ? Array(n).fill(x) : x));
    };
  };

  public palindrome = <T>(array: T[]): T[] => {
    /**
     * Returns a palindrome of an array.
     * @param array - The array to palindrome
     * @returns A palindrome of the array
     */
    return array.concat(array.slice(0, array.length - 1).reverse());
  };

  // =============================================================
  // Oscilloscope Configuration
  // =============================================================

  public scope = (config: OscilloscopeConfig): void => {
    /**
     * Configures the oscilloscope.
     * @param config - The configuration object
     */
    this.app.osc = {
      ...this.app.osc,
      ...config,
    };
  };

  // =============================================================
  // Ralt144mi section
  // =============================================================

  raltfont = (mainFont: string, commentFont: string): void => {
    this.app.view.dispatch({
      effects: this.app.fontSize.reconfigure(
        EditorView.theme({
          "&": { fontFamily: mainFont },
          ".cm-gutters": { fontFamily: mainFont, },
          ".cm-content": {
            fontFamily: mainFont,
          },
          ".cm-comment": {
            fontFamily: commentFont,
          },
        })
      ),
    });
  }


  // =============================================================
  // Resolution
  // =============================================================
  //

  public showGif = (options: any) => {
    /**
    * Displays a GIF on the webpage with various customizable options including rotation and fading.
    * @param {Object} options - The configuration object for displaying the GIF.
    * @param {string} options.gifUrl - The URL of the GIF to display.
    * @param {number} [options.posX=0] - The X-coordinate to place the GIF at.
    * @param {number} [options.posY=0] - The Y-coordinate to place the GIF at.
    * @param {number} [options.opacity=1] - The opacity level of the GIF.
    * @param {string} [options.size='auto'] - The size of the GIF (can be 'cover', 'contain', or specific dimensions).
    * @param {number} [options.zIndex=1000] - The z-index of the GIF.
    * @param {boolean} [options.center=false] - Whether to center the GIF in the window.
    * @param {number} [options.rotation=0] - The rotation angle of the GIF in degrees.
    * @param {string} [options.filter='none'] - The CSS filter function to apply for color alterations.
    * @param {number} [options.fadeDuration=0] - The duration of the fade-in effect in seconds.
    */
    const {
      gifUrl,
      posX = 0,
      posY = 0,
      opacity = 1,
      size = 'auto',
      zIndex = 1000,
      center = false,
      rotation = 0,
      filter = 'none',
      fadeDuration = 0
    } = options;

    const gifElement = document.createElement('img');
    gifElement.src = gifUrl;
    // @ts-ignore
    gifElement.style = `
    position: fixed;
    left: ${center ? '50%' : `${posX}px`};
    top: ${center ? '50%' : `${posY}px`};
    opacity: ${fadeDuration > 0 ? 0 : opacity}; /* Start with opacity 0 if fading in */
    z-index: ${zIndex};
    ${size !== 'auto' ? `width: ${size}; height: ${size};` : ''}
    ${center ? 'transform: translate(-50%, -50%) rotate(${rotation}deg);' : `transform: rotate(${rotation}deg);`}
    filter: ${filter};
    transition: opacity ${fadeDuration}s ease;
  `;
    gifElement.classList.add('top-level-gif'); // Add a class for easier removal

    document.body.appendChild(gifElement);

    // If fadeDuration is specified, fade the image in
    if (fadeDuration > 0) {
      setTimeout(() => {
        gifElement.style.opacity = opacity;
      }, 10); // Timeout to ensure the element is rendered before starting the transition
    }
  }


  public clearGif = () => {
    const gifs = document.querySelectorAll('.top-level-gif');
    gifs.forEach(gif => gif.remove());
  }
}
