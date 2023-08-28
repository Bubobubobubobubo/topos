# Topos

![Screenshot](https://github.com/Bubobubobubobubo/Topos/blob/main/img/screnshot.png)

## Disclaimer

**Topos** is a very young project. It is not ready for end users, do not expect stable features and/or user support. Contributors and curious people are welcome! The software is not stabilized at all for the moment but it is already possible to have fun playing with it.

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
