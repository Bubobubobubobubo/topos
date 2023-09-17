import { type Editor } from "../main";
import { makeExampleFactory, key_shortcut } from "../Documentation";

export const midi = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# MIDI

You can use Topos to play MIDI thanks to the [WebMIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API). You can currently send notes, control change, program change and so on. You can also send a MIDI Clock to your MIDI devices or favorite DAW. Note that Topos is also capable of playing MIDI using **Ziffers** which provides a better syntax for melodic expression.

**Important note:** for the examples on this page to work properly, you will need to configure your web browser to output **MIDI** on the right port. You will also need to make sure to have a synthesizer ready to receive MIDI data (hardware or software). You can use softwares like [VCVRack](https://vcvrack.com/), [Dexed](https://asb2m10.github.io/dexed/), [Surge](https://surge-synthesizer.github.io/) or [SunVox](https://www.warmplace.ru/soft/sunvox/) to get enough instruments for a lifetime.

## MIDI Configuration

Your web browser is capable of sending and receiving MIDI information through the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API). The support for MIDI on browsers is a bit shaky. Please, take some time to configure and test. To our best knowledge, **Chrome** is currently leading on this feature, followed closely by **Firefox**. The other major web browsers are also starting to support this API. **There are two important functions for configuration:**

- <ic>midi_outputs()</ic>: prints the list of available MIDI devices on the screen. You will have to open the web console using ${key_shortcut(
    "Ctrl+Shift+I"
  )} or sometimes ${key_shortcut(
    "F12"
  )}. You can also open it from the menu of your web browser. **Note:** close the docs to see it printed.


${makeExample(
  "Listing MIDI outputs",
  `
midi_outputs()
`,
  true
)}

- <ic>midi_output(output_name: string)</ic>: enter your desired output to connect to it.

${makeExample(
  "Listing MIDI outputs",
  `
midi_output("MIDI Rocket-Trumpet")
`,
  true
)}

That's it! You are now ready to play with MIDI.

## Notes

The most basic MIDI event is the note. MIDI notes traditionally take three parameters: _note_ (from <ic>0</ic> to <ic>127</ic>), _velocity_ (from <ic>0</ic> to <ic>127</ic>) and _channel_ (from <ic>0</ic> to <ic>15</ic>). MIDI notes are quite important and can be used for a lot of different things. You can use them to trigger a synthesizer, a drum machine, a robot, or anything really!

- <ic>midi(note: number|object)</ic>: send a MIDI Note. This function is quite bizarre. It can be written and used in many different ways. You can pass form one up to three arguments in different forms.
	
${makeExample(
  "MIDI note using one parameter: note",
  `
// Configure your MIDI first! 
// => midi_output("MIDI Bus 1")
rhythm(.5, 5, 8) :: midi(50).out()
`,
  true
)}

${makeExample(
  "MIDI note using three parameters: note, velocity, channel",
  `
// MIDI Note 50, Velocity 50 + LFO, Channel 0
rhythm(.5, 5, 8) :: midi(50, 50 + usine(.5) * 20, 0).out()
`,
  false
)}

${makeExample(
  "MIDI note by passing an object",
  `
// MIDI Note 50, Velocity 50 + LFO, Channel 0
rhythm(.5, 5, 8) :: midi({note: 50, velocity: 50 + usine(.5) * 20, channel: 0}).out()
`,
  false
)}

We can now have some fun and starting playing a small piano piece:

${makeExample(
  "Playing some piano",
  `
bpm(80) // Setting a default BPM
beat(.5) && midi(36 + [0,12].beat()).sustain(0.02).out()
beat(.25) && midi([64, 76].pick()).sustain(0.05).out()
beat(.75) && midi([64, 67, 69].beat()).sustain(0.05).out()
beat(.25) && midi([64, 67, 69].beat() + 24).sustain(0.05).out()
`,
  true
)}

## Control and Program Changes
	
- <ic>control_change({control: number, value: number, channel: number})</ic>: send a MIDI Control Change. This function takes a single object argument to specify the control message (_e.g._ <ic>control_change({control: 1, value: 127, channel: 1})</ic>).
	
${makeExample(
  "Imagine that I am tweaking an hardware synthesizer!",
  `
control_change({control: [24,25].pick(), value: irand(1,120), channel: 1})
control_change({control: [30,35].pick(), value: irand(1,120) / 2, channel: 1})
`,
  true
)}
	
- <ic>program_change(program: number, channel: number)</ic>: send a MIDI Program Change. This function takes two arguments to specify the program and the channel (_e.g._ <ic>program_change(1, 1)</ic>).
	
${makeExample(
  "Crashing old synthesizers: a hobby",
  `
program_change([1,2,3,4,5,6,7,8].pick(), 1)
`,
  true
)}
	
	
## System Exclusive Messages
	
- <ic>sysex(...number[])</ic>: send a MIDI System Exclusive message. This function takes any number of arguments to specify the message (_e.g._ <ic>sysex(0x90, 0x40, 0x7f)</ic>).
	

${makeExample(
  "Nobody can say that we don't support Sysex messages!",
  `
sysex(0x90, 0x40, 0x7f)
`,
  true
)}

## Clock
	
- <ic>midi_clock()</ic>: send a MIDI Clock message. This function is used to synchronize Topos with other MIDI devices or DAWs.
	
${makeExample(
  "Tic, tac, tic, tac...",
  `
beat(.25) && midi_clock() // Sending clock to MIDI device from the global buffer
`,
  true
)}
`;
};
