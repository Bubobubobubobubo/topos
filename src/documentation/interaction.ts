import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

// @ts-ignore
export const interaction = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Interaction

Topos can interact with the physical world or react to events coming from outside the system (_MIDI_, physical control, etc).

## Midi input

Topos can use MIDI input to estimate the bpm from incoming clock messages and to control sounds with incoming note and cc messages. Sending MIDI messages to Topos is like sending messages to far away universe; you can't expect a quick response, but the messages will be received and processed eventually.

Midi input can be enabled in the settings panel. Once you have done that, you can use the following functions to control values. All methods have channel parameter as optional value to receive only notes from a certain channel:
* <ic>active_notes(channel?: number)</ic>: returns array of the active notes / pressed keys as an array of MIDI note numbers (0-127). Returns undefined if no notes are active.
* <ic>sticky_notes(channel?: number)</ic>: returns array of the last pressed keys as an array of MIDI note numbers (0-127). Notes are added and removed from the list with the "Note on"-event. Returns undefined if no keys have been pressed.
* <ic>last_note(channel?: number)</ic>: returns the last note that has been received. Returns undefined if no notes have been received.
* <ic>buffer()</ic>: return true if there are notes in the buffer.
* <ic>buffer_note(channel?: number)</ic>: returns last unread note that has been received. Note is fetched and removed from start of the buffer once this is called. Returns undefined if no notes have been received.

${makeExample(
  "Play active notes as chords",
  `
  beat(1) && active_notes() && sound('sine').chord(active_notes()).out()
  `,
  true
)}

${makeExample(
  "Play continous arpeggio with sticky notes",
  `
  beat(0.25) && sticky_notes() && sound('arp')
  .note(sticky_notes().palindrome().beat(0.25)).out()
  `,
  true
)}

${makeExample(
  "Play last note",
  `
  beat(0.5) && last_note() :: sound('sawtooth').note(last_note())
  .vib([1, 3, 5].beat(1))
  .vibmod([1,3,2,4].beat(2)).out()
  `,
  true
)}

${makeExample(
  "Play buffered note",
  `
  beat(1) && buffer() && sound('sine').note(buffer_note()).out()
  `,
  true
)}


### Run scripts with mini note messages and channels

Midi note messages with channels can also be used to run scripts. This can be enabled in the settings panel by setting "Route channels to scripts".

### Midi clock

Topos can controlled from external hadware or software using Midi clock messages. To enable this feature, you need to connect a MIDI input as Midi Clock in the settings panel. Once you have done that, Topos will listen to incoming clock messages and will use them to estimate the current bpm. Topos will also listen to Start, Stop and Continue messages to start and stop the evaluation. Different MIDI devices can send clock at different resolution, define Clock PPQN in settings to match the resolution of your device. 

## Mouse input
	
You can get the current position of the mouse on the screen by using the following functions:
	
- <ic>mouseX()</ic>: the horizontal position of the mouse on the screen (as a floating point number).
- <ic>mouseY()</ic>: the vertical position of the mouse on the screen (as a floating point number).
	
${makeExample(
    "FM Synthesizer controlled using the mouse",
    `
beat(.25) :: sound('sine')
  .fmi(mouseX() / 100)
  .fmh(mouseY() / 100)
  .vel(0.2)
  .room(0.9).out()
`,
    true
  )}

Current mouse position can also be used to generate notes:
	
- <ic>noteX()</ic>: returns a MIDI note number (0-127) based on the horizontal position of the mouse on the screen.
- <ic>noteY()</ic>: returns a MIDI note number (0-127) based on the vertical position of the mouse on the screen.
	

${makeExample(
    "The same synthesizer, with note control!",
    `
beat(.25) :: sound('sine')
  .fmi(mouseX() / 100)
  .note(noteX())
  .fmh(mouseY() / 100)
  .vel(0.2)
  .room(0.9).out()
`,
    true
  )}



`
}
