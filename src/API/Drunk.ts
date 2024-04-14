export const drunk = (app: any) => (n?: number): number => {
    /**
     * This function sets or returns the current drunk mechanism's value.
     * @param n - [optional] The value to set the drunk mechanism to
     * @returns The current value of the drunk mechanism
     */
    if (n !== undefined) {
      app._drunk.position = n;
      return app._drunk.getPosition();
    }
    app._drunk.step();
    return app._drunk.getPosition();
};

export const drunk_max = (app: any) => (max: number): void => {
    /**
     * Sets the maximum value of the drunk mechanism.
     * @param max - The maximum value of the drunk mechanism
     */
    app._drunk.max = max;
};

export const drunk_min = (app: any) => (min: number): void => {
    /**
     * Sets the minimum value of the drunk mechanism.
     * @param min - The minimum value of the drunk mechanism
     */
    app._drunk.min = min;
};

export const drunk_wrap = (app: any) => (wrap: boolean): void => {
    /**
     * Sets whether the drunk mechanism should wrap around
     * @param wrap - Whether the drunk mechanism should wrap around
     */
    app._drunk.toggleWrap(wrap);
};