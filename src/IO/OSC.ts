export let socket = new WebSocket('ws://localhost:3000')
export interface OSCMessage {
  address: string
  message: object
  timetag: number
}

// @ts-ignore
socket.onopen = function(event) {
  console.log("Connected to WebSocket Server")
  // Send an OSC-like message
  socket.send(JSON.stringify({
    address: '/test',
    args: [1, 2, 3]
  }))

  socket.onerror = function(error) {
    console.log("Websocket Error:", error);
  }

  socket.onmessage = function(event) {
    console.log("Received: ", event.data)
  }
}


// export function sendToServer(message: OSCMessage) {
//   socket.send(JSON.stringify(message));
// }


export function sendToServer(message: OSCMessage) {
  // Check if the WebSocket is open
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    // Reconnect if the WebSocket is not open
    console.log('WebSocket is not open. Attempting to reconnect...');
    // Close the existing socket if necessary
    if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

    // Create a new WebSocket connection
    socket = new WebSocket('ws://localhost:3000');

    // Send the message once the socket is open
    socket.onopen = () => {
      socket.send(JSON.stringify(message));
    };
  }
}
