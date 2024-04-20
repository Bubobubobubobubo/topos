class TransportProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this.port.addEventListener("message", this.handleMessage);
    this.bpm = 120;
    this.nudge = 0;
    this.started = false;
    this.ppqn = 48 * 2;
    this.timeSignature = [4, 4];
    this.port.start();
    this.currentPulsePosition = 0;
    this.startTime = 0;
    this.pauseTime = 0;
    this.grain = 0;
    this.totalPauseTime = 0;
  }

  handleMessage = (message) => {
    if (message.data && message.data.type === "ping") {
      this.port.postMessage(message.data);
    } else if (message.data.type === "start") {
      this.started = true;
      if (this.pauseTime) {
        this.totalPauseTime += currentTime - this.pauseTime;
        this.pauseTime = null;
      } else {
        this.startTime = currentTime
      }
    } else if (message.data.type === "pause") {
      this.started = false;
      this.pauseTime = currentTime;
    } else if (message.data.type === "stop") {
      this.started = false;
      this.startTime = 0;
      this.pauseTime = 0;
      this.totalPauseTime = 0;
      this.currentPulsePosition = 0;
    } else if (message.data.type === "bpm") {
      this.bpm = message.data.value;
      this.startTime = currentTime;
      this.currentPulsePosition = 0;
    } else if (message.data.type === "ppqn") {
      this.ppqn = message.data.value;
      this.startTime = currentTime;
      this.currentPulsePosition = 0;
    } else if (message.data.type === "timeSignature") {
      this.timeSignature = [
        message.data.num,
        message.data.den
      ]
    } else if (message.data.type === "nudge") {
      this.nudge = message.data.value;
    } else if (message.data.type === "timeSignature") {
      this.timeSignature = message.data.value;
    }
  };

  process() {
    if (this.started) {
      const adjustedCurrentTime = (currentTime - this.startTime) + this.nudge / 100;
      const beatNumber = adjustedCurrentTime / (60 / this.bpm);
      const currentPulsePosition = Math.round(beatNumber * this.ppqn);

      if (currentPulsePosition > this.currentPulsePosition) {
        this.grain += 1;
        this.currentPulsePosition = currentPulsePosition;

        // Calculate current tick, beat, and bar
        const ticksPerBeat = this.ppqn;
        const beatsPerBar = this.timeSignature[0];
        const ticksPerBar = ticksPerBeat * beatsPerBar;

        const currentTick = this.currentPulsePosition % ticksPerBeat;
        const currentBeat = Math.floor(this.currentPulsePosition / ticksPerBeat) % beatsPerBar;
        const currentBar = Math.floor(this.currentPulsePosition / ticksPerBar);

        this.port.postMessage({
          bpm: this.bpm,
          ppqn: this.ppqn,
          type: 'time',
          time: currentTime,
          tick: currentTick,
          beat: currentBeat,
          bar: currentBar,
          bpm: this.bpm,
          num: this.timeSignature[0],
          den: this.timeSignature[1],
          grain: this.grain,
        });
      }
    }

    return true;
  }
}

registerProcessor("transport", TransportProcessor);