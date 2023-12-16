export function objectWithArraysToArrayOfObjects(
  input: Record<string, any>,
  arraysToArrays: string[],
): Record<string, any>[] {
  /*
   * Transforms object with arrays into array of objects
   *
   * @param {Record<string, any>} input - Object with arrays
   * @param {string[]} ignoredKeys - Keys to ignore
   * @returns {Record<string, any>[]} Array of objects
   *
   */
  const inputCopy = { ...input };
  arraysToArrays.forEach((k) => {
    if (Array.isArray(inputCopy[k]) && !Array.isArray(inputCopy[k][0])) {
      inputCopy[k] = [inputCopy[k]];
    }
  });

  const keysAndLengths = Object.entries(inputCopy).reduce(
    (acc, [key, value]) => {
      const length = Array.isArray(value) ? (value as any[]).length : 1;
      acc.maxLength = Math.max(acc.maxLength, length);
      acc.keys.push(key);
      return acc;
    },
    { keys: [] as string[], maxLength: 0 },
  );

  const output: Record<string, any>[] = [];
  for (let i = 0; i < keysAndLengths.maxLength; i++) {
    const event: Record<string, any> = {};
    for (const k of keysAndLengths.keys) {
      if (Array.isArray(inputCopy[k])) {
        event[k] = (inputCopy[k] as any[])[i % (inputCopy[k] as any[]).length];
      } else {
        event[k] = inputCopy[k];
      }
    }
    output.push(event);
  }
  return output;
}

export function arrayOfObjectsToObjectWithArrays<T extends Record<string, any>>(
  array: T[],
  mergeObject: Record<string, any> = {},
): Record<string, any> {
  /*
   * Transforms array of objects into object with arrays
   *
   * @param {Record<string, any>[]} array - Array of objects
   * @param {Record<string, any>} mergeObject - Object that is merged to each object in the array
   * @returns {object} Merged object with arrays
   *
   */
  return array.reduce(
    (acc, obj) => {
      const mergedObj = { ...obj, ...mergeObject };
      Object.keys(mergedObj).forEach((key) => {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(mergedObj[key]);
      });
      return acc;
    },
    {} as Record<string, any>,
  );
}

export function maybeAtomic<T>(value: T): T | T[] {
  /*
    * Returns first value of array if array of length 1, otherwise returns value
    * @param {any} value - Value to check
    * @returns {any} Value or array
    */
  return Array.isArray(value) && value.length === 1 ? value[0] : value;
}

export function filterObject(
  obj: Record<string, any>,
  filter: string[],
): Record<string, any> {
  /*
   * Filter certain keys from object
   *
   * @param {Record<string, any>} obj - Object to filter
   * @param {string[]} filter - Keys to filter
   * @returns {object} Filtered object
   *
   */
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => filter.includes(key)),
  );
}

export const GeneratorType = (function*(){yield undefined;}).constructor;
export const GeneratorIteratorType = (function*(){yield undefined;}).prototype.constructor;
export const isGenerator = (v:any) => Object.prototype.toString.call(v) === '[object Generator]';
export const isGeneratorFunction = (v:any) => Object.prototype.toString.call(v) === '[object GeneratorFunction]';