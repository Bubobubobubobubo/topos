/*
 * Transforms object with arrays into array of objects
 * 
 * @param {Record<string, any>} input - Object with arrays
 * @param {string[]} ignoredKeys - Keys to ignore
 * @returns {Record<string, any>[]} Array of objects
 * 
 */
export function objectWithArraysToArrayOfObjects(input: Record<string, any>, ignoredKeys: string[]): Record<string, any>[] {
    const keys = Object.keys(input).filter((k) => !ignoredKeys.includes(k));
    const maxLength = Math.max(
      ...keys.map((k) =>
        Array.isArray(input[k]) ? (input[k] as any[]).length : 1
      )
    );

    const output: Record<string, any>[] = [];

    for (let i = 0; i < maxLength; i++) {
      const event: Record<string, any> = {};
      for (const k of keys) {
        if (ignoredKeys.includes(k)) {
           event[k] = input[k];
        } else {
          if (Array.isArray(input[k])) {
            event[k] = (input[k] as any[])[i % (input[k] as any[]).length];
          } else {
            event[k] = input[k];
          }
        }
      }
      output.push(event);
    }
    return output;
  };

/* 
 * Transforms array of objects into object with arrays
 * 
 * @param {Record<string, any>[]} array - Array of objects
 * @param {Record<string, any>} mergeObject - Object that is merged to each object in the array
 * @returns {object} Merged object with arrays
 * 
 */
export function arrayOfObjectsToObjectWithArrays<T extends Record<string, any>>(array: T[], mergeObject: Record<string, any> = {}): Record<string, any> {
    return array.reduce((acc, obj) => {
      Object.keys(mergeObject).forEach((key) => {
        obj[key as keyof T] = mergeObject[key];
      });
      Object.keys(obj).forEach((key) => {
        if (!acc[key as keyof T]) {
          acc[key as keyof T] = [];
        }
        (acc[key as keyof T] as unknown[]).push(obj[key]);
      });
      return acc;
    }, {} as Record<keyof T, any[]>);
  }

  /* 
   * Filter certain keys from object
   *
   * @param {Record<string, any>} obj - Object to filter
   * @param {string[]} filter - Keys to filter
   * @returns {object} Filtered object
   *
   */
  export function filterObject(obj: Record<string, any>, filter: string[]): Record<string, any> {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => filter.includes(key)));
  }