// @ts-ignore
import { ClockNode } from "./ClockNode";
import TransportProcessor from "./ClockProcessor?worker&url";
import { Editor } from "../main";

export interface TimePosition {
  bpm: number; ppqn: number; time: number;
  tick: number; beat: number; bar: number;
  num: number; den: number; grain: number;
  tick_duration: number;
}

export class Clock {
  ctx: AudioContext;
  transportNode: ClockNode | null;
  time_position: TimePosition;
  startTime: number | null = null;
  elapsedTime: number = 0;
  state: 'running' | 'paused' | 'stopped' = 'stopped';

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
      tick_duration: 0,
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

  public play(): void {
    if (this.state !== 'running') {
      this.elapsedTime = 0;
      this.state = 'running';
    }
    this.startTime = performance.now();
    this.app.api.MidiConnection.sendStartMessage();
    this.transportNode?.start();
  }
  
  public pause(): void {
    this.state = 'paused';
    if (this.startTime !== null) {
      this.elapsedTime += performance.now() - this.startTime;
      this.startTime = null;
    }
    this.app.api.MidiConnection.sendStopMessage();
    this.transportNode?.pause();
  }
 
  public resume(): void {
    if (this.state === 'stopped' || this.state === 'paused') {
      this.startTime = performance.now();
      this.state = 'running';
      this.app.api.MidiConnection.sendStartMessage();
      this.transportNode?.start();
    } else if (this.state === 'running') {
      this.state = 'paused';
      if (this.startTime !== null) {
        this.elapsedTime += performance.now() - this.startTime;
        this.startTime = null;
      }
      this.app.api.MidiConnection.sendStopMessage();
      this.transportNode?.pause();
    }
  }

  public stop(): void {
    if (this.startTime !== null) {
      this.elapsedTime += performance.now() - this.startTime;
      this.startTime = null;
    }
    this.state = 'stopped';
    this.app.api.MidiConnection.sendStopMessage();
    this.transportNode?.stop();
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
    const pulseDuration = this.time_position.tick_duration;
    const nudgedTime = time + nudge;
    const nextTickTime = Math.ceil(nudgedTime / pulseDuration) * pulseDuration;
    const remainingTime = nextTickTime - nudgedTime;

    return remainingTime;
  }
  
  public convertTicksToTimeposition(n: number): TimePosition {
    /**
     * TODO: probably incorrect
     */
    const ppqn = this.time_position.ppqn;
    const bpm = this.time_position.bpm;
    const num = this.time_position.num;
    const den = this.time_position.den;
    const tick = n % ppqn;
    const grain = n;
    const beat = Math.floor(n / ppqn) % num;
    const bar = Math.floor(n / ppqn / num);
    const time = n * this.time_position.tick_duration;
    const tick_duration = this.time_position.tick_duration;
    return { bpm, ppqn, time, tick, beat, bar, num, den, grain, tick_duration };
  }

  public convertPulseToSecond(n: number): number {
    /**
     * Converts a pulse to a second.
     */
    return n * this.time_position.tick_duration;
  }


  public setSignature(num: number, den: number): void {
    this.transportNode?.setSignature(num, den);
  }

  public getElapsed(): number {
    if (this.startTime === null) {
      return this.elapsedTime;
    } else {
      return this.elapsedTime + (performance.now() - this.startTime);
    }
  }

  public getTimeDeviation(grain: number, tick_duration: number): number {
    const idealTime = grain * tick_duration;
    const elapsedTime = this.getElapsed();
    const timeDeviation = elapsedTime - idealTime;
    return timeDeviation;
  }
}