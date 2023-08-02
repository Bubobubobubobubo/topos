class TransportProcessor extends AudioWorkletProcessor {

    constructor(options) {
        super(options);
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        this.stated = false;
   }
 
    handleMessage = (message) => {
        if (message.data && message.data.type === "ping") {
            this.port.postMessage(message.data);
        } else if (message.data === "start") {
            this.started = true;
       } else if (message.data === "pause") {
            this.started = false;
        } else if (message.data === "stop") {
            this.started = false;
        }
    };

    process(inputs, outputs, parameters) {
        if (this.started) this.port.postMessage({ type: "bang", currentTime });
        return true;
    }
}

registerProcessor(
    "transport", 
    TransportProcessor
);