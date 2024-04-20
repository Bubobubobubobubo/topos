import { ClockNode } from "./ClockNode";
import TransportProcessor from "./ClockProcessor?worker&url";
import { Editor } from "../main";

export interface TimePosition {
  bpm: number; ppqn: number; time: number;
  tick: number; beat: number; bar: number;
  num: number; den: number; grain: number;
}

export class Clock {
  ctx: AudioContext;
  transportNode: ClockNode | null;
  time_position: TimePosition;

  constructor(
    public app: Editor,
    ctx: AudioContext,
  ) {
    this.time_position = { 
      bpm: 0,
      time: 0,
      ppqn: 0,
      tick: 0,
      beat: 0, 
      bar: 0, 
      num: 0,
      den: 0,
      grain: 0,
    };
    this.transportNode = null;
    this.ctx = ctx;
    ctx.audioWorklet
      .addModule(TransportProcessor)
      .then((e) => {
        this.transportNode = new ClockNode(ctx, {}, this.app);
        this.transportNode.connect(ctx.destination);
        return e;
      })
      .catch((e) => {
        console.log("Error loading TransportProcessor.js:", e);
      });
  }

  get grain(): number {
    return this.time_position.grain;
  }

  get ticks_before_new_bar(): number {
    /**
     * This function returns the number of ticks separating the current moment
     * from the beginning of the next bar.
     *
     * @returns number of ticks until next bar
     */
    const ticksMissingFromBeat = this.time_position.ppqn - this.time_position.tick;
    const beatsMissingFromBar = this.beats_per_bar - this.time_position.beat;
    return beatsMissingFromBar * this.time_position.ppqn + ticksMissingFromBeat;
  }

  get next_beat_in_ticks(): number {
    /**
     * This function returns the number of ticks separating the current moment
     * from the beginning of the next beat.
     *
     * @returns number of ticks until next beat
     */
    return this.time_position.grain + this.time_position.tick;
  }

  get beats_per_bar(): number {
    /**
     * Returns the number of beats per bar.
     */
    return this.time_position.num;
  }

  get beats_since_origin(): number {
    /**
     * Returns the number of beats since the origin.
     *
     * @returns number of beats since origin
     */
    return Math.floor(this.time_position.tick / this.ppqn)
  }

  get pulse_duration(): number {
    /**
     * Returns the duration of a pulse in seconds.
     */
    return 60 / this.time_position.bpm / this.time_position.ppqn;
  }

  public pulse_duration_at_bpm(bpm: number = this.bpm): number {
    /**
     * Returns the duration of a pulse in seconds at a specific bpm.
     */
    return 60 / bpm / this.time_position.ppqn;
  }

  get bpm(): number {
    return this.time_position.bpm;
  }

  set bpm(bpm: number) {
    if (bpm > 0 && this.time_position.bpm !== bpm) {
      this.transportNode?.setBPM(bpm);
    }
  }

  get ppqn(): number {
    return this.time_position.ppqn;
  }

  set ppqn(ppqn: number) {
    if (ppqn > 0 && this.ppqn !== ppqn) {
      this.transportNode?.setPPQN(ppqn);
    }
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
    this.app.api.MidiConnection.sendStartMessage();
    this.transportNode?.start();
  }

  public pause(): void {
    this.app.api.MidiConnection.sendStopMessage();
    this.transportNode?.pause() 
  }

  public signature(num: number, den: number): void {
    this.transportNode?.setSignature(num, den);
  }

  public stop(): void {
    this.app.api.MidiConnection.sendStopMessage();
    this.transportNode?.stop() 
  }

}
