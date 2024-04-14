export const time = (app: any) => (): number => {
    return app.audioContext.currentTime;
};

export const play = (app: any) => (): void => {
    app.setButtonHighlighting("play", true);
    app.MidiConnection.sendStartMessage();
    app.clock.start();
};

export const pause = (app: any) => (): void => {
    app.setButtonHighlighting("pause", true);
    app.clock.pause();
};

export const stop = (app: any) => (): void => {
    app.setButtonHighlighting("stop", true);
    app.clock.stop();
};

export const silence = (app: any) => (): void => {
    return stop(app)();
};

export const tempo = (app: any) => (n?: number): number => {
    /**
     * Sets or returns the current bpm.
     */
    if (n === undefined) return app.clock.bpm;

    if (n >= 1 && n <= 500) {
      app.clock.bpm = n;
    } else {
      console.error("BPM out of acceptable range (1-500).");
    }
    return n;
};

export const bpb = (app: any) => (n?: number): number => {
    /**
     * Sets or returns the number of beats per bar.
     */
    if (n === undefined) return app.clock.time_signature[0];

    if (n >= 1) {
        app.clock.time_signature[0] = n;
    } else {
        console.error("Beats per bar must be at least 1.");
    }
    return n;
};

export const ppqn = (app: any) => (n?: number): number => {
    /**
     * Sets or returns the number of pulses per quarter note.
     */
    if (n === undefined) return app.clock.ppqn;

    if (n >= 1) {
        app.clock.ppqn = n;
    } else {
        console.error("Pulses per quarter note must be at least 1.");
    }
    return n;
};

export const time_signature = (app: any) => (numerator: number, denominator: number): void => {
    /**
     * Sets the time signature.
     */
    if (numerator < 1 || denominator < 1) {
        console.error("Time signature values must be at least 1.");
    } else {
        app.clock.time_signature = [numerator, denominator];
    }
};

export const cbar = (app: any) => (): number => {
    return app.clock.time_position.bar + 1;
};

export const ctick = (app: any) => (): number => {
    return app.clock.tick + 1;
};

export const cpulse = (app: any) => (): number => {
    return app.clock.time_position.pulse + 1;
};

export const cbeat = (app: any) => (): number => {
    return app.clock.time_position.beat + 1;
};

export const ebeat = (app: any) => (): number => {
    return app.clock.beats_since_origin + 1;
};

export const epulse = (app: any) => (): number => {
    return app.clock.pulses_since_origin + 1;
};

export const nominator = (app: any) => (): number => {
    return app.clock.time_signature[0];
};

export const meter = (app: any) => (): number => {
    return app.clock.time_signature[1];
};

export const denominator = meter;  // Alias for meter

export const pulsesForBar = (app: any) => (): number => {
    return (app.clock.bpm * app.clock.ppqn * nominator(app)()) / 60;
};