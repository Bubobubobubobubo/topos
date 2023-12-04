const WebSocket = require("ws");
const osc = require("osc");
var pjson = require('./package.json');


// ========================================================== 
// SERVER SIDE OSC FORWARDING: WebSocket => OSC
// ========================================================== 

// Listening to WebSocket messages
let banner = `
┏┳┓         ┏┓┏┓┏┓
 ┃ ┏┓┏┓┏┓┏  ┃┃┗┓┃ 
 ┻ ┗┛┣┛┗┛┛  ┗┛┗┛┗┛
     ┛            
             ${pjson.version}\n`
const wss = new WebSocket.Server({ port: 3000 });
console.log(banner)
console.log("Listening to: ws://localhost:3000. Open Topos.\n");

// Setting up for message broadcasting
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

wss.on("error", function (error) {
  console.error("> Server error:", error);
})

wss.on("close", function () {
  // Close the websocket server
  wss.close();
  console.log("> Closing websocket server")
});

let udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 3001,
  remoteAddress: "127.0.0.1",
  remotePort: 57120, 
});

udpPort.on("error", function (error) {
  console.error("> UDP Port error:", error);
});

udpPort.on("ready", function () {
  console.log(`> UDP Port opened on port ${udpPort.options.localPort}`);
});

udpPort.open();

function sendOscMessage(message) {
  try {
    console.log("> Sending OSC message:", message);
    udpPort.send(message);
  } catch (error) {
    console.error("> Error sending OSC message:", error);
  }
}