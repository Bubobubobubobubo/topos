import { Editor } from "./main";
import { tryEvaluate } from "./Evaluator";
// @ts-ignore
import { getAudioContext } from "superdough";
// @ts-ignore
import "zyklus";
const zeroPad = (num: number, places: number) => String(num).padStart(places, "0");

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
   * The Clock Class is responsible for keeping track of the current time.
   * It is also responsible for starting and stopping the Clock TransportNode.
   *
   * @param app - The main application instance
   * @param clock - The zyklus clock
   * @param ctx - The current AudioContext used by app
   * @param bpm - The current beats per minute value
   * @param time_signature - The time signature
   * @param time_position - The current time position
   * @param ppqn - The pulses per quarter note
   * @param tick - The current tick since origin
   * @param running - Is the clock running?
   * @param lastPauseTime - The last time the clock was paused
   * @param lastPlayPressTime - The last time the clock was started
   * @param totalPauseTime - The total time the clock has been paused / stopped
   */

  clock: any;
  ctx: AudioContext;
  logicalTime: number;
  private _bpm: number;
  time_signature: number[];
  time_position: TimePosition;
  private _ppqn: number;
  tick: number;
  running: boolean;
  lastPauseTime: number;
  lastPlayPressTime: number;
  totalPauseTime: number;
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
    this.lastPauseTime = 0;
    this.deadline = 0;
    this.lastPlayPressTime = 0;
    this.totalPauseTime = 0;
    this.timeviewer = document.getElementById("timeviewer")!;
    this.clock = getAudioContext().createClock(this.clockCallback, this.pulse_duration)
 }

  clockCallback = (time: number, duration: number, tick: number) => {
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
            this.timeviewer.innerHTML = `${zeroPad(futureTimeStamp.bar, 2)}:${
              futureTimeStamp.beat + 1
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
     * Converts ticks to a TimePosition object.
     * @param ticks The number of ticks to convert.
     * @returns The TimePosition object representing the converted ticks.
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
     * This function returns the number of ticks separating the current moment
     * from the beginning of the next bar.
     *
     * @returns number of ticks until next bar
     */
    const ticskMissingFromBeat = this.ppqn - this.time_position.pulse;
    const beatsMissingFromBar = this.beats_per_bar - this.time_position.beat;
    return beatsMissingFromBar * this.ppqn + ticskMissingFromBeat;
  }

  get next_beat_in_ticks(): number {
    /**
     * This function returns the number of ticks separating the current moment
     * from the beginning of the next beat.
     *
     * @returns number of ticks until next beat
     */
    return this.app.clock.pulses_since_origin + this.time_position.pulse;
  }

  get beats_per_bar(): number {
    /**
     * Returns the number of beats per bar.
     */
    return this.time_signature[0];
  }

  get beats_since_origin(): number {
    /**
     * Returns the number of beats since the origin.
     *
     * @returns number of beats since origin
     */
    return Math.floor(this.tick / this.ppqn);
  }

  get pulses_since_origin(): number {
    /**
     * Returns the number of pulses since the origin.
     *
     * @returns number of pulses since origin
     */
    return this.tick;
  }

  get pulse_duration(): number {
    /**
     * Returns the duration of a pulse in seconds.
     */
    return 60 / this.bpm / this.ppqn;
  }

  public pulse_duration_at_bpm(bpm: number = this.bpm): number {
    /**
     * Returns the duration of a pulse in seconds at a specific bpm.
     */
    return 60 / bpm / this.ppqn;
  }

  get bpm(): number {
    return this._bpm;
  }

  set nudge(nudge: number) {
  }

  set bpm(bpm: number) {
    if (bpm > 0 && this._bpm !== bpm) {
      this._bpm = bpm;
      this.logicalTime = this.realTime;
    }
  }

  get ppqn(): number {
    return this._ppqn;
  }

  get realTime(): number {
    return this.app.audioContext.currentTime - this.totalPauseTime;
  }

  get deviation(): number {
    return Math.abs(this.logicalTime - this.realTime);
  }

  set ppqn(ppqn: number) {
    if (ppqn > 0 && this._ppqn !== ppqn) {
      this._ppqn = ppqn;
      this.logicalTime = this.realTime;
    }
  }

  public incrementTick(bpm: number) {
    this.tick++;
    this.logicalTime += this.pulse_duration_at_bpm(bpm);
  }

  public nextTickFrom(time: number, nudge: number): number {
    /**
     * Compute the time remaining before the next clock tick.
     * @param time - audio context currentTime
     * @param nudge - nudge in the future (in seconds)
     * @returns remainingTime
     */
    const pulseDuration = this.pulse_duration;
    const nudgedTime = time + nudge;
    const nextTickTime = Math.ceil(nudgedTime / pulseDuration) * pulseDuration;
    const remainingTime = nextTickTime - nudgedTime;

    return remainingTime;
  }

  public convertPulseToSecond(n: number): number {
    /**
     * Converts a pulse to a second.
     */
    return n * this.pulse_duration;
  }

  public start(): void {
    /**
     * Starts the TransportNode (starts the clock).
     *
     * @remark also sends a MIDI message if a port is declared
     */
    this.app.audioContext.resume();
    this.running = true;
    this.app.api.MidiConnection.sendStartMessage();
    this.lastPlayPressTime = this.app.audioContext.currentTime;
    this.totalPauseTime += this.lastPlayPressTime - this.lastPauseTime;
    this.clock.start()
  }

  public pause(): void {
    /**
     * Pauses the TransportNode (pauses the clock).
     *
     * @remark also sends a MIDI message if a port is declared
     */
    this.running = false;
    this.app.api.MidiConnection.sendStopMessage();
    this.lastPauseTime = this.app.audioContext.currentTime;
    this.logicalTime = this.realTime;
  }

  public stop(): void {
    /**
     * Stops the TransportNode (stops the clock).
     *
     * @remark also sends a MIDI message if a port is declared
     */
    this.running = false;
    this.tick = 0;
    this.lastPauseTime = this.app.audioContext.currentTime;
    this.logicalTime = this.realTime;
    this.time_position = { bar: 0, beat: 0, pulse: 0 };
    this.app.api.MidiConnection.sendStopMessage();
  }
}
