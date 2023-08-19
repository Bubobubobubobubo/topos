const key_shortcut = (shortcut: string): string => {
    return `<kbd class="px-2 py-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">${shortcut}</kbd>`
}

const introduction: string = `
# Welcome

Welcome to the Topos documentation. This documentation companion is made to help you understand the software and the ideas behind Topos. You can summon it anytime by pressing ${key_shortcut('Ctrl + D')}.  Press again to make the documentation disappear.

## What is Topos?

Topos is an _algorithmic_ sequencer. Topos uses small algorithms to represent musical sequences and processes. These can be written in just a few lines of code. Topos is made to be _live-coded_. The _live coder_ strives for the constant interaction with algorithms and sound during a musical performance. Topos is aiming to be a digital playground for live algorithmic music.


Topos is deeply inspired by the [Monome Teletype](https://monome.org/). The Teletype is an open source hardware module for Eurorack synthesizers. While the Teletype was initially born as an hardware module, Topos is a web-browser based software sequencer from the same family! It is a sequencer, a scriptable interface, a companion for algorithmic music-making.  Topos wishes to fullfill the same goal than the Teletype, keeping the same spirit alive on the web. It is free, open-source, and made to be shared and used by everyone.

## Example

Press ${key_shortcut('Ctrl + G')} to switch to the global file. This is where everything starts! Evaluate the following script there by pasting and pressing ${key_shortcut('Ctrl + Enter')}:

<pre><code class="language-javascript">
if (bar() % 4 > 2 ) {
    often() && mod(48) && sound('808bd').out()
    mod(24) && euclid($('a'), 3, 8) && sound('808sd').out()
    mod(seqbeat(24,12)) && euclid($('a'), 7, 8) && sound('hh')
      .delay(0.75).delaytime(0.75)
      .speed(seqbeat(1,2,3,4)).out()
    mod(48) && sound('bd').n(6).out()
} else {
      mod(24) && sound('hh').n(seqbeat(1,2,3,4)).end(.01).out()
      mod(48) && sound('kick').out()
      mod(24) && euclid($('ba'), 5, 8) && sound('cp').out()
}
</code></pre>
`

const software_interface: string = `
# Interface

The Topos interface is molded around the core concepts at play: _scripts_ and _universes_. By mastering them, you will be able to compose complex algorithmic musical compositions.

## Scripts

Topos works by linking together several scripts into what is called a _universe_:

- the global script (${key_shortcut('Ctrl + G')}): Evaluated for every clock pulse.
- the local scripts (${key_shortcut('Ctrl + L')}): Evaluated _on demand_. Local scripts are storing musical parts, logic or whatever you need!
- the init script (${key_shortcut('Ctrl + I')}): Evaluated on program load. Used to set up the software (_bpm_, etc...).
- the note file (${key_shortcut('Ctrl + N')}): Not evaluated. Used to store thoughts and ideas about the music you are making.

## Universes

A set of files is called a _universe_. Topos can store several universes and switch immediately from one to another. You can switch between universes by pressing ${key_shortcut('Ctrl + B')}. You can also create a new universe by entering a name that has never been used before. _Universes_ are only known by their names.

Switching between universes will not stop the transport nor reset the clock. You are switching the context but time keeps flowing. This can be useful to prepare immediate transitions between songs and parts. Think of universes as an algorithmic set of music. All scripts in a given universe are aware about how many times they have been runned already. You can reset that value programatically.

You can clear the current universe by pressing the flame button on the top right corner of the interface. This will clear all the scripts and the note file. **Note:** there is no shortcut for clearing a universe. We do not want to loose your work by mistake!
`

const time: string = `
# Time

Time in Topos is handled by a _transport_ system. It allows you to **play**, **pause** and **reset** time. Time is quite simple to understand:

- **bars**: how many bars have elapsed since the origin of time.
- **beats**: how many beats have elapsed since the beginning of the bar.
- **pulse**: how many pulses have elapsed since the last beat.

The **pulse** is also known as the [PPQN](https://en.wikipedia.org/wiki/Pulses_per_quarter_note). By default, Topos is using a pulses per quarter note of 48. It means that the lowest possible rhythmic value is 1/48 of a quarter note. That's plenty of time already. Music is sequenced by playing around with these core time values.

**Note:** you will also learn how to manipulate time to backtrack, jump forward, etc... Your traditional timeline based playback will progressively get more spicy.

## Programming with time

Every script can access the current time by using the following functions:

- <icode>bar(n: number)</icode>: returns the current bar since the origin of time.

- <icode>beat(n: number)</icode>: returns the current beat since the origin of the bar.

- <icode>ebeat()</icode>: returns the current beat since the origin of time.

- <icode>pulse()</icode>: returns the current bar since the origin of the beat.

- <icode>epulse()</icode>: returns the current bar since the origin of time.

## Useful basic functions

Some functions are used very often as time primitives. They are used to create more complex rhythms and patterns:

- <icode>beat(...values: number[])</icode>: returns <icode>true</icode> on the given beat. You can add any number of beat values, (_e.g._ <icode>onbeat(1.2,1.5,2.3,2.5)</icode>). The function will return <icode>true</icode> only for a given pulse, which makes this function very useful for drumming.

\`\`\`javascript
    onbeat(1,2,3,4) && sound('bd').out()
    onbeat(.5,.75,1) && sound('hh').out()
    onbeat(3) && sound('sd').out()
\`\`\`

- <icode>mod(...values: number[])</icode>: returns <icode>true</icode> if the current pulse is a multiple of the given value. You can add any number of values, (_e.g._ <icode>mod(12,36)</icode>).

\`\`\`javascript
    mod(48) && sound('bd').out()
    mod(pick(12,24)) && sound('hh').out()
    mod(24) && sound('jvbass').out()
\`\`\`

- <icode>onbar(...values: number[])</icode>: returns <icode>true</icode> if the bar is currently equal to any of the specified values.
- <icode>modbar(...values: number[])</icode>: returns <icode>true</icode> if the bar is currently a multiple of any of the specified values.

## Using time as a conditional

You can use the time functions as conditionals. The following example will play a pattern A for 2 bars and a pattern B for 2 bars:

\`\`\`javascript
    if((bar() % 4) > 1) {
      mod(48) && sound('kick').out()
      rarely() && mod(24) && sound('sd').out()
      mod(24) && sound('jvbass').freq(500).out()
    } else {
      mod(24) && sound('hh').out()
      mod(36) && sound('cp').out()
      mod(24) && sound('jvbass').freq(250).out()
    }
\`\`\`
`

const midi: string = `
# MIDI
`

const sound: string = `
# Sound and Notes

Topos is capable of:
- sending MIDI to your hardware or software synthesizers.
- playing sound samples and internal synths using the [SuperDough](https://www.npmjs.com/package/superdough) audio backend.

As a first test, try to evaluate the following scripts in the global script (${key_shortcut('Ctrl + G')}). We will first learn about the audio engine.

## Audio Engine

To play a very basic kick drum, evaluate the following script:

\`\`\`javascript
mod(48) && sound('bd').out()
\`\`\`

And for good measure, let's add a high-hat:

\`\`\`javascript
mod(24) && sound('hh').out()
\`\`\`

The sounds will be loaded automatically and start playing when they are ready. Let's translate these instructions to plain english. It reads like :

> Every 48 pulses, play a kick drum.
> Every 24 pulses, play a high-hat.

If you remove the **mod** instruction, you will end up with a deluge of kick drums and high-hats. The **mod** instruction is used to filter out pulses. It is a very useful instruction to create basic rhythms. The **mod** function checks if the current pulse is a multiple of the given number. If it is, it returns <icode>true</icode>, otherwise it returns <icode>false</icode>. You will find a lot of these kind of logical functions in Topos.

The <icode>sound('sample_name')</icode> function can be chained to _specify_ a sound more. For instance, you can add a filter and some effects to your high-hat:
\`\`\`javascript
mod(24) && sound('hh')
    .speed(pick(1,2,3))
    .room(0.5)
    .cutoff(usine(2) * 5000)
    .out()
\`\`\`

No sound will play until you add <icode>.out()</icode> at the end of the chain. Chaining sounds makes it easy to compose and think about sound samples and synthesis. There are many possible arguments that you can add to your sounds.

## Sound modifiers
- <icode>unit(value: number)</icode>: Sets the unit value of the sound.
- <icode>frequency(value: number)</icode>: Sets the playback sample frequency. 
- <icode>nudge(value: number)</icode>: Adjusts the start time of the sound by the given value.
- <icode>cut(value: number)</icode>: Cut the sample if it overlaps on the same orbit.
- <icode>loop(value: number)</icode>: Loops the sample.
- <icode>clip(value: number)</icode>: Sets the clip value of the sound.
- <icode>n(value: number)</icode>: Choose a sample in the selected sample folder.
- <icode>note(value: number)</icode>: Sets the note value of the sound.
- <icode>speed(value: number)</icode>: Sets the playback speed for the given sound.
- <icode>begin(value: number)</icode>: Sets the beginning of sample (between <icode>0.0</icode> and <icode>1.0</icode>).
- <icode>end(value: number)</icode>: Sets the end of sample (between <icode>0.0</icode> and <icode>1.0</icode>).
- <icode>gain(value: number)</icode>: Sets the gain value of the given sound.
- <icode>cutoff(value: number)</icode>: Sets the cutoff frequency of the low-pass filter.
- <icode>resonance(value: number)</icode>: Sets the resonance value of the low-pass filter.
- <icode>hcutoff(value: number)</icode>: Sets the high cutoff frequency value of high-pass filter.
- <icode>hresonance(value: number)</icode>: Sets the high resonance value of high-pass filter.
- <icode>bandf(value: number)</icode>: Sets the band frequency value of the bandpass filter.
- <icode>bandq(value: number)</icode>: Sets the band Q value of the bandpass filter.
- <icode>coarse(value: number)</icode>: Sets the coarse value of the given sound.
- <icode>crush(value: number)</icode>: Sets some amount of bitcrush on the given sound.
- <icode>shape(value: number)</icode>: Sets some distortion on the given sound.
- <icode>pan(value: number)</icode>: Sets the pan value of the sound (between <icode>0.0</icode> and <icode>1.0</icode>).
- <icode>vowel(value: number)</icode>: Sets a formant vowel filter on the given sound(<icode>'a'</icode>, <icode>'e'</icode>, <icode>'i'</icode>, <icode>'o'</icode>, <icode>'u'</icode>.).
- <icode>delay(value: number)</icode>: Sets the delay value of the sound.
- <icode>delayfeedback(value: number)</icode>: Sets the delay feedback value of the sound.
- <icode>delaytime(value: number)</icode>: Sets the delay time value of the sound.
- <icode>orbit(value: number)</icode>: Sets the orbit value of the sound.
- <icode>room(value: number)</icode>: Sets the room value of the sound.
- <icode>size(value: number)</icode>: Sets the size value of the sound.
- <icode>velocity(value: number)</icode>: Sets the velocity value of the sound.
- <icode>out()</icode>: Returns an object processed by the <icode>superdough</icode> function, using the current values in the <icode>values</icode> object and the <icode>pulse_duration</icode> from the <icode>app.clock</icode>.

`


const about: string = `
# About Topos

## The Topos Project

Topos is an experimental web based algorithmic sequencer programmed by **BuboBubo** (Raphaël Forment) and **Amiika** (Miika Alonen). It is written using [TypeScript](https://google.fr) and [Vite](https://google.fr). Many thanks to Felix Roos for making the [Superdough](https://www.npmjs.com/package/superdough) audio backend available for experimentation. 

This project is based on the [Monome Teletype](https://monome.org) by Brian Crabtree. We hope to follow and honor the same spirit of sharing and experimentation. How much can the Teletype be extended while staying accessible and installation-free?

## About Live Coding

**Amiika** and I are both very involved in the [TOPLAP](https://toplap.org) and [Algorave](https://algorave.com) scenes. We previously worked on the [Sardine](https://sardine.raphaelforment.fr) live coding environment for Python. **Amiika** has been working hard on its own algorithmic pattern language called [Ziffers](https://github.com/amiika/ziffers). A version of it is available in Topos! **Raphaël** is doing live coding with other folks from the [Cookie Collective](https://cookie.paris) and from the city of Lyon (France).

## Free and open-source software

Topos is a free and open-source software distributed under [GPL-3.0](https://github.com/Bubobubobubobubo/Topos/blob/main/LICENSE) licence.
We welcome all contributions and ideas. You can find the source code on [GitHub](https://github.com/Bubobubobubobubo/topos).
You can also join us on [Discord](https://discord.gg/8Q2QV6Z6) to discuss about the project and live coding in general.
 
**Have fun!**
`

const functions: string = `
# Functions
`
const reference: string = `
# Reference
`

const shortcuts: string = `
# Keybindings

Topos is made to be controlled entirely with a keyboard. It is recommanded to stop using the mouse as much as possible when you are _live coding_. Here is a list of the most important keybindings:

## Transport

- **Start** the transport: ${key_shortcut('Ctrl + P')}.
- **Pause** the transport: ${key_shortcut('Ctrl + S')}.
- **Rewind** the transport: ${key_shortcut('Ctrl + R')}.

## Moving in the interface

- Switch to a different universe: ${key_shortcut('Ctrl + B')}.
- Switch to the global script: ${key_shortcut('Ctrl + G')} or ${key_shortcut('F10')}.
- Switch to the local scripts: ${key_shortcut('Ctrl + L')} or ${key_shortcut('F11')}.
- Switch to the init script: ${key_shortcut('Ctrl + L')}.
- Switch to the note file: ${key_shortcut('Ctrl + N')}.
- Switch to a local file: ${key_shortcut('F1')} to ${key_shortcut('F9')}.
- Toggle the documentation: ${key_shortcut('Ctrl + D')}.

## Evaluating code

- Evaluate the current script: ${key_shortcut('Ctrl + Enter')}.
- Evaluate a local script: ${key_shortcut('Ctrl + F1')} to ${key_shortcut('Ctrl + F9')}.

## Special

- Switch the editor to Vim Mode: ${key_shortcut('Ctrl + V')}.
`

export const documentation = {
    introduction: introduction,
    interface: software_interface,
    time: time,
    sound: sound,
    midi: midi,
    functions: functions,
    reference: reference,
    shortcuts: shortcuts,
    about: about,
}

