# Topos: a Teletype inspired algorithmic sequencer

[Monome Teletype](https://monome.org/docs/teletype/) inspired algorithmic sequencer for live coding in the browser. This is a prototype of an (hopefully) soon to be instrument that can generate sound through WebAudio and or MIDI. This sequencer works by letting the user enter short JS code snippets that are evaluated in a _sandboxed_ environment. An API is providing tools to manipulate time, instruments and data.

Just like the Teletype, this interface works by using the following hierarchy:

- **the global buffer** is used to sequence and activate scripts and control major global events.
- **the local buffers** are describing some musical processes taking place when activated.
- **the init buffer** is used to initialise the state of the universe.

A _universe_ is a set of files (global, init and locals) representing a musical composition, a song, a piece. The user can create as many universes as they want and switch between them at any time. The application is saving the state of the universe in the browser's local storage. To switch between universes, use the `Ctrl+B` keybinding that will open a modal. The clear button will delete restore the current universe to a blank slate.

The application is a based on CodeMirror (for the editor), Tailwind (CSS) and Vite (bundler). The code is written in TypeScript when possible.

# Installation / Dev

To run the application:

- clone the repository
- run `yarn install`
- run `yarn run dev`

# Keybindings

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

# TODO

## API

- [ ] Give information about its context of execution to every script
  - knowing which internal iterator to use for each script would be nice

## Scheduler

- [ ] Stable / robust clock and script/event scheduler.
  - [x] Add a way to set the clock's tempo.
  - [x] Add a way to set the clock's time signature.
  - [ ] Add a way to set the clock's swing.
  - [ ] MIDI Clock In/Out support.
  - [x] Performance optimisations and metrics.
- [ ] Add a way to save the current universe as a file.
- [ ] Add a way to load a universe from a file.
- [x] Add MIDI support.
  - This is only partial, more work needed to support more messages.

## UI

- [x] Settings menu with all options.
  - [ ] Color themes (dark/light), other colors.
  - [x] Font size.
  - [x] Vim mode.
- [ ] Repair the current layout (aside + CodeMirror)
- [ ] Optimizations for smaller screens and mobile devices.
- [ ] Add a new "note" buffer for each universe (MarkDown)
- [ ] Find a way to visualize console logs somewhere

## Web Audio

- [ ] Support Faut DSP integration.
- [ ] Support Tone.js integration.
- [x] WebAudio based engine.
