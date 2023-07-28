# Topos

Monome Teletype inspired algorithmic sequencer for live coding in the browser. This is a prototype of an (hopefully) soon to be instrument that can generate sound through WebAudio and or MIDI. This sequencer works by letting the user enter short JS code snippets that are evaluated in a _sandboxed_ environment. An API is providing tools to manipulate time, instruments and data.

Just like the Teletype, this interface works by using the following hierarchy:

- **the global buffer** is used to sequence and activate scripts and major events.
- **the local buffers** are describing some process taking place when activated.
- **the init buffer** is used to initialise the state of the universe.

A _universe_ is a set of files (global, init and locals) representing a musical composition, a song, a piece. The user can create as many universes as they want and switch between them at any time. The application is saving the state of the universe in the browser's local storage. To switch between universes, use the `Ctrl+B` keybinding that will open a modal allowing you to do so. The clear button will delete restore the current universe to a blank slate.

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

To evaluate code, press `Ctrl+Enter` (no visible animation).

# Small tutorial for devs and people passing by :)

The global buffer is evaluated at a very high rate, for every pulse of the clock. To play your first note, it is best to pick a specific pulse or beat to play on and stick to it. In the global buffer (`Ctrl+G`), write:

```js
if (mod(12)) beep(400, 0.5);
```

Press `Ctrl+Enter` to submit that code for evaluation. If successful, the playback will start immediately and this code will loop on every tick. You can trigger one of the local scripts by using the `script(x)` function that also accepts multiple arguments: (_e.g._ `script(1, 4)`).

There are no _fancy_ web audio instruments for the moment, just a _beep_ function.
