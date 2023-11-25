// @ts-ignore
import { Editor } from "./main";
import { tryEvaluate } from "./Evaluator";
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
   * @param _nudge - The current nudge value
   */
  lastPulseAt: number;
  afterEvaluation: number;
  private _bpm: number;
  time_signature: number[];
  time_position: TimePosition;
  private _ppqn: number;
  tick: number;
  running: boolean;
  private timerWorker: Worker | null = null;
  _nudge: number;

  timeviewer: HTMLElement;

  constructor(public app: Editor) {
    this.timeviewer = document.getElementById("timeviewer")!;
    this.time_position = { bar: 0, beat: 0, pulse: 0 };
    this.time_signature = [4, 4];
    this.lastPulseAt = 0;
    this.afterEvaluation = 0;
    this.tick = 0;
    this._bpm = 120;
    this._ppqn = 48;
    this._nudge = 0;
    this.running = false;
  }

  private initializeWorker(): void {
    /**
     * Initializes the worker responsible for sending clock pulses. The worker
     * is responsible for sending clock pulses at a regular interval. The
     * interval is set by the `setWorkerInterval` function. The worker is
     * restarted when the BPM is changed. The worker is terminated when the
     * clock is stopped.
     *
     * @returns void
     */
    const workerScript =
      "onmessage = (e) => { setInterval(() => { postMessage(true) }, e.data)}";
    const blob = new Blob([workerScript], { type: "text/javascript" });
    this.timerWorker = new Worker(URL.createObjectURL(blob));
    this.timerWorker.onmessage = () => {
      this.run();
    };
  }

  private setWorkerInterval(): void {
    /**
     * Sets the interval for the worker responsible for sending clock pulses.
     * The interval is set by calculating the duration of one pulse. The
     * duration of one pulse is calculated by dividing the duration of one beat
     * by the number of pulses per quarter note.
     *
     * @remark The BPM is off constantly by 3~5 BPM.
     * @returns void
     */
    const beatDurationMs = 60000 / this._bpm;
    const pulseDurationMs = beatDurationMs / this._ppqn;
    this.timerWorker?.postMessage(pulseDurationMs);
  }

  private run = () => {
    /**
     * This function is called by the worker responsible for sending clock
     * pulses. It is called at a regular interval. The interval is set by the
     * `setWorkerInterval` function. This function is responsible for updating
     * the time position and sending MIDI clock messages. It is also responsible
     * for evaluating the global buffer. The global buffer is evaluated at the
     * beginning of each pulse.
     *
     * @returns void
     */
    if (this.running) {
        this.lastPulseAt = performance.now();
        const futureTimeStamp = this.convertTicksToTimeposition(this.tick);
        this.time_position = futureTimeStamp;
        if (this.app.settings.send_clock) {
            this.app.api.MidiConnection.sendMidiClock();
        }
        if (futureTimeStamp.pulse % this.app.clock.ppqn == 0) {
          this.timeviewer.innerHTML = `${zeroPad(futureTimeStamp.bar, 2)}:${
            futureTimeStamp.beat + 1
          } / ${this.bpm}`;
        }
        if (this.app.exampleIsPlaying) {
          tryEvaluate(this.app, this.app.example_buffer);
        } else {
          tryEvaluate(this.app, this.app.global_buffer);
        }
        this.afterEvaluation = performance.now();
        console.log("DEVIATION", this.deviation);
        this.tick++;
    }
  };

  convertTicksToTimeposition(ticks: number): TimePosition {
    /**
     * This function converts a number of ticks to a time position.
     * @param ticks - number of ticks
     * @returns time position
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
     *
     * @returns number of beats per bar
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
     *
     * @returns duration of a pulse in seconds
     */
    return 60 / this._bpm / this.ppqn;
  }

  public pulse_duration_at_bpm(bpm: number = this.bpm): number {
    /**
     * Returns the duration of a pulse in seconds at a specific bpm.
     *
     * @param bpm - beats per minute
     * @returns duration of a pulse in seconds
     */
    return 60 / bpm / this.ppqn;
  }

  get bpm(): number {
    /**
     * Returns the current BPM.
     *
     * @returns current BPM
     */
    return this._bpm;
  }

  set nudge(nudge: number) {
    /**
     * Sets the nudge.
     *
     * @param nudge - nudge in seconds
     * @returns void
     */
    this._nudge = nudge;
  }

  get nudge(): number {
    /**
     * Returns the current nudge.
     *
     * @returns current nudge
     */
    return this._nudge;
  }

  set bpm(bpm: number) {
    /**
     * Sets the BPM.
     *
     * @param bpm - beats per minute
     * @returns void
     */
    if (bpm > 0 && this._bpm !== bpm) {
      this._bpm = bpm;

      // Restart the worker with the new BPM if the clock is running
      if (this.running) {
        this.restartWorker();
      }
    }
  }

  private restartWorker(): void {
    /**
     * Restarts the worker responsible for sending clock pulses.
     *
     * @returns void
     */
    if (this.timerWorker) {
      this.timerWorker.terminate();
    }
    this.initializeWorker();
    this.setWorkerInterval();
  }

  get ppqn(): number {
    /**
     * Returns the current PPQN.
     *
     * @returns current PPQN
     */
    return this._ppqn;
  }

  get realTime(): number {
    /**
     * Returns the current time of the audio context.
     *
     * @returns current time of the audio context
     * @remark This is the time of the audio context, not the time of the clock.
     */
    return this.lastPulseAt;
  }

  get deviation(): number {
    /**
     * Returns the deviation between the logical time and the real time.
     *
     * @returns deviation between the logical time and the real time
     */
    if(this.afterEvaluation<this.lastPulseAt) return 0;
    return (this.afterEvaluation - this.lastPulseAt) / 1000;
  }

  set ppqn(ppqn: number) {
    /**
     * Sets the PPQN.
     *
     * @param ppqn - pulses per quarter note
     * @returns void
     */
    if (ppqn > 0 && this._ppqn !== ppqn) {
      this._ppqn = ppqn;
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
     * Converts a number of pulses to a number of seconds.
     *
     * @param n - number of pulses
     * @returns number of seconds
     */
    return n * this.pulse_duration;
  }

  public start(): void {
    /**
     * This function starts the worker.
     *
     * @remark also sends a MIDI message if a port is declared
     * @returns void
     */
    if (this.running) {
      return;
    }

    this.running = true;
    this.app.api.MidiConnection.sendStartMessage();
    this.lastPulseAt = 0;
    this.afterEvaluation = 0;

    if (!this.timerWorker) {
      this.initializeWorker();
    }
    this.setWorkerInterval();

  }

  public pause(): void {
    /**
     * Pauses the Transport worker.
     *
     * @remark also sends a MIDI message if a port is declared
     * @returns void
     */
    this.running = false;
    this.app.api.MidiConnection.sendStopMessage();
    if (this.timerWorker) {
      this.timerWorker.terminate();
      this.timerWorker = null;
    }
  }

  public stop(): void {
    /**
     * Stops the Transport worker and resets the tick to 0. The time position
     * is also reset to 0. The clock is stopped by terminating the worker
     * responsible for sending clock pulses.
     *
     * @remark also sends a MIDI message if a port is declared
     * @returns void
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
