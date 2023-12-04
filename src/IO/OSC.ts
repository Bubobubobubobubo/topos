export interface OSCMessage {
  address: string;
  port: number;
  args: object;
  timetag: number;
}

// Send/receive messages from websocket
export let outputSocket = new WebSocket("ws://localhost:3000");
export let inputSocket = new WebSocket("ws://localhost:3001");

export let oscMessages : any[] = [];
inputSocket.addEventListener('message', (event) => {
  let data = JSON.parse(event.data);
  if (oscMessages.length >= 1000) {
    oscMessages.shift();
  }
  oscMessages.push(data);
});


// @ts-ignore
outputSocket.onopen = function (event) {
  console.log("Connected to WebSocket Server");
  // Send an OSC-like message
  outputSocket.send(
    JSON.stringify({
      address: "/successful_connexion",
      port: 3000, args: {}
    })
  );

  outputSocket.onerror = function (error) {
    console.log("Websocket Error:", error);
  };

  outputSocket.onmessage = function (event) {
    console.log("Received: ", event.data);
  };
};

export function sendToServer(message: OSCMessage) {
  if (outputSocket.readyState === WebSocket.OPEN) {
    outputSocket.send(JSON.stringify(message));
  } else {
    console.log("WebSocket is not open. Attempting to reconnect...");
    if (
      outputSocket.readyState === WebSocket.CONNECTING ||
      outputSocket.readyState === WebSocket.OPEN
    ) {
      outputSocket.close();
    }

    // Create a new WebSocket connection
    outputSocket = new WebSocket("ws://localhost:3000");

    // Send the message once the socket is open
    outputSocket.onopen = () => {
      outputSocket.send(JSON.stringify(message));
    };
  }
}
