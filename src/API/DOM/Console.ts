import { type UserAPI } from "../API";

export const log = (api: UserAPI) => (message: any) => {
  /**
   * Logs a message to the console and app-specific logger.
   * @param message - The message to log.
   */
  console.log(message);
  api._logMessage(message, false);
};

export const logOnce = (api: UserAPI) => (message: any) => {
  /**
   * Logs a message to the console and app-specific logger, but only once.
   * @param message - The message to log.
   */
  if (api.onceEvaluator) {
    console.log(message);
    api._logMessage(message, false);
    api.onceEvaluator = false;
  }
};
