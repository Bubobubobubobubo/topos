import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

// @ts-ignore
export const interaction = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Interaction

Topos can interact with the physical world or react to events coming from outside the system (_MIDI_, physical control, etc).


## Mouse
	
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
