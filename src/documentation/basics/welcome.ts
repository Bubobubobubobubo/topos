import { makeExampleFactory, key_shortcut } from "../../Documentation";
import { type Editor } from "../../main";
import { examples } from "../../examples/excerpts";

export const introduction = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Welcome
	
Welcome to the **Topos** documentation. You can jump here anytime by pressing ${key_shortcut(
    "Ctrl + D",
  )}.  Press again to make the documentation disappear. Contributions are much appreciated! The documentation [lives here](https://github.com/Bubobubobubobubo/topos/tree/main/src/documentation).

${makeExample(
    "Welcome! Eval to get started",
    examples[Math.floor(Math.random() * examples.length)],
    true,
  )}
	
# What is Topos?
	
Topos is an _algorithmic_ sequencer. Topos is also a _live coding_ environment. To sum it up, think: "_making music in real time through code_". Code used as an expressive medium for musical improvisation! Topos uses small algorithms to represent musical sequences and processes.
	
${makeExample(
    "Small algorithms for direct musical expression",
    `
rhythm(.5, 4, 8) :: sound('drum').out()
rhythm(.25, [5, 7].beat(2), 8) :: sound(['hc', 'fikea', 'hat'].pick(1))
  .lpf([500, 4000+usine(1/2)*2000]).pan(r(0, 1)).ad(0, [1, .5])
  .db(-ir(1,8)).speed([1,[0.5, 2].pick()]).room(0.5).size(3).o(4).out()
beat([2,0.5].dur(13.5, 0.5))::snd('fsoftsnare')
  .n(0).speed([1, 0.5]).o(4).out()`,
    false,
  )}

${makeExample(
    "Computer music should be immediate and intuitive",
    `
let chord_prog = [0, 0, 5].bar() // Chord progression
beat(.25)::snd('sine')
  .note(chord_prog + [60, 64, 67, 71].mouseX() 
        + [-12,0,12].beat(0.25)) // Notes
  .fmi([1, 1.5, 2, 4].beat()) // FM synthesis
  .ad(0, r(0.1, .25)) // Envelope
  .lpf(500 + usine(1/4)*1500) // Filter Envelope
  .lpad(4, 0, .125) 
  .delay(0.5).delayt(0.25).delayfb(0.7) // Delay
  .room(0.5).size(8) // Reverb
  .out()`,
    false,
  )}

${makeExample(
    "Making the web less dreadful, one beep at at time",
    `
beat(.5) :: sound('sid').n($(2))
  .room(1).speed([1,2].pick()).out()
beat(.25) :: sound('sid').note(
  [34, 36, 41].beat(.25) + [[0,-24].pick(),12].beat())
  .room(0.9).size(0.9).n(4).out()`,
    false,
  )}
	
Topos is deeply inspired by the [Monome Teletype](https://monome.org/). The Teletype is/was an open source hardware module for Eurorack synthesizers. While the Teletype was initially born as an hardware module, Topos aims to be a web-browser based cousin of it! It is a sequencer, a scriptable interface, a companion for algorithmic music-making. Topos wishes to fullfill the same goal as the Teletype, keeping the same spirit alive on the web. It is free, open-source, and made to be shared and used by everyone.  Learn more about live coding on [livecoding.fr](https://livecoding.fr).

## Demo Songs

Reloading the application will get you one random song example to study every time. Press ${key_shortcut(
    "F5",
  )} and listen to them all! The demo songs are also used a bit everywhere in the documentation to illustrate some of the working principles :).

## Support

<p>You can <a href='https://ko-fi.com/I2I2RSBHF' target='_blank'><img height='36' style='display: inline; border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> to support the development :) </p>

`;
};

