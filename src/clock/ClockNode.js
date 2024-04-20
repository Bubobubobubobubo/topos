import { tryEvaluate } from "../Evaluator";

export class ClockNode extends AudioWorkletNode {

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
    if (message.data.type === "time") {
      clock.time_position = {
        bpm: message.data.bpm,
        ppqn: message.data.ppqn,
        time: message.data.time,
        tick: message.data.tick,
        beat: message.data.beat,
        bar: message.data.bar,
        num: message.data.num,
        den: message.data.den,
        grain: message.data.grain,
        tick_duration: message.data.tick_duration,
      }
      this.app.settings.send_clock ?? this.app.api.MidiConnection.sendMidiClock();
      this.updateTransportViewer();
     tryEvaluate(
        this.app,
        this.app.exampleIsPlaying
          ? this.app.example_buffer
          : this.app.global_buffer
      );
    } 
};
updateTransportViewer() {
  const { bar, beat, tick } = this.app.clock.time_position;
  const paddedBar = String(bar).padStart(2, '0');
  const paddedBeat = String(beat).padStart(2, '0');
  const paddedTick = String(tick).padStart(2, '0');
  requestAnimationFrame(() => {
    this.app.interface.transport_viewer.innerHTML = `<span class="text-xl text-neutral">${paddedBar}:${paddedBeat}:${paddedTick}</span>`;
  });
}
 
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

  setSignature(num, den) {
    this.port.postMessage({ type: "timeSignature", num: num, den: den });
  }

  setNudge(nudge) {
    this.port.postMessage({ type: "nudge", value: nudge });
  }

  stop() {
    this.port.postMessage({ type: "stop" });
  }
}
