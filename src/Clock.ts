// @ts-ignore
import { TransportNode } from './TransportNode';
import TransportProcessor from './TransportProcessor?worker&url';
import { Editor } from './main';

export interface TimePosition {
    /**
     *  A position in time.
     * 
     * @param bar - The bar number
     * @param beat - The beat number
     * @param pulse - The pulse number
     */
    bar: number
    beat: number
    pulse: number
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
     */

    ctx: AudioContext
    transportNode: TransportNode | null
    bpm: number
    time_signature: number[]
    time_position: TimePosition
    ppqn: number
    tick: number

    constructor(public app: Editor, ctx: AudioContext) {
        this.time_position = { bar: 0, beat: 0, pulse: 0 }
        this.time_signature = [4, 4];
        this.tick = 0;
        this.bpm = 120;
        this.ppqn = 24;
        this.transportNode = null;
        this.ctx = ctx;
        ctx.audioWorklet.addModule(TransportProcessor).then((e) => {
            this.transportNode = new TransportNode(ctx, {}, this.app);
            this.transportNode.connect(ctx.destination);
            return e
        })
        .catch((e) => {
            console.log('Error loading TransportProcessor.js:', e);
        })
    }

    get ticks_before_new_bar(): number {
        /**
         * This function returns the number of ticks sepaating the current moment
         * from the beginning of the next bar. 
         * 
         * @returns number of ticks until next bar
         */
        const currentBeatInTicks = ((this.app.clock.beats_since_origin - 1) * 48) + this.time_position.pulse + 1
        const nextBarinTicks =  (this.beats_per_bar * this.ppqn) * this.time_position.bar + 1
        return nextBarinTicks - currentBeatInTicks
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
        return (this.time_position.bar - 1) * this.beats_per_bar + this.time_position.beat;
    }

    get pulses_since_origin(): number {
        /**
         * Returns the number of pulses since the origin.
         * 
         * @returns number of pulses since origin
         */
        return (this.beats_since_origin * this.ppqn) + this.time_position.pulse

    }

    get pulse_duration(): number {
        /**
         * Returns the duration of a pulse in seconds.
         */
        return 60 / this.bpm / this.ppqn;
    }

    public convertPulseToSecond(n: number): number {
        /**
         * Converts a pulse to a second.
         */
        return n * this.pulse_duration
    }


    public start(): void {
        /**
         * Starts the TransportNode (starts the clock).
         */
        // @ts-ignore
        if (this.transportNode?.state === 'running') {
            console.log('Already started')
        } else {
            this.app.audioContext.resume()
            this.transportNode?.start();
        }
    }

    public pause(): void {
        /**
         * Pauses the TransportNode (pauses the clock).
         */
        this.transportNode?.pause();
    }
    
    public stop(): void {
        /**
         * Stops the TransportNode (stops the clock).
         */
        this.transportNode?.stop();
    }
}