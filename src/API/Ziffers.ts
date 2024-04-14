import { InputOptions, Player } from "../Classes/ZPlayer";
import { UserAPI } from "./API";
import { generateCacheKey, removePatternFromCache } from "./Cache"

export const z = (api: UserAPI) => (input: string | Generator<number>, options: InputOptions = {}, id: number | string = ""): Player => {
  const zid = "z" + id.toString();
  const key = id === "" ? generateCacheKey()(input, options) : zid;

  const validSyntax = typeof input === "string" && !api.invalidPatterns[input]

  let player;
  let replace = false;

  if (api.patternCache.has(key)) {
    player = api.patternCache.get(key) as Player;

    if (typeof input === "string" &&
      player.input !== input &&
      (player.atTheBeginning() || api.forceEvaluator)) {
      replace = true;
    }
  }

  if ((typeof input !== "string" || validSyntax) && (!player || replace)) {
    if (typeof input === "string" && player && api.forceEvaluator) {
      if (!player.updatePattern(input, options)) {
        api.logOnce(`Invalid syntax: ${input}`);
      };
      api.forceEvaluator = false;
    } else {
      const newPlayer = player ? new Player(input, options, api.app, zid, player.nextEndTime()) : new Player(input, options, api.app, zid);
      if (newPlayer.isValid()) {
        player = newPlayer;
        api.patternCache.set(key, player);
      } else if (typeof input === "string") {
        api.invalidPatterns[input] = true;
      }
    }
  }

  if (player) {
    if (player.atTheBeginning()) {
      if (typeof input === "string" && !validSyntax) api.log(`Invalid syntax: ${input}`);
    }

    if (player.ziffers.generator && player.ziffers.generatorDone) {
      removePatternFromCache(api)(key);
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
export const generateZFunctions = (api: UserAPI) => {
  const zFunctions: { [key: string]: (input: string, opts: InputOptions) => Player } = {};
  for (let i = 0; i <= 16; i++) {
    zFunctions[`z${i}`] = (input: string, opts: InputOptions = {}) => z(api)(input, opts, i);
  }
  return zFunctions;
};
