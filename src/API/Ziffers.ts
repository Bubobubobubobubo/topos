import { InputOptions, Player } from "../Classes/ZPlayer";
import { generateCacheKey, removePatternFromCache } from "./Cache"


// ziffersFunctions.ts
export const z = (app: any) => (input: string | Generator<number>, options: InputOptions = {}, id: number | string = ""): Player => {
    const zid = "z" + id.toString();
    const key = id === "" ? generateCacheKey(app)(input, options) : zid;

    const validSyntax = typeof input === "string" && !app.invalidPatterns[input]

    let player;
    let replace = false;

    if (app.patternCache.has(key)) {
      player = app.patternCache.get(key) as Player;

      if (typeof input === "string" &&
        player.input !== input &&
        (player.atTheBeginning() || app.forceEvaluator)) {
        replace = true;
      }
    }

    if ((typeof input !== "string" || validSyntax) && (!player || replace)) {
      if (typeof input === "string" && player && app.forceEvaluator) {
        if (!player.updatePattern(input, options)) {
          app.logOnce(`Invalid syntax: ${input}`);
        };
        app.forceEvaluator = false;
      } else {
        const newPlayer = player ? new Player(input, options, app, zid, player.nextEndTime()) : new Player(input, options, app, zid);
        if (newPlayer.isValid()) {
          player = newPlayer;
          app.patternCache.set(key, player);
        } else if (typeof input === "string") {
          app.invalidPatterns[input] = true;
        }
      }
    }

    if (player) {
      if (player.atTheBeginning()) {
        if (typeof input === "string" && !validSyntax) app.log(`Invalid syntax: ${input}`);
      }

      if (player.ziffers.generator && player.ziffers.generatorDone) {
        removePatternFromCache(app)(key);
      }

      if (typeof id === "number") player.zid = zid;

      player.updateLastCallTime();

      if (id !== "" && zid !== "z0") {
        // Sync named patterns to z0 by default
        player.sync("z0", false);
      }

      return player;
    } else {
      throw new Error(`Invalid syntax: ${input}`);
    }
};

// Generating numbered functions dynamically
export const generateZFunctions = (app: any) => {
    const zFunctions: { [key: string]: (input: string, opts: InputOptions) => Player } = {};
    for (let i = 0; i <= 16; i++) {
        zFunctions[`z${i}`] = (input: string, opts: InputOptions = {}) => z(app)(input, opts, i);
    }
    return zFunctions;
};
