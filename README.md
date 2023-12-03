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

---------------------

Topos is a web based live coding environment. Topos is capable of many things:
- it is a music sequencer made for improvisation and composition alike
- it is a synthesizer capable of additive, substractive, FM and wavetable
synthesis, backed up by a [powerful web based audio engine](https://www.npmjs.com/package/superdough)
- it can also generate video thanks to [Hydra](https://hydra.ojack.xyz/) and
custom oscilloscopes, frequency visualizers and image sequencing capabilities
- it can be used to sequence other MIDI devices (and soon.. OSC!)
- it is made to be used without the need of installing anything, always ready at
  [https://topos.live](https://topos.live)
- Topos is also an emulation and personal extension of the [Monome Teletype](https://monome.org/docs/teletype/)
![Screenshot](https://github.com/Bubobubobubobubo/Topos/blob/main/img/topos_gif.gif)

---------------------

## Disclaimer

**Topos** is still a young project developed by two hobbyists :) Contributions are welcome! We wish to be as inclusive and welcoming as possible to your ideas and suggestions! The software is working quite well and we are continuously striving to improve it.

## Installation (for devs and contributors)

To run the application, you will need to install [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/). Then, clone the repository and run:

- `yarn install`
- `yarn run dev`

To build the application for production, you will need to install [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/). Then, clone the repository and run:

- `yarn run build`
- `yarn run start`

Always run a build before committing to check for compiler errors. The automatic deployment on the `main` branch will not accept compiler errors!

To build a standalone browser application using [Tauri](https://tauri.app/), you will need to have [Node.js](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/en/) and [Rust](https://www.rust-lang.org/) installed. Then, clone the repository and run:

- `yarn tauri build`
- `yarn tauri dev`

The `tauri` version is only here to quickstart future developments but nothing has been done yet.

## Docker

### Run the application

`docker run -p 8001:80 yassinsiouda/topos:latest`

### Build and run the prod image

`docker compose --profile prod up`

### Build and run the dev image

**First installation**
First you need to map node_modules to your local machine for your ide intellisense to work properly

```bash
docker compose --profile dev up -d
docker cp topos-dev:/app/node_modules .
docker compose --profile dev down
```

**Then**

```bash
docker compose --profile dev up
```
