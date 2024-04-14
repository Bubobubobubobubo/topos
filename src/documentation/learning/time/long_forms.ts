import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../Documentation";

export const long_forms = (app: Editor): string => {
  // @ts-ignore
  let makeExample = makeExampleFactory(app);
  return `
# Long forms

Now you know how to play some basic rhythms but in any case, you are stuck in a loop. It's time to learn how to compose larger/longer musical structures. The functions you are going to learn are all about mastering the flow of time on longer periods. **Read and experiment a lot with the following examples**.

## Using scripts and universes

- **Use the nine local scripts as containers** for sections of your composition. When you start playing with **Topos**, it's easy to forget that there are multiple scripts you can play with. Each script can store a different section or part from your composition. Here is a simple example:

${makeExample(
    "Eight bars per section",
    `
// Playing each script for 8 bars in succession
script([1,2,3,4].bar(8))
  `,
    true,
  )}

You can also give a specific duration to each section using <ic>.dur</ic>:

${makeExample(
    "N beats per section",
    `
script([1,2,3,4].dur(8, 2, 16, 4))
  `,
    true,
  )}

- **Use universes as well**. Transitions between universes are _seamless_, instantaneous. Just switch to different content if you ever hit the limitations of the current _universe_.
	
## Long-form Functions

- <ic>flip(n: number, ratio: number = 50)</ic>: the <ic>flip</ic> method is a temporal switch. If the value <ic>2</ic> is given, the function will return <ic>true</ic> for two beats and <ic>false</ic> for two beats. There are multiple ways to use it effectively. You can pass an integer or a floating point number.
  - <ic>ratio: number = 50</ic>: this argument is ratio expressed in %. It determines how much of the period should be true or false. A ratio of <ic>75</ic> means that 75% of the period will be true. A ratio of <ic>25</ic> means that 25% of the period will be true.  
	
${makeExample(
    "Two beats of silence, two beats of playing",
    `
flip(4) :: beat(1) :: snd('kick').out()
`,
    true,
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
    false,
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
    true,
  )}
	
<ic>flip</ic> is extremely powerful and is used internally for a lot of other Topos functions. You can also use it to think about **longer durations** spanning over multiple bars. Here is a silly composition that is using <ic>flip</ic> to generate a 4 bars long pattern.
	
${makeExample(
    "Clunky algorithmic rap music",
    `
// Rap God VS Lil Wild -- Adel Faure
if (flip(8)) {
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
    true,
  )}
	
You can use it everywhere to spice things up, including as a method parameter picker:
	
${makeExample(
    "flip is great for parameter variation",
    `
beat(.5)::snd(flip(2) ? 'kick' : 'hat').out()
`,
    true,
  )}
	
- <ic>flipbar(n: number = 1)</ic>: this method works just like <ic>flip</ic> but counts in bars instead of beats. It allows you to think about even larger time cycles. You can also pair it with regular <ic>flip</ic> for writing complex and long-spanning algorithmic beats.
	
${makeExample(
    "Thinking music over bars",
    `
let roomy = (n) => n.room(1).size(1).cutoff(500 + usaw(1/8) * 5000);
function a() {
  beat(1) && roomy(sound('kick')).out()
  beat(.5) && roomy(sound('hat')).out()
}
function b() {
  beat(1/4) && roomy(sound('shaker')).out()
}
flipbar(2) && a()
flipbar(3) && b()
`,
    true,
  )}
${makeExample(
    "Alternating over four bars",
    `
flipbar(2)
  ? beat(.5) && snd(['kick', 'hh'].beat(1)).out()
  : beat(.5) && snd(['east', 'east:2'].beat(1)).out()
`,
    false,
  )};

	
- <ic>onbar(bars: number | number[], n: number)</ic>: The second argument, <ic>n</ic>, is used to divide the time in a period of <ic>n</ic> consecutive bars. The first argument should be a bar number or a list of bar numbers to play on. For example, <ic>onbar([1, 4], 5)</ic> will return <ic>true</ic> on bar <ic>1</ic> and <ic>4</ic> but return <ic>false</ic> the rest of the time. You can easily divide time that way.
	
${makeExample(
    "Using onbar for filler drums",
    `
tempo(150);
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
    true,
  )}

`;
};
