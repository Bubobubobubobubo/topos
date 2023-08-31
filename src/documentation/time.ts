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
	
- <ic>mod(...n: number[])</ic>: this function will return true every _n_ pulsations. The value <ic>1</ic> will return <ic>true</ic> at the beginning of each beat. Floating point numbers like <ic>0.5</ic> or <ic>0.25</ic> are also accepted. Multiple values can be passed to <ic>mod</ic> to generate more complex rhythms.
	
${makeExample(
  "Using different mod values",
  `
// This code is alternating between different mod values
mod([1,1/2,1/4,1/8].div(2)) :: sound('bd').n(0).out()
`,
  true
)}

${makeExample(
  "Some sort of ringtone",
  `
let blip = (freq) => {return sound('sine').sustain(0.1).freq(freq)};
mod(1) :: blip(200).out();
mod(1/3) :: blip(400).out();
div(3) :: mod(1/6) :: blip(800).out();
mod([1,0.75].div(2)) :: blip([50, 100].div(2)).out();
`,
  false
)}


- <ic>modp(...n: number[])</ic>: extreme version of the <ic>mod</ic> function. Instead of being normalised, this function is returning a modulo of real pulses! It can be used to break out of ratios and play with real clock pulses for unexpected results.

${makeExample(
  "Intriguing rhythms",
  `
modp(36) :: snd('east')
  .n([2,4].div(1)).out()
modp([12, 36].div(4)) :: snd('east')
  .n([2,4].add(5).div(1)).out()
`,
  true
)}
${makeExample(
  "modp is the OG rhythmic function in Topos",
  `
modp([48, 24, 16].div(4)) :: sound('linnhats').out()
mod(1)::snd('bd').out()
`,
  false
)};

- <ic>onbeat(...n: number[])</ic>: By default, the bar is set in <ic>4/4</ic> with four beats per bar. The <ic>onbeat</ic> function allows you to lock on to a specific beat to execute some code. It can accept multiple arguments. It's usage is very straightforward and not hard to understand. You can pass integers or floating point numbers.

${makeExample(
  "Some simple yet detailed rhythms",
  `
onbeat(1,2,3,4)::snd('kick').out() // Bassdrum on each beat
onbeat(2,4)::snd('snare').out() // Snare on acccentuated beats
onbeat(1.5,2.5,3.5, 3.75)::snd('hat').out() // Cool high-hats
`,
  true
)}

${makeExample(
  "Let's do something more complex",
  `
onbeat(0.5, 1.5, 2, 3, 3.75)::snd('kick').n(2).out()
onbeat(2, [1.5, 3].pick(), 4)::snd('snare').n(7).out()
mod([.25, 1/8].div(1.5))::snd('hat').n(2)
  .gain(rand(0.4, 0.7))
  .pan(usine()).out()
`,
  false
)}

	
## Rhythm generators
	
We included a bunch of popular rhythm generators in Topos such as the euclidian rhythms algorithms or the one to generate rhythms based on a binary sequence. They all work using _iterators_ that you will gradually learn to use for iterating over lists. Note that they are levaraging <ic>mod(...n:number[])</ic> that you just learned about!
	
- <ic>euclid(iterator: number, pulses: number, length: number, rotate: number): boolean</ic>: generates <ic>true</ic> or <ic>false</ic> values from an euclidian rhythm sequence. This algorithm is very popular in the electronic music making world.
	
${makeExample(
  "Classic euclidian club music patterns",
  `
mod(.5) && euclid($(1), 5, 8) && snd('kick').out()
mod(.5) && euclid($(2), 2, 8) && snd('sd').out()
`,
  true
)}

${makeExample(
  "And now for more interesting rhythmic constructions",
  `
bpm(145); // Setting a faster BPM
mod(.5) && euclid($(1), 5, 8) :: sound('bd').out()
mod(.5) && euclid($(2), [1,0].div(8), 8) :: sound('sd').out()
mod(.5) && euclid($(6), [6,7].div(8), 8) :: sound('hh').out()
`,
  false
)}

${makeExample(
  "Adding more rhythmic density",
  `
mod(.5) && euclid($(1), 5, 9) && snd('kick').out()
mod(.5) && euclid($(2), 2, 3, 1) && snd('east').end(0.5).n(5).out()
mod(.5) && euclid($(3), 6, 9, 1) && snd('east').end(0.5).n(5).freq(200).out()
mod(.25) && euclid($(4), 7, 9, 1) && snd('hh').out()
`,
  false
)}


- <ic>rhythm(divisor: number, pulses: number, length: number, rotate: number): boolean</ic>: generates <ic>true</ic> or <ic>false</ic> values from an euclidian rhythm sequence. This is another version of <ic>euclid</ic> that does not take an iterator.
${makeExample(
  "rhythm is a beginner friendly rhythmic function!",
  `
let speed = [0.5, 0.25].div(8);
rhythm(speed, 5, 12) :: snd('east').n(2).out()
rhythm(speed, 2, 12) :: snd('east').out()
rhythm(speed, 3, 12) :: snd('east').n(4).out()
rhythm(speed, 7, 12) :: snd('east').n(9).out()
`,
  true
)}



- <ic>bin(iterator: number, n: number): boolean</ic>: a binary rhythm generator. It transforms the given number into its binary representation (_e.g_ <ic>34</ic> becomes <ic>100010</ic>). It then returns a boolean value based on the iterator in order to generate a rhythm.
	
${makeExample(
  "Change the integers for a surprise rhythm!",
  `
mod(.5) && bin($(1), 34) && snd('kick').out()
mod(.5) && bin($(2), 48) && snd('sd').out()
`,
  true
)}

${makeExample(
  "Calling 911",
  `
mod(.5) && bin($(1), 911) && snd('subroc3d').n($(2)).delay(0.5).delayt(0.25).end(0.5).out()
mod(.5) && sound('less').n(irand(1, 10)).out()
`,
  false
)}

${makeExample(
  "Playing around with simple numbers",
  `
mod(.5) && bin($(1), [123, 456, 789].div(4)) 
	&& snd('tabla').n($(2)).delay(0.5).delayt(0.25).out()
mod(1) && sound('kick').shape(0.5).out()
`,
  false
)}
	
If you don't find it spicy enough, you can add some more probabilities to your rhythms by taking advantage of the probability functions. See the functions documentation page to learn more about them. 
	
${makeExample(
  "Probablistic drums in one line!",
  `
prob(60)::mod(.5) && euclid($(1), 5, 8) && snd('kick').out()
prob(60)::mod(.5) && euclid($(2), 3, 8) && snd('sd').out()
prob(80)::mod(.5) && sound('hh').out()
`,
  true
)}

	
## Larger time divisions
	
Now you know how to play some basic rhythmic music but you are a bit stuck in a one-bar long loop. Let's see how we can think about time flowing on longer periods. The functions you are going to learn now are _very fundamental_ and all the fun comes from mastering them. **Read and experiment a lot with the following examples**.
	
- <ic>div(n: number)</ic>: the <ic>div</ic> is a temporal switch. If the value <ic>2</ic> is given, the function will return <ic>true</ic> for two beats and <ic>false</ic> for two beats. There are multiple ways to use it effectively. You can pass an integer or a floating point number. Here are some examples.
	
${makeExample(
  "Creating two beats of silence",
  `
div(3)::mod([1,.5].beat())::sound('kick').shape(0.3).out(); // Playing every three beats
mod(1)::snd('snare').out(); // Playing on every beat
div(2)::mod(.75)::snd('hat').out(); // Playing only every two beats
`,
  true
)}
	
You can also use it to think about **longer durations** spanning over multiple bars.
	
${makeExample(
  "Clunky algorithmic rap music",
  `
// Rap God VS Lil Wild -- Adel Faure
if (div(16)) {
  // Playing this part for two bars
  mod(1.5)::snd('kick').out()
  mod(2)::snd('snare').out()
  mod(.5)::snd('hh').out()
} else {
  // Now adding some birds and tablas
  mod(1.5)::snd('kick').out()
  mod(2)::snd('snare').out()
  mod(.5)::snd('hh').out()
  mod(.5)::snd('tabla').speed([1,2].pick()).end(0.5).out()
  mod(2.34)::snd('birds').n(irand(1,10))
    .delay(0.5).delaytime(0.5).delayfb(0.25).out()
  mod(.5)::snd('diphone').end(0.5).n([1,2,3,4].pick()).out()
}
`,
  true
)}
	
And you can use it for other things inside a method parameter:
	
${makeExample(
  "div is great for parameter variation",
  `
mod(.5)::snd(div(2) ? 'kick' : 'hat').out()
`,
  true
)}

${makeExample(
  "div is great for pretty much everything",
  `
div([1, .5].beat()) :: mod(.25) :: sound('shaker').out();
div([4, .5].beat()) :: mod(.25) :: sound('shaker').speed(2).out();
div([1, 2].beat()) :: mod(1.75) :: sound('snare').out();
div(4) :: mod(.5) :: sound('tom').out()
div(.125) :: mod(.5) :: sound('amencutup')
  .hcutoff(500).pan(sine())
  .n($(1)).shape(0.5).out()
`,
  true
)}

	
- <ic>divbar(n: number)</ic>: works just like <ic>div</ic> but at the level of bars instead of beats. It allows you to think about even bigger time cycles. You can also pair it with regular <ic>div</ic> for making complex algorithmic beats.
	
${makeExample(
  "Thinking music over bars",
  `
divbar(2)::mod(1)::snd('kick').out()
divbar(3)::mod(.5)::snd('hat').out()
`,
  true
)}
${makeExample(
  "Alternating over four bars",
  `
divbar(2)
  ? mod(.5) && snd(['kick', 'hh'].div(1)).out()
  : mod(.5) && snd(['east', 'snare'].div(1)).out()
`,
  false
)};

	
- <ic>onbar(bars: number | number[], n: number)</ic>: The second argument, <ic>n</ic>, is used to divide the time in a period of <ic>n</ic> consecutive bars. The first argument should be a bar number or a list of bar numbers to play on. For example, <ic>onbar([1, 4], 5)</ic> will return <ic>true</ic> on bar <ic>1</ic> and <ic>4</ic> but return <ic>false</ic> the rest of the time. You can easily divide time that way.
	
${makeExample(
  "Using onbar for filler drums",
  `
// Only play on the fourth bar of a four bar cycle.
onbar(4, 4)::mod(.5)::snd('hh').out(); 
		
// Here comes a longer version using JavaScript normal control flow
if (onbar([4, 1], 3)) { 
	mod(1)::snd('kick').out();
} else {
	mod(.5)::snd('sd').out();
}
`,
  true
)}

## What are pulses?
	
To make a beat, you need a certain number of time grains or **pulses**. The **pulse** is also known as the [PPQN](https://en.wikipedia.org/wiki/Pulses_per_quarter_note). By default, Topos is using a _pulses per quarter note_ of 48. You can change it by using the <ic>ppqn(number)</ic> function. It means that the lowest possible rhythmic value is 1/48 of a quarter note. That's plenty of time already.
	
**Note:** the <ic>ppqn(number)</ic> function can serve both for getting and setting the **PPQN** value.
	
## Time Primitives
	
Every script can access the current time by using the following functions:
	
- <ic>bar(n: number)</ic>: returns the current bar since the origin of time.
	
- <ic>beat(n: number)</ic>: returns the current beat since the beginning of the bar.
	
- <ic>ebeat()</ic>: returns the current beat since the origin of time (counting from 1).
	
- <ic>pulse()</ic>: returns the current bar since the origin of the beat.
	
- <ic>ppqn()</ic>: returns the current **PPQN** (see above).
	
- <ic>bpm()</ic>: returns the current **BPM** (see above).
	
- <ic>time()</ic>: returns the current wall clock time, the real time of the system.
	
These values are **extremely useful** to craft more complex syntax or to write musical scores. However, Topos is also offering more high-level sequencing functions to make it easier to play music. You can use the time functions as conditionals. The following example will play a pattern A for 2 bars and a pattern B for 2 bars:
	
${makeExample(
  "Manual mode: using time primitives!",
  `
if((bar() % 4) > 1) {
  mod(1) && sound('kick').out()
  rarely() && mod(.5) && sound('sd').out()
  mod(.5) && sound('jvbass').freq(500).out()
} else {
  mod(.5) && sound('hh').out()
  mod(.75) && sound('cp').out()
  mod(.5) && sound('jvbass').freq(250).out()
}
`,
  true
)}
`;
};
