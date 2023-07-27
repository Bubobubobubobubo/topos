import { evaluate, tryEvaluate, evaluateCommand } from "./Evaluator";

export class TransportNode extends AudioWorkletNode {

    constructor(context, options, application) {
        super(context, "transport", options);
        this.app = application
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        /** @type {HTMLSpanElement} */
        this.$clock = document.getElementById("clockviewer");
        this.offset_time = 0;
    }
    /** @type {(this: MessagePort, ev: MessageEvent<any>) => any} */
    handleMessage = (message) => {
        if (message.data === "bang") {
            let info = this.convertTimeToBarsBeats(this.context.currentTime);
            this.$clock.innerHTML = `${info.bar} / ${info.beat} / ${info.ppqn}`
            this.app.clock.time_position = { bar: info.bar, beat: info.beat, pulse: info.ppqn }
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
      // Calculate the duration of one beat in seconds
      const beatDuration = 60 / this.app.clock.bpm;

      // Calculate the beat number
      const beatNumber = (currentTime - this.offset_time) / beatDuration;

      // Calculate the bar and beat numbers
      const beatsPerBar = this.app.clock.time_signature[0];
      const barNumber = Math.floor(beatNumber / beatsPerBar) + 1; // Adding 1 to make it 1-indexed
      const beatWithinBar = Math.floor(beatNumber % beatsPerBar) + 1; // Adding 1 to make it 1-indexed

      // Calculate the PPQN position
      const ppqnPosition = Math.floor((beatNumber % 1) * this.app.clock.ppqn);
      return { bar: barNumber, beat: beatWithinBar, ppqn: ppqnPosition };
}

}