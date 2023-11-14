import { type UserAPI } from "../API";
import { safeScale, stepsToScale } from "zifferjs";
export {};

declare global {
  interface Array<T> {
    add(amount: number): number[];
    sub(amount: number): number[];
    mult(amount: number): number[];
    div(amount: number): number[];
    mouseX(): T[];
    mouseY(): T[];
    palindrome(): T[];
    random(index: number): T;
    rand(index: number): T;
    degrade(amount: number): T;
    repeat(amount: number): T;
    repeatEven(amount: number): T;
    repeatOdd(amount: number): T;
    beat(division: number): T;
    dur(...durations: number[]): T;
    b(division: number): T;
    bar(): T;
    pick(): T;
    loop(index: number): T;
    shuffle(): this;
    scale(name: string, base_note?: number): this;
    scaleArp(scaleName: string): this;
    rotate(steps: number): this;
    unique(): this;
    square(): number[];
    sqrt(): number[];
    gen(min: number, max: number, times: number): number[];
    sometimes(func: Function): number[];
    apply(func: Function): number[];
  }
}

export const makeArrayExtensions = (api: UserAPI) => {
  Array.prototype.mouseX = function <T>(this: T[]): T {
    /**
     * @returns Value from list based on mouse X position
     */
    const mouse_position = api.mouseX();
    const screenWidth = window.innerWidth;
    const zoneWidth = screenWidth / this.length;
    const zoneIndex = Math.floor(mouse_position / zoneWidth);

    return this[zoneIndex];
  };

  Array.prototype.mouseY = function <T>(this: T[]): T {
    const mouse_position = api.mouseY();
    const screenHeight = window.innerHeight;
    const zoneHeight = screenHeight / this.length;
    const zoneIndex = Math.floor(mouse_position / zoneHeight);

    return this[zoneIndex];
  };

  Array.prototype.square = function (): number[] {
    /**
     * @returns New array with squared values.
     */
    return this.map((x: number) => x * x);
  };

  Array.prototype.sometimes = function (func: Function): number[] {
    if (api.randomGen() < 0.5) {
      return func(this);
    } else {
      return this;
    }
  };

  Array.prototype.apply = function (func: Function): number[] {
    return func(this);
  };

  Array.prototype.sqrt = function (): number[] {
    /**
     * @returns New array with square roots of values. Throws if any element is negative.
     */
    if (this.some((x) => x < 0))
      throw new Error("Cannot take square root of negative number");
    return this.map((x: number) => Math.sqrt(x));
  };

  Array.prototype.add = function (amount: number): number[] {
    /**
     * @param amount - The value to add to each element in the array.
     * @returns New array with added values.
     */
    return this.map((x: number) => x + amount);
  };

  Array.prototype.sub = function (amount: number): number[] {
    /**
     * @param amount - The value to subtract from each element in the array.
     * @returns New array with subtracted values.
     */
    return this.map((x: number) => x - amount);
  };

  Array.prototype.mult = function (amount: number): number[] {
    /**
     * @param amount - The value to multiply with each element in the array.
     * @returns New array with multiplied values.
     */
    return this.map((x: number) => x * amount);
  };

  Array.prototype.div = function (amount: number): number[] {
    /**
     * @param amount - The value to divide each element in the array by.
     * @returns New array with divided values. Throws if division by zero.
     */
    if (amount === 0) throw new Error("Division by zero");
    return this.map((x: number) => x / amount);
  };

  Array.prototype.pick = function () {
    /**
     * Returns a random element from an array.
     *
     * @param array - The array of values to pick from
     */
    return this[Math.floor(api.randomGen() * this.length)];
  };

  Array.prototype.gen = function (min: number, max: number, times: number) {
    /**
     * Returns an array of random numbers.
     * @param min - The minimum value of the random numbers
     * @param max - The maximum value of the random numbers
     * @param times - The number of random numbers to generate
     * @returns An array of random numbers
     */
    if (times < 1) {
      return [];
    }
    return Array.from(
      { length: times },
      () => Math.floor(api.randomGen() * (max - min + 1)) + min
    );
  };

  Array.prototype.bar = function (value: number = 1) {
    /**
     * Returns an element from an array based on the current bar.
     *
     * @param array - The array of values to pick from
     */
    if (value === 1) {
      return this[api.app.clock.time_position.bar % this.length];
    } else {
      return this[
        Math.floor(api.app.clock.time_position.bar / value) % this.length
      ];
    }
  };

  Array.prototype.beat = function (divisor: number = 1) {
    const chunk_size = divisor; // Get the first argument (chunk size)
    const timepos = api.app.clock.pulses_since_origin;
    const slice_count = Math.floor(
      timepos / Math.floor(chunk_size * api.ppqn())
    );
    return this[slice_count % this.length];
  };
  Array.prototype.b = Array.prototype.beat;

  Array.prototype.dur = function (...durations: number[]) {
    const timepos = api.app.clock.pulses_since_origin;
    const ppqn = api.ppqn();
    const adjustedDurations: number[] = this.map(
      (_, index) => durations[index % durations.length]
    );
    const totalDurationInPulses = adjustedDurations.reduce(
      (acc, duration) => acc + duration * ppqn,
      0
    );
    const loopPosition = timepos % totalDurationInPulses;
    let cumulativeDuration = 0;
    for (let i = 0; i < this.length; i++) {
      const valueDurationInPulses = (adjustedDurations[i] as any) * ppqn;
      cumulativeDuration += valueDurationInPulses;
      if (loopPosition < cumulativeDuration) {
        return this[i];
      }
    }
    throw new Error("Durations array does not match the pattern length.");
  };

  Array.prototype.shuffle = function () {
    /**
     * Shuffles the array in place.
     *
     * @returns The shuffled array
     */
    let currentIndex = this.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(api.randomGen() * currentIndex);
      currentIndex--;
      [this[currentIndex], this[randomIndex]] = [
        this[randomIndex],
        this[currentIndex],
      ];
    }
    return this;
  };

  Array.prototype.rotate = function (steps: number) {
    /**
     * Rotates the array in place.
     *
     * @param steps - The number of steps to rotate the array by
     * @returns The rotated array
     */
    const length = this.length;
    if (steps < 0) {
      steps = length + (steps % length);
    } else if (steps > 0) {
      steps = steps % length;
    } else {
      return this;
    }
    const rotated = this.splice(-steps, steps);
    this.unshift(...rotated);
    return this;
  };

  Array.prototype.unique = function () {
    /**
     * Removes duplicate elements from the array in place.
     *
     * @returns The array without duplicates
     */
    const seen = new Set();
    let writeIndex = 0;
    for (let readIndex = 0; readIndex < this.length; readIndex++) {
      const value = this[readIndex];
      if (!seen.has(value)) {
        seen.add(value);
        this[writeIndex++] = value;
      }
    }
    this.length = writeIndex;
    return this;
  };

  Array.prototype.degrade = function <T>(this: T[], amount: number) {
    /**
     * Removes elements from the array at random. If the array has
     * only one element left, it will not be removed.
     *
     * @param amount - The amount of elements to remove
     * @returns The degraded array
     */
    if (amount < 0 || amount > 100) {
      throw new Error("Amount should be between 0 and 100");
    }
    if (this.length <= 1) {
      return this;
    }
    for (let i = 0; i < this.length; ) {
      const rand = api.randomGen() * 100;
      if (rand < amount) {
        if (this.length > 1) {
          this.splice(i, 1);
        } else {
          return this;
        }
      } else {
        i++;
      }
    }
    return this;
  };

  Array.prototype.repeat = function <T>(this: T[], amount: number = 1) {
    /**
     * Repeats all elements in the array n times.
     *
     * @param amount - The amount of times to repeat the elements
     * @returns The repeated array
     */
    if (amount < 1) {
      throw new Error("Amount should be at least 1");
    }
    let result = [];
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < amount; j++) {
        result.push(this[i]);
      }
    }

    this.length = 0;
    this.push(...result);
    return this;
  };

  Array.prototype.repeatOdd = function <T>(this: T[], amount: number = 1) {
    /**
     * Repeats all elements in the array n times, except for the
     * elements at odd indexes.
     *
     * @param amount - The amount of times to repeat the elements
     * @returns The repeated array
     */
    if (amount < 1) {
      throw new Error("Amount should be at least 1");
    }

    let result = [];

    for (let i = 0; i < this.length; i++) {
      // If the index is even, repeat the element
      if (i % 2 === 0) {
        for (let j = 0; j < amount; j++) {
          result.push(this[i]);
        }
      } else {
        result.push(this[i]);
      }
    }

    this.length = 0;
    this.push(...result);
    return this;
  };

  Array.prototype.repeatEven = function <T>(this: T[], amount: number = 1) {
    /**
     * Repeats all elements in the array n times, except for the
     * elements at even indexes.
     *
     * @param amount - The amount of times to repeat the elements
     * @returns The repeated array
     *
     * @remarks
     * This function is the opposite of repeatPair.
     */
    if (amount < 1) {
      throw new Error("Amount should be at least 1");
    }

    let result = [];

    for (let i = 0; i < this.length; i++) {
      // If the index is odd, repeat the element
      if (i % 2 !== 0) {
        for (let j = 0; j < amount; j++) {
          result.push(this[i]);
        }
      } else {
        result.push(this[i]);
      }
    }

    // Update the original array
    this.length = 0;
    this.push(...result);
    return this;
  };

  // @ts-ignore
  Array.prototype.palindrome = function <T>() {
    /**
     * Returns a palindrome of the array.
     *
     * @returns The palindrome of the array
     */
    let left_to_right = Array.from(this);
    let right_to_left = Array.from(this.reverse());
    return left_to_right.concat(right_to_left);
  };

  Array.prototype.loop = function (index: number) {
    /**
     * Returns an element from the array based on the index.
     * The index will wrap over the array.
     *
     * @param index - The index of the element to return
     * @returns The element at the given index
     */
    return this[index % this.length];
  };

  Array.prototype.random = function () {
    /**
     * Returns a random element from the array.
     *
     * @returns A random element from the array
     */
    return this[Math.floor(api.randomGen() * this.length)];
  };
  Array.prototype.rand = Array.prototype.random;
};

Array.prototype.scale = function (
  scale: string = "major",
  base_note: number = 0
) {
  /**
   * @param scale - the scale name
   * @param base_note - the base note to start at (MIDI note number)
   *
   * @returns notes from the desired scale
   */

  // This is a helper function to handle up or down octaviation.
  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const selected_scale = stepsToScale(safeScale(scale));
  return this.map((value) => {
    const octaveShift = Math.floor(value / selected_scale.length) * 12;
    return (
      selected_scale[mod(value, selected_scale.length)] +
      base_note +
      octaveShift
    );
  });
};

Array.prototype.scaleArp = function (
  scaleName: string = "major",
  boundary: number = 0
) {
  /*
   * @param scaleName - the scale name
   * @param mask - the length of the mask
   *
   * @returns arpeggiated notes from the scale
   */
  const scale = stepsToScale(safeScale(scaleName));

  let result = [];

  boundary = boundary > scale.length ? scale.length : boundary;
  boundary = boundary == 0 ? scale.length : boundary;

  for (let j = 0; j < boundary; j++) {
    for (let i = 0; i < this.length; i++) {
      result.push(this[i] + scale[j]);
    }
  }

  return result;
};
