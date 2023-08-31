import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const patterns = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Patterns

Music really comes to life when you start playing with algorithmic patterns. They can be used to describe a melody, a rhythm, a texture, a set of custom parameters or anything else you can think of. Topos comes with a lot of different abstractions to deal with musical patterns of increasing complexity. Some knowledge of patterns and how to use them will help you to break out of simple loops and repeating structures.

## Working with Arrays

JavaScript is using [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) as a data structure for lists. Topos is extending them with custom methods that allow you to enter softly into a universe of musical patterns. These methods can often be chained to compose a more complex expression: <ic>[1, 2, 3].repeatOdd(5).palindrome().beat()</ic>.

- <ic>div(division: number)</ic>: this method will return the next value in the list every _n_ pulses. By default, <ic>1</ic> equals to one beat but integer and floating point number values are supported as well. This method is extremely powerful and can be used for many different purposes. Check out the examples.

${makeExample(
  "Light drumming",
  `
// Every bar, use a different rhythm
mod([1, 0.75].div(4)) :: sound('cp').out()
mod([0.5, 1].div(4)) :: sound('kick').out()
mod(2)::snd('snare').shape(.5).out()
`,
  true
)}
${makeExample(
  "Using div to create arpeggios",
  `
// Arpeggio using pulse divisions
mod([.5, .25].div(2)) :: sound('sine')
  .hcutoff(400)
  .fmi([1,2].div(8))
  .fmh([0.5,0.25,1].div(2))
  .note([50,53,57].div(.25) + [12,24].div(2))
  .sustain([0.25, 0.5].div(8))
  .room(0.9).size(0.5)
  .delay(0.25).delayt([0.5,0.25].div(16))
  .delayfb(0.5)
  .out()
`,
  false
)}
${makeExample(
  "Cool ambiance",
  `
mod(.5) :: snd(['kick', 'hat'].div(4)).out()
mod([2,4].div(2)) :: snd('shaker').delay(.5).delayfb(.75).delayt(0.125).out()
div(2)::mod(1)::snd('clap').out()
div(4)::mod(2)::snd('pad').n(2).shape(.5).orbit(2).room(0.9).size(0.9).release(0.5).out()
`,
  false
)}



- <ic>beat()</ic>: returns the index of the list corresponding to current beat (with wrapping). This allows you to return a different value for each beat.
- <ic>pulse()</ic>: returns the index of the list corresponding to the current pulse (with wrapping). This method will return a different value for each pulse.
- <ic>bar()</ic>: returns the index of the list corresponding to the current bar (with wrapping). This method will return a different value for each bar.

${makeExample(
  "A simple drumbeat in no time!",
  `
mod(1)::sound(['kick', 'hat', 'snare', 'hat'].beat()).out()
mod(1.5)::sound(['jvbass', 'clap'].beat()).out()
`,
  true
)}

${makeExample(
  "Using beat, pulse and bar in the same code",
  `mod(2)::snd('snare').out()
mod([1, 0.5].beat()) :: sound(['bass3'].bar())
  .freq(100).n([12, 14].bar())
  .speed([1,2,3].pulse())
  .out()
`
)}


- <ic>palindrome()</ic>: Concatenates a list with the same list in reverse.

${makeExample(
  "Palindrome filter sweep",
  `
mod([1,.5,.25].beat()) :: snd('sine')
  .freq([100,200,300].div(0.25))
  .fmi([1,2,3].palindrome().div(0.5))
  .fmh([4, 8].palindrome().beat())
  .cutoff([500,1000,2000,4000].palindrome().beat())
  .sustain(0.1)
  .out()
`,
  true
)}


- <ic>random(index: number)</ic>: pick a random element in the given list.
- <ic>rand(index: number)</ic>: shorter alias for the same method.
- <ic>pick()</ic>: pick a random element in the list.


${makeExample(
  "Sipping some gasoline at the robot bar",
  `
mod(1)::snd('kick').shape(0.5).out()
mod([.5, 1].random() / 2) :: snd(
  ['amencutup', 'synth2'].random())
  .n(irand(4,10))
  .cutoff(2000)
  .resonance(10)
  .end(0.2).out()
`,
  true
)}

- <ic>degrade(amount: number)</ic>: removes _n_% of the list elements. Lists can be degraded as long as one element remains. The amount of degradation is given as a percentage.

${makeExample(
  "Amen break suffering from data loss",
  `
// Tweak the value to degrade this amen break even more!
mod(.25)::snd('amencutup').n([1,2,3,4,5,6,7,8,9].degrade(20).loop($(1))).out()
`,
  true
)}

- <ic>repeatAll(amount: number)</ic>: repeat every list elements _n_ times.
- <ic>repeatPair(amount: number)</ic>: repeaet every pair element of the list _n_ times.
- <ic>repeatOdd(amount: number)</ic>: repeaet every odd element of the list _n_ times.

${makeExample(
  "Repeating samples a given number of times",
  `
// Please take this repeat number down a bit!
mod(.25)::sound('amencutup').n([1,2,3,4,5,6,7,8].repeatAll(4).beat()).out()
`,
  true
)}

- <ic>loop(index: number)</ic>: loop takes one argument, the _index_. It allows you to iterate over a list using an iterator such as a counter. This is super useful to control how you are accessing values in a list without relying on a temporal method such as <ic>.beat()</ic> or </ic>.bar()</ic>.

${makeExample(
  "Don't you know how to count up to 5?",
  `
mod(1) :: sound('numbers').n([1,2,3,4,5].loop($(3, 10, 2))).out()
`,
  true
)}

- <ic>shuffle(): this</ic>: shuffles a list! Simple enough!

${makeExample(
  "Shuffling a list for extra randomness",
  `
mod(1) :: sound('numbers').n([1,2,3,4,5].shuffle().loop($(1)).out()
`,
  true
)}

- <ic>rotate(steps: number)</ic>: rotate a list to the right _n_ times. The last value become the first, rinse and repeat.

${makeExample(
  "To make things more complex... here you go",
  `
mod(.5) :: snd('sine')
  .freq([100, 150, 200, 250, ,300, 400]
    .rotate([1,2,3].bar()) // The list of frequencies is rotating
    .beat())               // while being indexed over!
  .sustain(0.1)
  .out()
`,
  true
)}

- <ic>unique()</ic>: filter a list to remove repeated values.

${makeExample(
  "Demonstrative filtering. Final list is [100, 200]",
  `
// Remove unique and 100 will repeat four times!
mod(1)::snd('sine').sustain(0.1).freq([100,100,100,100,200].unique().beat()).out()
`,
  true
)}

- <ic>add()</ic>: add a given amount to every list element.
- <ic>sub()</ic>: add a given amount to every list element.
- <ic>mult()</ic>: add a given amount to every list element.
- <ic>division()</ic>: add a given amount to every list element. The method is named <ic>division</ic> because obviously <ic>div</ic> is already taken.

${makeExample("Simple addition", `[1, 2 ,3].add(2).beat()`, true)}

## Simple patterns 
	
- <ic>divseq(div: number, ...values:any[])</ic>

`;
};
