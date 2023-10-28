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
        if(this.app.clock.running) {
          if (this.app.settings.send_clock) {
            this.app.api.MidiConnection.sendMidiClock();
          }
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
          this.app.clock.incrementTick();
        } else {
          console.log("STILLLLLLLLLLLLLLLL BANGING!");
        }
      }
    }
  };

  start(sentAt) {
    this.port.postMessage({ type: "start", sentAt: sentAt});
  }

  pause(sentAt) {
    this.port.postMessage({ type: "pause", sentAt: sentAt});
  }

  resume(sentAt) {
    this.port.postMessage({ type: "resume", sentAt: sentAt });
  }

  setBPM(bpm, sentAt) {
    this.port.postMessage({ type: "bpm", value: bpm, sentAt: sentAt });
  }

  setPPQN(ppqn, sentAt) {
    this.port.postMessage({ type: "ppqn", value: ppqn, sentAt: sentAt });
  }

  setNudge(nudge, sentAt) {
    this.port.postMessage({ type: "nudge", value: nudge, sentAt: sentAt });
  }

  stop(sentAt) {
    this.port.postMessage({type: "stop", sentAt: sentAt});
  }
}
