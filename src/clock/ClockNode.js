import { tryEvaluate } from "../Evaluator";

export class TransportNode extends AudioWorkletNode {

  constructor(context, options, application) {
    super(context, "transport", options);
    this.port.addEventListener("message", this.handleMessage);
    this.port.start();
    this.app = application;
    this.domUpdateFrequency = this.app.clock.ppqn;
  }

  /** @type {(this: MessagePort, ev: MessageEvent<any>) => any} */
  handleMessage = (message) => {
    let clock = this.app.clock;
    const startTime = performance.now();
  
  
    if (message.data.type === "time") {
     console.log(message.data)
     clock.time_position = {
        tick: message.data.tick,
        beat: message.data.beat,
        bar: message.data.bar,
        time: message.data.time,
     }
    } 

  
    if (message.data.type === "bang") {
      if (this.app.clock.running) {
        clock.time_position = clock.convertTicksToTimeposition(clock.tick);
        this.app.settings.send_clock ?? this.app.api.MidiConnection.sendMidiClock();
      
        tryEvaluate(
          this.app,
          this.app.exampleIsPlaying
            ? this.app.example_buffer
            : this.app.global_buffer
        );
      
        clock.incrementTick(message.data.bpm);
      }
    }

  const endTime = performance.now();
  const executionTime = endTime - startTime;
  console.log(`Execution time: ${executionTime}ms`);
};

  start() {
    this.port.postMessage({ type: "start" });
  }

  pause() {
    this.port.postMessage({ type: "pause" });
  }

  resume() {
    this.port.postMessage({ type: "resume" });
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
    this.port.postMessage({ type: "stop" });
  }
}
