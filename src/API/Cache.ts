import { isGenerator, isGeneratorFunction, maybeToNumber } from "../Utils/Generic";
import { type Player } from "../Classes/ZPlayer";


export const generateCacheKey = () => (...args: any[]): string => {
    return args.map((arg) => JSON.stringify(arg)).join(",");
};

export const resetAllFromCache = (app: any) => (): void => {
    app.patternCache.forEach((player: Player) => player.reset());
};

export const clearPatternCache = (app: any) => (): void => {
    app.patternCache.clear();
};

export const removePatternFromCache = (app: any) => (id: string): void => {
    app.patternCache.delete(id);
};


export const cache = (app: any) => (key: string, value: any) => {
    if (value !== undefined) {
        if (isGenerator(value)) {
            if (app.patternCache.has(key)) {
                const cachedValue = (app.patternCache.get(key) as Generator<any>).next().value;
                if (cachedValue !== 0 && !cachedValue) {
                    const generator = value as unknown as Generator<any>;
                    app.patternCache.set(key, generator);
                    return maybeToNumber(generator.next().value);
                }
                return maybeToNumber(cachedValue);
            } else {
                const generator = value as unknown as Generator<any>;
                app.patternCache.set(key, generator);
                return maybeToNumber(generator.next().value);
            }
        } else if (isGeneratorFunction(value)) {
            if (app.patternCache.has(key)) {
                const cachedValue = (app.patternCache.get(key) as Generator<any>).next().value;
                if (cachedValue || cachedValue === 0 || cachedValue === 0n) {
                    return maybeToNumber(cachedValue);
                } else {
                    const generator = value();
                    app.patternCache.set(key, generator);
                    return maybeToNumber(generator.next().value);
                }
            } else {
                const generator = value();
                app.patternCache.set(key, generator);
                return maybeToNumber(generator.next().value);
            }
        } else {
            app.patternCache.set(key, value);
            return maybeToNumber(value);
        }
    } else {
        return maybeToNumber(app.patternCache.get(key));
    }
};