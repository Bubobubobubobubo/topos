import { type UserAPI } from './API';

export const drunk = (api: UserAPI) => (n?: number): number => {
  /**
   * This function sets or returns the current drunk mechanism's value.
   * @param n - [optional] The value to set the drunk mechanism to
   * @returns The current value of the drunk mechanism
   */
  if (n !== undefined) {
    api._drunk.position = n;
    return api._drunk.getPosition();
  }
  api._drunk.step();
  return api._drunk.getPosition();
};

export const drunk_max = (api: UserAPI) => (max: number): void => {
  /**
   * Sets the maximum value of the drunk mechanism.
   * @param max - The maximum value of the drunk mechanism
   */
  api._drunk.max = max;
};

export const drunk_min = (api: UserAPI) => (min: number): void => {
  /**
   * Sets the minimum value of the drunk mechanism.
   * @param min - The minimum value of the drunk mechanism
   */
  api._drunk.min = min;
};

export const drunk_wrap = (api: UserAPI) => (wrap: boolean): void => {
  /**
   * Sets whether the drunk mechanism should wrap around
   * @param wrap - Whether the drunk mechanism should wrap around
   */
  api._drunk.toggleWrap(wrap);
};
