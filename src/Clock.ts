// @ts-ignore
import { Editor } from "./main";
import { tryEvaluate } from "./Evaluator";
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

  ctx: AudioContext;
  logicalTime: number;
  private _bpm: number;
  time_signature: number[];
  time_position: TimePosition;
  private _ppqn: number;
  tick: number;
  running: boolean;
  private timerWorker: Worker | null = null;
  private timeAtStart: number;
  nudge: number

  timeviewer: HTMLElement


  constructor(public app: Editor, ctx: AudioContext) {
    this.timeviewer = document.getElementById("timeviewer")!;
    this.time_position = { bar: 0, beat: 0, pulse: 0 };
    this.time_signature = [4, 4];
    this.logicalTime = 0;
    this.tick = 0;
    this._bpm = 120;
    this._ppqn = 48;
    this.nudge = 0;
    this.ctx = ctx;
    this.running = true;
    this.initializeWorker();
  }

  private initializeWorker(): void {
    const workerScript = 'onmessage = (e) => { setInterval(() => { postMessage(true) }, e.data)}';
    const blob = new Blob([workerScript], { type: 'text/javascript' });
    this.timerWorker = new Worker(URL.createObjectURL(blob));
    this.timerWorker.onmessage = () => {
      this.run();
    };
  }

  private setWorkerInterval(): void {
    // Calculate the duration of one beat in milliseconds
    const beatDurationMs = 60000 / this._bpm;

    // Calculate the duration of one pulse
    const pulseDurationMs = beatDurationMs / this._ppqn;

    // Set this as the interval for the worker
    this.timerWorker?.postMessage(pulseDurationMs);
  }

  private run = () => {
    if (this.running) {
      const adjustedCurrentTime = this.ctx.currentTime + (this.nudge / 1000);
      const beatNumber = adjustedCurrentTime / (60 / this._bpm);
      const currentPulsePosition = Math.ceil(beatNumber * this._ppqn);

      if (currentPulsePosition > this.time_position.pulse) {
        const futureTimeStamp = this.convertTicksToTimeposition(
          this.tick
        );
        this.app.clock.incrementTick(this.bpm);

        this.time_position.pulse = currentPulsePosition;

        if (this.app.settings.send_clock) {
          if (futureTimeStamp.pulse % 2 == 0) // TODO: Why?
            this.app.api.MidiConnection.sendMidiClock();
        }
        this.time_position = futureTimeStamp;
        if (futureTimeStamp.pulse % this.app.clock.ppqn == 0) {
          this.timeviewer.innerHTML = `${zeroPad(futureTimeStamp.bar, 2)}:${futureTimeStamp.beat + 1
            } / ${this.bpm}`;
        }
        if (this.app.exampleIsPlaying) {
          tryEvaluate(this.app, this.app.example_buffer);
        } else {
          tryEvaluate(this.app, this.app.global_buffer);
        }
      }
    }
  }

  convertTicksToTimeposition(ticks: number): TimePosition {
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
    return 60 / this._bpm / this.ppqn;
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

  set bpm(bpm: number) {
    if (bpm > 0 && this._bpm !== bpm) {
      this._bpm = bpm;

      // Restart the worker with the new BPM if the clock is running
      if (this.running) {
        this.restartWorker();
      }
    }
  }

  private restartWorker(): void {
    if (this.timerWorker) {
      this.timerWorker.terminate();
    }
    this.initializeWorker();
    this.setWorkerInterval();
  }

  get ppqn(): number {
    return this._ppqn;
  }

  get realTime(): number {
    return this.app.audioContext.currentTime;
  }

  get deviation(): number {
    return this.logicalTime - this.realTime;
  }

  set ppqn(ppqn: number) {
    if (ppqn > 0 && this._ppqn !== ppqn) {
      this._ppqn = ppqn;
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
    if (this.running) {
      return;
    }

    this.running = true;
    this.app.audioContext.resume();
    this.app.api.MidiConnection.sendStartMessage();

    if (!this.timerWorker) {
      this.initializeWorker();
    }
    this.setWorkerInterval();
    this.timeAtStart = this.ctx.currentTime;
    this.logicalTime = this.timeAtStart
  }

  public pause(): void {
    this.running = false;
    this.app.api.MidiConnection.sendStopMessage();
    if (this.timerWorker) {
      this.timerWorker.terminate();
      this.timerWorker = null;
    }
  }

  public stop(): void {
    /**
     * Stops the TransportNode (stops the clock).
     *
     * @remark also sends a MIDI message if a port is declared
     */
    this.running = false;
    this.tick = 0;
    this.time_position = { bar: 0, beat: 0, pulse: 0 };
    this.app.api.MidiConnection.sendStopMessage();
    if (this.timerWorker) {
      this.timerWorker.terminate();
      this.timerWorker = null;
    }
  }
}
