import { type Editor } from "../../main";
import { makeExampleFactory } from "../Documentation";

export const mouse = (app: Editor): string => {
  let makeExample = makeExampleFactory(app);
  return `
# Mouse
	
Using the mouse is a fun way to control your code. It's basically an X/Y controller that you don't have to pay for! There are clever actions you can do with the mouse from generating notes to activating scripts conditionally!

## Mouse position 

You can get the current position of the mouse on the screen by using the following functions:
	
- <ic>mouseX()</ic>: the horizontal position of the mouse on the screen (as a floating point number).
- <ic>mouseY()</ic>: the vertical position of the mouse on the screen (as a floating point number).
	
${makeExample(
    "Vibrato controlled by mouse",
    `
beat(.25) :: sound('sine')
  .note([0,4,5,10,11,15,16]
        .palindrome()
        .scale('pentatonic', 50).beat(.25)
        + [-12, 0, 12].beat(0.25))
  .vib(mouseX()/700).vibmod(mouseY()/200)
  .pan(r(0, 1))
  .room(0.35).size(4).out()
`,
    true,
  )}

<br>

Current mouse position can also be used to generate notes:
	
- <ic>noteX()</ic>: returns a MIDI note number (0-127) based on the horizontal position of the mouse on the screen.
- <ic>noteY()</ic>: returns a MIDI note number (0-127) based on the vertical position of the mouse on the screen.
	

${makeExample(
    "Using the mouse to output a note!",
    `
beat(.25) :: sound('sine')
  .lpf(7000)
  .delay(0.5).delayt(1/6).delayfb(0.2)
  .note(noteX())
  .room(0.35).size(4).out()`,
    true,
  )}

## Mouse and Arrays

You can use the mouse to explore the valuesq contained in an Array:

- <ic>mouseX()</ic>: returns a value from a list by splitting the horizontal space of the screen in _n_ sections.
- <ic>mouseY()</ic>: returns a value from a list by splitting the vertical space of the screen in _n_ sections.


${makeExample(
    "Taking values out of an Array with the mouse",
    `
log([1,2,3,4].mouseX())
log([4,5,6,7].mouseY())

  `,
    true,
  )}



  `;
};
