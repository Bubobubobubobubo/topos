import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const patterns = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Patterns

Playing with fixed values is fine but what if you could give more life to your parameters? Having parameters that can vary over time is important to describe melodies, rhythms, complex textures, etc. Topos comes with a lot of different abstractions to deal with musical patterns of increasing complexity. Some knowledge of patterns and how to use them will help you to break out of simple loops and repeating structures.

## Arrays

One of the most basic JavaScript data structures is [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). Topos is extending this data structure with custom methods that makes it usable for describing patterns that evolve over time. These methods can often be chained to compose more complex expressions: <ic>[1, 2, 3].repeatOdd(5).palindrome().beat()</ic>.

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
beat([.5, .25].beat(2)) :: sound('sine')
  .hcutoff(400)
  .fmi([1,2].beat(8))
  .fmh([0.5,0.25,1].beat(2))
  .note([50,53,57].beat(.25) + [12,24].beat(2))
  .sustain([0.25, 0.5].beat(8))
  .room(0.9).size(0.5)
  .delay(0.25).delayt([0.5,0.25].beat(16))
  .delayfb(0.5)
  .out()
`,
  false
)}
${makeExample(
  "Cool ambiance",
  `
beat(.5) :: snd(['kick', 'hat'].beat(4)).out()
beat([2,4].beat(2)) :: snd('shaker').delay(.5).delayfb(.75).delayt(0.125).out()
flip(2)::beat(1)::snd('clap').out()
flip(4)::beat(2)::snd('pad').n(2).shape(.5).orbit(2).room(0.9).size(0.9).release(0.5).out()
`,
  false
)}

- <ic>bar(value: number = 1)</ic>: returns the next value every bar (if <ic>value = 1</ic>). Using a larger value will return the next value every <ic>n</ic> bars.

${makeExample(
  "A simple drumbeat in no time!",
  `
beat(1)::sound(['kick', 'hat', 'snare', 'hat'].beat()).out()
beat(1.5)::sound(['jvbass', 'clap'].beat()).out()
`,
  true
)}

${makeExample(
  "Using beat, pulse and bar in the same code",
  `beat(2)::snd('snare').out()
beat([1, 0.5].beat()) :: sound(['bass3'].bar())
  .freq(100).n([12, 14].bar())
  .speed([1,2,3].pulse())
  .out()
`
)}

- <ic>palindrome()</ic>: Concatenates a list with the same list in reverse.

${makeExample(
  "Palindrome filter sweep",
  `
beat([1,.5,.25].beat()) :: snd('sine')
  .freq([100,200,300].beat(0.25))
  .fmi([1,2,3].palindrome().beat(0.5))
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
- <ic>gen(min,max,length)</ic>: generate a list of random numbers between _min_ and _max_ with a given _length_.

${makeExample(
  "Sipping some gasoline at the robot bar",
  `
beat(1)::snd('kick').shape(0.5).out()
beat([.5, 1].random() / 2) :: snd(
  ['amencutup', 'synth2'].random())
  .n(irand(4,10))
  .cutoff(2000)
  .resonance(10)
  .end(0.2).out()
`,
  true
)}

${makeExample(
  "Generate a list of random numbers",
  `beat(0.5) && sound('arp').freq([].gen(300,600,10).beat(3)).out()`,
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
- <ic>repeatEven(amount: number)</ic>: repeaet every pair element of the list _n_ times.
- <ic>repeatOdd(amount: number)</ic>: repeaet every odd element of the list _n_ times.

${makeExample(
  "Repeating samples a given number of times",
  `
// Please take this repeat number down a bit!
beat(.25)::sound('amencutup').n([1,2,3,4,5,6,7,8].repeatAll(4).beat()).out()
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
beat(.5) :: snd('sine')
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
beat(1)::snd('sine').sustain(0.1).freq([100,100,100,100,200].unique().beat()).out()
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


- <ic>add()</ic>: add a given amount to every list element.
- <ic>sub()</ic>: add a given amount to every list element.
- <ic>mult()</ic>: add a given amount to every list element.
- <ic>div()</ic>: add a given amount to every list element.

${makeExample("Simple addition", `[1, 2 ,3].add(2).beat()`, true)}

`;
};
