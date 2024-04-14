import { seededRandom } from "zifferjs";
import { UserAPI } from "./API";

export const randI = (api: UserAPI) => (min: number, max: number): number => {
  return Math.floor(api.randomGen() * (max - min + 1)) + min;
};

export const rand = (api: UserAPI) => (min: number, max: number): number => {
  return api.randomGen() * (max - min) + min;
};

export const seed = (api: UserAPI) => (seed: string | number): void => {
  if (typeof seed === "number") seed = seed.toString();
  if (api.currentSeed !== seed) {
    api.currentSeed = seed;
    api.randomGen = seededRandom(seed);
  }
};

export const localSeededRandom = (api: UserAPI) => (seed: string | number): Function => {
  if (typeof seed === "number") seed = seed.toString();
  if (api.localSeeds.has(seed)) return api.localSeeds.get(seed) as Function;
  const newSeededRandom = seededRandom(seed);
  api.localSeeds.set(seed, newSeededRandom);
  return newSeededRandom;
};

export const clearLocalSeed = (api: UserAPI) => (seed: string | number | undefined = undefined): void => {
  if (seed) {
    api.localSeeds.delete(seed.toString());
  } else {
    api.localSeeds.clear();
  }
};
