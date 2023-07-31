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
        this.hasBeenEvaluated = false;
        this.currentPulse = 0;
    }



    /** @type {(this: MessagePort, ev: MessageEvent<any>) => any} */
    handleMessage = (message) => {
        if (message.data && message.data.type === "bang") {
            let info = this.convertTimeToBarsBeats(message.data.currentTime);
            this.app.clock.time_position = { bar: info.bar, beat: info.beat, pulse: info.ppqn }
            this.$clock.innerHTML = `[${info.bar} | ${info.beat} | ${zeroPad(info.ppqn, '2')}]`

            // Evaluate the global buffer only once per ppqn value
            if (this.currentPulse !== info.ppqn) {
                this.hasBeenEvaluated = false;
            }

            if (!this.hasBeenEvaluated) {
                tryEvaluate( this.app, this.app.global_buffer );
                this.hasBeenEvaluated = true;
                this.currentPulse = info.ppqn;
                this.app.api.midi_clock();
            }
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
      const barNumber = Math.floor(beatNumber / beatsPerBar) + 1;
      const beatWithinBar = Math.floor(beatNumber % beatsPerBar) + 1;

      const ppqnPosition = Math.floor((beatNumber % 1) * this.app.clock.ppqn);
      this.app.clock.tick++
      return { bar: barNumber, beat: beatWithinBar, ppqn: ppqnPosition };
    }
}