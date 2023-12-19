# Topos: A Web-Based Algorithmic Sequencer

<p align="center"> | 
  <a href="https://discord.gg/aPgV7mSFZh">Discord</a> |
  <a href="https://raphaelforment.fr/">BuboBubo</a> |
  <a href="https://github.com/amiika">Amiika</a> |
  <a href="https://toplap.org/">About Live Coding</a> |
  <br><br>
  <h2 align="center"><b>Contributors</b></h2>
  <p align='center'>
    <a href="https://github.com/bubobubobubobubo/Topos/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=bubobubobubobubo/Topos" />
    </a>
  </p>
  <p align="center">
  <a href='https://ko-fi.com/I2I2RSBHF' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
  </p>
</p>

---

Topos is a web based live coding environment designed to be installation-free, independant and fun. Topos is loosely based on the [Monome Teletype](https://monome.org/docs/teletype/). The application follows the same operating principle, but adapts it to the rich multimedia context offered by web browsers. Topos is capable of many things:

- it is a generative/algorithmic music sequencer made for **improvisation** and **composition** alike
- it is a synthesizer capable of _additive_, _substractive_, _FM_ and _wavetable
  synthesis_, backed up by a [powerful web based audio engine](https://www.npmjs.com/package/superdough)
- it can also generate video thanks to [Hydra](https://hydra.ojack.xyz/), 
  oscilloscopes, frequency visualizers and image/canvas sequencing capabilities
- it can be used to sequence other MIDI and OSC devices (the latter using a **NodeJS** script)
- it is made to be used without the need of installing anything, always ready at
  [https://topos.live](https://topos.live)

---

![Screenshot](https://github.com/Bubobubobubobubo/Topos/blob/main/src/assets/topos_gif.gif)

## Disclaimer

**Topos** is still a young and experimental project developed by two hobbyists :) Contributions are welcome! We wish to be as inclusive and welcoming as possible to your ideas and suggestions! The software is working quite well and we are continuously striving to improve it. Note that most features are rather experimental and that we don't really have any classical training in web development.

## Local Installation (for devs and contributors)

To run the application, you will need to install [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/). Then, clone the repository and run:

- `yarn install`
- `yarn run dev`

You are good to go. The application will update itself automatically with every change to the codebase. To test the production version of the applicationn, you will need to install [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/). Then, clone the repository and run:

- `yarn run build`
- `yarn run start`

If the build passes, you can be sure that it will also pass our **CI** pipeline that deploys the application to [https://topos.live](https://topos.live). Always run a build before committing to check for compiler errors. The automatic deployment on the `main` branch will not accept compiler errors!

## Tauri version

Topos can also be compiled as a standalone application using [Tauri](https://tauri.app/). You will need [Node.js](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/en/) and [Rust](https://www.rust-lang.org/) to be installed on your computer. Then, clone the repository and run:

- `yarn tauri build`
- `yarn tauri dev`

The `tauri` version has never been fleshed out. It's a template for later developments if Topos ever wants to escape from the web :)

## Docker

To run the **Docker** version, run the following command:

`docker run -p 8001:80 bubobubobubo/topos:latest`

### Build and run the prod image

`docker compose --profile prod up`

### Build and run the dev image

First you need to map `node_modules` to your local machine for your IDE IntelliSense to work properly :

```bash
docker compose --profile dev up -d
docker cp topos-dev:/app/node_modules .
docker compose --profile dev down
```

then run the following command:

```bash
docker compose --profile dev up
```

Note that a Docker version of Topos is automatically generated everytime a commit is done on the `main` branch.

## Credits

- Felix Roos for the [SuperDough](https://www.npmjs.com/package/superdough) audio engine.
- Frank Force for the [ZzFX](https://github.com/KilledByAPixel/ZzFX) synthesizer.
- Kristoffer Ekstrand for the [AKWF](https://www.adventurekid.se/akrt/waveforms/adventure-kid-waveforms/) waveforms.
- Ryan Kirkbride for some of the audio samples in the [Dough-Fox](https://github.com/Bubobubobubobubo/Dough-Fox) sample pack, taken from [here](https://github.com/Qirky/FoxDot/tree/master/FoxDot/snd).
- Adel Faure for the [JGS](https://adelfaure.net/https://adelfaure.net/) font.
- Raphaël Bastide for the [Steps Mono](https://github.com/raphaelbastide/steps-mono/) font.

Many thanks to all the contributors and folks who tried the software already :)