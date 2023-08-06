# Topos: a Teletype inspired algorithmic sequencer

Topos is an algorithmic sequencer inspired by the [Monome Teletype](https://monome.org/docs/teletype/). It is meant to be ready to use, without installation, from a web browser. Topos is still a prototype and is not ready for production use. It is not meant to be a clone of the Teletype, but rather a new take on the same concept. The goal is to provide a tool that can be used to generate music, but also to learn about live coding and algorithmic music.

![Screenshot](https://github.com/Bubobubobubobubo/Topos/blob/main/img/screnshot.png)

Topos can generate sound through WebAudio and/or MIDI. The sequencer works by letting the user enter short JS code snippets that are evaluated in a _sandboxed_ environment. An API is providing tools to manipulate time, transport, instruments, data, etc...

## How does it work?

Just like the **Teletype**, **Topos** is following a **scripting** paradigm. The user is writing short snippets of code that are evaluated in a sandboxed environment. The code is evaluated in a loop, at a given tempo. There are four types of files that can be edited:

- **the global buffer**: used to sequence scripts and control major global events. This script is evaluated **at every clock tick**. This is, by default, _super fast_.
- **the local buffers** are describing some musical logic/processes taking place. They are activated on demand, _once_ by any other script using the `script(n)` command.
- **the init buffer** is used to initialise the state of the universe when you first load the app. Think of it as a space to set the tempo, to set default variables, etc...
- **the note buffer**: used to document your projects and to take notes about your composition.

A **universe** is a set of files (global, init, locals and note) representing a musical composition, a song, a piece, an improvisation. You can create as many universes as you want and switch between them at any time. The application is saving the state of the universe in the browser's local storage.

To switch between universes, use the `Ctrl+B` keybinding that will open a modal. The clear button will reset the current universe to a blank slate.

## Keybindings

- `Ctrl+P`: start the audio playback/clock.
- `Ctrl+S`: stop the audio playback/clock.
- `Ctrl+G`: global buffer.
- `Ctrl+I`: initialisation buffer.
- `Ctrl+L`: local buffers.
- `F1...F9`: switch to one of the 9 local buffers.
- `Ctrl` + `F1...F9`: manual trigger of a local buffer.
- `Ctrl+B`: switch between universes.
- `Ctrl+Shift+V`: toggle Vim editor mode.

To evaluate code, press `Ctrl+Enter` (no visible animation). This is true for every buffer. To stop a buffer from playing, comment your code or delete it.

## How to install locally?

To run the application in dev mode, you will need to have [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) installed on your computer. Then:

- Clone the repository:
  - run `yarn install`
  - run `yarn run dev`

To build the application for production, you will need to have [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) installed on your computer. Then:

- Clone the repository:
  - run `yarn run build`
  - run `yarn run start`

To build a standalone browser application using [Tauri](https://tauri.app/), you will need to have [Node.js](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/en/) and [Rust](https://www.rust-lang.org/) installed on your computer. Then:

- Clone the repository:
  - run `yarn tauri build`
  - run `yarn tauri dev`

# Roadmap to Topos v1.0

## Application User Interface

- [ ] Give more information the local context of execution of every script
  - print/display the internal iterator used in each script
  - animate code to show which line is currently being executed

## Scheduler

- [ ] Stable / robust clock and script/event scheduler.
  - [x] Add a way to set the clock's tempo.
  - [x] Add a way to set the clock's time signature.
  - [ ] Add a way to set the clock's swing.
  - [ ] MIDI Clock In/Out support.
  - [x] Performance optimisations and metrics.
- [ ] Add a way to save the current universe as a file.
- [ ] Add a way to load a universe from a file.

## User Interface

- [x] Settings menu with all options.
  - [ ] Color themes (dark/light), other colors.
  - [x] Font size.
  - [ ] Font Family
  - [x] Vim mode.
- [ ] Optimizations for smaller screens and mobile devices.
- [ ] Read console log without opening the browser console.
- [ ] Fix the bug that adds a new line everytime the app is opened

## Web Audio

- [ ] Support Faut DSP integration.
- [x] WebAudio based engine.
