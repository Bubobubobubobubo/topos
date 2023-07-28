class TransportProcessor extends AudioWorkletProcessor {

    constructor(options) {
        super(options);
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        this.stated = false;
        /*
        this.interval = 0.0001;
        this.origin = currentTime;
        this.next = this.origin + this.interval;
        */
    }
 
    handleMessage = (message) => {
       if (message.data === "start") {
            this.started = true;
            // this.origin = currentTime;
            // this.next = this.origin + this.interval;
        } else if (message.data === "pause") {
            // this.next = Infinity;
            this.started = false;
        } else if (message.data === "stop") {
            // this.origin = currentTime;
            // this.next = Infinity;
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