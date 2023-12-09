import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const ziffers_rhythm = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Rhythm

Ziffers combines rhythmic and melodic notation into a single pattern language. This means that you can use the same pattern to describe both the rhythm and the melody of a musical phrase similarly to the way it is done in traditional music notation.

${makeExample(
  "Duration chars",
  `
  z1('q 0 0 4 4 5 5 h4 q 3 3 2 2 1 1 h0').sound('sine').out()
`,
  true,
)}

${makeExample(
  "Fraction durations",
  `
  z1('1/4 0 0 4 4 5 5 2/4 4 1/4 3 3 2 2 1 1 2/4 0')
  .sound('sine').out()
`,
  true,
)}

${makeExample(
  "Decimal durations",
  `
z1('0.25 5 1 2 6 0.125 3 8 0.5 4 1.0 0')
.sound('sine').scale("galian").out()
`,
  true,
)}

## List of all duration characters

Ziffers maps the following duration characters to the corresponding note lengths.

|	Character	|	Fraction | Duration |	Name (US)	|	Name (UK)	|
| ----- | ----- | ------- | ----- |
| m..   | 14/1  | 14.0    | Double dotted maxima | Double dotted Large
| m.    | 12/1  | 12.0    | Dotted maxima | Dotted Large |
|	m	    |	8/1   | 8.0	    |	Maxima	|	Large	|
| l..   | 7/1   | 7.0     | Double dotted long note | Double dotted longa |
| l.    | 6/1   | 6.0     | Long dotted note | Longa dotted |
|	l	    |	4/1   | 4.0	    |	Long	|	Longa |
|	p	    |	8/3   | 2.6666	|	Triplet maxima	|	Triplet longa	|
| d..   | 7/2   | 3.5     | Double dotted long note | Double dotted breve |
| d.    | 3/3   | 3.0     | Double whole note | Double breve |
|	d	    |	2/1   | 2.0	    |	Double whole note	|	Breve	|
|	c	    |	4/3   | 1.3333  |	Triplet long	|	Triplet breve	|
| w..   | 7/4   | 1.75    | Double dotted whole note | Double dotted breve |
| w.    | 3/2   | 1.5     | Dotted whole note | Dotted breve |
|	w	    |	1/1   | 1.0	    |	Whole note	|	Semibreve	|
|	y	    |	2/3   | 0.6666	|	Triplet half	|	Triplet semibreve	|
| h..   | 7/8   | 0.875   | Double dotted half note | Double dotted minim |
| h.    | 3/4   | 0.75    | Dotted half note | Dotted minim |
|	h	    |	1/2   | 0.5	    |	Half note 	|	Minim	|
|	n	    |	1/3   | 0.3333	|	Triplet whole	|	Triplet minim	|
| q..   | 7/16  | 0.4375  | Double dotted quarter note | Double dotted crotchet |
| q.    | 3/8   | 0.375   | Dotted quarter note | Dotted crotchet |
|	q	    |	1/4   | 0.25  	|	Quarter note	|	Crotchet	|
|	a	    |	1/6   | 0.1666	|	Triplet quarter	|	Triplet crochet 	|
| e..   | 7/32  | 0.2187  | Double dotted eighth note | Double dotted quaver |
| e.    | 3/16  | 0.1875  | Dotted eighth note | Dotted quaver |
|	e	    |	1/8   | 0.125	  |	8th note	|	Quaver	|
|	f	    |	1/12  | 0.0833	|	Triplet 8th	|	Triplet quaver	|
| s..   | 7/64  | 0.1093  | Double dotted sixteenth note | Double dotted semiquaver |
| s.    | 3/32  | 0.0937  | Dotted sixteenth note | Dotted semiquaver |
|	s	    |	1/16  | 0.0625	|	16th note	|	Semiquaver	|
|	x	    |	1/24  | 0.0416	|	Triplet 16th	|	Triplet semiquaver	|
| t..   | 7/128 | 0.0546  | Double dotted thirty-second note | Double dotted demisemiquaver |
| t.    | 3/64  | 0.0468  | Dotted thirty-second note | Dotted demisemiquaver |
|	t	    |	1/32  | 0.0312	|	32th note	|	Demisemiquaver	|
|	g	    |	1/48  | 0.0208	|	Triplet 32th	|	Triplet demi-semiquaver	|
| u..   | 7/256 | 0.0273  | Double dotted sixty-fourth note | Double dotted hemidemisemiquaver |
| u.    | 3/128 | 0.0234  | Dotted sixty-fourth note | Dotted hemidemisemiquaver |
|	u	    |	1/64  | 0.0156	|	64th note	|	Hemidemisemiquaver	|
| j     |	1/96  | 0.0104	|	Triplet 64th	|	Triplet hemidemisemiquaver	|
| o..   | 7/512 | 0.0136  | Double dotted 128th note | Double dotted semihemidemisemiquaver |
| o.    | 3/256 | 0.0117  | Dotted 128th note | Dotted semihemidemisemiquaver |
|	o	    |	1/128 | 0.0078	|	128th note	|	Semihemidemisemiquaver	|
|	k	    |	1/192 | 0.0052	|	Triplet 128th | Triplet semihemidemisemiquaver	|
|	z	    |	0/1   | 0.0	    |	No length	|	No length	|

## Samples

Samples can be patterned using the sample names or using <c>@</c>-operator for assigning sample to a pitch. Sample index can be changed using the <c>:</c> operator.

${makeExample(
  "Sampled drums",
  `
  z1('bd [hh hh]').octave(-2).sound('sine').out()
  `,
  true,
)}

${makeExample(
  "More complex pattern",
  `
  z1('bd [hh <hh <cp cp:2>>]').octave(-2).sound('sine').out()
  `,
  true,
)}

${makeExample(
  "Pitched samples",
  `
  z1('0@sax 3@sax 2@sax 6@sax')
    .octave(-1).sound()
    .adsr(0.25,0.125,0.125,0.25).out()
  `,
  true,
)}

${makeExample(
  "Pitched samples from list operation",
  `
  z1('e (0 3 -1 4)+(-1 0 2 1)@sine')
  .key('G4')
  .scale('110 220 320 450')
  .sound().out()
  `,
  true,
)}

${makeExample(
  "Pitched samples with list notation",
  `
  z1('e (0 2 6 3 5 -2)@sax (0 2 6 3 5 -2)@arp')
    .octave(-1).sound()
    .adsr(0.25,0.125,0.125,0.25).out()
  `,
  true,
)}

${makeExample(
  "Sample indices",
  `
  z1('e 1:2 4:3 6:2')
  .octave(-1).sound("east").out()
  `,
  true,
)}

${makeExample(
  "Pitched samples with sample indices",
  `
z1('_e 1@east:2 4@bd:3 6@arp:2 9@baa').sound().out()
`,
  true,
)}

`;
};
