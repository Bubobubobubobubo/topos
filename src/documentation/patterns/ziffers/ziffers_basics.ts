import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const ziffers_basics = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Ziffers
	
Ziffers is a **musical number based notation** tuned for _live coding_. It is a very powerful and flexible notation for describing musical patterns in very few characters. Number based musical notation has a long history and has been used for centuries as a shorthand technique for music notation. Amiika has written [papers](https://zenodo.org/record/7841945) and other documents describing his system. It is currently implemented for many live coding platforms including [Sardine](https://sardine.raphaelforment.fr) (Raphaël Forment) and [Sonic Pi](https://sonic-pi.net/) (Sam Aaron). Ziffers can be used for:

- composing melodies using using **classical music notation and concepts**.
- exploring **generative / aleatoric / stochastic** melodies and applying them to sounds and synths.
- embracing a different mindset and approach to time and **patterning**.

${makeExample(
  "Super Fancy Ziffers example",
  `
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
`,
  true,
)}

## Evaluation

Evaluation of live coded Ziffers patterns can be done in 3 different ways. Normal evaluation using <ic>Ctrl+Enter</ic> updates the pattern after the current cycle is finished. Evaluation using <ic>Ctrl+Shift+Enter</ic> updates the pattern immediately keeping the current position, which enables to modify future events even within the current cycle. Evaluation using <ic>Ctrl+Shift+Backspace</ic> resets the current pattern and starts from the beginning immediately.

## Notation

The basic Ziffer notation is entirely written in JavaScript strings (_e.g_ <ic>"0 1 2"</ic>). It consists mostly of numbers and letters. The whitespace character is used as a separator. Instead of note names, Ziffer is using numbers to represent musical pitch and letters to represent musical durations. Alternatively, _floating point numbers_ can also be used to represent durations.

| Syntax        | Symbol | Description            |
|------------   |--------|------------------------|
| **Pitches**   | <ic>0-9</ic> <ic>{10 11 21}</ic> | Numbers or escaped numbers in curly brackets |
| **Duration**  | <ic>0.25</ic>, <ic>0.5</ic> | Floating point numbers can also be used as durations |
| **Duration**  | <ic>1/4</ic>, <ic>1/16</ic> | Fractions can be used as durations |
| **Subdivision** | <ic>[1 [2 3]]</ic> | Durations can be subdivided using square brackets |
| **Cycles**    | <ic>1 <2 4></ic> | Cycle values within the pattern |
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
  true,
)}

${makeExample(
  "Escaped pitches using curly brackets",
  `z1('_ _ 0 {9 10 11} 4 {12 13 14}')
  .sound('wt_05').pan(r(0,1))
  .cutoff(usaw(1/2) * 4000)
  .room(0.9).size(0.9).out()`,
  false,
)}

${makeExample(
  "Durations using fractions and floating point numbers",
  `
z1('1/8 0 2 4 0 2 4 1/4 0 3 5 0.25 _ 0 7 0 7')
  .sound('square').delay(0.5).delayt(1/8)
  .adsr(0, .1, 0, 0).delayfb(0.45).out()
`,
  false,
)}

${makeExample(
  "Disco was invented thanks to Ziffers",
  `
z1('e _ _ 0 ^ 0 _ 0 ^ 0').sound('jvbass').out()
beat(1)::snd('bd').out(); beat(2)::snd('sd').out()
beat(3) :: snd('cp').room(0.5).size(0.5).orbit(2).out()
`,
  false,
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
  false,
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
  false,
)}

${makeExample(
  "Subdivided durations",
  `
z1('w [0 [5 [3 7]]] h [0 4]')
  .scale('major').sound('sine')
  .fmi(usine(.5)).fmh(2).out()
`,
  false,
)}

## Rests

${makeExample(
  "Rest and octaves",
  `
z1('q 0 ^ e0 r _ 0 _ r 4 ^4 4')
.sound('sine').scale("godian").out()
`,
  true,
)}

${makeExample(
  "Rests with durations",
  `
 z1('q 0 4 e^r 3 e3 0.5^r h4 1/4^r e 5 r 0.125^r 0')
 .sound('sine').scale("aeryptian").out()
 `,
  true,
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
  `,
  true
  )}
  
  ${makeExample(
    "Chords from roman numerals",
    `
  z1('2/4 i vi ii v')
    .sound('triangle').adsr(0.2, 0.3, 0, 0)
    .room(0.5).size(0.9).scale("major").out()
  `,
  true
  )}
  
  ${makeExample(
    "Named chords with repeats",
    `
  z1('0.25 Bmaj7!2 D7!2 _ Gmaj7!2 Bb7!2 ^ Ebmaj7!2')
    .sound('square').room(0.5).cutoff(500)
    .lpadsr(4, 0, .4, 0, 0).size(0.9)
    .scale("major").out()
  `,
  true
  )}
  
  ${makeExample(
    "Transposing chords",
    `
  z1('q Amin!2').key(["A2", "E2"].beat(4))
    .sound('sawtooth').cutoff(500)
    .lpadsr(2, 0, .5, 0, 0, 0).out()`,
  )}
  
  ${makeExample(
    "Chord inversions with roman numerals",
    `
  z1('i i v%-4 v%-2 vi%-5 vi%-3 iv%-2 iv%-1')
    .sound('triangle').adsr(1/16, 1/5, 0.1, 0)
    .delay(0.5).delayt([1/8, 1/4].beat(4))
    .delayfb(0.5).out()
  beat(4) :: sound('breaks165').stretch(4).out()
  `,
  )}
  
  ${makeExample(
    "Chord inversion with named chords",
    `
  z1('1/4 Cmin!3 Fmin!3 Fmin%-1 Fmin%-2 Fmin%-1')
    .sound("sine").bpf(500 + usine(1/4) * 2000)
    .out()
  `,
  )}
  
  ${makeExample(
    "Programmatic inversions",
    `
  z1('1/6 i v 1/3 vi iv').invert([1,-1,-2,0].beat(4))
    .sound("sawtooth").cutoff(1000)
    .lpadsr(2, 0, .2, 0, 0).out()
    `,
  )}

## Arpeggios

Chords can be arpeggiated using the @-character within the ziffers notation or by using <ic>arpeggio</ic> method.

${makeExample(
  "Arpeggio using the mini-notation",
  `
  z1("(i v vi%-3 iv%-2)@(s 0 2 0 1 2 1 0 2)")
  .sound("sine").out()
  `,
)}

${makeExample(
  "Arpeggio from named chords with durations",
  `
z1("_ Gm7 ^ C9 D7 Gm7")
  .arpeggio("e 0 2 q 3 e 1 2")
  .sound("sine").out()
  `,
)}

${makeExample(
  "Arpeggio from roman chords with inversions",
  `
  z1("i v%-1 vi%-1 iv%-2")
    .arpeggio(0,2,1,2)
    .noteLength(0.125)
    .sound("sine").out()
  `,
)}

## Chaining
	
- Basic notation
	
${makeExample(
  "Simple method chaining",
  `
z1('0 1 2 3').key('G3')
  .scale('minor').sound('sine').out()
`,
  true,
)}

${makeExample(
  "More complex chaining",
  `
z1('0 1 2 3 4').key('G3').scale('minor').sound('sine').often(n => n.pitch+=3).rarely(s => s.delay(0.5)).out()
`,
  true,
)}

${makeExample(
  "Alternative way for inputting options",
  `
z1('0 3 2 4',{key: 'D3', scale: 'minor pentatonic'}).sound('sine').out()
`,
  true,
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
  true,
)}  

`;
};
