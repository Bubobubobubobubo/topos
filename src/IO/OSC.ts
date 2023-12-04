export let socket = new WebSocket("ws://localhost:3000");
export interface OSCMessage {
  address: string;
  port: number;
  args: object;
  timetag: number;
}

// @ts-ignore
socket.onopen = function (event) {
  console.log("Connected to WebSocket Server");
  // Send an OSC-like message
  socket.send(
    JSON.stringify({
      address: "/successful_connexion",
      args: true,
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
