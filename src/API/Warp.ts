export const warp = (app: any) => (n: number): void => {
    /**
     * Time-warp the clock by using the tick you wish to jump to.
     */
    app.clock.tick = n;
    app.clock.time_position = app.clock.convertTicksToTimeposition(n);
};

export const beat_warp = (app: any) => (beat: number): void => {
    /**
     * Time-warp the clock by using the tick you wish to jump to.
     */
    const ticks = beat * app.clock.ppqn;
    app.clock.tick = ticks;
    app.clock.time_position = app.clock.convertTicksToTimeposition(ticks);
};