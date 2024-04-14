import { isGenerator, isGeneratorFunction, maybeToNumber } from "../Utils/Generic";
import { type Player } from "../Classes/ZPlayer";
import { type UserAPI } from "./API";


export const generateCacheKey = () => (...args: any[]): string => {
  return args.map((arg) => JSON.stringify(arg)).join(",");
};

export const resetAllFromCache = (api: UserAPI) => (): void => {
  api.patternCache.forEach((player) => (player as Player).reset());
};

export const clearPatternCache = (api: UserAPI) => (): void => {
  api.patternCache.clear();
};

export const removePatternFromCache = (api: UserAPI) => (id: string): void => {
  api.patternCache.delete(id);
};


export const cache = (api: UserAPI) => (key: string, value: any) => {
  if (value !== undefined) {
    if (isGenerator(value)) {
      if (api.patternCache.has(key)) {
        const cachedValue = (api.patternCache.get(key) as Generator<any>).next().value;
        if (cachedValue !== 0 && !cachedValue) {
          const generator = value as unknown as Generator<any>;
          api.patternCache.set(key, generator);
          return maybeToNumber(generator.next().value);
        }
        return maybeToNumber(cachedValue);
      } else {
        const generator = value as unknown as Generator<any>;
        api.patternCache.set(key, generator);
        return maybeToNumber(generator.next().value);
      }
    } else if (isGeneratorFunction(value)) {
      if (api.patternCache.has(key)) {
        const cachedValue = (api.patternCache.get(key) as Generator<any>).next().value;
        if (cachedValue || cachedValue === 0 || cachedValue === 0n) {
          return maybeToNumber(cachedValue);
        } else {
          const generator = value();
          api.patternCache.set(key, generator);
          return maybeToNumber(generator.next().value);
        }
      } else {
        const generator = value();
        api.patternCache.set(key, generator);
        return maybeToNumber(generator.next().value);
      }
    } else {
      api.patternCache.set(key, value);
      return maybeToNumber(value);
    }
  } else {
    return maybeToNumber(api.patternCache.get(key));
  }
};
