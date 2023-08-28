import type { Editor } from "./main";
import type { File } from "./AppSettings";

const delay = (ms: number) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Operation took too long")), ms)
  );

const codeReplace = (code: string): string => {
  let new_code = code.replace(/->/g, "&&").replace(/::/g, "&&");
  return new_code;
};

const tryCatchWrapper = (
  application: Editor,
  code: string
): Promise<boolean> => {
  return new Promise((resolve, _) => {
    try {
      Function(
        `"use strict";try{${codeReplace(
          code
        )}} catch (e) {console.log(e); _reportError(e);};`
      ).call(application.api);
      resolve(true);
    } catch (error) {
      application.error_line.innerHTML = error as string;
      console.log(error);
      resolve(false);
    }
  });
};

const cache = new Map<string, Function>();
const MAX_CACHE_SIZE = 20;

const addFunctionToCache = (code: string, fn: Function) => {
  if (cache.size >= MAX_CACHE_SIZE) {
    // Delete the first item if cache size exceeds max size
    cache.delete(cache.keys().next().value);
  }
  cache.set(code, fn);
};

export const tryEvaluate = async (
  application: Editor,
  code: File,
  timeout = 5000
): Promise<void> => {
  try {
    code.evaluations!++;
    const candidateCode = code.candidate;

    if (cache.has(candidateCode)) {
      // If the code is already in cache, use it
      cache.get(candidateCode)!.call(application.api);
    } else {
      const wrappedCode = `let i = ${code.evaluations};` + candidateCode;
      // Otherwise, evaluate the code and if valid, add it to the cache
      const isCodeValid = await Promise.race([
        tryCatchWrapper(application, wrappedCode as string),
        delay(timeout),
      ]);
      if (isCodeValid) {
        code.committed = code.candidate;
        const newFunction = new Function(
          `"use strict";try{${codeReplace(
            wrappedCode
          )}} catch (e) {console.log(e); _reportError(e);};`
        );
        addFunctionToCache(candidateCode, newFunction);
      } else {
        await evaluate(application, code, timeout);
      }
    }
  } catch (error) {
    application.error_line.innerHTML = error as string;
    console.log(error);
  }
};

export const evaluate = async (
  application: Editor,
  code: File,
  timeout = 1000
): Promise<void> => {
  try {
    await Promise.race([
      tryCatchWrapper(application, code.committed as string),
      delay(timeout),
    ]);
    if (code.evaluations) code.evaluations++;
  } catch (error) {
    application.error_line.innerHTML = error as string;
    console.log(error);
  }
};

export const evaluateOnce = async (
  application: Editor,
  code: string
): Promise<void> => {
	/**
	 * Evaluates the code once without any caching or error-handling mechanisms besides the tryCatchWrapper.
	 *
	 * @param application - The application object that contains the Editor API.
	 * @param code - The code to be evaluated.
	 * @returns A promise that resolves when the code has been evaluated.
	 */
  await tryCatchWrapper(application, code);
};
