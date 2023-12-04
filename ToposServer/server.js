const WebSocket = require("ws");
const osc = require("osc");

require("./banner").greet();
// Topos to OSC
require("./ToposToOSC");
// OSC to Topos
require("./OSCtoTopos");
