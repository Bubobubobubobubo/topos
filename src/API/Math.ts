// mathFunctions.ts
export const min = () => (...values: number[]): number => {
    /**
     * Returns the minimum value of a list of numbers.
     */
    return Math.min(...values);
};

export const max = () => (...values: number[]): number => {
    /**
     * Returns the maximum value of a list of numbers.
     */
    return Math.max(...values);
};

export const mean = () => (...values: number[]): number => {
    /**
     * Returns the mean of a list of numbers.
     */
    const sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return values.length > 0 ? sum / values.length : 0;
};

export const limit = () => (value: number, min: number, max: number): number => {
    /**
     * Limits a value between a minimum and a maximum.
     */
    return Math.min(Math.max(value, min), max);
};

export const abs = () => (value: number): number => {
    /**
     * Returns the absolute value of a number.
     */
    return Math.abs(value);
};