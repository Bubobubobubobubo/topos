import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const functions = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Functions
	
## Scripts
	
You can control scripts programatically. This is the core concept of Topos after all!
	
- <ic>script(...number: number[])</ic>: call one or more scripts (_e.g. <ic>script(1,2,3,4)</ic>). Once called, scripts will be evaluated once. There are nine local scripts by default. You cannot call the global script nor the initialisation script.
- <ic>clear_script(number)</ic>: deletes the given script.
- <ic>copy_script(from: number, to: number)</ic>: copies a local script denoted by its number to another local script. **This is a destructive operation!**

${makeExample(
  "Calling a script! The most important feature!",
  `
beat(1) :: script(1)
`,
  true,
)}

${makeExample(
  "Calling mutliple scripts at the same time.",
  `
beat(1) :: script(1, 3, 5)
`,
  false,
)}

## Math functions
	
- <ic>max(...values: number[]): number</ic>: returns the maximum value of a list of numbers.
- <ic>min(...values: number[]): number</ic>: returns the minimum value of a list of numbers.
- <ic>mean(...values: number[]): number</ic>: returns the arithmetic mean of a list of numbers.
- <ic>limit(value: number, min: number, max: number): number</ic>: Limits a value between a minimum and a maximum. 
	
### Scaling functions

There are some very useful scaling methods taken from **SuperCollider**. You can call these on any number:

- <ic>.linlin(inMin: number, inMax: number, outMin: number, outMax: number)</ic>: scale linearly from one range to another.
- <ic>.linexp(inMin: number, inMax: number, outMin: number, outMax: number)</ic>: scale a linear range to an exponential range.
- <ic>.explin(inMin: number, inMax: number, outMin: number, outMax: number)</ic>: scale an exponential range to a linear range.
- <ic>.expexp(inMin: number, inMax: number, outMin: number, outMax: number)</ic>: scale an exponential range to another exponential range.
- <ic>.lincurve(inMin: number, inMax: number, outMin: number, outMax: number, curve: number)</ic>: scale a number from one range to another following a specific curve.
  - <ic>curve: number</ic>: <ic>0</ic> is linear,  <ic>< 0</ic> is concave, negatively curved, <ic>> 0</ic> is convex, positively curved

${makeExample(
  "Scaling an LFO",
  `usine(1/2).linlin(0, 1, 0, 100)`,
  true,
)}



## Delay functions
	
- <ic>delay(ms: number, func: Function): void</ic>: Delays the execution of a function by a given number of milliseconds.

${makeExample(
  "Phased woodblocks",
  `
// Some very low-budget version of phase music
beat(.5) :: delay(usine(.125) * 80, () => sound('east').out())
beat(.5) :: delay(50, () => sound('east').out())
`,
  true,
)}

- <ic>delayr(ms: number, nb: number, func: Function): void</ic>: Delays the execution of a function by a given number of milliseconds, repeated a given number of times.

${makeExample(
  "Another woodblock texture",
  `
beat(1) :: delayr(50, 4, () => sound('east').speed([0.5,.25].beat()).out())
flip(2) :: beat(2) :: delayr(150, 4, () => sound('east').speed([0.5,.25].beat() * 4).out())
`,
  true,
)};
`;
};
