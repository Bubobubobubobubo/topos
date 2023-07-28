// @ts-ignore
import { TransportNode } from './TransportNode';

import { Editor } from './main';

export interface TimePosition {
    bar: number
    beat: number
    pulse: number
}

export class Clock {

    evaluations: number
    transportNode: TransportNode
    bpm: number
    time_signature: number[]
    time_position: TimePosition
    ppqn: number

    constructor(public app: Editor, ctx: AudioContext) {
        this.time_position = { bar: 0, beat: 0, pulse: 0 }
        this.bpm = 120;
        this.time_signature = [4, 4];
        this.ppqn = 48;
        this.evaluations = 0;
        ctx.audioWorklet.addModule('src/TransportProcessor.js').then((e) => {
            this.transportNode = new TransportNode(ctx, {}, this.app);
            this.transportNode.connect(ctx.destination);
            return e
        })
        .catch((e) => {
            console.log('Error loading TransportProcessor.js:', e);
        })
    }

    get pulses_per_beat(): number {
        return this.ppqn / this.time_signature[1];
    }

    start(): void {
        // Check if the clock is already running
        if (this.transportNode?.state === 'running') {
            console.log('Already started')
        } else {
            this.app.audioContext.resume()
            this.transportNode?.start();
        }
    }

    pause(): void {
        this.transportNode?.pause();
    }

    stop(): void {
        this.transportNode?.stop();
    }

    // Public methods
    public toString(): string { return `` }
}