import { evaluate, tryEvaluate, evaluateCommand } from "./Evaluator";
const zeroPad = (num, places) => String(num).padStart(places, '0')

export class TransportNode extends AudioWorkletNode {

    constructor(context, options, application) {
        super(context, "transport", options);
        this.app = application
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        /** @type {HTMLSpanElement} */
        this.$clock = document.getElementById("clockviewer");
    }
    /** @type {(this: MessagePort, ev: MessageEvent<any>) => any} */
    handleMessage = (message) => {
        if (message.data === "bang") {
            let info = this.convertTimeToBarsBeats(this.context.currentTime);
            this.app.clock.time_position = { bar: info.bar, beat: info.beat, pulse: info.ppqn }
            this.$clock.innerHTML = `[${info.bar} | ${info.beat} | ${zeroPad(info.ppqn, '2')}]`
            tryEvaluate( this.app, this.app.global_buffer );
        }
    };

    start() {
        this.port.postMessage("start");
    }

    pause() {
        this.port.postMessage("pause");
    }

    convertTimeToBarsBeats(currentTime) {
      const beatDuration = 60 / this.app.clock.bpm;
      const beatNumber = (currentTime) / beatDuration;

      const beatsPerBar = this.app.clock.time_signature[0];
      const barNumber = Math.floor(beatNumber / beatsPerBar) + 1; // Adding 1 to make it 1-indexed
      const beatWithinBar = Math.floor(beatNumber % beatsPerBar) + 1; // Adding 1 to make it 1-indexed

      const ppqnPosition = Math.floor((beatNumber % 1) * this.app.clock.ppqn);
      return { bar: barNumber, beat: beatWithinBar, ppqn: ppqnPosition };
    }
}