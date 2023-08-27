class TransportProcessor extends AudioWorkletProcessor {

    constructor(options) {
        super(options);
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        this.started = false;
        this.totalPausedTime = 0;
        this.lastPausedTime = 0;
        this.startedAgainTime = 0;
        this.wasStopped = false;
   }
 
    handleMessage = (message) => {
        if (message.data && message.data.type === "ping") {
            this.port.postMessage(message.data);
        } else if (message.data === "start") {
            this.started = true;
       } else if (message.data === "pause") {
            this.started = false;
            if(this.lastPausedTime === 0) {
                this.lastPausedTime = currentTime;
            }
        } else if (message.data === "stop") {
            this.started = false;
            this.totalPausedTime = 0;
            this.lastPausedTime = 0;
            this.startedAgainTime = 0;
            this.wasStopped = true;
        }
    };

    process(inputs, outputs, parameters) {
        if (this.started) {
            if(this.lastPausedTime>0) {
                const pausedTime = currentTime-this.lastPausedTime;
                this.totalPausedTime += pausedTime;
                this.lastPausedTime = 0;
            }
            if(this.wasStopped) {
                this.startedAgainTime = currentTime;
                this.wasStopped = false;
            }
            const logicalTime = currentTime-this.totalPausedTime-this.startedAgainTime;
            //console.log("Logical/Current:", logicalTime, currentTime);
            this.port.postMessage({ type: "bang", logicalTime });
        }
        return true;
    }
}

registerProcessor(
    "transport", 
    TransportProcessor
);