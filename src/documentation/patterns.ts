import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const patterns = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Patterns

**Topos** is using arrays as a way to make dynamic patterns of data (rhythms, melodies, etc). 
It means that the following:

${makeExample(
  "Boring kick",
  `
beat(1)::sound('kick').out()
`,
  true
)}

can be turned into something more interesting like this easily:

${makeExample(
  "Less boring kick",
  `
let c = [1,2].dur(3, 1)
beat([1, 0.5, 0.25].dur(0.75, 0.25, 1) / c)::sound(['kick', 'fsoftsnare'].beat(0.75))
  .ad(0, .25).shape(usine(1/2)*0.5).speed([1, 2, 4].beat(0.5)).out()
`,
  true
)}


**Topos** comes with a lot of array methods to deal with musical patterns of increasing complexity. Some knowledge of patterns and how to use them will help you to break out of simple loops and repeating structures.  The most basic JavaScript data structure is the [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). Topos is extending it with custom methods to describe patterns that evolve over time. These methods can often be chained to compose more complex expressions: <ic>[1, 2, 3].repeatOdd(5).palindrome().beat()</ic>.

## Temporal iteration

- <ic>beat(division: number)</ic>: this method will return the next value in the list every _n_ pulses. By default, <ic>1</ic> equals to one beat but integer and floating point number values are supported as well. This method is extremely powerful and can be used for many different purposes. Check out the examples.

${makeExample(
  "Light drumming",
  `
// Every bar, use a different rhythm
beat([1, 0.75].beat(4)) :: sound('cp').out()
beat([0.5, 1].beat(4)) :: sound('kick').out()
beat(2)::snd('snare').shape(.5).out()
`,
  true
)}
${makeExample(
  "Using beat to create arpeggios",
  `
// Arpeggio using pulse divisions
beat([.5, .25].beat(0.5)) :: sound('sine')
  .lpf(100+usine(1/4)*400).lpad(2, 0, .25)
  .fmi([1,2].beat(8)).fmh([1, 2].beat(0.5))
  .note([0,2,4,5].scale('minor', 40).beat(0.25) 
        + [0, 7].bar()
        + [12,24].beat(0.5))
  .sustain([0.25, 0.5].beat(8))
  .room(0.9).size(0.5)
  .delay(0.5).delayt([0.5,0.25].beat(16))
  .delayfb(0.5)
  .out()
`,
  false
)}
${makeExample(
  "Cool ambiance",
  `
beat(.5) :: snd(['kick', 'hat'].beat(0.5)).out()
beat([2,4].beat(2)) :: snd('shaker').delay(.5).delayfb(.75).delayt(0.125).out()
flip(2)::beat(1)::snd('froomy').out()
flip(4)::beat(2)::snd('pad').n(2).shape(.5)
  .orbit(2).room(0.9).size(0.9).release(0.5).out()
`,
  false
)}

- <ic>bar(value: number = 1)</ic>: returns the next value every bar (if <ic>value = 1</ic>). Using a larger value will return the next value every <ic>n</ic> bars.

${makeExample(
  "A simple drumbeat in no time!",
  `
beat(1)::sound(['kick', 'hat', 'snare', 'hat'].beat()).out()
beat([1/4, 1/2].dur(1.5, 0.5))::sound(['jvbass', 'fikea'].bar())
  .ad(0, .25).room(0.5).size(2).resonance(0.15).lpf(
    [200,400,800,1200,2000].beat(2) 
    * [1, 2].bar())
  .out()
`,
  true
)}

${makeExample(
  "Using beat and bar in the same example",
  `
beat(2)::snd('snare').out()
beat([1, 0.5].beat()) :: sound(['bass3'].bar())
  .freq(100).n([12, 14].bar())
  .room(0.5).size(4).orbit(2)
  .pan(r(0, 1))
  .speed([1,2,3].beat())
  .out()
`
)}

- <ic>dur(...list: numbers[])</ic> : keeps the same value for a duration of <ic>n</ic> beats corresponding to the <ic>nth</ic> number of the list you provide.

${makeExample(
  "Holding a value for n beats",
  `
// The second note is kept for twice as long
beat(0.5)::sound('notes').n([1,2].dur(1, 2))
  .room(0.5).size(8).delay(0.125).delayt(1/8)
  .speed(0.5).ad(0, .125).out()
// Kick (3 beats), Snare (1 beat)
beat(1)::sound(['kick', 'fsnare'].dur(3, 1))
  .n([0,3].dur(3, 1)).out()
  `,
  true
)}

## Manipulating notes and scales


- <ic>pitch()</ic>: convert a list of integers to pitch classes

${makeExample(
  "Converting a list of integers to pitch classes using key and scale",
  `
    beat(0.25) :: snd('sine')
    .pitch([0,1,2,3,4,6,7,8].beat(0.125))
    .key(["F4","F3"].beat(2.0))
    .scale("minor").out()
`,
  true
)}

  - <ic>scale(scale: string, base note: number)</ic>: Map each element of the list to the closest note of the slected scale. [0, 2, 3, 5 ].scale("major", 50) returns [50, 52, <ic>54</ic>, 55]. You can use western scale names like (Major, Minor, Minor pentatonic ...) or [zeitler](https://ianring.com/musictheory/scales/traditions/zeitler) scale names. Alternatively you can also use the integers as used by Ian Ring in his [study of scales](https://ianring.com/musictheory/scales/).

${makeExample(
  "Mapping the note array to the E3 major scale",
  `
beat(1) :: snd('gtr')
  .note([0, 5, 2, 1, 7].scale("Major", 52).beat())
  .out()
`,
  true
)}

- <ic>scaleArp(scale: string, mask: number)</ic>: extrapolate a custom-masked scale from each list elements. [0].scale("major", 3) returns [0,2,4]. <ic>scaleArp</ic> supports the same scales as <ic>scale</ic>.

${makeExample(
  "Extrapolate a 3-elements Mixolydian scale from 2 notes",
  `
beat(1) :: snd('gtr')
  .note([0, 5].scaleArp("mixolydian", 3).beat() + 50)
  .out()
`,
  true
)}

## Iteration using the mouse

- <ic>mouseX()</ic> / <ic>mouseY()</ic>: divides the screen in <ic>n</ic> zones and returns the value corresponding to the mouse position on screen.</ic>

${makeExample(
  "Controlling an arpeggio (octave and note) with mouse",
  `
beat(0.25)::sound('wt_piano')
  .note([0,2,3,4,5,7,8,9,11,12].scale(
    'minor', 30 + [0,12,24].mouseY()).mouseX())
  .room(0.5).size(4).lpad(-2, .2).lpf(500, 0.3)
  .ad(0, .2).out()
`,
  true
)}

## Simple data operations

- <ic>palindrome()</ic>: Concatenates a list with the same list in reverse.

${makeExample(
  "Palindrome filter sweep",
  `
beat([1,.5,.25].beat()) :: snd('wt_stereo')
  .speed([1, 0.5, 0.25])
  .pan(r(0, 1)).freq([100,200,300].beat(0.25))
  .fmi([1,2,3].palindrome().beat(0.5))
  .fmh([0.5, 1].palindrome().beat())
  .lpf([500,1000,2000,4000].palindrome().beat())
  .lpad(4, 0, .25).sustain(0.125).out()
`,
  true
)}

- <ic>random(index: number)</ic>: pick a random element in the given list.
- <ic>rand(index: number)</ic>: shorter alias for the same method.

${makeExample(
  "Sipping some gasoline at the robot bar",
  `
// rand, random and pick are doing the same thing!
beat(1)::snd('fhardkick').shape(0.5)
  .ad(0, .1).lpf(500).db(-12).out()
beat([.5, 1].rand() / 2) :: snd(
  ['amencutup', 'synth'].random())
  .clip(1).n(irand(4,10)).room(0.5)
  .size(3).freq(200)
  .lpf([5000,3000,2000].pick())
  .end(0.5).out()
`,
  true
)}

- <ic>pick()</ic>: pick a random element in the list.

${makeExample(
  "Picking values in lists",
  `
beat(0.25)::sound(['ftabla', 'fwood'].pick())
  .speed([1,2,3,4].pick()).ad(0, .125).n(ir(1,10))
  .room(0.5).size(1).out()
  `,
  true
)}

- <ic>degrade(amount: number)</ic>: removes _n_% of the list elements. Lists can be degraded as long as one element remains. The amount of degradation is given as a percentage.

${makeExample(
  "Amen break suffering from data loss",
  `
// Tweak the value to degrade this amen break even more!
beat(.25)::snd('amencutup').n([1,2,3,4,5,6,7,8,9].degrade(20).loop($(1))).out()
`,
  true
)}

- <ic>repeat(amount: number)</ic>: repeat every list elements _n_ times.
- <ic>repeatEven(amount: number)</ic>: repeat every pair element of the list _n_ times.
- <ic>repeatOdd(amount: number)</ic>: repeat every odd element of the list _n_ times.

${makeExample(
  "Repeating samples a given number of times",
  `
beat(.25)::sound('amencutup').n([1,2,3,4,5,6,7,8].repeat(4).beat(.25)).out()
`,
  true
)}

- <ic>loop(index: number)</ic>: loop takes one argument, the _index_. It allows you to iterate over a list using an iterator such as a counter. This is super useful to control how you are accessing values in a list without relying on a temporal method such as <ic>.beat()</ic> or </ic>.bar()</ic>.

${makeExample(
  "Don't you know how to count up to 5?",
  `
beat(1) :: sound('numbers').n([1,2,3,4,5].loop($(3, 10, 2))).out()
`,
  true
)}

- <ic>shuffle(): this</ic>: shuffles a list! Simple enough!

${makeExample(
  "Shuffling a list for extra randomness",
  `
beat(1) :: sound('numbers').n([1,2,3,4,5].shuffle().loop($(1)).out()
`,
  true
)}

- <ic>rotate(steps: number)</ic>: rotate a list to the right _n_ times. The last value become the first, rinse and repeat.

${makeExample(
  "To make things more complex... here you go",
  `
beat(.25) :: snd('sine').fmi([1.99, 2])
  .ad(0, .125).lpf(500+r(1,400))
  .lpad(usine()*8, 0, .125)
  .fmenv(2).fmdecay(0.125).fmsustain(0)
  .delay(0.5).fmh(parseInt(usine(1/12)*3))
  .note(["C3", "E3", "G3", "Bb3", "D4"]
    .rotate([0, 1, 3, 5].beat(4)) // Rotation over notes
    .beat(.25))                   // while the index changes
  .out()
`,
  true
)}

## Filtering

- <ic>unique()</ic>: filter a list to remove repeated values.

${makeExample(
  "Demonstrative filtering. Final list is [100, 200]",
  `
// Remove unique and 100 will repeat four times!
beat(1)::snd('sine').sustain(0.1).freq([100,100,100,100,200].unique().beat()).out()
`,
  true
)}

## Simple math operations

- <ic>add()</ic>: add a given amount to every list element.
- <ic>sub()</ic>: add a given amount to every list element.
- <ic>mult()</ic>: add a given amount to every list element.
- <ic>div()</ic>: add a given amount to every list element.

${makeExample("Simple addition", `[1, 2 ,3].add(2).beat()`, true)}

`;
};
