# Topos

![Screenshot](https://github.com/Bubobubobubobubo/Topos/blob/main/img/screnshot.png)

**Topos is only a POC:**

- It is not ready for users.
- Do not expect stable features and/or support!
- Contributors are welcome!

## Presentation

Topos is an algorithmic sequencer inspired by the [Monome Teletype](https://monome.org/docs/teletype/). It is meant to use from a web browser, without installation. It is not meant to be a clone of the Teletype but rather a new take based on the same concept. The goal is to provide a tool that can be used to generate music but also to learn about live coding and algorithmic music. A desktop based version is also available, using [Tauri](https://tauri.app/). Hopefully, it will support MIDI and OSC in the future for a better integration with musical hardware.

Topos can generate sound through [WebAudio](https://www.npmjs.com/package/superdough) and/or [MIDI](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API). Users can enter short JS code snippets evaluated in a _sandboxed_ environment. A simple to use API provides tools to manipulate time, transport, instruments, data, etc...

## How does it work?

Topos is based on the manipulation of short code snippets, each of them stored in their own file. A set of files is called a **universe**. You can switch from universe to universe _anytime_, even while the application is running. The application is saving the state of the universe in the browser's local storage.

Like the **Teletype**, A **Topos universe** contains a set of files:

- **the global script**: evaluated on a loop for every pulse! Used to call scripts, introduce major changes, etc... The global script really is the conductor of the piece. It can also be used to test short code snippets when you don't feel like programming anything too complex.
- **the local scripts** are parts / are describing some kind of logic or process that you would like to play with. The local scripts are activated on demand by any other script (including themselves) using the `script(n)` command.
- **the init buffer** is used to initialise the state of the _universe_ when you first load the app. Think of it as a script used to set the tempo, to set some default variables or state for your composition.
- **the note file**: used to document your _universe_ (project) and to take notes about your composition.

A **universe** is a set of files (global, init, locals and note) representing a musical composition, a song, a piece, an improvisation. You can create as many universes as you want and switch between them at any time. The application is saving the state of the universe in the browser's local storage. To switch between universes, open the selector by pressing the `Ctrl+B` . The clear button can be used to reset the currently selected universe to a blank slate.

## Keybindings

- `Ctrl+P`: start the audio playback/clock.
- `Ctrl+S`: stop the audio playback/clock.
- `Ctrl+R`: rewind the audio playblack/clock to the beginning.
- `Ctrl+G`: global buffer.
- `Ctrl+I`: initialisation buffer.
- `Ctrl+L`: local buffers.
- `F1...F9`: switch to one of the 9 local buffers.
- `Ctrl` + `F1...F9`: manual trigger of a local buffer.
- `Ctrl+B`: switch between universes.
- `Ctrl+Shift+V`: toggle Vim editor mode.

To evaluate code, press `Ctrl+Enter`. The screen will flash to indicate that the code was transmitted. This is true for every script, including the note script. To stop a script from playing, just comment your code or stop calling it!

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

# Roadmap to Topos v1.0 (first release)

## Application User Interface

- [ ] Visual feedback for script execution
  - [ ] add blinking dots in the upper-right corner of the editor
  - [ ] visual warning when an error is detected (blinking red?)
  - [ ] more variety in visual signals when evaluating code
- [ ] Code animation for rhythmic functions on certain lines (show that a statement is true)
- [ ] More/Better rhythmic generators
  - [ ] Ability to write simple musical sequences
  - [ ] Ability to create musical structures easily
- [ ] Rendering static files (MIDI, MOD, etc...)
- [ ] Add a way to save the current universe as a file.
- [ ] Add a way to load a universe from a file.
- [ ] Add a way to share the universe using a link.

## Scheduler

- [ ] Stable / robust clock and script/event scheduler.
  - [ ] There is still a tiny bit of imprecision left.
  - [ ] Add a way to set the clock's swing.
  - [ ] MIDI Clock In/Out support.

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
