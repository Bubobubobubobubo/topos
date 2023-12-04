const WebSocket = require("ws");
const osc = require("osc");

// Listening to WebSocket messages
const wss = new WebSocket.Server({ port: 3000 });

// Setting up for message broadcasting
wss.on("connection", function (ws) {
  console.log("> Client connected");
  ws.on("message", function (data) {
    try {
      const message = JSON.parse(data);
      sendOscMessage(
        formatAndTypeMessage(message),
        message.address,
        message.port,
      );
      console.log(
        `> Message sent to ${message.address}:${message.port}: ${JSON.stringify(
          message.args,
        )}`,
      );
    } catch (error) {
      console.error("> Error processing message:", error);
    }
  });
});

wss.on("error", function (error) {
  console.error("> Server error:", error);
});

wss.on("close", function () {
  // Close the websocket server
  wss.close();
  console.log("> Closing websocket server");
});

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
  //console.log(`> UDP Receive: ${udpPort.options.localPort}`);
  console.log("> WebSocket server: 127.0.0.1:3000");
});

udpPort.open();

function sendOscMessage(message, address, port) {
  try {
    udpPort.options.remotePort = port;
    message.address = address;
    udpPort.send(message);
  } catch (error) {
    console.error("> Error sending OSC message:", error);
  }
}

const formatAndTypeMessage = (message) => {
  let newMessage = {};
  delete message.args["address"];
  delete message.args["port"];
  newMessage.address = message.address;
  newMessage.timestamp = osc.timeTag(message.timetag);

  args = [...Object.entries(message.args)].flat().map((arg) => {
    if (typeof arg === "string") return { type: "s", value: arg };
    if (typeof arg === "number") return { type: "f", value: arg };
    if (typeof arg === "boolean")
      return value ? { type: "s", value: 1 } : { type: "s", value: 0 };
  });

  newMessage.args = args;

  return newMessage;
};
