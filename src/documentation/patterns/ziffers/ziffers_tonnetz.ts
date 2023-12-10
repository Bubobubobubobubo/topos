import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const ziffers_tonnetz = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Tonnetz

The Riemannian Tonnetz is a geometric representation of tonal relationships for applying mathematical operations to analyze harmonic and melodic relationships in tonal music. Ziffers includes an implementation of live coding tonnetz developed together with <a href="https://github.com/edelveart/TypeScriptTonnetz" target="_blank">Edgar Delgado Vega</a>. Live coding tonnetz implementation combines all transformations to new explorative notation that includes all of the traditional triad transformations (PLR functions), film music transformations and seventh transformations (PLRQ, PLR*, ST, etc.). 

Tonnetz can be visualized as an <a href="https://numeric-tonnetz-ziffers-6f7c9299bb4e1292f6891b9aceba16d81409236.gitlab.io/" target="_blank">numeric lattice</a> that represents the twelve pitch classes of the chromatic scale. The numeric visualization is a fork of <a href="https://hal.science/hal-03250334/" target="_blank">Web tonnetz</a> by Corentin Guichaou et. al. The lattice can be arranged into multiple tonal pitch spaces which are all supported in Ziffers implementation.

TBD: Write summary about: HexaCycles, OctaCycles, EnneaCycles
	
## Explorative notation

Ziffers implements explorative live coding notation that indexes all of the transformations for triad and seventh chords. For more detailed transformations see Triad and Tetra chapters.

Transformations are applied by grouping operations into a parameter string which applies the transformations to the chord. The parameter string is a sequence of transformations separated by whitespace, for example <ic>plr rl2 p3lr</ic>. The numbers after the characters defines the index for the operation, as there can be multiple operations of the same type.

Indexed transformations <ic>[plrfsntq][1-9]*</ic>:

* p: Parallel
* l: Leading
* r: Relative
* f: Film transformation
* n: Film transformation
* s: Film transformation
* h: Film transformation
* t: Film transformation
* q: PLR* transformation ?

### Examples:

${makeExample(
  "Explorative transformations with roman chords",
  `
z1('i i7').tonnetz("p1 p2 plr2")
  .sound('wt_stereo')
  .adsr(0, .1, 0, 0)
  .out()`,
  true,
)}

${makeExample(
  "Arpeggiated explorative transformations",
  `
z1("i7")
  .tonnetz("p l2 r3 rp4l")
  .arpeggio("e _ 0 1 s ^ 0 2 1 3 h _ 012 s ^ 2 1")
  .sound("sine")
  .out()`,
  true,
)}

${makeExample(
  "Arpeggios and note lengths with parameters",
  `
  z1("024")
  .tonnetz("p lr rp lrp")
  .arpeggio(0,2,1,2)
  .noteLength(1/16,1/8)
  .sound("sine")
  .out()`,
  true,
)}


## Triad transformations

Triad transofrmations can be defined explicitly using the <ic>triadTonnetz(transformation: string, tonnetz: number[])</ic> method. This method will only apply spesific transformations to triad chords.

* p
* l
* r
* f
* n
* s
* h
* t6
* p32
* p41
* lt13
* l41
* lt13
* l41
* rt23
* rt42
* q13
* q42
* n42

### Examples:


## Tetra transformations

Tetra transformations can be applied to seventh chords using the <ic>tetraTonnetz(transformation: string, tonnetz: number[])</ic> method. This method will apply spesific transformations to certain type of chords. If the chord is not the correct type, the transformation will not be applied.

### 7: 7th chords

* p: p12, p14, p18, p19
* l: l13, l15, l71
* r: r12, rr19
* q: q15, qq51
* n: n51

${makeExample(
  "Transform seventh chord from chromatic scale",
  `
  z1("1.0 047{10}")
  .scale('chromatic')
  .tetraTonnetz("o p18 q15 l13 n51 p19 q15")
  .sound("sawtooth")
  .cutoff(500 + usine(1/8) * 2000)
  .adsr(.5,0.05,0.25,0.5)
  .dur(2.0)
  .out()`,
  true,
)}

### m7: minor 7th chords

  * p: p12, p23, p26
  * l: l42
  * r: r12, r23, r42
  * q: q62

### hdim7: Half diminished 7th chords

  * p: p23, p35, p39
  * l: l13
  * r: r23, r35, r53, r63, rr35, rr39
  * q: q43, qq38

### maj7: Major 7th chords
  * p: p14, p47, p64
  * l: l42
  * r: r42
  * q: q43

### dim7: Diminished 7th chords
  * p: p35
  * l: l15
  * r: r35, r53
  * q: q15, qq51
  * n: n51

### minMaj7: Minor major 7th chords
  * p: p26, p64
  * r: r63, r76, r86
  * q: q62, q76

### maj7aug5: Major 7th augmented 5th chords
  * p: p47, p87
  * l: l71
  * r: r76
  * q: q76

### dom7aug5: Dominant 7th augmented 5th chords
  * p: p18, p87, p98
  * l: l89
  * r: r86, rr98
  * q: qq38, qq98

### dom7b5: Dominant 7th flat 5th chords
  * p: p19, p39, p98
  * l: l89
  * r: rr19, rr39, rr98
  * q: qq98

## Cyclic methods

In addition to the transformations, Ziffers implements cyclic methods that can be used to cycle through the tonnetz space. Cyclic methods turns individual pitch classes to chords using the tonnetz. The cyclic methods are:

* <ic>hexaCycle(tonnetz: number[])</ic>: Cycles through chords in the hexa cycle
* <ic>octaCycle(tonnetz: number[])</ic>: Cycles through chords in the octa cycle
* <ic>enneaCycle(tonnetz: number[])</ic>: Cycles through chords in the ennea cycle

### Examples:

${makeExample(
  "Arpeggio with ennea cycle",
  `
  z1("0 2 -1 3")
  .enneaCycle()
  .arpeggio(0,2,1)
  .scale("modimic")
  .noteLength(0.15,0.05,0.05,0.25)
  .sound("sine")
  .adsr(0.1,0.15,0.25,0.1)
  .out()`,
  true,
)}

${makeExample(
  "Variating arpeggios",
  `
  z1("s 0 3 2 1")
  .octaCycle()
  .arpeggio([0,[0,2],[1,0],[0,1,2]].beat(0.15))
  .sound("triangle")
  .adsr(0.1,0.1,0.13,0.15)
  .out()`,
  true,
)}





## Regions

TBD: Implement and write about Weitzmann Regions, Boretz Regions, OctaTowers



`;
};
