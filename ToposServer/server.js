const WebSocket = require("ws");
const osc = require("osc");
var pjson = require('./package.json');

let banner = `
┏┳┓         ┏┓┏┓┏┓
 ┃ ┏┓┏┓┏┓┏  ┃┃┗┓┃ 
 ┻ ┗┛┣┛┗┛┛  ┗┛┗┛┗┛
     ┛            
             ${pjson.version}\n`

console.log(banner)
console.log("Listening to: ws://localhost:3000. Open Topos.\n");

// Listening to WebSocket messages
const wss = new WebSocket.Server({ port: 3000 });

// Setting up for message broadcasting
wss.on("connection", function (ws) {
  console.log("> Client connected");
  ws.on("message", function (data) {
    try {
      const message = JSON.parse(data);
      sendOscMessage(formatAndTypeMessage(message));
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

// Setting up for OSC messages

let udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 3000,
  metadata: true,
  remoteAddress: "0.0.0.0",
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
    udpPort.send(message);
    console.log(message)
  } catch (error) {
    console.error("> Error sending OSC message:", error);
  }
}

const formatAndTypeMessage = (message) => {
  let newMessage = {};
  newMessage.address = message.address;
  newMessage.timestamp = osc.timeTag(message.timetag);

  args = [...Object.entries(message.args)].flat().map((arg) => {
    if (typeof arg === 'string') 
      return {type: 's', value: arg};
    if (typeof arg === 'number')
      return {type: 'f', value: arg};
    if (typeof arg === 'boolean')
      return {type: 'f', value: arg ? 1 : 0};
  })

  newMessage.args = args

  return newMessage;
}

console.log(formatAndTypeMessage({ 
  address: '/baba', 
  port: 2000, 
  args: { s: 'fhardkick', dur: 0.5, port: 2000, address: 'baba' }, 
  timetag: 1701696184583
}))
