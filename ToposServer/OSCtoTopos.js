const WebSocket = require("ws");
const osc = require("osc");

const cleanIncomingOSC = (oscMsg) => {
    let data = oscMsg.args;
    // Remove information about type of data
    data = data.map((item) => {
        return item.value;
    })
    return {data: data, address: oscMsg.address};
}

// ==============================================
// Receiving and forwarding OSC UDP messages
// Create an osc.js UDP Port listening on port 57121.
console.log("> OSC Input: 127.0.0.1:30000");
const wss = new WebSocket.Server({ port: 3001 });
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 30000,
    metadata: true
});
udpPort.on("message", function (oscMsg, timeTag, info) {
    console.log(`> Incoming OSC to ${oscMsg.address}:`, oscMsg.args.map(
        (item) => {return item.value})
    );
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(cleanIncomingOSC(oscMsg)));
        }
    });
});
udpPort.open();