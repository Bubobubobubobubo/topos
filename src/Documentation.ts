import { type Editor } from "./main";

const key_shortcut = (shortcut: string): string => {
  return `<kbd class="lg:px-2 lg:py-1.5 px-1 py-1 lg:text-sm text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">${shortcut}</kbd>`;
};

const makeExample = (
  description: string,
  code: string,
  open: boolean = false
): string => {
  return `
<details ${open ? "open" : ""}>
	<summary>${description}</summary>
\`\`\`javascript
${code}
\`\`\`
</details>
`;
};

const samples_to_markdown = (samples: object) => {
  let markdownList = "";
  let keys = Object.keys(samples);
  let i = -1;
  while (i++ < keys.length - 1) {
    //@ts-ignore
    if (!samples[keys[i]].data) continue;
    //@ts-ignore
    if (!samples[keys[i]].data.samples) continue;
    markdownList += `**${keys[i]}** (_${
      //@ts-ignore
      samples[keys[i]].data.samples.length
    }_) `;
    // let i2 = -1;
    // while (i2++ < samples[keys[i]].data.samples.length - 1) {
    //   console.log(samples[keys[i]].data.samples[i2]);
    //   markdownList += `\t- <audio controls> <source src="${
    //     samples[keys[i]].data.samples[i2]
    //   }" type="audio/wav">\n
    // 	</audio>
    // 	`;
    // }
  }
  return markdownList;
};

const injectAvailableSamples = (application: Editor): string => {
  let test = samples_to_markdown(application.api._all_samples());
  return test;
};

export const documentation_factory = (application: Editor) => {
  const introduction: string = `
# Welcome
	
Welcome to the Topos documentation. These pages are offering you an introduction to the software and to the ideas behind it. You can jump here anytime by pressing ${key_shortcut(
    "Ctrl + D"
  )}.  Press again to make the documentation disappear. All your contributions are welcome!
	
## What is Topos?
	
Topos is an _algorithmic_ sequencer. Topos uses small algorithms to represent musical sequences and processes. These can be written in just a few lines of code. Topos is made to be _live-coded_. The _live coder_ strives for the constant interaction with algorithms and sound during a musical performance. Topos is aiming to be a digital playground for live algorithmic music.
	
	
Topos is deeply inspired by the [Monome Teletype](https://monome.org/). The Teletype is/was an open source hardware module for Eurorack synthesizers. While the Teletype was initially born as an hardware module, Topos aims to be a web-browser based software sequencer from the same family! It is a sequencer, a scriptable interface, a companion for algorithmic music-making.  Topos wishes to fullfill the same goal than the Teletype, keeping the same spirit alive on the web. It is free, open-source, and made to be shared and used by everyone.
	
## Demo Songs
	
Press ${key_shortcut(
    "Ctrl + G"
  )} to switch to the global file. This is where everything starts! Evaluate the following script there by pasting and pressing ${key_shortcut(
    "Ctrl + Enter"
  )}. You are now making music:

${makeExample(
  "Drums and arpeggios",
  `
bpm(80)
mod(0.25) :: sound('sawtooth')
  .note(seqbar(
    [60, 67, 63].pick() - 12,  [60, 67, 63].pick() - 12, 
    [60, 67, 63].pick() - 12 + 5, [60, 67, 63].pick() - 12 + 5,
    [60, 67, 63].pick() - 12 + 7, [60, 67, 63].pick() - 12 + 7) + (sometimes() ? 24 : 12)
  )
  .sustain(0.1).fmi(8).fmh(4).room(0.9)
  .gain(0.75).cutoff(500 + usine(8) * 10000)
  .delay(0.5).delaytime(bpm() / 60 / 4 / 3)
  .delayfeedback(0.25)
  .out();
mod(1) && snd('kick').out();
mod(2) && snd('snare').out();
mod(.5) && snd('hat').out();
`,
  true
)}
`;

  const software_interface: string = `
# Interface
	
The Topos interface is entirely dedicated to highlight the core concepts at play: _scripts_ and _universes_. By understanding the interface, you will already understand quite a lot about Topos and how to play music with it. Make sure to learn the dedicated keybindings as well and you will fly!
	
## Scripts

Every Topos session is composed of several small scripts. A set of scripts is called a _universe_. Every script is written using the JavaScript programming language and describes a musical or algorithmic process that takes place over time.
	
- **the global script** (${key_shortcut(
    "Ctrl + G"
  )}): _Evaluated for every clock pulse_. The central piece, acting as the conductor for all the other scripts. You can also jam directly from the global script to test your ideas before pushing them to a separate script. You can also access that script using the ${key_shortcut(
    "F10"
  )} key.
- **the local scripts** (${key_shortcut(
    "Ctrl + L"
  )}): _Evaluated on demand_. Local scripts are used to store anything too complex to sit in the global script. It can be a musical process, a whole section of your composition, a complex controller that you've built for your hardware, etc... You can also switch to one of the local scripts by using the function keys (${key_shortcut(
    "F1"
  )} to ${key_shortcut("F9")}).
- **the init script** (${key_shortcut(
    "Ctrl + I"
  )}): _Evaluated on program load_. Used to set up the software the session to the desired state before playing (_bpm_, etc...). You can also access that script using the ${key_shortcut(
    "F11"
  )} key.
- **the note file** (${key_shortcut(
    "Ctrl + N"
  )}): _Not evaluated_. Used to store your thoughts or commentaries about the session you are currently playing. It is nothing more than a scratchpad really!
	
## Universes
	
A set of files is called a _universe_. Topos can store several universes and switch immediately from one to another. You can switch between universes by pressing ${key_shortcut(
    "Ctrl + B"
  )}. You can also create a new universe by entering a name that has never been used before. _Universes_ are only referenced by their names. Once a universe is loaded, it is not possible to call any data/code from any other universe.
	
Switching between universes will not stop the transport nor reset the clock. You are switching the context but time keeps flowing. This can be useful to prepare immediate transitions between songs and parts. Think of universes as an algorithmic set of music. All scripts in a given universe are aware about how many times they have been runned already. You can reset that value programatically.
	
You can clear the current universe by pressing the flame button on the top right corner of the interface. This will clear all the scripts and the note file. **Note:** there is no shortcut for clearing a universe. We do not want to loose your work by mistake!
	
# Sharing your work
	
Click on the Topos logo in the top bar. Your URL will change to something much longer and complex. The same URL will be copied to your clipboard. Send this link to your friends to share the universe you are currently working on with them. 
	
- The imported universe will always get a randomly generated name such as: <icode>random_silly_llama</icode>.
- Topos will automatically fetch and switch to the universe that was sent to you. Your previous universe is still accessible if you switch to it, don't worry!
`;

  const time: string = `
# Time
	
Time in Topos is flowing just like on a drum machine. Topos is counting bars, beats and pulses. The time can be **paused**, **resumed** and/or **resetted**. Pulses are flowing at a given **BPM** (_beats per minute_). There are three core values that you will often interact with in one form or another:
	
- **bars**: how many bars have elapsed since the origin of time.
- **beats**: how many beats have elapsed since the beginning of the bar.
- **pulse**: how many pulses have elapsed since the last beat.
	
To change the tempo, use the <icode>bpm(number)</icode> function. The transport is controlled by the interface buttons, by the keyboard shortcuts or using the <icode>play()</icode>, <icode>pause()</icode> and <icode>stop()</icode> functions. You will soon learn how to manipulate time to your liking for backtracking, jumping forward, etc... The traditional timeline model has little value when you can script everything.
	
**Note:** the <icode>bpm(number)</icode> function can serve both for getting and setting the **BPM** value.
	
## Simple rhythms
	
Let's study two very simple rhythmic functions, <icode>mod(n: ...number[])</icode> and <icode>onbeat(...n:number[])</icode>. They are both easy to understand and powerful enough to get you to play your first rhythms.
	
- <icode>mod(...n: number[])</icode>: this function will return true every _n_ pulsations. The value <icode>1</icode> will return <icode>true</icode> at the beginning of each beat. Floating point numbers like <icode>0.5</icode> or <icode>0.25</icode> are also accepted. Multiple values can be passed to <icode>mod</icode> to generate more complex rhythms.
	
${makeExample(
  "Using different mod values",
  `
mod(1) :: sound('kick').out() // A kickdrum played every beat
mod(.5) :: sound('kick').out() // A kickdrum played twice per beat
mod(.25) :: sound('kick').out() // A kickdrum played four times every beat
mod(1/3) :: sound('kick').out() // A funnier ratio!
mod(1, 2.5)::sound('hh').out() // A great high-hat pattern
mod(1,3.25,2.5)::snd('hh').out() // A somewhat weirder pattern
`,
  true
)}
	
- <icode>onbeat(...n: number[])</icode>: By default, the bar is set in <icode>4/4</icode> with four beats per bar. The <icode>onbeat</icode> function allows you to lock on to a specific beat to execute some code. It can accept multiple arguments. It's usage is very straightforward and not hard to understand. You can pass integers or floating point numbers.

${makeExample(
  "Some simple yet detailed rhythms",
  `
onbeat(1,2,3,4)::snd('kick').out() // Bassdrum on each beat
onbeat(2,4)::snd('snare').out() // Snare on acccentuated beats
onbeat(1.5,2.5,3.5, 3.75)::snd('hat').out() // Cool high-hats
`,
  true
)}

	
## Rhythm generators
	
We included a bunch of popular rhythm generators in Topos such as the euclidian rhythms algorithms or the one to generate rhythms based on a binary sequence. They all work using _iterators_ that you will gradually learn to use for iterating over lists. Note that they are levaraging <icode>mod(...n:number[])</icode> that you just learned about!
	
- <icode>euclid(iterator: number, pulses: number, length: number, rotate: number): boolean</icode>: generates <icode>true</icode> or <icode>false</icode> values from an euclidian rhythm sequence. This algorithm is very popular in the electronic music making world.
	
${makeExample(
  "Classic euclidian club music patterns",
  `
mod(.5) && euclid($(1), 5, 8) && snd('kick').out()
mod(.5) && euclid($(2), 2, 8) && snd('sd').out()
`,
  true
)}
	
- <icode>bin(iterator: number, n: number): boolean</icode>: a binary rhythm generator. It transforms the given number into its binary representation (_e.g_ <icode>34</icode> becomes <icode>100010</icode>). It then returns a boolean value based on the iterator in order to generate a rhythm.
	
${makeExample(
  "Change the integers for a surprise rhythm!",
  `
mod(.5) && bin($(1), 34) && snd('kick').out()
mod(.5) && bin($(2), 48) && snd('sd').out()
`,
  true
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
	
- <icode>div(n: number)</icode>: the <icode>div</icode> is a temporal switch. If the value <icode>2</icode> is given, the function will return <icode>true</icode> for two beats and <icode>false</icode> for two beats. There are multiple ways to use it effectively. You can pass an integer or a floating point number. Here are some examples.
	
${makeExample(
  "Creating two beats of silence",
  `
mod(1)::snd('kick').out(); // Playing on every beat
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
	
- <icode>divbar(n: number)</icode>: works just like <icode>div</icode> but at the level of bars instead of beats. It allows you to think about even bigger time cycles. You can also pair it with regular <icode>div</icode> for making complex algorithmic beats.
	
${makeExample(
  "Thinking music over bars",
  `
divbar(2)::mod(1)::snd('kick').out()
divbar(3)::mod(.5)::snd('hat').out()
`,
  true
)}
	
- <icode>onbar(n: number, ...bar: number[])</icode>: The first argument, <icode>n</icode>, is used to divide the time in a period of <icode>n</icode> consecutive bars. The following arguments are bar numbers to play on. For example, <icode>onbar(5, 1, 4)</icode> will return <icode>true</icode> on bar <icode>1</icode> and <icode>4</icode> but return <icode>false</icode> the rest of the time. You can easily divide time that way.
	
	
${makeExample(
  "Using onbar for filler drums",
  `
// Only play on the fourth bar of a four bar cycle.
onbar(4, 4)::mod(.5)::snd('hh').out(); 
		
// Here comes a longer version using JavaScript normal control flow
if (onbar(4, 1, 3)) { 
	mod(1)::snd('kick').out();
} else {
	mod(.5)::snd('sd').out();
}
`,
  true
)}
	
## What are pulses?
	
To make a beat, you need a certain number of time grains or **pulses**. The **pulse** is also known as the [PPQN](https://en.wikipedia.org/wiki/Pulses_per_quarter_note). By default, Topos is using a _pulses per quarter note_ of 48. You can change it by using the <icode>ppqn(number)</icode> function. It means that the lowest possible rhythmic value is 1/48 of a quarter note. That's plenty of time already.
	
**Note:** the <icode>ppqn(number)</icode> function can serve both for getting and setting the **PPQN** value.
	
## Time Primitives
	
Every script can access the current time by using the following functions:
	
- <icode>bar(n: number)</icode>: returns the current bar since the origin of time.
	
- <icode>beat(n: number)</icode>: returns the current beat since the beginning of the bar.
	
- <icode>ebeat()</icode>: returns the current beat since the origin of time (counting from 1).
	
- <icode>pulse()</icode>: returns the current bar since the origin of the beat.
	
- <icode>ppqn()</icode>: returns the current **PPQN** (see above).
	
- <icode>bpm()</icode>: returns the current **BPM** (see above).
	
- <icode>time()</icode>: returns the current wall clock time, the real time of the system.
	
These values are **extremely useful** to craft more complex syntax or to write musical scores. However, Topos is also offering more high-level sequencing functions to make it easier to play music. You can use the time functions as conditionals. The following example will play a pattern A for 2 bars and a pattern B for 2 bars:
	
${makeExample(
  "Calculating time by hand... a weird hobby",
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

  const midi: string = `
# MIDI
	
You can use Topos to play MIDI thanks to the [WebMIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API). You can currently send notes, control change, program change and so on. You can also send a MIDI Clock to your MIDI devices or favorite DAW. Note that Topos is also capable of playing MIDI using **Ziffers** which provides a better syntax for melodic expression.
	
## Notes
- <icode>midi(note: number|object)</icode>: send a MIDI Note. Object can take parameters {note: number, channel: number, port: number|string, velocity: number}.
	
${makeExample(
  "Playing some piano",
  `
bpm(80) // Setting a default BPM
mod(.5) && midi(36 + seqbeat(0,12)).sustain(0.02).out()
mod(.25) && midi([64, 76].pick()).sustain(0.05).out()
mod(.75) && midi(seqbeat(64, 67, 69)).sustain(0.05).out()
sometimes() && mod(.25) && midi(seqbeat(64, 67, 69) + 24).sustain(0.05).out()
`,
  true
)}
	
## Note chaining
	
The <icode>midi(number|object)</icode> function can be chained to _specify_ a midi note more. For instance, you can add a duration, a velocity, a channel, etc... by chaining:
	
${makeExample(
  "MIDI Caterpillar",
  `
mod(0.25) && midi(60)
  .sometimes(n=>n.note(irand(40,60)))
  .sustain(0.05)
  .channel(2)
  .port("bespoke")
  .out()
`,
  true
)}
	
## Control and Program Changes
	
- <icode>control_change({control: number, value: number, channel: number})</icode>: send a MIDI Control Change. This function takes a single object argument to specify the control message (_e.g._ <icode>control_change({control: 1, value: 127, channel: 1})</icode>).
	
${makeExample(
  "Imagine that I am tweaking an hardware synthesizer!",
  `
control_change({control: [24,25].pick(), value: rI(1,120), channel: 1}))})
control_change({control: [30,35].pick(), value: rI(1,120) / 2, channel: 1}))})
`,
  true
)}
	
- <icode>program_change(program: number, channel: number)</icode>: send a MIDI Program Change. This function takes two arguments to specify the program and the channel (_e.g._ <icode>program_change(1, 1)</icode>).
	
${makeExample(
  "Crashing old synthesizers: a hobby",
  `
program_change([1,2,3,4,5,6,7,8].pick(), 1)
`,
  true
)}
	
	
## System Exclusive Messages
	
- <icode>sysex(...number[])</icode>: send a MIDI System Exclusive message. This function takes any number of arguments to specify the message (_e.g._ <icode>sysex(0x90, 0x40, 0x7f)</icode>).
	
## Clock
	
- <icode>midi_clock()</icode>: send a MIDI Clock message. This function is used to synchronize Topos with other MIDI devices or DAWs.
	
${makeExample(
  "Tic, tac, tic, tac...",
  `
mod(.25) && midi_clock() // Sending clock to MIDI device from the global buffer
`,
  true
)}

	
## MIDI Output Selection
	
- <icode>midi_outputs()</icode>: Prints a list of available MIDI outputs. You can then use any output name to select the MIDI output you wish to use. **Note:** this function will print to the console. You can open the console by pressing ${key_shortcut(
    "Ctrl + Shift + I"
  )} in many web browsers.
- <icode>midi_output(output_name: string)</icode>: Selects the MIDI output to use. You can use the <icode>midi_outputs()</icode> function to get a list of available MIDI outputs first. If the MIDI output is not available, the function will do nothing and keep on with the currently selected MIDI Port.
`;

  const sound: string = `
# Audio engine
	
The Topos audio engine is based on the [SuperDough](https://www.npmjs.com/package/superdough) audio backend, leveraging the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). The engine is capable of playing multiple samples, synths and effects at once. It is a very powerful and almost limitless tool to create complex sounds and textures. A set of default sounds are already provided but you can also load your own audio samples and synths!
	
## Sound basics
	
The basic function to play a sound is... <icode>sound(name: string)</icode> (you can also write <icode>snd</icode> to save some precious time). If the given sound or synthesizer exists in the database, it will be automatically queried/started and will start playing. Evaluate the following script in the global window:
	
\`\`\`javascript
mod(1) && sound('bd').out()
mod(0.5) && sound('hh').out()
\`\`\`
	
In plain english, this translates to:
	
> Every 48 pulses, play a kick drum.
> Every 24 pulses, play a high-hat.
	
Let's make it slightly more complex:

\`\`\`javascript
mod(1) && sound('bd').coarse(0.25).out()
mod(0.5) && sound('hh').delay(0.25).delaytime(0.125).out()
\`\`\`
	
Now, it reads as follow:
	
> Every 48 pulses, play a kick drum with some amount of distortion.
> Every 24 pulses, play a high-hat with 25% of the sound injected in
> a delay unit, with a delay time of 0.125 seconds.
	
Let's pause for a moment to explain what we just wrote. There are many things to be said:
- If you remove the **mod** instruction, you will end up with a deluge of kick drums and high-hats. The **mod** instruction is used to filter out pulses. It is a very useful instruction to create basic rhythms. Check out the **Time** page if you haven't read it already.
- Playing a sound always ends up with the <icode>.out()</icode> method that gives the instruction to send a message to the audio engine.
- Sounds are **composed** by adding qualifiers that will modify the sound or synthesizer being played (_e.g_ <icode>sound('...').blabla(...)..something(...).out()</icode>.
	
## Audio Sample Folders / Sample Files
	
When you type <icode>kick</icode> in the <icode>sound('kick').out()</icode> expression, you are referring to a sample folder containing multiple audio samples. If you look at the sample folder, it would look something like this:
	
\`\`\`shell
.
├── KICK9.wav
├── kick1.wav
├── kick10.wav
├── kick2-1.wav
├── kick2.wav
├── kick3-1.wav
├── kick3.wav
├── kick4.wav
├── kick5.wav
├── kick6.wav
├── kick7.wav
└── kick8.wav
\`\`\`
	
The <icode>.n(number)</icode> method can be used to pick a sample from the currently selected sample folder. For instance, the following script will play a random sample from the _kick_ folder:
	
\`\`\`javascript
mod(1) && sound('kick').n([1,2,3,4,5,6,7,8].pick()).out()
\`\`\`
	
Don't worry about the number. If it gets too big, it will be automatically wrapped to the number of samples in the folder. You can type any number, it will always fall on a sample. Let's use our mouse to select a sample number in a folder:
	
\`\`\`javascript
// Move your mouse to change the sample being used!
mod(.25) && sound('numbers').n(Math.floor(mouseX())).out()
\`\`\`
	
**Note:** the <icode>sound</icode> function can also be used to play synthesizers (see the **Synthesizers** page). In that case, the <icode>.n(n: number)</icode> becomes totally useless!
	
## Learning about sound modifiers
	
As we said earlier, the <icode>sound('sample_name')</icode> function can be chained to _specify_ a sound more. For instance, you can add a filter and some effects to your high-hat:
\`\`\`javascript
mod(0.5) && sound('hh')
    .sometimes(s=>s.speed([1,5,10].pick()))
    .room(0.5)
    .cutoff(usine(2) * 5000)
    .out()
\`\`\`
	
There are many possible arguments that you can add to your sounds. Learning them can take a long time but it will open up a lot of possibilities. Let's try to make it through all of them. They can all be used both with synthesizers and audio samples, which is kind of unconventional with normal / standard electronic music softwares.
	
## Orbits and audio busses
	
Topos is inheriting some audio bus management principles taken from the [SuperDirt](https://github.com/musikinformatik/SuperDirt) and [Superdough](https://www.npmjs.com/package/superdough) engine, a WebAudio based recreation of the same engine. Each sound that you play is associated with an audio bus, called an _orbit_. Some effects are affecting **all sounds currently playing on that bus**. These are called **global effects**, to distinguish from **local effects**:
	
- **global effects**: _reverberation_ and _delay_.
- **local effects**: everything else :smile:

There is a special method to choose the _orbit_ that your sound is going to use:
	
| Method   | Alias | Description                                                |
|----------|-------|------------------------------------------------------------|
| orbit    |       | Orbit number                                               |

	
## Amplitude
	
Simple controls over the amplitude (volume) of a given sound.
	
| Method   | Alias | Description                                                |
|----------|-------|------------------------------------------------------------|
| gain     |       | Volume of the synth/sample (exponential)                   |
| velocity | vel   | Velocity (amplitude) from 0 to 1. Multipled with gain      |
	
\`\`\`javascript
mod(.5)::snd('cp').vel($(1)%10 / 10).out()
\`\`\`
	
## Amplitude Enveloppe
	
**Superdough** is applying an **ADSR** envelope to every sound being played. This is a very standard and conventional amplitude envelope composed of four stages: _attack_, _decay_, _sustain_ and _release_. You will find the same parameters on most synthesizers.
	
| Method  | Alias | Description                                   |
|---------|-------|-----------------------------------------------|
| attack  | atk   | Attack value (time to maximum volume)         |
| decay   | dec   | Decay value (time to decay to sustain level)  |
| sustain | sus   | Sustain value (gain when sound is held)       |
| release | rel   | Release value (time for the sound to die off) |
	
Note that the **sustain** value is not a duration but an amplitude value (how loud). The other values are the time for each stage to take place. Here is a fairly complete example using the <icode>sawtooth</icode> basic waveform.
	
${makeExample(
  "Simple synthesizer",
  `
mod(4)::sound('sawtooth').note(50).decay(0.5).sustain(0.5).release(2).out();
mod(2)::sound('sawtooth').note(50+7).decay(0.5).sustain(0.6).release(2).out();
mod(1)::sound('sawtooth').note(50+12).decay(0.5).sustain(0.7).release(2).out();
mod(.25)::sound('sawtooth').note([50,57,62].pick() + [12, 24, 0].div(2))
  .cutoff(5000).sustain(0.5).release(0.1).out()
	`,
  false
)};
	
## Sample Controls

There are some basic controls over the playback of each sample. This allows you to get into more serious sampling if you take the time to really work with your audio materials.
	
| Method  | Alias | Description                                            |
|---------|-------|--------------------------------------------------------|
| n       |       | Select a sample in the current folder (from <icode>0</icode> to infinity)                 |
| begin   |       | Beginning of the sample playback (between <icode>0</icode> and <icode>1</icode>)     |
| end     |       | End of the sample (between <icode>0</icode> and <icode>1</icode>)                    |
| speed   |       | Playback speed (<icode>2</icode> = twice as fast)         |
| cut     |       | Set with <icode>0</icode> or <icode>1</icode>. Will cut the sample as soon as another sample is played on the same bus |
| clip    |       | Multiply the duration of the sample with the given number |
| pan     |       | Stereo position of the audio playback (<icode>0</icode> = left, <icode>1</icode> = right)|
	
${makeExample(
  "Complex sampling duties",
  `
// Using some of the modifiers described above :)
mod(.5)::snd('pad').begin(0.2)
  .speed([1, 0.9, 0.8].div(4))
  .n([0, 0, 2, 4].div(4)).pan(usine(.5))
  .end(rand(0.3,0.8))
  .room(0.8).size(0.5)
  .clip(1).out()
	`,
  false
)};
	
	
## Filters
	
There are three basic filters: a _lowpass_, _highpass_ and _bandpass_ filters with rather soft slope. Each of them can take up to two arguments. You can also use only the _cutoff_ frequency and the resonance will stay to its default nominal value.
	
| Method     | Alias | Description                             |
|------------|-------|-----------------------------------------|
| cutoff     | lpf   | Cutoff frequency of the lowpass filter  |
| resonance  | lpq   | Resonance of the lowpass filter         |
| hcutoff    | hpf   | Cutoff frequency of the highpass filter |
| hresonance | hpq   | Resonance of the highpass filter        |
| bandf      | bpf   | Cutoff frequency of the bandpass filter |
| bandq      | bpq   | Resonance of the bandpass filter        |
| vowel			 |       | Formant filter with (vocal quality)     |

${makeExample(
  "Filter sweep using a low frequency oscillator",
  `
mod(.5) && snd('sawtooth')
	.cutoff([2000,500].pick() + usine(.5) * 4000)
	.resonance(0.9).freq([100,150].pick())
	.out()
	`,
  false
)};
	
## Reverb
	
A basic reverberator that you can use to give some depth to your sounds. This simple reverb design has a _LoFI_ quality that can be quite useful on certain sounds.
	
| Method     | Alias | Description                     |
|------------|-------|---------------------------------|
| room |     | The more, the bigger the reverb (between <icode>0</icode> and <icode>1</icode>.|
| size |     | Reverberation amount |

${makeExample(
  "Clapping in the cavern",
  `
mod(2)::snd('cp').room(1).size(0.9).out()
	`,
  false
)};

	
## Delay
	
A good sounding delay unit that can go into feedback territory. Use it without moderation.
	
| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| delay      |           | Delay _wet/dry_ (between <icode>0</icode> and <icode>1</icode>) |
| delaytime  | delayt    | Delay time (in milliseconds)    |
| delayfeedback| delayfb | Delay feedback (between <icode>0</icode> and <icode>1</icode>) |
	
${makeExample(
  "Who doesn't like delay?",
  `
mod(2)::snd('cp').delay(0.5).delaytime(0.75).delayfb(0.8).out()
mod(4)::snd('snare').out()
mod(1)::snd('kick').out()
	`,
  false
)};
	
## Distorsion, saturation, destruction
	
| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| coarse     |           | Artificial sample-rate lowering |
| crush      |           | bitcrushing. <icode>1</icode> is extreme, the more you go up, the less it takes effect.  |
| shape      |           | Waveshaping distortion (between <icode>0</icode> and <icode>1</icode>)          |
	
	
${makeExample(
  "Crunch... crunch... crunch!",
  `
mod(.5)::snd('pad').coarse($(1) % 16).clip(.5).out(); // Comment me
mod(.5)::snd('pad').crush([16, 8, 4].div(2)).clip(.5).out()
	`,
  false
)};
`;

  const samples: string = `
# Audio Samples
	
Audio samples are dynamically loaded from the web. By default, Topos is providing some samples coming from the classic [Dirt-Samples](https://github.com/tidalcycles/Dirt-Samples) but also from the [Topos-Samples](https://github.com/Bubobubobubobubo/Topos-Samples) repository. You can contribute to the latter if you want to share your samples with the community! For each sample folder, we are indicating how many of them are available in parentheses.

- **sample_folder** (_how_many_)

## Available audio samples
	
${injectAvailableSamples(application)}

`;

  const patterns: string = `
# Patterns

Music really comes to life when you start playing with algorithmic patterns. They can be used to describe a melody, a rhythm, a texture, a set of custom parameters or anything else you can think of. Topos comes with a lot of different abstractions to deal with musical patterns of increasing complexity. Some knowledge of patterns and how to use them will help you to break out of simple loops and repeating structures.

## Working with Arrays

JavaScript is using [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) as a data structure for lists. Topos is extending them with custom methods that allow you to enter softly into a universe of musical patterns. These methods can often be chained to compose a more complex expression: <icode>[1, 2, 3].repeatOdd(5).palindrome().beat()</icode>.

- <icode>beat()</icode>: returns the index of the list corresponding to current beat (with wrapping). This allows you to return a different value for each beat.
- <icode>pulse()</icode>: returns the index of the list corresponding to the current pulse (with wrapping). This method will return a different value for each pulse.
- <icode>bar()</icode>: returns the index of the list corresponding to the current bar (with wrapping). This method will return a different value for each bar.

${makeExample(
  "This is a test example",
  `
mod(1)::sound(['kick', 'hat', 'snare', 'hat'].beat()).out()
mod(1.5)::sound(['jvbass', 'clap'].beat()).out()
`,
  true
)}

${makeExample(
  "This is another example",
  `
mod(2)::snd('snare').out()
mod([1, 0.5].beat()) :: sound(['bass3'].bar())
  .freq(100).n([12, 14].bar())
  .speed([1,2,3].pulse())
  .out()
`
)}


- <icode>palindrome()</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>random(index: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>rand(index: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>degrade(amount: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>repeatAll(amount: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`


- <icode>repeatPair(amount: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`


- <icode>repeatOdd(amount: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>beat()</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>bar()</icode>:

\`\`\`javascript
// Add example
\`\`\`


- <icode>pick()</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>loop(index: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>div(division: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>shuffle(): this</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>rotate(steps: number)</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>unique()</icode>:

\`\`\`javascript
// Add example
\`\`\`

- <icode>in(value: T)</icode>:

\`\`\`javascript
// Add example
\`\`\`


## Simple patterns 
	
- <icode>divseq(div: number, ...values:any[])</icode>

`;

  const synths: string = `
# Synthesizers
	
Topos comes with a small number of basic synthesizers. These synths are based on a basic [WebAudio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) design. For heavy synthesis duties, please use MIDI and speak to more complex instruments.
	
# Substractive Synthesis
	
The <icode>sound</icode> function can take the name of a synthesizer as first argument.
- <icode>sine</icode>, <icode>sawtooth</icode>,<icode>triangle</icode>, <icode>square</icode> for the waveform selection.
- <icode>cutoff</icode> and <icode>resonance</icode> for adding a low-pass filter with cutoff frequency and filter resonance.
  - <icode>hcutoff</icode> or <icode>bandf</icode> to switch to a high-pass or bandpass filter.
	- <icode>hresonance</icode> and <icode>bandq</icode> for the resonance parameter of these filters.
	
${makeExample(
  "Simple synthesizer voice with filter",
  `
mod(.5) && snd('sawtooth')
  .cutoff([2000,500].pick() + usine(.5) * 4000)
  .resonance(0.9).freq([100,150].pick())
  .out()
	`,
  true
)}
	
	
# Frequency Modulation Synthesis (FM)
	
The same basic waveforms can take additional methods to switch to a basic two operators FM synth design (with _carrier_ and _modulator_). FM Synthesis is a complex topic but take this advice: simple ratios will yield stable and harmonic sounds, complex ratios will generate noises, percussions and gritty sounds.
	
- <icode>fmi</icode> (_frequency modulation index_): a floating point value between <icode>1</icode> and <icode>n</icode>.
- <icode>fmh</icode> (_frequency modulation harmonic ratio_): a floating point value between <icode>1</icode> and <icode>n</icode>.

${makeExample(
  "80s nostalgia",
  `
mod(.25) && snd('sine')
  .fmi([1,2,4,8].pick())
  .fmh([1,2,4,8].div(8))
  .freq([100,150].pick())
  .sustain(0.1)
  .out()
	`,
  true
)}

**Note:** you can also set the _modulation index_ and the _harmonic ratio_ with the <icode>fm</icode> argument. You will have to feed both as a string: <icode>fm('2:4')</icode>. If you only feed one number, only the _modulation index_ will be updated.
	
`;

  const about: string = `
	# About Topos
	
	## The Topos Project
	
	Topos is an experimental web based algorithmic sequencer programmed by **BuboBubo** ([Raphaël Forment](https://raphaelforment.fr) and **Amiika** ([Miika Alonen](https//github.com/amiika). It is written using [TypeScript](https://google.fr) and [Vite](https://google.fr). Many thanks to Felix Roos for making the [Superdough](https://www.npmjs.com/package/superdough) audio backend available for experimentation. This project is based on the [Monome Teletype](https://monome.org) by [Brian Crabtree](https://nnnnnnnn.co/) and [Kelli Cain](https://kellicain.com/). We hope to follow and honor the same spirit of sharing and experimentation. How much can the Teletype be extended while staying accessible and installation-free?
	
	## About Live Coding
	
	**Amiika** and I are both very involved in the [TOPLAP](https://toplap.org) and [Algorave](https://algorave.com) scenes. We previously worked on the [Sardine](https://sardine.raphaelforment.fr) live coding environment for Python. **Amiika** has been working hard on its own algorithmic pattern language called [Ziffers](https://github.com/amiika/ziffers). A version of it is available in Topos! **Raphaël** is doing live coding with other folks from the [Cookie Collective](https://cookie.paris) and from the city of Lyon (France).
	
	## Free and open-source software
	
	Topos is a free and open-source software distributed under [GPL-3.0](https://github.com/Bubobubobubobubo/Topos/blob/main/LICENSE) licence. We welcome all contributions and ideas. You can find the source code on [GitHub](https://github.com/Bubobubobubobubo/topos). You can also join us on [Discord](https://discord.gg/8Q2QV6Z6) to discuss about the project and live coding in general.
	 
	**Have fun!**
	`;

  const code: string = `
# Code
	
Topos is using the [JavaScript](https://en.wikipedia.org/wiki/JavaScript) syntax because it lives in a web browser where JS is the default programming language. It is also a language that you can learn to speak quite fast if you are already familiar with other programming languages. You are not going to write a lot of code anyway but familiarity with the language can help. Here are some good resources:
	
- [MDN (Mozilla Web Docs)](https://developer.mozilla.org/): it covers pretty much anything and is considered to be a reliable source to learn how the web currently works. We use it quite a lot to develop Topos. 
	
- [Learn JS in Y Minutes](https://learnxinyminutes.com/docs/javascript/): a good tour of the language. Can be useful as a refresher.
	
- [The Modern JavaScript Tutorial](https://javascript.info/): another well known source to learn the language.
	
You **do not need to have any prior knowledge of programming** to use Topos. It can also be used as a **valuable resource** to learn some basic programming.
	
## How is the code evaluated?
	
The code you enter in any of the scripts is evaluated in strict mode. This tells your browser that the code you run can be optimized quite agressively. We need this because by default, **the global script is evaluated 48 times per beat**. It also means that you can crash at the speed of light :smile:. The local and initialisation scripts are evaluated on demand, one run at a time. There are some things to keep in mind:
	
- **about variables:** the state of your variables is not kept between iterations. If you write <icode>let a = 2</icode> and change the value later on, the value will be reset to <icode>2</icode> after each run! There are other ways to deal with variables and to share variables between scripts! Some variables like **iterators** can keep their state between iterations because they are saved **with the file itself**.
- **about errors and printing:** your code will crash! Don't worry, it will hopefully try to crash in the most gracious way possible. To check if your code is erroring, you will have to open the dev console with ${key_shortcut(
    "Ctrl + Shift + I"
  )}. You cannot directly use <icode>console.log('hello, world')</icode> in the interface. You will have to open the console as well to see your messages being printed there!
- **about new syntax:** sometimes, we have taken liberties with the JavaScript syntax in order to make it easier/faster to write on stage. <icode>&&</icode> can also be written <icode>::</icode> or <icode>-></icode> because it is faster to type or better for the eyes!
	
## About crashes and bugs
	
Things will crash, that's also part of the show. You will learn progressively to avoid mistakes and to write safer code. Do not hesitate to kill the page or to stop the transport if you feel overwhelmed by an algorithm blowing up. There are no safeties in place to save you. This is to ensure that you have all the available possible room to write bespoke code and experiment with your ideas through code.
`;

  const functions: string = `
# Functions
	
## Global Shared Variables
	
By default, each script is independant from each other. Scripts live in their own bubble and you cannot get or set variables affecting a script from any other script. **However**, everybody knows that global variables are cool and should be used everywhere. This is an incredibely powerful tool to use for radically altering a composition in a few lines of code.
	
- <icode>variable(a: number | string, b?: any)</icode>: if only one argument is provided, the value of the variable will be returned through its name, denoted by the first argument. If a second argument is used, it will be saved as a global variable under the name of the first argument.
	- <icode>delete_variable(name: string)</icode>: deletes a global variable from storage.
	- <icode>clear_variables()</icode>: clear **ALL** variables. **This is a destructive operation**!
	
## Counter and iterators
	
You will often need to use iterators and/or counters to index over data structures (getting a note from a list of notes, etc...). There are functions ready to be used for this. Each script also comes with its own iterator that you can access using the <icode>i</icode> variable. **Note:** the script iteration count is **not** resetted between sessions. It will continue to increase the more you play, even if you just picked up an old project.
	
- <icode>counter(name: number | string, limit?: number, step?: number)</icode>: reads the value of the counter <icode>name</icode>. You can also call this function using the dollar symbol: <icode>$</icode>.
	- <icode>limit?</icode>: counter upper limit before wrapping up.
	- <icode>step?</icode>: incrementor. If step is <icode>2</icode>, the iterator will go: <icode>0, 2, 4, 6</icode>, etc...
	
- <icode>drunk(n?: number)</icode>: returns the value of the internal drunk walk counter. This iterator will sometimes go up, sometimes go down. It comes with companion functions that you can use to finetune its behavior.
	- <icode>drunk_max(max: number)</icode>: sets the maximum value.
	- <icode>drunk_min(min: number)</icode>: sets the minimum value.
	- <icode>drunk_wrap(wrap: boolean)</icode>: whether to wrap the drunk walk to 0 once the upper limit is reached or not.

## Scripts
	
You can control scripts programatically. This is the core concept of Topos after all!
	
- <icode>script(...number: number[])</icode>: call one or more scripts (_e.g. <icode>script(1,2,3,4)</icode>). Once called, scripts will be evaluated once. There are nine local scripts by default. You cannot call the global script nor the initialisation script.
	
- <icode>clear_script(number)</icode>: deletes the given script.
- <icode>copy_script(from: number, to: number)</icode>: copies a local script denoted by its number to another local script. **This is a destructive operation!**
	
## Mouse
	
You can get the current position of the mouse on the screen by using the following functions:
	
- <icode>mouseX()</icode>: the horizontal position of the mouse on the screen (as a floating point number).
- <icode>mouseY()</icode>: the vertical position of the mouse on the screen (as a floating point number).
	
Current mouse position can also be used to generate notes:
	
- <icode>noteX()</icode>: returns a MIDI note number (0-127) based on the horizontal position of the mouse on the screen.
- <icode>noteY()</icode>: returns a MIDI note number (0-127) based on the vertical position of the mouse on the screen.
	
## Low Frequency Oscillators
	
Low Frequency Oscillators (_LFOs_) are an important piece in any digital audio workstation or synthesizer. Topos implements some basic waveforms you can play with to automatically modulate your paremeters. 
	
- <icode>sine(freq: number = 1, offset: number= 0): number</icode>: returns a sinusoïdal oscillation between <icode>-1</icode> and <icode>1</icode>.
- <icode>usine(freq: number = 1, offset: number= 0): number</icode>: returns a sinusoïdal oscillation between <icode>0</icode> and <icode>1</icode>. The <icode>u</icode> stands for _unipolar_.
	
\`\`\`javascript
mod(.25) && snd('cp').speed(1 + usine(0.25) * 2).out()
\`\`\`
	
- <icode>triangle(freq: number = 1, offset: number= 0): number</icode>: returns a triangle oscillation between <icode>-1</icode> and <icode>1</icode>.
- <icode>utriangle(freq: number = 1, offset: number= 0): number</icode>: returns a triangle oscillation between <icode>0</icode> and <icode>1</icode>. The <icode>u</icode> stands for _unipolar_.
	
\`\`\`javascript
mod(.25) && snd('cp').speed(1 + utriangle(0.25) * 2).out()
\`\`\`
	
- <icode>saw(freq: number = 1, offset: number= 0): number</icode>: returns a sawtooth-like oscillation between <icode>-1</icode> and <icode>1</icode>.
- <icode>usaw(freq: number = 1, offset: number= 0): number</icode>: returns a sawtooth-like oscillation between <icode>0</icode> and <icode>1</icode>. The <icode>u</icode> stands for _unipolar_.
	
\`\`\`javascript
mod(.25) && snd('cp').speed(1 + usaw(0.25) * 2).out()
\`\`\`
	
- <icode>square(freq: number = 1, offset: number= 0, duty: number = .5): number</icode>: returns a square wave oscillation between <icode>-1</icode> and <icode>1</icode>. You can also control the duty cycle using the <icode>duty</icode> parameter.
- <icode>usquare(freq: number = 1, offset: number= 0, duty: number = .5): number</icode>: returns a square wave oscillation between <icode>0</icode> and <icode>1</icode>. The <icode>u</icode> stands for _unipolar_. You can also control the duty cycle using the <icode>duty</icode> parameter.
	
\`\`\`javascript
mod(.25) && snd('cp').speed(1 + usquare(0.25, 0, 0.25) * 2).out()
\`\`\`
	
- <icode>noise()</icode>: returns a random value between -1 and 1.
	
\`\`\`javascript
mod(.25) && snd('cp').speed(1 + noise() * 2).out()
\`\`\`
	
## Probabilities

There are some simple functions to play with probabilities.

- <icode>rand(min: number, max:number)</icode>: returns a random number between <icode>min</icode> and <icode>max</icode>. Shorthand _r()_.
- <icode>irand(min: number, max:number)</icode>: returns a random integer between <icode>min</icode> and <icode>max</icode>. Shorthands _ir()_ or _rI()_.
- <icode>prob(p: number)</icode>: return <icode>true</icode> _p_% of time, <icode>false</icode> in other cases.
- <icode>toss()</icode>: throwing a coin. Head (<icode>true</icode>) or tails (<icode>false</icode>).
- <icode>seed(val: number|string)</icode>: sets the seed of the random number generator. You can use a number or a string. The same seed will always return the same sequence of random numbers.
	
Chance operators returning a boolean value are also available:
	
- <icode>odds(n: number, sec?: number)</icode>: returns true for every n (odds) (eg. 1/4 = 0.25) in given seconds (sec)
- <icode>almostNever(sec?: number)</icode>: returns true 0.1% in given seconds (sec)
- <icode>rarely(sec?: number)</icode>: returns true 1% in given seconds (sec)
- <icode>scaresly(sec?: number)</icode>: returns true 10% in given seconds (sec)
- <icode>sometimes(sec?: number)</icode>: returns true 50% in given seconds (sec)
- <icode>often(sec?: number)</icode>: returns true 75% in given seconds (sec)
- <icode>frequently(sec?: number)</icode>: returns true 90% in given seconds (sec)
- <icode>almostAlways(sec?: number)</icode>: returns true 99% in given seconds (sec)
	
## Math functions
	
- <icode>max(...values: number[]): number</icode>: returns the maximum value of a list of numbers.
- <icode>min(...values: number[]): number</icode>: returns the minimum value of a list of numbers.
- <icode>mean(...values: number[]): number</icode>: returns the arithmetic mean of a list of numbers.
- <icode>limit(value: number, min: number, max: number): number</icode>: Limits a value between a minimum and a maximum. 
	
## Delay functions
	
- <icode>delay(ms: number, func: Function): void</icode>: Delays the execution of a function by a given number of milliseconds.
- <icode>delayr(ms: number, nb: number, func: Function): void</icode>: Delays the execution of a function by a given number of milliseconds, repeated a given number of times.
`;

  const reference: string = `
# Reference
`;

  const shortcuts: string = `
# Keybindings
	
Topos is made to be controlled entirely with a keyboard. It is recommanded to stop using the mouse as much as possible when you are _live coding_. Here is a list of the most important keybindings:
	
## Transport
	
- **Start** the transport: ${key_shortcut("Ctrl + P")}.
- **Pause** the transport: ${key_shortcut("Ctrl + S")}.
- **Rewind** the transport: ${key_shortcut("Ctrl + R")}.
	
## Moving in the interface

- Switch to a different universe: ${key_shortcut("Ctrl + B")}.
- Switch to the global script: ${key_shortcut("Ctrl + G")} or ${key_shortcut(
    "F10"
  )}.
- Switch to the local scripts: ${key_shortcut("Ctrl + L")} or ${key_shortcut(
    "F11"
  )}.
- Switch to the init script: ${key_shortcut("Ctrl + L")}.
- Switch to the note file: ${key_shortcut("Ctrl + N")}.
- Switch to a local file: ${key_shortcut("F1")} to ${key_shortcut("F9")}.
- Toggle the documentation: ${key_shortcut("Ctrl + D")}.
	
## Evaluating code
	
- Evaluate the current script: ${key_shortcut("Ctrl + Enter")}.
- Evaluate a local script: ${key_shortcut("Ctrl + F1")} to ${key_shortcut(
    "Ctrl + F9"
  )}.
	
## Special
	
- Switch the editor to Vim Mode: ${key_shortcut("Ctrl + V")}.
`;

  return {
    introduction: introduction,
    interface: software_interface,
    code: code,
    time: time,
    sound: sound,
    samples: samples,
    synths: synths,
    patterns: patterns,
    midi: midi,
    functions: functions,
    reference: reference,
    shortcuts: shortcuts,
    about: about,
  };
};
