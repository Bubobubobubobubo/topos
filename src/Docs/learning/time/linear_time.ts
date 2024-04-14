import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../Documentation";
import pulses from "./pulses.svg";

export const linear_time = (app: Editor): string => {
  // @ts-ignore
  let makeExample = makeExampleFactory(app);
  return `
# Linear time

**Topos** time is flowing just like in your typical computer music program, with _bars_, _beats_, _pulses_ and so on. The transport can be **paused**, **resumed** and/or **stopped**. There are interface buttons to handle these tasks.  The tiniest unit of time is the **pulse**. There is a finite number of **pulses** per **beat** (by default, <ic>48</ic> **PPQN**). Beats are passing at a given **BPM** (_beats per minute_). You can change the **BPM** anytime you want. You can also change the granularity of time.
	
<object type="image/svg+xml" data=${pulses} style="width: 100%; height: auto; background-color: transparent"></object>

### Beats, bar, pulses

**Topos** is using three core values to deal with time:
- **bars**: how many bars have elapsed since the origin of time.
- **beats**: how many beats have elapsed since the beginning of the bar.
- **pulse**: how many pulses have elapsed since the last beat.
	
There is a tiny widget at the bottom right of the screen showing you the current BPM and the status of the transport. You can turn it on or off in the settings menu.

${makeExample(
    "Printing the transport",
    `
log(\`\$\{cbar()}\, \$\{cbeat()\}, \$\{cpulse()\}\`)
  `,
    true,
  )}

### BPM and PPQN

The base functions to control time are:
- <ic>bpm(number?)</ic> : get or set the current tempo.
- <ic>tempo(number?)</ic> : alias to <ic>bpm</ic>.
- <ic>ppqn(number?)</ic> : get or set the granularity of time
  - The function name comes from [PPQN](https://en.wikipedia.org/wiki/Pulses_per_quarter_note) (_pulses per quarter notes_).

### Controlling time

Note that it is preferable to use the keyboard shortcuts to manipulate the transport system. You can also use the <ic>play()</ic>, <ic>pause()</ic> and <ic>stop()</ic> functions. It is generally preferable to program things instead of relying on the interface!
<br>
## Time Primitives
	
Every script can access the current time by using the following functions:
	
- <ic>cbar(n: number)</ic>:  current bar since the origin of time.
	
- <ic>cbeat(n: number)</ic>: current beat since the beginning of the bar.
	
- <ic>ebeat()</ic>: current beat since the origin of time (counting from 1).
	
- <ic>cpulse()</ic>: current bar since the origin of the beat.
	
- <ic>ppqn()</ic>: current **PPQN** (see above).
	
- <ic>bpm()</ic>: current **BPM** (see above).
	
- <ic>time()</ic>: current wall clock time, the real time of the system.
	
These values are **extremely useful** to craft more complex syntax or to write musical scores. However, it means that you have to write more to be more precise. There is a tradeoff between _live-codeability_ and dealing with time manually (verbose). Topos is offering high-level functions to deal with that issue, don't worry :)

You can use time primitives as conditionals. The following example will play a pattern A for 2 bars and a pattern B for 2 bars:
	
${makeExample(
    "Manual mode: using time primitives!",
    `
// Manual time condition
if((cbar() % 4) > 1) {
  beat(2) && sound('kick').out()
  rarely() && beat(.5) && sound('sd').out()
  beat([.5, .25].beat()) && sound('jvbass')
    .freq(100  * [2, 1].pick()).dec(2)
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
    true,
  )}

## Time Warping

Time generally flows from the past to the future. However, you can manipulate it to jump back and forth. Think about looping a specific part of your current pattern or song or jumping all of the sudden in the future. This is entirely possible thanks to two simple functions: <ic>warp(n: number)</ic> and <ic>beat_warp(n: number)</ic>. They are both very easy to use and very powerful. Let's see how they work.

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
    true,
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
  [30, 33, 35].repeat(4).beat(1) - [12,0].beat(0.5)).out()
// Comment me to stop warping!
beat(1) :: beat_warp([2,4,5,10,11].pick())
`,
    true,
  )}

## Transport-based rhythm generators

- <ic>onbeat(...n: number[])</ic>: The <ic>onbeat</ic> function allows you to lock on to a specific beat from the clock to execute code. It can accept multiple arguments. It's usage is very straightforward and not hard to understand. You can pass either integers or floating point numbers. By default, topos is using a <ic>4/4</ic> bar meaning that you can target any of these beats (or in-between) with this function.

${makeExample(
    "Some simple yet detailed rhythms",
    `
onbeat(1,2,3,4)::snd('kick').out() // Bassdrum on each beat
onbeat(2,4)::snd('snare').n([8,4].beat(4)).out() // Snare on acccentuated beats
onbeat(1.5,2.5,3.5, 3.75)::snd('hat').gain(r(0.9,1.1)).out() // Cool high-hats
`,
    true,
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
    false,
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
    true,
  )}

${makeExample(
    "Using oncount to create rhythms with a custom meter",
    `
tempo(200)
oncount([1, 5, 9, 13],16) :: sound('808bd').n(4).shape(0.5).gain(1.0).out()
oncount([5, 6, 13],16) :: sound('shaker').room(0.25).gain(0.9).out()
oncount([2, 3, 3.5, 6, 7, 10, 15],16) :: sound('hh').n(8).gain(0.8).out()
oncount([1, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16],16) :: sound('hh').out()
`,
    true,
  )}



`;
};
