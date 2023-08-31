import { type Editor } from "../main";
import { makeExampleFactory, key_shortcut } from "../Documentation";

export const functions = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Functions
	
## Global Shared Variables
	
By default, each script is independant from each other. Scripts live in their own bubble and you cannot get or set variables affecting a script from any other script. **However**, everybody knows that global variables are cool and should be used everywhere. This is an incredibely powerful tool to use for radically altering a composition in a few lines of code.
	
- <ic>variable(a: number | string, b?: any)</ic>: if only one argument is provided, the value of the variable will be returned through its name, denoted by the first argument. If a second argument is used, it will be saved as a global variable under the name of the first argument.
	- <ic>delete_variable(name: string)</ic>: deletes a global variable from storage.
	- <ic>clear_variables()</ic>: clear **ALL** variables. **This is a destructive operation**!
	
**Note:** since this example is running in the documentation, we cannot take advantage of the multiple scripts paradigm. Try to send a variable from the global file to the local file n°6.

${makeExample(
  "Setting a global variable",
  `
v('my_cool_variable', 2)
`,
  true
)}

${makeExample(
  "Getting that variable back and printing!",
  `
// Note that we just use one argument
log(v('my_cool_variable'))
`,
  false
)}


## Counter and iterators
	
You will often need to use iterators and/or counters to index over data structures (getting a note from a list of notes, etc...). There are functions ready to be used for this. Each script also comes with its own iterator that you can access using the <ic>i</ic> variable. **Note:** the script iteration count is **not** resetted between sessions. It will continue to increase the more you play, even if you just picked up an old project.
	
- <ic>counter(name: number | string, limit?: number, step?: number)</ic>: reads the value of the counter <ic>name</ic>. You can also call this function using the dollar symbol: <ic>$</ic>.
	- <ic>limit?</ic>: counter upper limit before wrapping up.
	- <ic>step?</ic>: incrementor. If step is <ic>2</ic>, the iterator will go: <ic>0, 2, 4, 6</ic>, etc...
	
- <ic>drunk(n?: number)</ic>: returns the value of the internal drunk walk counter. This iterator will sometimes go up, sometimes go down. It comes with companion functions that you can use to finetune its behavior.
	- <ic>drunk_max(max: number)</ic>: sets the maximum value.
	- <ic>drunk_min(min: number)</ic>: sets the minimum value.
	- <ic>drunk_wrap(wrap: boolean)</ic>: whether to wrap the drunk walk to 0 once the upper limit is reached or not.

**Note:** Counters also come with a secret syntax. They can be called with the **$** symbol!

${makeExample(
  "Iterating over a list of samples using a counter",
  `
rhythm(.25, 6, 8) :: sound('dr').n($(1)).end(.25).out()
`,
  true
)}

${makeExample(
  "Using a more complex counter",
  `
// Limit is 20, step is 5
rhythm(.25, 6, 8) :: sound('dr').n($(1, 20, 5)).end(.25).out()
`,
  false
)}

${makeExample(
  "Calling the drunk mechanism",
  `
// Limit is 20, step is 5
rhythm(.25, 6, 8) :: sound('dr').n(drunk()).end(.25).out()
`,
  false
)}

## Scripts
	
You can control scripts programatically. This is the core concept of Topos after all!
	
- <ic>script(...number: number[])</ic>: call one or more scripts (_e.g. <ic>script(1,2,3,4)</ic>). Once called, scripts will be evaluated once. There are nine local scripts by default. You cannot call the global script nor the initialisation script.
- <ic>clear_script(number)</ic>: deletes the given script.
- <ic>copy_script(from: number, to: number)</ic>: copies a local script denoted by its number to another local script. **This is a destructive operation!**

${makeExample(
  "Calling a script! The most important feature!",
  `
mod(1) :: script(1)
`,
  true
)}

${makeExample(
  "Calling mutliple scripts at the same time.",
  `
mod(1) :: script(1, 3, 5)
`,
  false
)}


	
## Mouse
	
You can get the current position of the mouse on the screen by using the following functions:
	
- <ic>mouseX()</ic>: the horizontal position of the mouse on the screen (as a floating point number).
- <ic>mouseY()</ic>: the vertical position of the mouse on the screen (as a floating point number).
	
${makeExample(
  "FM Synthesizer controlled using the mouse",
  `
mod(.25) :: sound('sine')
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
mod(.25) :: sound('sine')
  .fmi(mouseX() / 100)
  .note(noteX())
  .fmh(mouseY() / 100)
  .vel(0.2)
  .room(0.9).out()
`,
  true
)}

## Low Frequency Oscillators
	
Low Frequency Oscillators (_LFOs_) are an important piece in any digital audio workstation or synthesizer. Topos implements some basic waveforms you can play with to automatically modulate your paremeters. 
	
- <ic>sine(freq: number = 1, offset: number= 0): number</ic>: returns a sinusoïdal oscillation between <ic>-1</ic> and <ic>1</ic>.
- <ic>usine(freq: number = 1, offset: number= 0): number</ic>: returns a sinusoïdal oscillation between <ic>0</ic> and <ic>1</ic>. The <ic>u</ic> stands for _unipolar_.
	
${makeExample(
  "Modulating the speed of a sample player using a sine LFO",
  `mod(.25) && snd('cp').speed(1 + usine(0.25) * 2).out()`,
  true
)};

- <ic>triangle(freq: number = 1, offset: number= 0): number</ic>: returns a triangle oscillation between <ic>-1</ic> and <ic>1</ic>.
- <ic>utriangle(freq: number = 1, offset: number= 0): number</ic>: returns a triangle oscillation between <ic>0</ic> and <ic>1</ic>. The <ic>u</ic> stands for _unipolar_.
	

${makeExample(
  "Modulating the speed of a sample player using a triangle LFO",
  `mod(.25) && snd('cp').speed(1 + utriangle(0.25) * 2).out()`,
  true
)}
	
- <ic>saw(freq: number = 1, offset: number= 0): number</ic>: returns a sawtooth-like oscillation between <ic>-1</ic> and <ic>1</ic>.
- <ic>usaw(freq: number = 1, offset: number= 0): number</ic>: returns a sawtooth-like oscillation between <ic>0</ic> and <ic>1</ic>. The <ic>u</ic> stands for _unipolar_.
	

${makeExample(
  "Modulating the speed of a sample player using a saw LFO",
  `mod(.25) && snd('cp').speed(1 + usaw(0.25) * 2).out()`,
  true
)}
	
- <ic>square(freq: number = 1, offset: number= 0, duty: number = .5): number</ic>: returns a square wave oscillation between <ic>-1</ic> and <ic>1</ic>. You can also control the duty cycle using the <ic>duty</ic> parameter.
- <ic>usquare(freq: number = 1, offset: number= 0, duty: number = .5): number</ic>: returns a square wave oscillation between <ic>0</ic> and <ic>1</ic>. The <ic>u</ic> stands for _unipolar_. You can also control the duty cycle using the <ic>duty</ic> parameter.
	
${makeExample(
  "Modulating the speed of a sample player using a square LFO",
  `mod(.25) && snd('cp').speed(1 + usquare(0.25, 0, 0.25) * 2).out()`,
  true
)};
	
- <ic>noise()</ic>: returns a random value between -1 and 1.
	
${makeExample(
  "Modulating the speed of a sample player using noise",
  `mod(.25) && snd('cp').speed(1 + noise() * 2).out()`,
  true
)};
	
## Probabilities

There are some simple functions to play with probabilities.

- <ic>rand(min: number, max:number)</ic>: returns a random number between <ic>min</ic> and <ic>max</ic>. Shorthand _r()_.
- <ic>irand(min: number, max:number)</ic>: returns a random integer between <ic>min</ic> and <ic>max</ic>. Shorthands _ir()_ or _rI()_.

${makeExample(
  "Bleep bloop, what were you expecting?",
  `
rhythm(0.125, 10, 16) :: sound('sid').n(4).note(50 + irand(50, 62) % 8).out()
`,
  true
)}


- <ic>prob(p: number)</ic>: return <ic>true</ic> _p_% of time, <ic>false</ic> in other cases.
- <ic>toss()</ic>: throwing a coin. Head (<ic>true</ic>) or tails (<ic>false</ic>).


${makeExample(
  "The Teletype experience!",
  `
prob(50) :: script(1);
prob(60) :: script(2);
prob(80) :: script(toss() ? script(3) : script(4))
`,
  true
)}

- <ic>seed(val: number|string)</ic>: sets the seed of the random number generator. You can use a number or a string. The same seed will always return the same sequence of random numbers.


## Chance operators

Chance operators returning a boolean value are also available. They are super important because they also exist for another mechanism called **chaining**. Checkout the **Chaining** page to learn how to use them in different contexts!
	
- <ic>odds(n: number, sec?: number)</ic>: returns true for every n (odds) (eg. 1/4 = 0.25) in given seconds (sec)
- <ic>almostNever(sec?: number)</ic>: returns true 0.1% in given seconds (sec)
- <ic>rarely(sec?: number)</ic>: returns true 1% in given seconds (sec)
- <ic>scaresly(sec?: number)</ic>: returns true 10% in given seconds (sec)
- <ic>sometimes(sec?: number)</ic>: returns true 50% in given seconds (sec)
- <ic>often(sec?: number)</ic>: returns true 75% in given seconds (sec)
- <ic>frequently(sec?: number)</ic>: returns true 90% in given seconds (sec)
- <ic>almostAlways(sec?: number)</ic>: returns true 99% in given seconds (sec)
	
## Math functions
	
- <ic>max(...values: number[]): number</ic>: returns the maximum value of a list of numbers.
- <ic>min(...values: number[]): number</ic>: returns the minimum value of a list of numbers.
- <ic>mean(...values: number[]): number</ic>: returns the arithmetic mean of a list of numbers.
- <ic>limit(value: number, min: number, max: number): number</ic>: Limits a value between a minimum and a maximum. 
	
## Delay functions
	
- <ic>delay(ms: number, func: Function): void</ic>: Delays the execution of a function by a given number of milliseconds.

${makeExample(
  "Phased woodblocks",
  `
// Some very low-budget version of phase music
mod(.5) :: delay(usine(.125) * 80, () => sound('east').out())
mod(.5) :: delay(50, () => sound('east').out())
`,
  true
)}

- <ic>delayr(ms: number, nb: number, func: Function): void</ic>: Delays the execution of a function by a given number of milliseconds, repeated a given number of times.

${makeExample(
  "Another woodblock texture",
  `
mod(1) :: delayr(50, 4, () => sound('east').speed([0.5,.25].beat()).out())
div(2) :: mod(2) :: delayr(150, 4, () => sound('east').speed([0.5,.25].beat() * 4).out())
`,
  true
)};
`;
};
