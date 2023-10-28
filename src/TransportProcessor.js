class TransportProcessor extends AudioWorkletProcessor {

  constructor(options) {
    super(options);
    this.port.addEventListener("message", this.handleMessage);
    this.port.start();
    this.nudge = 0;
    this.started = false;
    this.bpm = 120;
    this.ppqn = 48;
    this.currentPulsePosition = 0;
    this.totalPausedTime = 0;
    this.lastPauseTime = null;

  }

  handleMessage = (message) => {
    if (message.data && message.data.type === "ping") {
      this.port.postMessage(message.data);
    } else if (message.data.type === "start") {
      this.started = true;
      this.lastPlayPressTime = currentTime;
      this.totalPausedTime = 0;

    } else if (message.data.type === "resume") {
      this.started = true;
      if (this.lastPauseTime !== null) {
        this.totalPausedTime += currentTime - this.lastPauseTime;
        this.lastPauseTime = null;
      }
    } else if (message.data.type === "pause") {
      this.started = false;
      this.lastPauseTime = currentTime;
    } else if (message.data.type === "stop") {
      this.started = false;
    } else if (message.data.type === 'bpm') {
      this.bpm = message.data.value;
    } else if (message.data.type === 'ppqn') {
      this.ppqn = message.data.value;
    } else if (message.data.type === 'nudge') {
      this.nudge = message.data.value
    }
    // Log difference between currentTime and message.data.sentAt
     console.log("Message delay: ", currentTime - message.data.sentAt);
  }

  process(inputs, outputs, parameters) {
    if (this.started) {
      const adjustedCurrentTime = currentTime + (this.nudge / 100);
      const beatNumber = adjustedCurrentTime / (60 / this.bpm);
      const currentPulsePosition = Math.ceil(beatNumber * this.ppqn);
      const elapsedTime = (currentTime - this.lastPlayPressTime) - this.totalPausedTime;
      this.port.postMessage({ type: "elapsed", value: elapsedTime })
      if (currentPulsePosition > this.currentPulsePosition) {
        this.currentPulsePosition = currentPulsePosition;
        this.port.postMessage({ type: "bang" });
      }
    }
    return true;
  }
}

registerProcessor(
  "transport",
  TransportProcessor
);
