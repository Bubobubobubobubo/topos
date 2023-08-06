import { tryEvaluate } from "./Evaluator";
import { Editor } from './main';
const zeroPad = (num: number, places: any) => String(num).padStart(places, '0')

export class TransportNode extends AudioWorkletNode {

    app: Editor
    $clock: HTMLSpanElement|null
    hasBeenEvaluated: boolean
    currentPulsePosition: number
    nextPulsePosition: number
    executionLatency: number
    lastLatencies: number[]
    indexOfLastLatencies: number
    startTime: number|undefined
    elapsedTime: number|undefined
    prevCurrentTime: number

    constructor(context: BaseAudioContext, options: AudioWorkletNodeOptions, application: Editor) {
        super(context, "transport", options);
        this.app = application
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        /** @type {HTMLSpanElement} */
        this.$clock = document.getElementById("clockviewer");
        this.hasBeenEvaluated = false;
        this.currentPulsePosition = 0;
        this.nextPulsePosition = -1;
        this.executionLatency = 0;
        this.lastLatencies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.indexOfLastLatencies = 0;
        // setInterval(() => this.ping(), 1000);
        this.startTime = undefined;
        this.elapsedTime = 0;
        this.prevCurrentTime = 0;
    }

    // ping() {
    //     this.port.postMessage({ type: "ping", t: performance.now() })
    // }

    /** @type {(this: MessagePort, ev: MessageEvent<any>) => any} */
    handleMessage = (message: MessageEvent) => {
        if (message.data && message.data.type === "bang") {
            if (this.startTime === undefined) {
                this.startTime = message.data.currentTime;
            }
            this.elapsedTime = message.data.currentTime - this.startTime!;
            this.prevCurrentTime = message.data.currentTime;
            let { futureTimeStamp, timeToNextPulse, nextPulsePosition } = this.convertTimeToNextBarsBeats(this.elapsedTime);

            // Evaluate the global buffer only once per ppqn value
            if (this.nextPulsePosition !== nextPulsePosition) {
                this.nextPulsePosition = nextPulsePosition;
                setTimeout(() => {
                    const now = performance.now();
                    this.app.clock.time_position = futureTimeStamp;
                    this.$clock!.innerHTML = `[${futureTimeStamp.bar} | ${futureTimeStamp.beat} | ${zeroPad(futureTimeStamp.pulse, '2')}]`;
                    tryEvaluate( 
                        this.app, 
                        this.app.global_buffer,
                    );
                    this.hasBeenEvaluated = true;
                    this.currentPulsePosition = nextPulsePosition;
                    const then = performance.now();
                    this.lastLatencies[this.indexOfLastLatencies] = then - now;
                    this.indexOfLastLatencies = (this.indexOfLastLatencies + 1) % this.lastLatencies.length;
                    const averageLatency = this.lastLatencies.reduce((a, b) => a + b) / this.lastLatencies.length;
                    this.executionLatency = averageLatency / 1000;
                }, (timeToNextPulse + this.executionLatency) * 1000);    
            }
        }
    };

    start() {
        this.port.postMessage("start");
    }

    pause() {
        this.port.postMessage("pause");
    }

    stop() {
        this.startTime = undefined;
        this.elapsedTime = undefined;
        this.app.clock.tick = 0;
        this.$clock!.innerHTML = `[${1} | ${1} | ${zeroPad(1, '2')}]`;
        this.port.postMessage("stop");
    }

    convertTimeToBarsBeats(currentTime: number) {
      const beatDuration = 60 / this.app.clock.bpm;
      const beatNumber = (currentTime) / beatDuration;

      const beatsPerBar = this.app.clock.time_signature[0];
      const barNumber = Math.floor(beatNumber / beatsPerBar) + 1;
      const beatWithinBar = Math.floor(beatNumber % beatsPerBar) + 1;

      const ppqnPosition = Math.floor((beatNumber % 1) * this.app.clock.ppqn);
      this.app.clock.tick++
      return { bar: barNumber, beat: beatWithinBar, ppqn: ppqnPosition };
    }

    convertTimeToNextBarsBeats(currentTime: number) {

      const beatDuration = 60 / this.app.clock.bpm;
      const beatNumber = (currentTime) / beatDuration;
      const beatsPerBar = this.app.clock.time_signature[0];

      this.currentPulsePosition = beatNumber * this.app.clock.ppqn;
      const nextPulsePosition = Math.ceil(this.currentPulsePosition);
      const timeToNextPulse = this.app.clock.convertPulseToSecond(this.nextPulsePosition - this.currentPulsePosition);

      const futureBeatNumber = this.nextPulsePosition / this.app.clock.ppqn;
      const futureBarNumber = futureBeatNumber / beatsPerBar;
      const futureTimeStamp = {
        bar: Math.floor(futureBarNumber) + 1,
        beat: Math.floor(futureBeatNumber) % beatsPerBar + 1,
        pulse: Math.floor(this.nextPulsePosition) % this.app.clock.ppqn
      };

      this.app.clock.tick++
      return {
        futureTimeStamp,
        timeToNextPulse,
        nextPulsePosition
      };
    }
}