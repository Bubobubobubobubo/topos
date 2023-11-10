import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const cyclical_time = (app: Editor): string => {
  // @ts-ignore
  let makeExample = makeExampleFactory(app);
  return `
# Cyclical time

Time as a cycle. A cycle can be quite long (a few bars) or very short (a few pulses). Cyclical time is extremely interesting for _live coders_ since it allows you to control a process that will eventually repeat. If your time constructs are repeating, you are able to hear them again and again. Since you can react and alter the code to change the loops, you become part of a complex feedback system between the computer and yourself.

## Simple rhythms
	
- <ic>beat(n: number | number[] = 1, offset: number = 1)</ic>: return true every _n_ beats.
  - <ic>number</ic>: if <ic>number = 1</ic>, the function will return <ic>true</ic> every beat. Lists can be used too.
  - <ic>offset</ic>: offset (in beats) to apply. An offset of <ic>0.5</ic> will return true against the beat.
	
${makeExample(
    "Using different mod values",
    `
// This code is alternating between different mod values
beat([1,1/2,1/4,1/8].beat(2)) :: sound('hat').n(0).out()
`,
    true
  )}

${makeExample(
    "Some sort of ringtone",
    `
// Blip generator :)
let blip = (freq) => {
  return sound('wt_piano')
          .gain(1)
          .sustain(0.1)
          .freq(freq)
          .cutoff(1500)
          .lpadsr(4, 0, .25, 0, 0)
};
beat(1) :: blip(200).pan(r(0,1)).vib(0.5).vibmod(2).out();
beat(1/3) :: blip(400).pan(r(0,1)).out();
flip(3) :: beat(1/6) :: blip(800).pan(r(0,1)).out();
beat([1,0.75].beat(2)) :: blip([50, 100].beat(2)).pan(r(0,1)).out();
`,
    false
  )}

${makeExample(
    "Beat can match multiple values",
    `
beat([.5, 1.25])::sound('hat').out()
`,
    false
  )}

- <ic>pulse(n: number | number[] = 1, offset: number = 1)</ic>: return true every _n_ pulses. A pulse is the tiniest possible rhythmic value.
  - <ic>number</ic>: if <ic>number = 1</ic>, the function will return <ic>true</ic> every pulse. Lists can be used too.
  - <ic>offset</ic>: offset (in pulses) to apply.


${makeExample(
    "Intriguing rhythms",
    `
pulse([24, 16])::sound('hat').ad(0, .02).out()
pulse([48, [36,24].dur(4, 1)])::sound('fhardkick').ad(0, .1).out()
`,
    true
  )}
${makeExample(
    "pulse is the OG rhythmic function in Topos",
    `
pulse([48, 24, 16].beat(4)) :: sound('linnhats').out()
beat(1)::snd(['bd', '808oh'].beat(1)).out()
`,
    false
  )}


- <ic>bar(n: number | number[] = 1, offset: number = 1)</ic>: return true every _n_ bars.
  - <ic>number</ic>: if <ic>number = 1</ic>, the function will return <ic>true</ic> every bar. Lists can be used too.
  - <ic>offset</ic>: offset (in bars) to apply.

${makeExample(
    "Four beats per bar: proof",
    `
bar(1)::sound('kick').out()
beat(1)::sound('hat').speed(2).out()
`,
    true
  )}


${makeExample(
    "Offsetting beat and bar",
    `
bar(1)::sound('kick').out()
beat(1)::sound('hat').speed(2).out()
beat(1, 0.5)::sound('hat').speed(4).out()
bar(1, 0.5)::sound('sn').out()
`,
    false
  )}

- <ic>onbeat(...n: number[])</ic>: The <ic>onbeat</ic> function allows you to lock on to a specific beat from the clock to execute code. It can accept multiple arguments. It's usage is very straightforward and not hard to understand. You can pass either integers or floating point numbers. By default, topos is using a <ic>4/4</ic> bar meaning that you can target any of these beats (or in-between) with this function.

${makeExample(
    "Some simple yet detailed rhythms",
    `
onbeat(1,2,3,4)::snd('kick').out() // Bassdrum on each beat
onbeat(2,4)::snd('snare').n([8,4].beat(4)).out() // Snare on acccentuated beats
onbeat(1.5,2.5,3.5, 3.75)::snd('hat').gain(r(0.9,1.1)).out() // Cool high-hats
`,
    true
  )}

## Cyclical rhythm generators
	
We included a bunch of popular rhythm generators in Topos such as the euclidian rhythms algorithms or the one to generate rhythms based on a binary sequence. They all work using _iterators_ that you will gradually learn to use for iterating over lists. Note that they are levaraging <ic>mod(...n:number[])</ic> that you just learned about!


- <ic>rhythm(divisor: number, pulses: number, length: number, rotate: number): boolean</ic>: generates <ic>true</ic> or <ic>false</ic> values from an euclidian rhythm sequence. This is another version of <ic>euclid</ic> that does not take an iterator.
${makeExample(
    "rhythm is a beginner friendly rhythmic function!",
    `
rhythm(.5, 4, 8)::sound('sine')
  .fmi(2)
  .room(0.5).size(8)
  .freq(250).ad(0, .2).out()
rhythm(.5, 7, 8)::sound('sine')
  .freq(125).ad(0, .2).out()
rhythm(.5, 3, 8)::sound('sine').freq(500).ad(0, .5).out()
`,
    true
  )}


- <ic>oneuclid(pulses: number, length: number, rotate: number): boolean</ic>: generates <ic>true</ic> or <ic>false</ic> values from an euclidian rhythm sequence. This is another version of <ic>euclid</ic> that does not take an iterator.
${makeExample(
    "Using oneuclid to create a rhythm without iterators",
    `
  // Change speed using bpm
  bpm(250)
  oneuclid(5, 9) :: snd('kick').out()
  oneuclid(7,16) :: snd('east').end(0.5).n(irand(3,5)).out()
`,
    true
  )}

- <ic>bin(iterator: number, n: number): boolean</ic>: a binary rhythm generator. It transforms the given number into its binary representation (_e.g_ <ic>34</ic> becomes <ic>100010</ic>). It then returns a boolean value based on the iterator in order to generate a rhythm.
- <ic>binrhythm(divisor: number, n: number): boolean: boolean</ic>: iterator-less version of the  binary rhythm generator.
	
${makeExample(
    "Change the integers for a surprise rhythm!",
    `
bpm(135);
beat(.5) && bin($(1), 12) && snd('kick').n([4,9].beat(1.5)).out()
beat(.5) && bin($(2), 34) && snd('snare').n([3,5].beat(1)).out()
`,
    true
  )}

${makeExample(
    "binrhythm for fast cool binary rhythms!",
    `
let a = 0;
a = beat(4) ? irand(1,20) : a;
binrhythm(.5, 6) && snd(['kick', 'snare'].beat(0.5)).n(11).out()
binrhythm([.5, .25].beat(1), 30) && snd('wt_granular').n(a)
  .cutoff(800).lpadsr(4, 0, 0.125, 0.5, 0.25)
  .adsr(0, r(.1, .4), 0, 0).freq([50, 60, 72].beat(4))
  .room(1).size(1).out()
`,
    true
  )}

${makeExample(
    "Submarine jungle music",
    `
bpm(145);
beat(.5) && bin($(1), 911) && snd('ST69').n([2,3,4].beat())
  .delay(0.125).delayt(0.25).end(0.25).speed(1/3)
  .room(1).size(1).out()
beat(.5) && sound('amencutup').n(irand(2,7)).shape(0.3).out() 
`,
    false
  )}
	
If you don't find it spicy enough, you can add some more probabilities to your rhythms by taking advantage of the probability functions. See the functions documentation page to learn more about them. 
	
${makeExample(
    "Probablistic drums in one line!",
    `
prob(60)::beat(.5) && euclid($(1), 5, 8) && snd('kick').out()
prob(60)::beat(.5) && euclid($(2), 3, 8) && snd('mash')
  .n([1,2,3].beat(1))
  .pan(usine(1/4)).out()
prob(80)::beat(.5) && sound(['hh', 'hat'].pick()).out()
`,
    true
  )}



`;
};
