import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const osc = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `
# Open Sound Control

Topos is a sandboxed web application. It cannot speak with your computer directly, or only through secure connexions. You can use the [Open Sound Control](https://en.wikipedia.org/wiki/Open_Sound_Control) protocol to send and receive data from your computer. This protocol is used by many softwares and hardware devices. You can use it to control your favorite DAW, your favorite synthesizer, your favorite robot, or anything really!

To use **OSC** with Topos, you will need to download the <ic>ToposServer</ic> by [following this link](https://github.com/Bubobubobubobubo/Topos). You can download everything as a zip file or clone the project if you know what you are doing. Here is a quick guide to get you started:

- 1) Download <ic>Topos</ic> and navigate to the <ic>ToposServer</ic> folder.
- 2) Install the dependencies using <ic>npm install</ic>.
- 3) Start the server using <ic>npm start</ic>.
- 4) Open the <ic>Topos</ic> application in your web browser.


## Input

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