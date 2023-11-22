export let socket = new WebSocket("ws://localhost:3000");
export interface OSCMessage {
  address: string;
  port: number;
  message: object;
  timetag: number;
}

// @ts-ignore
socket.onopen = function (event) {
  console.log("Connected to WebSocket Server");
  // Send an OSC-like message
  socket.send(
    JSON.stringify({
      address: "/connected",
      args: [1],
    })
  );

  socket.onerror = function (error) {
    console.log("Websocket Error:", error);
  };

  socket.onmessage = function (event) {
    console.log("Received: ", event.data);
  };
};

export function sendToServer(message: OSCMessage) {
  // Check the port in the message and change port if necessary
  if (message.port != parseInt(socket.url.split(":")[2])) {
    socket.close();
    socket = new WebSocket(`ws://localhost:${message.port}`);
  }

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.log("WebSocket is not open. Attempting to reconnect...");
    if (
      socket.readyState === WebSocket.CONNECTING ||
      socket.readyState === WebSocket.OPEN
    ) {
      socket.close();
    }

    // Create a new WebSocket connection
    socket = new WebSocket("ws://localhost:3000");

    // Send the message once the socket is open
    socket.onopen = () => {
      socket.send(JSON.stringify(message));
    };
  }
}
