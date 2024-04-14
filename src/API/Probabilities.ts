import { type UserAPI } from "./API";

export const prob = (api: UserAPI) => (p: number): boolean => {
  return api.randomGen() * 100 < p;
};

export const toss = (api: UserAPI) => (): boolean => {
  return api.randomGen() > 0.5;
};

export const odds = (api: UserAPI) => (n: number, beats: number = 1): boolean => {
  return api.randomGen() < (n * api.ppqn()) / (api.ppqn() * beats);
};

export const never = () => (): boolean => {
  return false;
};

export const almostNever = (api: UserAPI) => (beats: number = 1): boolean => {
  return api.randomGen() < (0.025 * api.ppqn()) / (api.ppqn() * beats);
};

export const rarely = (api: UserAPI) => (beats: number = 1): boolean => {
  return api.randomGen() < (0.1 * api.ppqn()) / (api.ppqn() * beats);
};

export const scarcely = (api: UserAPI) => (beats: number = 1): boolean => {
  return api.randomGen() < (0.25 * api.ppqn()) / (api.ppqn() * beats);
};

export const sometimes = (api: UserAPI) => (beats: number = 1): boolean => {
  return api.randomGen() < (0.5 * api.ppqn()) / (api.ppqn() * beats);
};

export const often = (api: UserAPI) => (beats: number = 1): boolean => {
  return api.randomGen() < (0.75 * api.ppqn()) / (api.ppqn() * beats);
};

export const frequently = (api: UserAPI) => (beats: number = 1): boolean => {
  return api.randomGen() < (0.9 * api.ppqn()) / (api.ppqn() * beats);
};

export const almostAlways = (api: UserAPI) => (beats: number = 1): boolean => {
  return api.randomGen() < (0.985 * api.ppqn()) / (api.ppqn() * beats);
};

export const always = () => (): boolean => {
  return true;
};

export const dice = (api: UserAPI) => (sides: number): number => {
  return Math.floor(api.randomGen() * sides) + 1;
};
