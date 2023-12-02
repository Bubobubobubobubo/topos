import { Editor } from "./main";
import { tryEvaluate } from "./Evaluator";
// @ts-ignore
import { getAudioContext } from "superdough";
// @ts-ignore
import "zyklus";
const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

export interface TimePosition {
  /**
   *  A position in time.
   *
   * @param bar - The bar number
   * @param beat - The beat number
   * @param pulse - The pulse number
   */
  bar: number;
  beat: number;
  pulse: number;
}

export class Clock {
  /**
   *
   * @param app - main application instance
   * @param clock - zyklus clock
   * @param ctx - current AudioContext used by app
   * @param bpm - current beats per minute value
   * @param time_signature - time signature
   * @param time_position - current time position
   * @param ppqn - pulses per quarter note
   * @param tick - current tick since origin
   * @param running - Is the clock running?
   */

  private _bpm: number;
  private _ppqn: number;
  clock: any;
  ctx: AudioContext;
  logicalTime: number;
  time_signature: number[];
  time_position: TimePosition;
  tick: number;
  running: boolean;
  timeviewer: HTMLElement;
  deadline: number;

  constructor(
    public app: Editor,
    ctx: AudioContext,
  ) {
    this.time_position = { bar: 0, beat: 0, pulse: 0 };
    this.time_signature = [4, 4];
    this.logicalTime = 0;
    this.tick = 0;
    this._bpm = 120;
    this._ppqn = 48;
    this.ctx = ctx;
    this.running = true;
    this.deadline = 0;
    this.timeviewer = document.getElementById("timeviewer")!;
    this.clock = getAudioContext().createClock(
      this.clockCallback,
      this.pulse_duration,
    );
  }

  // @ts-ignore
  clockCallback = (time: number, duration: number, tick: number) => {
    /**
     * Callback function for the zyklus clock. Updates the clock info and sends a 
     * MIDI clock message if the setting is enabled. Also evaluates the global buffer.
     * 
     * @param time - precise AudioContext time when the tick should happen
     * @param duration -  seconds between each tick
     * @param tick - count of the current tick
     */
    let deadline = time - getAudioContext().currentTime;
    this.deadline = deadline;
    this.tick = tick;
    if (this.app.clock.running) {
      if (this.app.settings.send_clock) {
        this.app.api.MidiConnection.sendMidiClock();
      }
      const futureTimeStamp = this.app.clock.convertTicksToTimeposition(
        this.app.clock.tick,
      );
      this.app.clock.time_position = futureTimeStamp;
      if (futureTimeStamp.pulse % this.app.clock.ppqn == 0) {
        this.timeviewer.innerHTML = `${zeroPad(futureTimeStamp.bar, 2)}:${futureTimeStamp.beat + 1
          } / ${this.app.clock.bpm}`;
      }
      if (this.app.exampleIsPlaying) {
        tryEvaluate(this.app, this.app.example_buffer);
      } else {
        tryEvaluate(this.app, this.app.global_buffer);
      }
    }

    // Implement TransportNode clock callback and update clock info with it
  };

  convertTicksToTimeposition(ticks: number): TimePosition {
    /**
     * Converts ticks to a time position. 
     * 
     * @param ticks - ticks to convert
     * @returns TimePosition
     */
    const beatsPerBar = this.app.clock.time_signature[0];
    const ppqnPosition = ticks % this.app.clock.ppqn;
    const beatNumber = Math.floor(ticks / this.app.clock.ppqn);
    const barNumber = Math.floor(beatNumber / beatsPerBar);
    const beatWithinBar = Math.floor(beatNumber % beatsPerBar);
    return { bar: barNumber, beat: beatWithinBar, pulse: ppqnPosition };
  }

  get ticks_before_new_bar(): number {
    /**
     * Calculates the number of ticks before the next bar.
     * 
     * @returns number - ticks before the next bar
     */
    const ticskMissingFromBeat = this.ppqn - this.time_position.pulse;
    const beatsMissingFromBar = this.beats_per_bar - this.time_position.beat;
    return beatsMissingFromBar * this.ppqn + ticskMissingFromBeat;
  }

  get next_beat_in_ticks(): number {
    /**
     * Calculates the number of ticks before the next beat.
     * 
     * @returns number - ticks before the next beat
     */
    return this.app.clock.pulses_since_origin + this.time_position.pulse;
  }

  get beats_per_bar(): number {
    /**
     * Returns the number of beats per bar.
     * 
     * @returns number - beats per bar
     */
    return this.time_signature[0];
  }

  get beats_since_origin(): number {
    /**
     * Returns the number of beats since the origin.
     * 
     * @returns number - beats since the origin
     */
    return Math.floor(this.tick / this.ppqn);
  }

  get pulses_since_origin(): number {
    /**
     * Returns the number of pulses since the origin.
     * 
     * @returns number - pulses since the origin
     */
    return this.tick;
  }

  get pulse_duration(): number {
    /**
     * Returns the duration of a pulse in seconds.
     * @returns number - duration of a pulse in seconds
     */
    return 60 / this.bpm / this.ppqn;
  }

  public pulse_duration_at_bpm(bpm: number = this.bpm): number {
    /**
     * Returns the duration of a pulse in seconds at a given bpm.
     * 
     * @param bpm - bpm to calculate the pulse duration for
     * @returns number - duration of a pulse in seconds
     */
    return 60 / bpm / this.ppqn;
  }

  get bpm(): number {
    /**
     * Returns the current bpm.
     * @returns number - current bpm
     */
    return this._bpm;
  }

  get tickDuration(): number {
    /**
     * Returns the duration of a tick in seconds.
     * @returns number - duration of a tick in seconds
     */
    return 1 / this.ppqn;
  }

  set bpm(bpm: number) {
    /**
     * Sets the bpm.
     * @param bpm - bpm to set
     */
    if (bpm > 0 && this._bpm !== bpm) {
      this._bpm = bpm;
      this.clock.setDuration(() => (this.tickDuration * 60) / this.bpm);
    }
  }

  get ppqn(): number {
    /**
     * Returns the current ppqn.
     * @returns number - current ppqn
     */
    return this._ppqn;
  }

  set ppqn(ppqn: number) {
    /**
     * Sets the ppqn.
     * @param ppqn - ppqn to set
     * @returns number - current ppqn
     */
    if (ppqn > 0 && this._ppqn !== ppqn) {
      this._ppqn = ppqn;
    }
  }

  public nextTickFrom(time: number, nudge: number): number {
    const pulseDuration = this.pulse_duration;
    const nudgedTime = time + nudge;
    const nextTickTime = Math.ceil(nudgedTime / pulseDuration) * pulseDuration;
    const remainingTime = nextTickTime - nudgedTime;
    return remainingTime;
  }

  public convertPulseToSecond(n: number): number {
    return n * this.pulse_duration;
  }

  public start(): void {
    /**
     * Start the clock
     * 
     * @remark also sends a MIDI message if a port is declared
     */
    this.app.audioContext.resume();
    this.running = true;
    this.app.api.MidiConnection.sendStartMessage();
    this.clock.start();
  }

  public pause(): void {
    /**
     * Pause the clock.
     * 
     * @remark also sends a MIDI message if a port is declared
     */
    this.running = false;
    this.app.api.MidiConnection.sendStopMessage();
    this.clock.pause();
  }

  public stop(): void {
    /**
     * Stops the clock.
     *
     * @remark also sends a MIDI message if a port is declared
     */
    this.running = false;
    this.tick = 0;
    this.time_position = { bar: 0, beat: 0, pulse: 0 };
    this.app.api.MidiConnection.sendStopMessage();
    this.clock.stop();
  }
}
