// @ts-ignore
import { TransportNode } from './TransportNode';
import TransportProcessor from './TransportProcessor?url';
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
    tick: number

    constructor(public app: Editor, ctx: AudioContext) {
        this.tick = 0;
        this.time_position = { bar: 0, beat: 0, pulse: 0 }
        this.bpm = 120;
        this.time_signature = [4, 4];
        this.ppqn = 48;
        this.evaluations = 0;
        ctx.audioWorklet.addModule(TransportProcessor).then((e) => {
            this.transportNode = new TransportNode(ctx, {}, this.app);
            this.transportNode.connect(ctx.destination);
            return e
        })
        .catch((e) => {
            console.log('Error loading TransportProcessor.js:', e);
        })
    }

    get beats_per_bar(): number { return this.time_signature[0]; }

    get pulse_duration(): number {
        return 60 / this.bpm / this.ppqn;
    }

    public convertPulseToSecond(n: number): number {
        return n * this.pulse_duration
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

    pause = (): void => this.transportNode?.pause();
    stop = (): void => this.transportNode?.stop();
}