import { tryEvaluate } from "./Evaluator";
const zeroPad = (num, places) => String(num).padStart(places, '0')

export class TransportNode extends AudioWorkletNode {

    constructor(context, options, application) {
        super(context, "transport", options);
        this.app = application
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        /** @type {HTMLSpanElement} */
        this.$clock = document.getElementById("clockviewer");
        this.currentPulsePosition = 0;
        this.executionLatency = 0;
        this.lastLatencies = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        this.indexOfLastLatencies = 0;
        this.logicalTime = 0;
    }

    /** @type {(this: MessagePort, ev: MessageEvent<any>) => any} */
    handleMessage = (message) => {
        if (message.data && message.data.type === "bang") {
            this.logicalTime = message.data.logicalTime;
            this.app.clock.tick++
            let futureTimeStamp = this.convertTicksToTimeposition(this.app.clock.tick);
            console.log("BANG", this.logicalTime, futureTimeStamp);
            
            setTimeout(() => {
                console.log("EVALUATING");
                const now = this.app.audioContext.currentTime;
                this.app.clock.time_position = futureTimeStamp;
                tryEvaluate(this.app, this.app.global_buffer);
                const then = this.app.audioContext.currentTime;
                this.lastLatencies[this.indexOfLastLatencies] = then - now;
                this.indexOfLastLatencies = (this.indexOfLastLatencies + 1) % this.lastLatencies.length;
                const averageLatency = this.lastLatencies.reduce((a, b) => a + b) / this.lastLatencies.length;
                this.executionLatency = averageLatency / 1000;
            }, (this.app.clock.pulse_duration + this.executionLatency) * 1000);    
            
        }
    };

    start() {
        this.port.postMessage("start");
    }

    pause() {
        this.port.postMessage("pause");
    }

    setBPM(bpm) {
        this.port.postMessage({ type: "bpm", value: bpm });
    }

    setPPQN(ppqn) {
        this.port.postMessage({ type: "ppqn", value: ppqn });
    }

    stop() {
        this.app.clock.tick = 0;
        // this.$clock.innerHTML = `[${1} | ${1} | ${zeroPad(1, '2')}]`;
        this.port.postMessage("stop");
    }

    convertTimeToBarsBeats(currentTime) {
      const beatDuration = 60 / this.app.clock.bpm;
      const beatNumber = (currentTime) / beatDuration;

      const beatsPerBar = this.app.clock.time_signature[0];
      const barNumber = Math.floor(beatNumber / beatsPerBar) + 1;
      const beatWithinBar = Math.floor(beatNumber % beatsPerBar) + 1;

      const ppqnPosition = Math.floor((beatNumber % 1) * this.app.clock.ppqn);
      this.app.clock.tick++
      return { bar: barNumber, beat: beatWithinBar, ppqn: ppqnPosition };
    }

    convertTimeToNextBarsBeats(currentTime) {

      const beatDuration = 60 / this.app.clock.bpm;
      const beatNumber = (currentTime) / beatDuration;
      const beatsPerBar = this.app.clock.time_signature[0];

      this.currentPulsePosition = beatNumber * this.app.clock.ppqn;
      const nextPulsePosition = Math.ceil(this.currentPulsePosition);
      const timeToNextPulse = this.app.clock.convertPulseToSecond(this.nextPulsePosition - this.currentPulsePosition);

      const futureBeatNumber = this.nextPulsePosition / this.app.clock.ppqn;
      const futureBarNumber = futureBeatNumber / beatsPerBar;

    }

    convertTicksToTimeposition(ticks) {
        const beatsPerBar = this.app.clock.time_signature[0];
        const ppqnPosition = (ticks % this.app.clock.ppqn)+1;
        const beatNumber = Math.floor(ticks / this.app.clock.ppqn);
        const barNumber = Math.floor(beatNumber / beatsPerBar)+1;
        const beatWithinBar = Math.floor(beatNumber % beatsPerBar)+1;
        return {bar: barNumber, beat: beatWithinBar, ppqn: ppqnPosition};
    }

}