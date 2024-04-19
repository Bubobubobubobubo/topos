import { TransportNode } from "./ClockNode";
import TransportProcessor from "./ClockProcessor?worker&url";
import { Editor } from "../main";

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
   * @param ctx - The current AudioContext used by app
   * @param transportNode - The TransportNode helper
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

  ctx: AudioContext;
  logicalTime: number;
  transportNode: TransportNode | null;
  private _bpm: number;
  time_signature: number[];
  time_position: TimePosition;
  private _ppqn: number;
  tick: number;
  running: boolean;
  lastPauseTime: number;
  lastPlayPressTime: number;
  totalPauseTime: number;

  constructor(
    public app: Editor,
    ctx: AudioContext,
  ) {
    this.time_position = { bar: 0, beat: 0, pulse: 0 };
    this.time_signature = [4, 4];
    this.logicalTime = 0;
    this.tick = 0;
    this._bpm = 120;
    this._ppqn = 48 * 2;
    this.transportNode = null;
    this.ctx = ctx;
    this.running = true;
    this.lastPauseTime = 0;
    this.lastPlayPressTime = 0;
    this.totalPauseTime = 0;
    ctx.audioWorklet
      .addModule(TransportProcessor)
      .then((e) => {
        this.transportNode = new TransportNode(ctx, {}, this.app);
        this.transportNode.connect(ctx.destination);
        return e;
      })
      .catch((e) => {
        console.log("Error loading TransportProcessor.js:", e);
      });
  }

  convertTicksToTimeposition(ticks: number): TimePosition {
    /**
     * Converts ticks to a TimePosition object.
     * @param ticks The number of ticks to convert.
     * @returns The TimePosition object representing the converted ticks.
     */

    const beatsPerBar = this.app.clock.time_signature[0]!;
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
    return this.time_signature[0] || 4;
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
    this.transportNode?.setNudge(nudge);
  }

  set bpm(bpm: number) {
    if (bpm > 0 && this._bpm !== bpm) {
      this.transportNode?.setBPM(bpm);
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
      this.transportNode?.setPPQN(ppqn);
      this.logicalTime = this.realTime;
    }
  }

  public incrementTick(bpm: number) {
    /**
    * Increment the clock tick by 1.
    * @param bpm - The current beats per minute value
    * @returns void
    */
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
    this.transportNode?.start();
  }

  public pause(): void {
    /**
     * Pauses the TransportNode (pauses the clock).
     *
     * @remark also sends a MIDI message if a port is declared
     */
    this.running = false;
    this.transportNode?.pause();
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
    this.transportNode?.stop();
  }
}
