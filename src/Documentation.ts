const key_shortcut = (shortcut: string): string => {
  return `<kbd class="lg:px-2 lg:py-1.5 px-1 py-1 lg:text-sm text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">${shortcut}</kbd>`;
};

const injectAvailableSamples = (): string => {};

const introduction: string = `
# Welcome

Welcome to the Topos documentation. These pages are made to help you understand the software and the ideas behind Topos. You can jump here anytime by pressing ${key_shortcut(
  "Ctrl + D"
)}.  Press again to make the documentation disappear.

## What is Topos?

Topos is an _algorithmic_ sequencer. Topos uses small algorithms to represent musical sequences and processes. These can be written in just a few lines of code. Topos is made to be _live-coded_. The _live coder_ strives for the constant interaction with algorithms and sound during a musical performance. Topos is aiming to be a digital playground for live algorithmic music.


Topos is deeply inspired by the [Monome Teletype](https://monome.org/). The Teletype is/was an open source hardware module for Eurorack synthesizers. While the Teletype was initially born as an hardware module, Topos aims to be a web-browser based software sequencer from the same family! It is a sequencer, a scriptable interface, a companion for algorithmic music-making.  Topos wishes to fullfill the same goal than the Teletype, keeping the same spirit alive on the web. It is free, open-source, and made to be shared and used by everyone.

## How to read this documentation

These pages have been conceived to introduce the core concepts first before diving to the more arcane bits. You can read them in order if you just found out about this software! Later on, this documentation will only help you to refresh your memory about some function, etc...

## Example

Press ${key_shortcut(
  "Ctrl + G"
)} to switch to the global file. This is where everything starts! Evaluate the following script there by pasting and pressing ${key_shortcut(
  "Ctrl + Enter"
)}. You are now making music:

<pre><code class="language-javascript">
bpm(80)
mod(0.25) :: sound('sawtooth')
  .note(seqbar(
    pick(60, 67, 63) - 12,  pick(60, 67, 63) - 12, 
    pick(60, 67, 63) - 12 + 5, pick(60, 67, 63) - 12 + 5,
    pick(60, 67, 63) - 12 + 7, pick(60, 67, 63) - 12 + 7) + (sometimes() ? 24 : 12))
  .dur(0.1).fmi(8).fmh(4).room(0.9)
  .gain(0.75).cutoff(500 + usine(8) * 10000)
  .delay(0.5).delaytime(bpm() / 60 / 4 / 3)
  .delayfeedback(0.25)
  .out()
mod(1) && snd('kick').out()
mod(2) && snd('snare').out()
mod(.5) && snd('hat').out()
</code></pre>
`;

const software_interface: string = `
# Interface

The Topos interface is molded around the core concepts of the software: _scripts_ and _universes_. By mastering the interface, you will already understand quite a lot about Topos and how to play music with it.

## Scripts

Every Topos session is composed of several scripts. A set of scripts is called a _universe_. Every script is written using the JavaScript programming language and describes a musical or algorithmic process that takes place over time.

- the global script (${key_shortcut(
  "Ctrl + G"
)}): **Evaluated for every clock pulse**. The central piece, acting as the conductor for all the other scripts. You can also jam directly from the global script to test your ideas before pushing them to a separate script.
- the local scripts (${key_shortcut(
  "Ctrl + L"
)}): **Evaluated on demand**. Local scripts are used to store anything too complex to sit in the global script. It can be a musical process, a whole section of your composition, a complex controller that you've built for your hardware, etc...
- the init script (${key_shortcut(
  "Ctrl + I"
)}): **Evaluated on program load**. Used to set up the software the session to the desired state before playing (_bpm_, etc...).
- the note file (${key_shortcut(
  "Ctrl + N"
)}): **Not evaluated**. Used to store your thoughts or commentaries about the session you are currently playing. It is nothing more than a scratchpad really!

## Universes

A set of files is called a _universe_. Topos can store several universes and switch immediately from one to another. You can switch between universes by pressing ${key_shortcut(
  "Ctrl + B"
)}. You can also create a new universe by entering a name that has never been used before. _Universes_ are only referenced by their names. Once a universe is loaded, it is not possible to call any data/code from any other universe.

Switching between universes will not stop the transport nor reset the clock. You are switching the context but time keeps flowing. This can be useful to prepare immediate transitions between songs and parts. Think of universes as an algorithmic set of music. All scripts in a given universe are aware about how many times they have been runned already. You can reset that value programatically.

You can clear the current universe by pressing the flame button on the top right corner of the interface. This will clear all the scripts and the note file. **Note:** there is no shortcut for clearing a universe. We do not want to loose your work by mistake!
`;

const time: string = `
# Time

Time in Topos can be **paused** and/or **resetted**. Musical time is flowing at a given **BPM** (_beats per minute_) like a regular drum machine. There are three core values that you will often interact with in one form or another:

- **bars**: how many bars have elapsed since the origin of time.
- **beats**: how many beats have elapsed since the beginning of the bar.
- **pulse**: how many pulses have elapsed since the last beat.

To change the tempo, use the <icode>bpm(number)</icode> function. You can interact with time using interface buttons, keyboard shortcuts but also by using the <icode>play()</icode>, <icode>pause()</icode> and <icode>stop()</icode> functions. You will soon learn how to manipulate time to your liking for backtracking, jumping forward, etc... The traditional timeline model has little value when you can script everything.

**Note:** the <icode>bpm(number)</icode> function can serve both for getting and setting the **BPM** value.

## Pulses

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

These values are **extremely useful** to craft more complex syntax or to write musical scores. However, Topos is also offering more high-level sequencing functions to make it easier to play music.

## Useful Basic Functions

Some functions can be leveraged to play rhythms without thinking too much about the clock. Learn them well:

- <icode>beat(...values: number[])</icode>: returns <icode>true</icode> on the given beat. You can add any number of beat values, (_e.g._ <icode>onbeat(1.2,1.5,2.3,2.5)</icode>). The function will return <icode>true</icode> only for a given pulse, which makes this function very useful for drumming.

\`\`\`javascript
    onbeat(1,2,3,4) && sound('bd').out()
    onbeat(.5,.75,1) && sound('hh').out()
    onbeat(3) && sound('sd').out()
\`\`\`

- <icode>mod(...values: number[])</icode>: returns <icode>true</icode> if the current pulse is a multiple of the given value. You can add any number of values, (_e.g._ <icode>mod(.25,.75)</icode>). Note that <icode>1</icode> will equal to <icode>ppqn()</icode> pulses by default. Thus, <icode>mod(.5)</icode> for a **PPQN** of 48 will be <icode>24</icode> pulses.

\`\`\`javascript
    mod(1) && sound('bd').out()
    mod(pick(.25,.5)) && sound('hh').out()
    mod(.5) && sound('jvbass').out()
\`\`\`

- <icode>onbar(...values: number[])</icode>: returns <icode>true</icode> if the bar is currently equal to any of the specified values.
- <icode>modbar(...values: number[])</icode>: returns <icode>true</icode> if the bar is currently a multiple of any of the specified values.

## Rhythm generators

We included a bunch of popular rhythm generators in Topos such as the euclidian rhythms algorithms or the one to generate rhythms based on a binary sequence. They all work using _iterators_ that you will gradually learn to use for iterating over lists.

- <icode>euclid(iterator: number, pulses: number, length: number, rotate: number): boolean</icode>: generates <icode>true</icode> or <icode>false</icode> values from an euclidian rhythm sequence. This algorithm is very popular in the electronic music making world.

\`\`\`javascript
    mod(.5) && euclid($(1), 5, 8) && snd('kick').out()
    mod(.5) && euclid($(2), 2, 8) && snd('sd').out()
\`\`\`

- <icode>bin(iterator: number, n: number): boolean</icode>: a binary rhythm generator. It transforms the given number into its binary representation (_e.g_ <icode>34</icode> becomes <icode>100010</icode>). It then returns a boolean value based on the iterator in order to generate a rhythm.


\`\`\`javascript
    mod(.5) && euclid($(1), 34) && snd('kick').out()
    mod(.5) && euclid($(2), 48) && snd('sd').out()
\`\`\`

## Using time as a conditional

You can use the time functions as conditionals. The following example will play a pattern A for 2 bars and a pattern B for 2 bars:

\`\`\`javascript
    if((bar() % 4) > 1) {
      mod(1) && sound('kick').out()
      rarely() && mod(.5) && sound('sd').out()
      mod(.5) && sound('jvbass').freq(500).out()
    } else {
      mod(.5) && sound('hh').out()
      mod(.75) && sound('cp').out()
      mod(.5) && sound('jvbass').freq(250).out()
    }
\`\`\`

`;

const midi: string = `
# MIDI

You can use Topos to play MIDI thanks to the [WebMIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API). You can currently send notes, control change, program change and so on. You can also send a MIDI Clock to your MIDI devices or favorite DAW. Note that Topos is also capable of playing MIDI using **Ziffers** which provides a better syntax for melodic expression.



## Notes
- <icode>note(note: number, options: {})</icode>: send a MIDI Note. This function can take an object as a second argument to specify the MIDI channel, velocity, etc... (_e.g._ <icode>note(60, {channel: 1, velocity: 127})</icode>).

\`\`\`javascript
    bpm(80) // Setting a default BPM
    mod(.5) && note(36 + seqbeat(0,12), {duration: 0.02})
    mod(.25) && note(pick(64, 76), {duration: 0.05})
    mod(.75) && note(seqbeat(64, 67, 69), {duration: 0.05})
    sometimes() && mod(.25) && note(seqbeat(64, 67, 69) + 24, {duration: 0.5})
\`\`\`

## Control and Program Changes

- <icode>control_change({control: number, value: number, channel: number})</icode>: send a MIDI Control Change. This function takes a single object argument to specify the control message (_e.g._ <icode>control_change({control: 1, value: 127, channel: 1})</icode>).

\`\`\`javascript
    control_change({control: pick(24,25), value: rI(1,120), channel: 1}))})
    control_change({control: pick(30,35), value: rI(1,120) / 2, channel: 1}))})
\`\`\`


- <icode>program_change(program: number, channel: number)</icode>: send a MIDI Program Change. This function takes two arguments to specify the program and the channel (_e.g._ <icode>program_change(1, 1)</icode>).

\`\`\`javascript
    program_change(pick(1,2,3,4,5,6,7,8), 1)
\`\`\`


## System Exclusive Messages

- <icode>sysex(...number[])</icode>: send a MIDI System Exclusive message. This function takes any number of arguments to specify the message (_e.g._ <icode>sysex(0x90, 0x40, 0x7f)</icode>).

## Clock

- <icode>midi_clock()</icode>: send a MIDI Clock message. This function is used to synchronize Topos with other MIDI devices or DAWs.

\`\`\`javascript
    mod(.25) && midi_clock() // Sending clock to MIDI device from the global buffer
\`\`\`

## MIDI Output Selection

- <icode>midi_outputs()</icode>: Prints a list of available MIDI outputs. You can then use any output name to select the MIDI output you wish to use. **Note:** this function will print to the console. You can open the console by pressing ${key_shortcut(
  "Ctrl + Shift + I"
)} in many web browsers.
- <icode>midi_output(output_name: string)</icode>: Selects the MIDI output to use. You can use the <icode>midi_outputs()</icode> function to get a list of available MIDI outputs first. If the MIDI output is not available, the function will do nothing and keep on with the currently selected MIDI Port.

`;

const sound: string = `
# Sample playback

The Topos audio engine is based on the [SuperDough](https://www.npmjs.com/package/superdough) audio backend. It is a very powerful and flexible audio backend. It is based on the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) and is capable of playing samples, synths, and effects. It is also capable of playing samples and synths in a polyphonic way. It is a very powerful tool to create complex sounds and textures. A set of default sounds are already provided by default but you can also load your own audio samples. They will be loaded through a special URL scheme using the <icode>sample</icode> function.

I recommended you to run the following scripts in the global script (${key_shortcut(
  "Ctrl + G"
)}).

## Audio Engine

The basic function to play a sound is <icode>sound('sample/synth').out()</icode>. If the given sound exists in the database, it will be automatically queried and will start playing once loaded. To play a very basic beat, evaluate the following script:

\`\`\`javascript
mod(1) && sound('bd').out()
mod(0.5) && sound('hh').out()
\`\`\`

In plain english, this translates to:

> Every 48 pulses, play a kick drum.
> Every 24 pulses, play a high-hat.

If you remove the **mod** instruction, you will end up with a deluge of kick drums and high-hats. The **mod** instruction is used to filter out pulses. It is a very useful instruction to create basic rhythms. The **mod** function checks if the current pulse is a multiple of the given number. If it is, it returns <icode>true</icode>, otherwise it returns <icode>false</icode>. You will find a lot of these kind of logical functions in Topos.

## Pick a sample

The <icode>.n(number)</icode> method can be used to pick a sample from the currently selected sample folder. For instance, the following script will play a random sample from the _kick_ folder:

\`\`\`javascript
mod(1) && sound('kick').n(pick(1,2,3,4,5,6,7,8)).out()
\`\`\`

Don't worry about the number. If it gets too big, it will be automatically wrapped to the number of samples in the folder.

## Sound Chains

The <icode>sound('sample_name')</icode> function can be chained to _specify_ a sound more. For instance, you can add a filter and some effects to your high-hat:
\`\`\`javascript
mod(0.5) && sound('hh')
    .speed(pick(1,2,3))
    .room(0.5)
    .cutoff(usine(2) * 5000)
    .out()
\`\`\`

No sound will play until you add <icode>.out()</icode> at the end of the chain. Chaining sounds makes it easy to compose and think about sound samples and synthesis. There are many possible arguments that you can add to your sounds.

| Method                                 | Description |
| -------------------------------------- | ----------- |
| <icode>unit(value: number)</icode>     | Sets the unit value  |
| <icode>frequency(value: number)</icode>| Sets the playback sample frequency |
| <icode>nudge(value: number)</icode>    | Adjusts the start time of the sound by the given value |
| <icode>cut(value: number)</icode>| Cut the sample if it overlaps on the same orbit. |
| <icode>loop(value: number)</icode>| Loops the sample. |
| <icode>clip(value: number)</icode>| Sets the clip value of the sound. |
| <icode>n(value: number)</icode>| Sample number in the sample folder. |
| <icode>note(value: number)</icode>| Sets the note value of the sound. |
| <icode>speed(value: number)</icode>| Sets the playback speed. |
| <icode>begin(value: number)</icode>| Sets the beginning of sample (between <icode>0.0</icode> and <icode>1.0</icode>). |
| <icode>end(value: number)</icode>| Sets the end of sample (between <icode>0.0</icode> and <icode>1.0</icode>). |
| <icode>gain(value: number)</icode>| Sets the gain. |
| <icode>cutoff(value: number)</icode>| Sets the cutoff frequency of the low-pass filter. |
| <icode>resonance(value: number)</icode>| Sets the resonance value of the low-pass filter. |
| <icode>hcutoff(value: number)</icode>| Sets the cutoff frequency value of high-pass filter. |
| <icode>hresonance(value: number)</icode>| Sets the resonance value of high-pass filter. |
| <icode>bandf(value: number)</icode>| Sets the frequency value of the bandpass filter. |
| <icode>bandq(value: number)</icode>| Sets the Q value of the bandpass filter. |
| <icode>coarse(value: number)</icode>| Adds some flavor of saturation. |
| <icode>crush(value: number)</icode>| Adds some amount of bitcrush on the given sound. |
| <icode>shape(value: number)</icode>| Adds some distortion. |
| <icode>pan(value: number)</icode>| Sets the panoramic value of the sound (in stereo, between <icode>0.0</icode> and <icode>1.0</icode>). |
| <icode>vowel(value: number)</icode>| Sets a formant vowel filter on the given sound(<icode>'a'</icode>, <icode>'e'</icode>, <icode>'i'</icode>, <icode>'o'</icode>, <icode>'u'</icode>.). |
| <icode>delay(value: number)</icode>| Sets the delay wet/dry value. |
| <icode>delayfeedback(value: number)</icode>| Sets delay feedback. |
| <icode>delaytime(value: number)</icode>| Sets delay time (in seconds). |
| <icode>orbit(value: number)</icode>| Sets the orbit value of the sound. |
| <icode>room(value: number)</icode>| Sets reverb room. |
| <icode>size(value: number)</icode>| Sets reverb size. |
| <icode>velocity(value: number)</icode>| Sets velocity. |
| <icode>out()</icode> | Returns an object processed by the <icode>superdough</icode> function, using the current values in the <icode>values</icode> object and the <icode>pulse_duration</icode> from the <icode>app.clock</icode>. |
`;

const samples: string = `
# Audio Samples

## Available audio samples

${injectAvailableSamples()}

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

- <icode>prob(p: number)</icode>: return <icode>true</icode> _p_% of time, <icode>false</icode> in other cases.
- <icode>toss()</icode>: throwing a coin. Head (<icode>true</icode>) or tails (<icode>false</icode>).

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

export const documentation = {
  introduction: introduction,
  interface: software_interface,
  code: code,
  time: time,
  sound: sound,
  midi: midi,
  functions: functions,
  reference: reference,
  shortcuts: shortcuts,
  about: about,
};
