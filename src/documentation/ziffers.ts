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

${makeExample("Super Fancy Ziffers example", `
z1('1/8 024!3 035 024 0124').sound('wt_stereo')
  .adsr(0, .4, 0.5, .4).gain(0.1)
  .lpadsr(4, 0, .2, 0, 0)
  .cutoff(5000 + usine(1/2) * 2000)
  .n([1,2,4].beat(4)).out()
z2('<1/8 1/16> __ 0 <(^) (^ ^)> (0,8)').sound('wt_stereo')
  .adsr(0, .5, 0.5, .4).gain(0.2)
  .lpadsr(4, 0, .2, 0, 0).n(14)
  .cutoff(200 + usine(1/2) * 4000)
  .n([1,2,4].beat(4)).o(2).room(0.9).out()
let osci = 1500 + usine(1/2) * 2000;
z3('can can:2').sound().gain(1).cutoff(osci).out()
z4('1/4 kick kick snare kick').sound().gain(1).cutoff(osci).out()
`, true)}

## Notation

The basic Ziffer notation is entirely written in JavaScript strings (_e.g_ <ic>"0 1 2"</ic>). It consists mostly of numbers and letters. The whitespace character is used as a separator. Instead of note names, Ziffer is using numbers to represent musical pitch and letters to represent musical durations. Alternatively, _floating point numbers_ can also be used to represent durations.

| Syntax        | Symbol | Description            |
|------------   |--------|------------------------|
| **Pitches**   | <ic>0-9</ic> <ic>{10 11 21}</ic> | Numbers or escaped numbers in curly brackets |
| **Duration**  | <ic>0.25</ic>, <ic>0.5</ic> | Floating point numbers can also be used as durations |
| **Duration**  | <ic>1/4</ic>, <ic>1/16</ic> | Fractions can be used as durations |
| **Subdivision** | <ic>[1 [2 3]]</ic> | Durations can be subdivided using square brackets |
| **Octave**    | <ic>^ _</ic> | <ic>^</ic> for octave up and <ic>_</ic> for octave down |
| **Accidentals** | <ic># b</ic> | Sharp and flats, just like with regular music notation :smile: |
| **Rest**      |  <ic>r</ic> | Rest / silences |
| **Repeat**    | <ic>!1-9</ic> | Repeat the item 1 to 9 times  |
| **Chords**    | <ic>[1-9]+ / [iv]+ / [AG]+name</ic> | Multiple pitches grouped together, roman numerals or named chords |
| **Samples**   | <ic>[a-z0-9_]+</ic> | Samples can be used pitched or unpitched | 
| **Index/Channel** | <ic>[a-z0-9]+:[0-9]*</ic> | Samples or midi channel can be changed using a colon |

**Note:** Some features are experimental and some are still unsupported. For full / prior syntax see article about <a href="https://zenodo.org/record/7841945" target="_blank">Ziffers</a>.

${makeExample(
    "Pitches from 0 to 9",
    `
z1('0.25 0 1 2 3 4 5 6 7 8 9').sound('wt_stereo')
  .adsr(0, .1, 0, 0).out()`,
    true
  )}

${makeExample(
    "Escaped pitches using curly brackets",
    `z1('_ _ 0 {9 10 11} 4 {12 13 14}')
  .sound('wt_05').pan(r(0,1))
  .cutoff(usaw(1/2) * 4000)
  .room(0.9).size(0.9).out()`,
    false
  )}

${makeExample(
    "Durations using fractions and floating point numbers",
    `
z1('1/8 0 2 4 0 2 4 1/4 0 3 5 0.25 _ 0 7 0 7')
  .sound('square').delay(0.5).delayt(1/8)
  .adsr(0, .1, 0, 0).delayfb(0.45).out()
`,
    false
  )}

${makeExample(
    "Disco was invented thanks to Ziffers",
    `
z1('e _ _ 0 ^ 0 _ 0 ^ 0').sound('jvbass').out()
beat(1)::snd('bd').out(); beat(2)::snd('sd').out()
beat(3) :: snd('cp').room(0.5).size(0.5).orbit(2).out()
`,
    false
  )}

${makeExample(
    "Accidentals and rests for nice melodies",
    `
z1('^ 1/8 0 1 b2 3 4 _ 4 b5 4 3 b2 1 0')
  .scale('major').sound('triangle')
  .cutoff(500).lpadsr(5, 0, 1/12, 0, 0)
  .fmi(0.5).fmh(2).delay(0.5).delayt(1/3)
  .adsr(0, .1, 0, 0).out()
`,
    false
  )}

${makeExample(
    "Repeat items n-times",
    `
z1('1/8 _ _ 0!4 3!4 4!4 3!4')
  .scale('major').sound('wt_oboe')
  .shape(0.2).sustain(0.1).out()
z2('1/8 _ 0!4 5!4 4!2 7!2')
  .scale('major').sound('wt_oboe')
  .shape(0.2).sustain(0.1).out()
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

## Chords

Chords can be build by grouping pitches or using roman numeral notation, or by using named chords.

${makeExample(
    "Chords from pitches",
    `
z1('1.0 024 045 058 046 014')
  .sound('sine').adsr(0.5, 1, 0, 0)
  .room(0.5).size(0.9)
  .scale("minor").out()
`
  )}

${makeExample(
    "Chords from roman numerals",
    `
z1('2/4 i vi ii v')
  .sound('triangle').adsr(0.2, 0.3, 0, 0)
  .room(0.5).size(0.9).scale("major").out()
`
  )}

${makeExample(
    "Named chords with repeats",
    `
z1('0.25 Bmaj7!2 D7!2 _ Gmaj7!2 Bb7!2 ^ Ebmaj7!2')
  .sound('square').room(0.5).cutoff(500)
  .lpadsr(4, 0, .4, 0, 0).size(0.9)
  .scale("major").out()
`
  )}

${makeExample(
    "Transposing chords",
    `
z1('q Amin!2').key(["A2", "E2"].beat(4))
  .sound('sawtooth').cutoff(500)
  .lpadsr(2, 0, .5, 0, 0, 0).out()
z2('east east east:2 east').sound().out()`
  )}

${makeExample(
    "Chord transposition with roman numerals",
    `
z1('i i v%-4 v%-2 vi%-5 vi%-3 iv%-2 iv%-1')
  .sound('triangle').adsr(1/16, 1/5, 0.1, 0)
  .delay(0.5).delayt([1/8, 1/4].beat(4))
  .delayfb(0.5).out()
beat(4) :: sound('breaks165').stretch(4).out()
`
  )}

${makeExample(
    "Chord transposition with named chords",
    `
z1('1/4 Cmin!3 Fmin!3 Fmin%-1 Fmin%-2 Fmin%-1')
  .sound("sine").bpf(500 + usine(1/4) * 2000)
  .out()
`
  )}

${makeExample(
    "Programmatic inversions",
    `
z1('1/6 i v 1/3 vi iv').invert([1,-1,-2,0].beat(4))
  .sound("sawtooth").cutoff(1000)
  .lpadsr(2, 0, .2, 0, 0).out()
  `
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
beat(.5) :: snd(['kick', 'hat'].beat(.5)).out()
`,
    true
  )}

## Keys and scales

Ziffers supports all the keys and scales. Keys can be defined by using [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation), for example <ic>F3</ic>. Western style (1490 scales) can be with scale names named after greek modes and extended by [William Zeitler](https://ianring.com/musictheory/scales/traditions/zeitler). You will never really run out of scales to play with using Ziffers. Here is a short list of some possible scales that you can play with:

| Scale name | Intervals              |
|------------|------------------------|
| Lydian     | <ic>2221221</ic> |
| Mixolydian | <ic>2212212</ic> |
| Aeolian    | <ic>2122122</ic> |
| Locrian    | <ic>1221222</ic> |
| Ionian     | <ic>2212221</ic> |
| Dorian     | <ic>2122212</ic> |
| Phrygian   | <ic>1222122</ic> |
| Soryllic   | <ic>11122122</ic>|
| Modimic    | <ic>412122</ic>  |
| Ionalian   | <ic>1312122</ic> |
| ... | And it goes on for **1490** scales |

${makeExample(
    "What the hell is the Modimic scale?",
    `
z1("s (0,8) 0 0 (0,5) 0 0").sound('sine')
  .scale('modimic').fmi(2).fmh(2).room(0.5)
	.size(0.5).sustain(0.1) .delay(0.5)
	.delay(0.125).delayfb(0.25).out();
beat(.5) :: snd(['kick', 'hat'].beat(.5)).out()
`,
    true
  )}



<ic></ic>

You can also use more traditional <a href="https://ianring.com/musictheory/scales/traditions/western" target="_blank">western names</a>:


| Scale name | Intervals              |
|------------|------------------------|
| Major      | <ic>2212221</ic> |
| Minor      | <ic>2122122</ic> |
| Minor pentatonic   | <ic>32232</ic>  |
| Harmonic minor     | <ic>2122131</ic>|
| Harmonic major     | <ic>2212131</ic>|
| Melodic minor      | <ic>2122221</ic>|
| Melodic major      | <ic>2212122</ic>|
| Whole              | <ic>222222</ic> |
| Blues minor        | <ic>321132</ic> |
| Blues major        | <ic>211323</ic> |


${makeExample(
    "Let's fall back to a classic blues minor scale",
    `
z1("s (0,8) 0 0 (0,5) 0 0").sound('sine')
  .scale('blues minor').fmi(2).fmh(2).room(0.5)
	.size(0.5).sustain(0.25).delay(0.25)
	.delay(0.25).delayfb(0.5).out();
beat(1, 1.75) :: snd(['kick', 'hat'].beat(1)).out()
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
beat(1, 1.75) :: snd(['kick', 'hat'].beat(1)).out()
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
  z1('q 0 0 4 4 5 5 h4 q 3 3 2 2 1 1 h0').sound('sine').out()
`,
    true
  )}

${makeExample(
    "Fraction durations",
    `
  z1('1/4 0 0 4 4 5 5 2/4 4 1/4 3 3 2 2 1 1 2/4 0').sound('sine').out()
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

## Samples

Samples can be patterned using the sample names or using <c>@</c>-operator for assigning sample to a pitch. Sample index can be changed using the <c>:</c> operator.

${makeExample(
    "Sampled drums",
    `
  z1('bd [hh hh]').octave(-2).sound('sine').out()
  `,
    true
  )}

${makeExample(
    "More complex pattern",
    `
  z1('bd [hh <hh <cp cp:2>>]').octave(-2).sound('sine').out()
  `,
    true
  )}

${makeExample(
    "Pitched samples",
    `
  z1('0@sax 3@sax 2@sax 6@sax')
    .octave(-1).sound()
    .adsr(0.25,0.125,0.125,0.25).out()
  `,
    true
  )}

${makeExample(
    "Pitched samples from list operation",
    `
  z1('e (0 3 -1 4)+(-1 0 2 1)@sine')
  .key('G4')
  .scale('110 220 320 450')
  .sound().out()
  `,
    true
  )}

${makeExample(
    "Pitched samples with list notation",
    `
  z1('e (0 2 6 3 5 -2)@sax (0 2 6 3 5 -2)@arp')
    .octave(-1).sound()
    .adsr(0.25,0.125,0.125,0.25).out()
  `,
    true
  )}

${makeExample(
    "Sample indices",
    `
  z1('e 1:2 4:3 6:2')
  .octave(-1).sound("east").out()
  `,
    true
  )}

${makeExample(
    "Pitched samples with sample indices",
    `
z1('_e 1@east:2 4@bd:3 6@arp:2 9@baa').sound().out()
`,
    true
  )}



## String prototypes

You can also use string prototypes as an alternative syntax for creating Ziffers patterns

${makeExample(
    "String prototypes",
    `
  "q 0 e 5 2 6 2 q 3".z0().sound('sine').out()
  "q 2 7 8 6".z1().octave(-1).sound('sine').out()
  "q 2 7 8 6".z2({key: "C2", scale: "aeolian"}).sound('sine').scale("minor").out()
`,
    true
  )}  

`;
};
