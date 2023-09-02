import { makeExampleFactory, key_shortcut } from "../Documentation";
import { type Editor } from "../main";

export const introduction = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Welcome
	
Welcome to the Topos documentation. These pages are offering you an introduction to the software and to the ideas behind it. You can jump here anytime by pressing ${key_shortcut(
    "Ctrl + D"
  )}.  Press again to make the documentation disappear. All your contributions are welcome!

${makeExample(
  "Welcome! Eval to get started",
  `

	
bpm(110)
mod(0.125) && sound('sawtooth')
  .note([60, 62, 63, 67, 70].div(.125) + 
        [-12,0,12].beat() + [0, 0, 5, 7].bar())
  .sustain(0.1).fmi(0.25).fmh(2).room(0.9)
  .gain(0.75).cutoff(500 + usine(8) * [500, 1000, 2000].bar())
  .delay(0.5).delayt(0.25).delayfb(0.25)
  .out();
mod(1) && snd('kick').out();
mod(2) && snd('snare').out();
mod(.5) && snd('hat').out();

`,
  true
)}

	
## What is Topos?
	
Topos is an _algorithmic_ sequencer. Topos uses small algorithms to represent musical sequences and processes. These can be written in just a few lines of code. Topos is made to be _live-coded_. The _live coder_ strives for the constant interaction with algorithms and sound during a musical performance. Topos is aiming to be a digital playground for live algorithmic music.
	
${makeExample(
  "Small algorithms for direct musical expression",
  `
mod(1) :: sound(['kick', 'hat', 'snare', 'hat'].div(1)).out()
mod(.5) :: sound('jvbass').note(35 + [0,12].beat()).out()
mod([0.5, 0.25, 1, 2].div(1)) :: sound('east')
  .room(.5).size(0.5).n(irand(1,5)).out()`,
  false
)}

${makeExample(
  "Computer music should be immediate and intuitive",
  `mod(.5)::snd('sine')
  .delay(0.5).delayt(0.25).delayfb(0.7)
  .room(0.8).size(0.8)
  .freq(mouseX()).out()`,
  false
)}

${makeExample(
  "Making the web less dreadful, one beep at at time",
  `
mod(.5) :: sound('sid').n($(2)).out()
mod(.25) :: sound('sid').note(
  [34, 36, 41].div(.25) + [[0,-24].pick(),12].beat())
  .room(0.9).size(0.9).n(4).out()`,
  false
)}
	
Topos is deeply inspired by the [Monome Teletype](https://monome.org/). The Teletype is/was an open source hardware module for Eurorack synthesizers. While the Teletype was initially born as an hardware module, Topos aims to be a web-browser based software sequencer from the same family! It is a sequencer, a scriptable interface, a companion for algorithmic music-making.  Topos wishes to fullfill the same goal than the Teletype, keeping the same spirit alive on the web. It is free, open-source, and made to be shared and used by everyone.
	
## Demo Songs

Reloading the application will get you one random song example to study every time. Press ${key_shortcut(
    "F5"
  )} and listen to them all!
`;
};
