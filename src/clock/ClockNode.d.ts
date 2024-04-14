export class TransportNode {
  constructor(context: AudioContext, something, app: Editor);

  /**
   * Starts the clock.
   */
  start(): void;

  /**
   * Stops the clock.
   */
  stop(): void;

  connect(destionation: AudioNode);

  setNudge(nudge: number): void;

  setPPQN(ppq: number): void;

  setBPM(bpm: number): void;

  pause(): void;


  /**
   * Resets the clock to its initial state.
   */
  reset(): void;

  /**
   * Sets the interval at which the clock updates.
   * @param interval The interval in milliseconds.
   */
  setInterval(interval: number): void;

  /**
   * Gets the current time of the clock.
   * @returns The current time as a number.
   */
  getTime(): number;
}

export interface ClockNodeConfig {
  /**
   * The initial time for the clock.
   */
  startTime?: number;

  /**
   * The interval in milliseconds at which the clock should update.
   */
  updateInterval?: number;
}
