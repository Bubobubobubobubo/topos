import { makeExampleFactory } from "../Documentation";
import { type Editor } from "../main";

export const time = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Time
	
Time in Topos is flowing just like on a drum machine. Topos is counting bars, beats and pulses. The time can be **paused**, **resumed** and/or **resetted**. Pulses are flowing at a given **BPM** (_beats per minute_). There are three core values that you will often interact with in one form or another:
	
- **bars**: how many bars have elapsed since the origin of time.
- **beats**: how many beats have elapsed since the beginning of the bar.
- **pulse**: how many pulses have elapsed since the last beat.
	
To change the tempo, use the <ic>bpm(number)</ic> function. The transport is controlled by the interface buttons, by the keyboard shortcuts or using the <ic>play()</ic>, <ic>pause()</ic> and <ic>stop()</ic> functions. You will soon learn how to manipulate time to your liking for backtracking, jumping forward, etc... The traditional timeline model has little value when you can script everything.
	
**Note:** the <ic>bpm(number)</ic> function can serve both for getting and setting the **BPM** value.
	
## Simple rhythms
	
Let's study two very simple rhythmic functions, <ic>mod(n: ...number[])</ic> and <ic>onbeat(...n:number[])</ic>. They are both easy to understand and powerful enough to get you to play your first rhythms.
	
- <ic>beat(...n: number[])</ic>: this function will return true every _n_ beats. The value <ic>1</ic> will return <ic>true</ic> at the beginning of each beat. Floating point numbers like <ic>0.5</ic> or <ic>0.25</ic> are also accepted. Multiple values can be passed to <ic>beat</ic> to generate more complex rhythms.
	
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


- <ic>pulse(...n: number[])</ic>: faster version of the <ic>beat</ic> function. Instead of returning true for every beat, this function is returning true every _n_ clock ticks! It can be used to generate very unexpected rhythms.

${makeExample(
    "Intriguing rhythms",
    `
pulse([24,48].beat(2)) :: snd('hand')
  .cut(1).room(0.9).size(0.9)
  .n([2,4].beat(2)).out()
pulse([48/2, 48/3].beat(4)) :: snd('hand')
  .n([2,4].add(5).beat(1)).out()
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
  )};

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

${makeExample(
    "Let's do something more complex",
    `
onbeat(0.5, 2, 3, 3.75)::snd('kick').n(2).out()
onbeat(2, [1.5, 3, 4].pick(), 4)::snd('snare').n(8).out()
beat([.25, 1/8].beat(1.5))::snd('hat').n(2)
  .gain(rand(0.4, 0.7)).end(0.05)
  .pan(usine()).out()
`,
    false
  )}

- <ic>oncount(beats: number[], meter: number)</ic>: This function is similar to <ic>onbeat</ic> but it allows you to specify a custom number of beats as the last argument.

${makeExample(
    "Using oncount to create more variation in the rhythm",
    `
z1('1/16 (0 2 3 4)+(0 2 4 6)').scale('pentatonic').sound('sawtooth')
  .cutoff([400,500,1000,2000].beat(1))
  .lpadsr(2, 0, .2, 0, 0)
  .delay(0.5).delayt(0.25).room(0.9).size(0.9).out()
onbeat(1,1.5,2,3,4) :: sound('bd').gain(2.0).out()
oncount([1,3,5.5,7,7.5,8],8) :: sound('hh').gain(irand(1.0,4.0)).out()
`,
    true
  )}

${makeExample(
    "Using oncount to create rhythms with a custom meter",
    `
bpm(200)
oncount([1, 5, 9, 13],16) :: sound('808bd').n(4).shape(0.5).gain(1.0).out()
oncount([5, 6, 13],16) :: sound('shaker').room(0.25).gain(0.9).out()
oncount([2, 3, 3.5, 6, 7, 10, 15],16) :: sound('hh').n(8).gain(0.8).out()
oncount([1, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16],16) :: sound('hh').out()
`,
    true
  )}

## Rhythm generators
	
We included a bunch of popular rhythm generators in Topos such as the euclidian rhythms algorithms or the one to generate rhythms based on a binary sequence. They all work using _iterators_ that you will gradually learn to use for iterating over lists. Note that they are levaraging <ic>mod(...n:number[])</ic> that you just learned about!
	
- <ic>euclid(iterator: number, pulses: number, length: number, rotate: number): boolean</ic>: generates <ic>true</ic> or <ic>false</ic> values from an euclidian rhythm sequence. This algorithm is very popular in the electronic music making world.
	
${makeExample(
    "Classic euclidian club music patterns",
    `
beat(.5) && euclid($(1), 4, 8) && snd('kick').n(4).out()
beat(.25) && euclid($(2), 5, 8) && snd('dr').n(21).out()
beat(.25) && euclid($(3), 3, 8) && snd('shaker')
  .gain(r(0.7, 1)).cutoff(1000 + usine(1/8) * 3000)
  .n(11).out()
beat(.25) && euclid($(3), 6, 8) && snd('shaker')
  .gain(r(0.7, 1)).cutoff(1000 + usine(1/4) * 4000)
  .speed(2).n(11).out()
`,
    true
  )}

${makeExample(
    "And now something a bit more complex",
    `
bpm(145); // Setting a faster BPM
beat(.5) && euclid($(1), 5, 8) :: sound('bd').out()
beat(.5) && euclid($(2), [1,0].beat(8), 8) 
  :: sound('ST03').n(5).room(1).size(1).o(1).out()
beat(.5) && euclid($(6), [6,7].beat(8), 8) :: sound('hh').out()
`,
    false
  )}

${makeExample(
    "Adding more rhythmic density",
    `
beat(.5) && euclid($(1), 5, 9) && snd('kick').shape(r(0.2,0.5)).out()
beat(.5) && euclid($(2), 2, 3, 1) && snd('dr').end(0.5).n([8,9,13].beat(0.25))
  .gain(r(0.5,1)).speed(1).out()
beat(.5) && euclid($(3), 6, 9, 1) && snd('dr').end(0.5).n(2).freq(200).speed(1)
  .gain(r(0.5,1)).out()
beat(.25) && euclid($(4), 7, 9, 1) && snd('hh').out()
`,
    false
  )}

Alternatively, you can <ic>oneuclid</ic> or <ic>rhythm</ic> without the _iterators_:

- <ic>oneuclid(pulses: number, length: number, rotate: number): boolean</ic>: generates <ic>true</ic> or <ic>false</ic> values from an euclidian rhythm sequence. This is another version of <ic>euclid</ic> that does not take an iterator.
${makeExample(
    "Using oneuclid to create a rhythm without iterators",
    `
  // Change speed using bpm
  bpm(250)
  oneuclid(5, 9) :: snd('kick').out()
  oneuclid(7,16) :: snd('east').end(0.5).n(irand(3,5)).out()
`,
    false
  )}

- <ic>rhythm(divisor: number, pulses: number, length: number, rotate: number): boolean</ic>: generates <ic>true</ic> or <ic>false</ic> values from an euclidian rhythm sequence. This is another version of <ic>euclid</ic> that does not take an iterator.
${makeExample(
    "rhythm is a beginner friendly rhythmic function!",
    `
let speed = [1, 0.5].beat(8); bpm(140);
rhythm(speed, 5, 12) :: snd('linnhats').n(2).pan(noise()).out()
rhythm(speed, 2, 12) :: snd('east').out()
rhythm(speed, 3, 12) :: snd('linnhats').n(4).pan(noise()).out()
rhythm(speed, 7, 12) :: snd('east').n(9).out()
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

## Time Warping

Time generally flows from the past to the future. However, it's even cooler when you can manipulate it to your liking by jumping back and forth. Think about looping a specific part of your current pattern or song or jumping all of the sudden in the future. This is entirely possible thanks to two simple functions: <ic>warp(n: number)</ic> and <ic>beat_warp(n: number)</ic>. They are both very easy to use and very powerful. Let's see how they work.

- <ic>warp(n: number)</ic>: this function jumps to the _n_ tick of the clock. <ic>1</ic> is the first pulsation ever and the number keeps increasing indefinitely. You are most likely currently listening to tick n°<ic>12838123</ic>.


${makeExample(
    "Time is now super elastic!",
    `
// Obscure Shenanigans - Bubobubobubo
beat([1/4,1/8,1/16].beat(8)):: sound('sine')
	.freq([100,50].beat(16) + 50 * ($(1)%10))
	.gain(0.5).room(0.9).size(0.9)
	.sustain(0.1).out()
beat(1) :: sound('kick').out()
beat(2) :: sound('dr').n(5).out()
flip(3) :: beat([.25,.5].beat(.5)) :: sound('dr')
  .n([8,9].pick()).gain([.8,.5,.25,.1,.0].beat(.25)).out()
// Jumping back and forth in time
beat(.25) :: warp([12, 48, 24, 1, 120, 30].pick())
`,
    true
  )}
	
- <ic>beat_warp(beat: number)</ic>: this function jumps to the _n_ beat of the clock. The first beat is <ic>1</ic>.

${makeExample(
    "Jumping back and forth with beats",
    `
// Resonance bliss - Bubobubobubo
beat(.25)::snd('arpy')
  .note(30 + [0,3,7,10].beat())
  .cutoff(usine(.5) * 5000).resonance(10).gain(0.3)
  .end(0.8).room(0.9).size(0.9).n(0).out();
beat([.25,.125].beat(2))::snd('arpy')
  .note(30 + [0,3,7,10].beat())
  .cutoff(usine(.5) * 5000).resonance(20).gain(0.3)
  .end(0.8).room(0.9).size(0.9).n(3).out();
beat(.5) :: snd('arpy').note(
  [30, 33, 35].repeatAll(4).beat(1) - [12,0].beat(0.5)).out()
// Comment me to stop warping!
beat(1) :: beat_warp([2,4,5,10,11].pick())
`,
    true
  )}

## Larger time divisions
	
Now you know how to play some basic rhythmic music but you are a bit stuck in a one-bar long loop. Let's see how we can think about time flowing on longer periods. The functions you are going to learn now are _very fundamental_ and all the fun comes from mastering them. **Read and experiment a lot with the following examples**.
	
- <ic>flip(n: number, ratio: number = 50)</ic>: the <ic>flip</ic> method is a temporal switch. If the value <ic>2</ic> is given, the function will return <ic>true</ic> for two beats and <ic>false</ic> for two beats. There are multiple ways to use it effectively. You can pass an integer or a floating point number.
  - <ic>ratio: number = 50</ic>: this argument is ratio expressed in %. It determines how much of the period should be true or false. A ratio of <ic>75</ic> means that 75% of the period will be true. A ratio of <ic>25</ic> means that 25% of the period will be true.  
	
${makeExample(
    "Two beats of silence, two beats of playing",
    `
flip(4) :: beat(1) :: snd('kick').out()
`,
    true
  )}

${makeExample(
    "Clapping on the edge",
    `
flip(2.5, 10) :: beat(.25) :: snd('cp').out()
flip(2.5, 75) :: beat(.25) :: snd('click')
  .speed(2).end(0.2).out()
flip(2.5) :: beat(.5) :: snd('bd').out()
beat(.25) :: sound('hat').end(0.1).cutoff(1200).pan(usine(1/4)).out()
`,
    false
  )}

${makeExample(
    "Good old true and false",
    `
if (flip(4, 75)) {
  beat(1) :: snd('kick').out()
} else {
  beat(.5) :: snd('snare').out()
}
`,
    true
  )}
	
<ic>flip</ic> is extremely powerful and is used internally for a lot of other Topos functions. You can also use it to think about **longer durations** spanning over multiple bars. Here is a silly composition that is using <ic>flip</ic> to generate a 4 bars long pattern.
	
${makeExample(
    "Clunky algorithmic rap music",
    `
// Rap God VS Lil Wild -- Adel Faure
if (flip(16)) {
  // Playing this part for two bars
  beat(1.5)::snd('kick').out()
  beat(2)::snd('snare').out()
  beat(.5)::snd('hh').out()
} else {
  // Now adding some birds and tablas
  beat(1.5)::snd('kick').out()
  beat(2)::snd('snare').out()
  beat(.5)::snd('hh').out()
  beat(.5)::snd('tabla').speed([1,2].pick()).end(0.5).out()
  beat(2.34)::snd('birds').n(irand(1,10))
    .delay(0.5).delaytime(0.5).delayfb(0.25).out()
  beat(.5)::snd('diphone').end(0.5).n([1,2,3,4].pick()).out()
}
`,
    true
  )}
	
You can use it everywhere to spice things up, including as a method parameter picker:
	
${makeExample(
    "flip is great for parameter variation",
    `
beat(.5)::snd(flip(4) ? 'kick' : 'hat').out()
`,
    true
  )}
	
- <ic>flipbar(n: number = 1)</ic>: this method works just like <ic>flip</ic> but counts in bars instead of beats. It allows you to think about even larger time cycles. You can also pair it with regular <ic>flip</ic> for writing complex and long-spanning algorithmic beats.
	
${makeExample(
    "Thinking music over bars",
    `
let roomy = (n) => n.room(1).size(1).cutoff(500 + usaw(1/8) * 5000);
function a() {
  beat(1) && roomy(sound('kick')).out()
  beat(.5) && roomy(sound('hat')).out()
}
function b() {
  beat(1/4) && roomy(sound('shaker')).out()
}
flipbar(2) && a()
flipbar(3) && b()
`,
    true
  )}
${makeExample(
    "Alternating over four bars",
    `
flipbar(2)
  ? beat(.5) && snd(['kick', 'hh'].beat(1)).out()
  : beat(.5) && snd(['east', 'east:2'].beat(1)).out()
`,
    false
  )};

	
- <ic>onbar(bars: number | number[], n: number)</ic>: The second argument, <ic>n</ic>, is used to divide the time in a period of <ic>n</ic> consecutive bars. The first argument should be a bar number or a list of bar numbers to play on. For example, <ic>onbar([1, 4], 5)</ic> will return <ic>true</ic> on bar <ic>1</ic> and <ic>4</ic> but return <ic>false</ic> the rest of the time. You can easily divide time that way.
	
${makeExample(
    "Using onbar for filler drums",
    `
bpm(150);
// Only play on the third and fourth bar of the cycle.
onbar([3,4], 4)::beat(.25)::snd('hh').out(); 
// Using JavaScript regular control flow
if (onbar([1,2], 4)) {
    beat(.5) :: sometimes() :: sound('east').out()
	rhythm(.5, 3, 7) :: snd('kick').out();
    rhythm(.5, 1, 7) :: snd('jvbass').out();
    rhythm(.5, 2, 7) :: snd('snare').n(5).out();
} else {
    beat(.5) :: rarely() :: sound('east').n($(1)).out()
    rhythm(.5, 3, 7) :: snd('kick').n(4).out();
    rhythm(.5, 1, 7) :: snd('jvbass').n(2).out();
    rhythm(.5, 2, 7) :: snd('snare').n(3).out();
}`,
    true
  )}

## What are pulses?
	
To make a beat, you need a certain number of time grains or **pulses**. The **pulse** is also known as the [PPQN](https://en.wikipedia.org/wiki/Pulses_per_quarter_note). By default, Topos is using a _pulses per quarter note_ of 48. You can change it by using the <ic>ppqn(number)</ic> function. It means that the lowest possible rhythmic value is 1/48 of a quarter note. That's plenty of time already.
	
**Note:** the <ic>ppqn(number)</ic> function can serve both for getting and setting the **PPQN** value.
	
## Time Primitives
	
Every script can access the current time by using the following functions:
	
- <ic>cbar(n: number)</ic>: returns the current bar since the origin of time.
	
- <ic>cbeat(n: number)</ic>: returns the current beat since the beginning of the bar.
	
- <ic>ebeat()</ic>: returns the current beat since the origin of time (counting from 1).
	
- <ic>cpulse()</ic>: returns the current bar since the origin of the beat.
	
- <ic>ppqn()</ic>: returns the current **PPQN** (see above).
	
- <ic>bpm()</ic>: returns the current **BPM** (see above).
	
- <ic>time()</ic>: returns the current wall clock time, the real time of the system.
	
These values are **extremely useful** to craft more complex syntax or to write musical scores. However, Topos is also offering more high-level sequencing functions to make it easier to play music. You can use the time functions as conditionals. The following example will play a pattern A for 2 bars and a pattern B for 2 bars:
	
${makeExample(
    "Manual mode: using time primitives!",
    `
// Manual time condition
if((cbar() % 4) > 1) {
  beat(2) && sound('kick').out()
  rarely() && beat(.5) && sound('sd').out()
  beat([.5, .25].beat()) && sound('jvbass')
    .freq(100  * [2, 1].pick()).dec(2)
    .room(0.9).size(0.9).orbit(2).out()
} else {
  beat(.5) && sound('hh').out()
  beat(2) && sound('cp').out()
  beat([.5, .5, .25].beat(.5)) && sound('jvbass')
    .freq(100 * [3, 1].pick()).dec(2)
    .room(0.9).size(0.9).orbit(2).out()
}
// This is always playing no matter what happens
beat([.5, .5, 1, .25].beat(0.5)) :: sound('shaker').out() 
`,
    true
  )}
`;
};
