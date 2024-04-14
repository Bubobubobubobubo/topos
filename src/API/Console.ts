export const log = (app: any) => (message: any) => {
    /**
     * Logs a message to the console and app-specific logger.
     * @param message - The message to log.
     */
    console.log(message);
    app._logMessage(message, false);
};

export const logOnce = (app: any) => (message: any) => {
    /**
     * Logs a message to the console and app-specific logger, but only once.
     * @param message - The message to log.
     */
    if (app.onceEvaluator) {
        console.log(message);
        app._logMessage(message, false);
        app.onceEvaluator = false;
    }
};
