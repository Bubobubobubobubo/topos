import { seededRandom } from "zifferjs";

export const randI = (app: any) => (min: number, max: number): number => {
    return Math.floor(app.randomGen() * (max - min + 1)) + min;
};

export const rand = (app: any) => (min: number, max: number): number => {
    return app.randomGen() * (max - min) + min;
};

export const seed = (app: any) => (seed: string | number): void => {
    if (typeof seed === "number") seed = seed.toString();
    if (app.currentSeed !== seed) {
        app.currentSeed = seed;
        app.randomGen = seededRandom(seed);
    }
};

export const localSeededRandom = (app: any) => (seed: string | number): Function => {
    if (typeof seed === "number") seed = seed.toString();
    if (app.localSeeds.has(seed)) return app.localSeeds.get(seed) as Function;
    const newSeededRandom = seededRandom(seed);
    app.localSeeds.set(seed, newSeededRandom);
    return newSeededRandom;
};

export const clearLocalSeed = (app: any) => (seed: string | number | undefined = undefined): void => {
    if (seed) {
        app.localSeeds.delete(seed.toString());
    } else {
        app.localSeeds.clear();
    }
};