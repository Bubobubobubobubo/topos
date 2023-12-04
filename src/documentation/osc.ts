import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const osc = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `
# Open Sound Control

Topos is a sandboxed web application. It cannot speak with your computer directly or only through a secure connexion. You can use the [Open Sound Control](https://en.wikipedia.org/wiki/Open_Sound_Control) protocol to send and receive data from your computer. This protocol is used by many softwares and hardware devices. You can use it to control your favorite DAW, your favorite synthesizer, your favorite robot, or anything really! To use **OSC** with Topos, you will need to download the <ic>ToposServer</ic> by [following this link](https://github.com/Bubobubobubobubo/Topos). You can download everything as a zip file or clone the project if you know what you are doing. Here is a quick guide to get you started:

- 1) Download <ic>Topos</ic> and navigate to the <ic>ToposServer</ic> folder.
- 2) Install the dependencies using <ic>npm install</ic>. Start the server using <ic>npm start</ic>.
- 3) Open the <ic>Topos</ic> application in your web browser (server first, then application).

The <ic>ToposServer</ic> server is used both for **OSC** _input_ and _output_.

## Input

Send an **OSC** message to the server from another application or device at the address <ic>localhost:30000</ic>. Topos will store the last 1000 messages in a queue. You can access this queue using the <ic>getOsc()</ic> function.

### Unfiltered messages

You can access the last 1000 messages using the <ic>getOsc()</ic> function without any argument. This is raw data, you will need to parse it yourself:

${makeExample(
    "Reading the last OSC messages",
    `
beat(1)::getOsc()
// 0 : {data: Array(2), address: '/lala'}
// 1 : {data: Array(2), address: '/lala'}
// 2 : {data: Array(2), address: '/lala'}`,
 true)}

### Filtered messages

The <ic>getOsc()</ic> can receive an address filter as an argument. This will return only the messages that match the filter:

${
    makeExample(
        "Reading the last OSC messages (filtered)",
         `
beat(1)::getOsc("/lala")
// 0 : (2) [89, 'bob']
// 1 : (2) [84, 'bob']
// 2 : (2) [82, 'bob']
         `, true)}

## Output

Once the server is loaded, you are ready to send an **OSC** message:

${makeExample(
    "Sending a simple OSC message",
    `
beat(1)::sound('cp').speed(2).vel(0.5).osc()
    `, true
)}

This is a simple **OSC** message that will inherit all the properties of the sound. You can also send customized OSC messages using the <ic>osc()</ic> function:

${makeExample(
    "Sending a customized OSC message",
    `
// osc(address, port, ...message)
osc('/my/osc/address', 5000, 1, 2, 3)
    `, true)}

`};