# Topos: A Web-Based Algorithmic Sequencer

<p align="center"> | 
  <a href="https://discord.gg/aPgV7mSFZh">Discord</a> | 
  <a href="https://raphaelforment.fr/">BuboBubo</a> | 
  <a href="about:blank">Amiika</a> | 
  <a href="https://toplap.org/">About Live Coding</a> |
  <br><br>
  <h2 align="center"><b>Contributors</b></h2>
  <p align='center'>
    <a href="https://github.com/bubobubobubobubo/Topos/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=bubobubobubobubo/Topos" />
    </a>
  </p>
</p>

Topos is a web-based application that lives [here](https://topos.raphaelforment.fr). Documentation and description is directly included in the application itself.

![Screenshot](https://github.com/Bubobubobubobubo/Topos/blob/main/img/screnshot.png)

## Disclaimer

**Topos** is a fairly young project developed by two part time hobbyists :) Do not expect stable features and/or user support in the initial development stage. Contributors and curious people are welcome! The software is working quite well and we are continuously striving to improve it.

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
