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
        this.transportNode = null;
        this.ctx = ctx;
        this.tick = 0;
        this.time_position = { bar: 0, beat: 0, pulse: 0 }
        this.bpm = 120;
        this.time_signature = [4, 4];
        this.ppqn = 48;
        ctx.audioWorklet.addModule(TransportProcessor).then((e) => {
            this.transportNode = new TransportNode(ctx, {}, this.app);
            this.transportNode.connect(ctx.destination);
            return e
        })
        .catch((e) => {
            console.log('Error loading TransportProcessor.js:', e);
        })
    }

    get beats_per_bar(): number { 
        /**
         * Returns the number of beats per bar.
         */
        return this.time_signature[0]; 
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


    start(): void {
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

    pause(): void {
        /**
         * Pauses the TransportNode (pauses the clock).
         */
        this.transportNode?.pause();
    }
    
    stop(): void {
        /**
         * Stops the TransportNode (stops the clock).
         */
        this.transportNode?.stop();
    }
}