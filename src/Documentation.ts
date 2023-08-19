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

Topos works by linking together several scripts:

- the global script (${key_shortcut('Ctrl + G')}): Evaluated for every clock pulse.
- the local scripts (${key_shortcut('Ctrl + L')}): Evaluated _on demand_. Local scripts are storing musical parts, logic or whatever you need!
- the init script (${key_shortcut('Ctrl + I')}): Evaluated on program load. Used to set up the software (_bpm_, etc...).
- the note file (${key_shortcut('Ctrl + N')}): Not evaluated. Used to store thoughts and ideas about the music you are making.

## Universes

A set of files is called a _universe_. Topos can store several universes and switch immediately from one to another. You can switch between universes by pressing ${key_shortcut('Ctrl + B')}. You can also creating a new universe by entering a name that has never been used before. _Universes_ are only known by their names.

Switching between universes will not stop the transport nor reset the clock. You are switching the context but time keeps flowing. This can be useful to prepare immediate transitions between songs and parts. Think of universes as an algorithmic set of music. All scripts in a given universe are aware about how many times they have been runned already. You can reset that value programatically.

You can clear the current universe by pressing the flame button on the top right corner of the interface. This will clear all the scripts and the note file. **Note:** there is no shortcut for clearing a universe. We do not want to loose your work by mistake!
`

const time: string = `
# Time

Time in Topos is handled by a _transport_ system. It allows you to **play**, **pause** and **reset** time. Time is quite simple to understand:

- **bars**: how many bars have elapsed since the origin of time.
- **beats**: how many beats have elapsed since the origin of time.
- **pulse**: how many pulses have elapsed since the last beat.

The **pulse** is also known as the [PPQN](https://en.wikipedia.org/wiki/Pulses_per_quarter_note). By default, Topos is using a PPQN of 48. It means that the lowest possible rhythmic value is 1/48 of a quarter note. That's plenty of time already.

## Programming with time

Every script can access the current time by using the following functions:

- \`bar()\` returns the current bar since the origin of time.
- \`beat()\` returns the current beat since the origin of the bar.
- \`ebeat()\` returns the current beat since the origin of time.
- \`pulse()\` returns the current bar since the origin of the beat.
- \`epulse()\` returns the current bar since the origin of time.

`
const sound: string = `
# Sound and Notes
`

const about: string = `
# About Topos
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
    functions: functions,
    reference: reference,
    shortcuts: shortcuts,
    about: about,
}

