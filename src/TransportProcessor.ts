class TransportProcessor extends AudioWorkletProcessor {

    started: boolean;

    constructor(options: AudioWorkletNodeOptions) {
        super();
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        this.started = false;
   }
 
    handleMessage = (message: MessageEvent) => {
        if (message.data && message.data.type === "ping") {
            this.port.postMessage(message.data);
        } else if (message.data === "start") {
            this.started = true;
       } else if (message.data === "pause") {
            this.started = false;
        } else if (message.data === "stop") {
            this.started = false;
            currentTime = 0; // This is read-only?
        }
    };

    process() {
        if (this.started) this.port.postMessage({ type: "bang", currentTime });
        return true;
    }
}

registerProcessor(
    "transport", 
    TransportProcessor
);