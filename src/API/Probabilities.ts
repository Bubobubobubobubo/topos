// Probability.ts

export const prob = (app: any) => (p: number): boolean => {
    return app.randomGen() * 100 < p;
};

export const toss = (app: any) => (): boolean => {
    return app.randomGen() > 0.5;
};

export const odds = (app: any) => (n: number, beats: number = 1): boolean => {
    return app.randomGen() < (n * app.ppqn()) / (app.ppqn() * beats);
};

export const never = () => (): boolean => {
    return false;
};

export const almostNever = (app: any) => (beats: number = 1): boolean => {
    return app.randomGen() < (0.025 * app.ppqn()) / (app.ppqn() * beats);
};

export const rarely = (app: any) => (beats: number = 1): boolean => {
    return app.randomGen() < (0.1 * app.ppqn()) / (app.ppqn() * beats);
};

export const scarcely = (app: any) => (beats: number = 1): boolean => {
    return app.randomGen() < (0.25 * app.ppqn()) / (app.ppqn() * beats);
};

export const sometimes = (app: any) => (beats: number = 1): boolean => {
    return app.randomGen() < (0.5 * app.ppqn()) / (app.ppqn() * beats);
};

export const often = (app: any) => (beats: number = 1): boolean => {
    return app.randomGen() < (0.75 * app.ppqn()) / (app.ppqn() * beats);
};

export const frequently = (app: any) => (beats: number = 1): boolean => {
    return app.randomGen() < (0.9 * app.ppqn()) / (app.ppqn() * beats);
};

export const almostAlways = (app: any) => (beats: number = 1): boolean => {
    return app.randomGen() < (0.985 * app.ppqn()) / (app.ppqn() * beats);
};

export const always = () => (): boolean => {
    return true;
};

export const dice = (app: any) => (sides: number): number => {
    return Math.floor(app.randomGen() * sides) + 1;
};