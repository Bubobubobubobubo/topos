const WebSocket = require("ws");
const osc = require("osc");

const wss = new WebSocket.Server({ port: 3000 });
console.log("WebSocket server started on ws://localhost:3000");

wss.on("connection", function (ws) {
  console.log("> Client connected");

  ws.on("message", function (data) {
    try {
      const message = JSON.parse(data);
      sendOscMessage(message);
    } catch (error) {
      console.error("> Error processing message:", error);
    }
  });
});

function sendOscMessage(message) {
  const udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 3000,
    remoteAddress: "127.0.0.1",
    remotePort: message.port,
  });

  udpPort.on("ready", function () {
    console.log("> OSC Message:", message);
    udpPort.send(message);
    udpPort.close();
  });

  udpPort.open();
}
