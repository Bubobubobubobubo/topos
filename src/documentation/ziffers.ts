import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const ziffers = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Ziffers
	
Ziffers is a **musical number based notation** tuned for _live coding_. It is a very powerful and flexible notation for describing musical patterns in very few characters. Number based musical notation has a long history and has been used for centuries as a shorthand technique for music notation. Amiika has written [papers](https://zenodo.org/record/7841945) and other documents describing his system. It is currently implemented for many live coding platforms including [Sardine](https://sardine.raphaelforment.fr) (Raphaël Forment) and [Sonic Pi](https://sonic-pi.net/) (Sam Aaron). Ziffers can be used for:

- composing melodies using using **classical music notation and concepts**.
- exploring **generative / aleatoric / stochastic** melodies and applying them to sounds and synths.
- embracing a different mindset and approach to time and **patterning**.

${makeExample("Super Fancy Ziffers example", ``, true)}

## Notation

The basic Ziffer notation is entirely written in JavaScript strings (_e.g_ <ic>"0 1 2"</ic>). It consists mostly of numbers and letters. The whitespace character is used as a separator. Instead of note names, Ziffer is using numbers to represent musical pitch and letters to represent musical durations. Alternatively, _floating point numbers_ can also be used to represent durations.

| Syntax        | Symbol | Description            |
|------------   |--------|------------------------|
| **Pitches**   | <ic>0-9</ic> <ic>{10 11 21}</ic> | Numbers or escaped numbers in curly brackets |
| **Duration** | <ic>a b c</ic> to <ic>z</ic> | Each letter of the alphabet is a rhythm (see table) |
| **Duration**  | <ic>0.25</ic> = <ic>q</ic>, <ic>0.5</ic> = <ic>h</ic> | Floating point numbers can also be used as durations |
| **Subdivision** | <ic>[1 [2 3]]</ic> | Durations can be subdivided using square brackets |
| **Octave**    | <ic>^ _</ic> | <ic>^</ic> for octave up and <ic>_</ic> for octave down |
| **Accidentals** | <ic># b</ic> | Sharp and flats, just like with regular music notation :smile: |
| **Rest**      |  <ic>r</ic> | Rest / silences |
| **Repeat**    | <ic>:1-9</ic> | Repeat the item 1-9 times  |

**Note:** Some features are still unsupported. For full syntax see article about <a href="https://zenodo.org/record/7841945" target="_blank">Ziffers</a>.

${makeExample(
  "Pitches from 0 to 9",
  `
z1('s 0 1 2 3 4 5 6 7 8 9').sound('pluck').release(0.1).sustain(0.25).out()
`,
  true
)}

${makeExample(
  "Escaped pitches using curly brackets",
  `
let pattern = div(4) ? z1('s _ _ 0 0 {9 11}') : z1('s _ 0 0 {10 12}');
pattern.sound('pluck').sustain(0.1).room(0.9).out();
`,
  false
)}

${makeExample(
  "Durations using letters and floating point numbers",
  `
div(8) ? z1('s 0 e 1 q 2 h 3 w 4').sound('sine').scale("locrian").out()
	   : z1('0.125 0 0.25 2').sound('sine').scale("locrian").out()
`,
  false
)}

${makeExample(
  "Disco was invented thanks to Ziffers",
  `
z1('e _ _ 0 ^ 0 _ 0 ^ 0').sound('jvbass').out()
mod(1)::snd('bd').out(); mod(2)::snd('sd').out()
mod(3) :: snd('cp').room(0.5).size(0.5).orbit(2).out()
`,
  false
)}

${makeExample(
  "Accidentals and rests for nice melodies",
  `
z1('e 0 s 1 b2 3 e 0 s 1 b2 4')
  .scale('major').sound('sine')
  .fmi(usine(.5)).fmh(2)
  .delay(0.5).delayt(1.25)
  .sustain(0.1).out()
`,
  false
)}

${makeExample(
  "Repeat items n-times",
  `
z1('e 0:4 2:2 4:2 (0 4):2')
  .scale('major').sound('sine')
  .fmi(usine(.5)).fmh(2)
  .delay(0.5).delayt(1.25)
  .sustain(0.1).out()
`,
  false
)}

${makeExample(
  "Subdivided durations",
  `
z1('w [0 [5 [3 7]]] h [0 4]')
  .scale('major').sound('sine')
  .fmi(usine(.5)).fmh(2).out()
`,
  false
)}

## Algorithmic operations

Ziffers provides shorthands for **many** numeric and algorithimic operations such as evaluating random numbers and creating sequences using list operations:

* **List operations:** Cartesian operation (_e.g._ <ic>(3 2 1)+(2 5)</ic>) using the <ic>+</ic> operator. All the arithmetic operators are supported.

${makeExample(
  "Element-wise operations for melodic generation",
  `
z1("q 0 s (3 2 1)+(2 5) q 0 s (4 5 6)-(2 3)").sound('sine')
  .scale('minor').fmi(2).fmh(2).room(0.5).size(0.5).sustain(0.1)
  .delay(0.5).delay(0.125).delayfb(0.25).out();
`,
  true
)}

* **Random numbers:** <ic>(4,6)</ic> Random number between 4 and 6

${makeExample(
  "Random numbers, true computer music at last!",
  `
z1("s (0,8) 0 0 (0,5) 0 0").sound('sine')
  .scale('minor').fmi(2).fmh(2).room(0.5)
	.size(0.5).sustain(0.1) .delay(0.5)
	.delay(0.125).delayfb(0.25).out();
mod(.5) :: snd(['kick', 'hat'].div(.5)).out()
`,
  true
)}

## Keys and scales

Ziffers supports all the keys and scales. Keys can be defined by using [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation), for example <ic>F3</ic>. Western style (1490 scales) can be with scale names named after greek modes and extended by [William Zeitler](https://ianring.com/musictheory/scales/traditions/zeitler). You will never really run out of scales to play with using Ziffers. Here is a short list of some possible scales that you can play with:

| Scale name | Intervals              |
|------------|------------------------|
| Lydian     | <ic>2221221</ic> |
| Mixolydian | <ic>2212212</ic> |
| Aeolian    | <ic>2122122</ic> |
| Locrian    | <ic>1221222</ic> |
| Ionian     | <ic>2212221</ic> |
| Dorian     | <ic>2122212</ic> |
| Phrygian   | <ic>1222122</ic> |
| Soryllic   | <ic>11122122</ic>|
| Modimic    | <ic>412122</ic>  |
| Ionalian   | <ic>1312122</ic> |
| ... | And it goes on for **1490** scales |

${makeExample(
  "What the hell is the Modimic scale?",
  `
z1("s (0,8) 0 0 (0,5) 0 0").sound('sine')
  .scale('modimic').fmi(2).fmh(2).room(0.5)
	.size(0.5).sustain(0.1) .delay(0.5)
	.delay(0.125).delayfb(0.25).out();
mod(.5) :: snd(['kick', 'hat'].div(.5)).out()
`,
  true
)}



<ic></ic>

You can also use more traditional <a href="https://ianring.com/musictheory/scales/traditions/western" target="_blank">western names</a>:


| Scale name | Intervals              |
|------------|------------------------|
| Major      | <ic>2212221</ic> |
| Minor      | <ic>2122122</ic> |
| Minor pentatonic   | <ic>32232</ic>  |
| Harmonic minor     | <ic>2122131</ic>|
| Harmonic major     | <ic>2212131</ic>|
| Melodic minor      | <ic>2122221</ic>|
| Melodic major      | <ic>2212122</ic>|
| Whole              | <ic>222222</ic> |
| Blues minor        | <ic>321132</ic> |
| Blues major        | <ic>211323</ic> |


${makeExample(
  "Let's fall back to a classic blues minor scale",
  `
z1("s (0,8) 0 0 (0,5) 0 0").sound('sine')
  .scale('blues minor').fmi(2).fmh(2).room(0.5)
	.size(0.5).sustain(0.25).delay(0.25)
	.delay(0.25).delayfb(0.5).out();
mod(1, 1.75) :: snd(['kick', 'hat'].div(1)).out()
`,
  true
)}

Microtonal scales can be defined using <a href="https://www.huygens-fokker.org/scala/scl_format.html" target="_blank">Scala format</a> or by extended notation defined by Sevish <a href="https://sevish.com/scaleworkshop/" target="_blank">Scale workshop</a>, for example:

- **Young:** 106. 198. 306.2 400.1 502. 604. 697.9 806.1 898.1 1004.1 1102. 1200.
- **Wendy carlos:** 17/16 9/8 6/5 5/4 4/3 11/8 3/2 13/8 5/3 7/4 15/8 2/1


${makeExample(
  "Wendy Carlos, here we go!",
  `
z1("s ^ (0,8) 0 0 _ (0,5) 0 0").sound('sine')
  .scale('17/16 9/8 6/5 5/4 4/3 11/8 3/2 13/8 5/3 7/4 15/8 2/1').fmi(2).fmh(2).room(0.5)
	.size(0.5).sustain(0.15).delay(0.1)
	.delay(0.25).delayfb(0.5).out();
mod(1, 1.75) :: snd(['kick', 'hat'].div(1)).out()
`,
  true
)}

## Synchronization

Ziffers numbered methods **(z0-z16)** can be used to parse and play patterns. Each method is individually cached and can be used to play multiple patterns simultaneously. By default, each Ziffers expression can have a different duration. This system is thus necessary to make everything fit together in a loop-based environment like Topos.

Numbered methods are synced automatically to **z0** method if it exsists. Syncing can also be done manually by using either the <ic>wait</ic> method, which will always wait for the current pattern to finish before starting the next cycle, or the <ic>sync</ic> method will only wait for the synced pattern to finish on the first time.

${makeExample(
  "Automatic sync to z0",
  `
z0('w 0 8').sound('peri').out()
z1('e 0 4 5 9').sound('bell').out()
`,  
  true
)}

${makeExample(
  "Sync with wait",
  `
z1('w 0 5').sound('pluck').release(0.1).sustain(0.25).out()
z2('q 6 3').wait(z1).sound('sine').release(0.16).sustain(0.55).out()
`,  
  true
)}

${makeExample(
  "Sync on first run",
  `
  z1('w __ 0 5 9 3').sound('bin').out()
  z2('q __ 4 2 e 6 3 q 6').sync(z1).sound('east').out()
`,  
  true
)}




## Examples
	
- Basic notation
	
${makeExample(
  "Simple method chaining",
  `
z1('0 1 2 3').key('G3')
  .scale('minor').sound('sine').out()
`,
  true
)}

${makeExample(
  "More complex chaining",
  `
z1('0 1 2 3 4').key('G3').scale('minor').sound('sine').often(n => n.pitch+=3).rarely(s => s.delay(0.5)).out()
`,
  true
)}

${makeExample(
  "Simple options",
  `
z1('0 3 2 4',{key: 'D3', scale: 'minor pentatonic'}).sound('sine').out()
`,
  true
)}

${makeExample(
  "Duration chars",
  `
`,
  true
)}

${makeExample(
  "Decimal durations",
  `
z1('0.25 5 1 2 6 0.125 3 8 0.5 4 1.0 0').sound('sine').scale("ionian").out()
`,
  true
)}

${makeExample(
  "Rest and octaves",
  `
z1('q 0 ^ e0 r _ 0 _ r 4 ^4 4').sound('sine').scale("ionian").out()
`,
  true
)}

- Scales

${makeExample(
  "Microtonal scales",
  `
z1('q 0 3 {10 14} e 8 4 {5 10 12 14 7 0}').sound('sine')
.fmi([1,2,4,8].pick())
.scale("17/16 9/8 6/5 5/4 4/3 11/8 3/2 13/8 5/3 7/4 15/8 2/1")
.out()
`,
  true
)}

${makeExample(
  "Scala scale from variable",
  `
  const werckmeister = "107.82 203.91 311.72 401.955 503.91 605.865 701.955 809.775 900. 1007.82 1103.91 1200."

  z0('s (0,3) ^ 0 3 ^ 0 (3,6) 0 _ (3,5) 0 _ 3 ^ 0 (3,5) ^ 0 6 0 _ 3 0')
    .key('C3')
    .scale(werckmeister)
    .sound('sine')
    .fmi(1 + usine(0.5) * irand(1,10))
    .cutoff(100 + usine(.5) * 100) 
    .out()
  
  onbeat(1,1.5,3) :: sound('bd').cutoff(100 + usine(.25) * 1000).out()
`,
  true
)}

- Algorithmic operations

${makeExample(
  "Random numbers",
  `
z1('q 0 (2,4) 4 (5,9)').sound('sine')
.scale("Bebop minor")
.out()
`,
  true
)}

${makeExample(
  "List operations",
  `
z1('q (0 3 1 5)+(2 5) e (0 5 2)*(2 3) (0 5 2)>>(2 3) (0 5 2)%(2 3)').sound('sine')
.scale("Bebop major")
.out()
`,
  true
)}

`;
};
