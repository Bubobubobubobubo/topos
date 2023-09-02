import { tryEvaluate } from "./Evaluator";
const zeroPad = (num, places) => String(num).padStart(places, '0')

export class TransportNode extends AudioWorkletNode {

    constructor(context, options, application) {
        super(context, "transport", options);
        this.app = application
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        this.logicalTime = 0;
    }

    /** @type {(this: MessagePort, ev: MessageEvent<any>) => any} */
    handleMessage = (message) => {
        if (message.data && message.data.type === "bang") {
            this.logicalTime = message.data.logicalTime;

            this.app.clock.tick++
            
            const futureTimeStamp = this.app.clock.convertTicksToTimeposition(this.app.clock.tick);
            
            this.app.clock.time_position = futureTimeStamp;
            if (this.app.exampleIsPlaying) {
                tryEvaluate(this.app, this.app.example_buffer);
            } else {
                tryEvaluate(this.app, this.app.global_buffer);
            }
              
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
        this.port.postMessage("stop");
    }

}