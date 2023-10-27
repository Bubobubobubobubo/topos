import { tryEvaluate } from "./Evaluator";
const zeroPad = (num, places) => String(num).padStart(places, "0");

export class TransportNode extends AudioWorkletNode {
  constructor(context, options, application) {
    super(context, "transport", options);
    this.app = application;
    this.port.addEventListener("message", this.handleMessage);
    this.port.start();
    this.timeviewer = document.getElementById("timeviewer");
  }

  /** @type {(this: MessagePort, ev: MessageEvent<any>) => any} */
  handleMessage = (message) => {
    if(message.data) {
      if (message.data.type === "elapsed") {
        this.app.clock.elapsed = message.data.value
      } else if (message.data.type === "bang") {
        if (this.app.settings.send_clock)
          this.app.api.MidiConnection.sendMidiClock();
        this.app.clock.incrementTick();
        const futureTimeStamp = this.app.clock.convertTicksToTimeposition(
          this.app.clock.tick
        );
        this.app.clock.time_position = futureTimeStamp;
        this.timeviewer.innerHTML = `${zeroPad(futureTimeStamp.bar, 2)}:${futureTimeStamp.beat + 1
          }:${zeroPad(futureTimeStamp.pulse, 2)} / ${this.app.clock.bpm}`;
        if (this.app.exampleIsPlaying) {
          tryEvaluate(this.app, this.app.example_buffer);
        } else {
          tryEvaluate(this.app, this.app.global_buffer);
        }
      }
    }
  };

  start() {
    this.port.postMessage("start");
  }

  pause() {
    this.port.postMessage("pause");
  }

  resume() {
    this.port.postMessage("resume");
  }

  setBPM(bpm) {
    this.port.postMessage({ type: "bpm", value: bpm });
  }

  setPPQN(ppqn) {
    this.port.postMessage({ type: "ppqn", value: ppqn });
  }

  setNudge(nudge) {
    this.port.postMessage({ type: "nudge", value: nudge });
  }

  stop() {
    this.port.postMessage("stop");
  }
}
