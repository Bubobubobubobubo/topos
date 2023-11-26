import type { Editor } from "./main";
import type { File } from "./FileManagement";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const codeReplace = (code: string): string => {
  return code.replace(/->|::/g, "&&");
};

const tryCatchWrapper = async (
  application: Editor,
  code: string
): Promise<boolean> => {
  /**
   * Wraps the provided code in a try-catch block and executes it.
   *
   * @param application - The editor application.
   * @param code - The code to be executed.
   * @returns A promise that resolves to a boolean indicating whether the code executed successfully or not.
   */

  try {
    await new Function(`"use strict"; ${codeReplace(code)}`).call(
      application.api
    );
    return true;
  } catch (error) {
    application.interface.error_line.innerHTML = error as string;
    application.api._reportError(error as string);
    return false;
  }
};

const cache = new Map<string, Function>();
const MAX_CACHE_SIZE = 40;

const addFunctionToCache = (code: string, fn: Function) => {
  /**
   * Adds a function to the cache.
   * @param code - The code associated with the function.
   * @param fn - The function to be added to the cache.
   */
  if (cache.size >= MAX_CACHE_SIZE) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(code, fn);
};

export const tryEvaluate = async (
  application: Editor,
  code: File,
  timeout = 5000
): Promise<void> => {
  /**
   * Tries to evaluate the provided code within a specified timeout period.
   * Increments the evaluation count of the code file.
   * If the code is valid, updates the committed code and adds the evaluated function to the cache.
   * If the code is invalid, retries the evaluation.
   * @param application - The editor application.
   * @param code - The code file to evaluate.
   * @param timeout - The timeout period in milliseconds (default: 5000).
   * @returns A Promise that resolves when the evaluation is complete.
   */
  code.evaluations!++;
  const candidateCode = code.candidate;

  try {
    const cachedFunction = cache.get(candidateCode);
    if (cachedFunction) {
      cachedFunction.call(application.api);
    } else {
      const wrappedCode = `let i = ${code.evaluations}; ${candidateCode}`;
      const isCodeValid = await Promise.race([
        tryCatchWrapper(application, wrappedCode),
        delay(timeout),
      ]);

      if (isCodeValid) {
        code.committed = code.candidate;
        const newFunction = new Function(
          `"use strict"; ${codeReplace(wrappedCode)}`
        );
        addFunctionToCache(candidateCode, newFunction);
      } else {
        await evaluate(application, code, timeout);
      }
    }
  } catch (error) {
    application.interface.error_line.innerHTML = error as string;
    application.api._reportError(error as string);
  }
};

export const evaluate = async (
  application: Editor,
  code: File,
  timeout = 1000
): Promise<void> => {
  /**
   * Evaluates the given code using the provided application and timeout.
   * @param application The editor application.
   * @param code The code file to evaluate.
   * @param timeout The timeout value in milliseconds (default: 1000).
   * @returns A Promise that resolves when the evaluation is complete.
   */

  try {
    await Promise.race([
      tryCatchWrapper(application, code.committed as string),
      delay(timeout),
    ]);
    if (code.evaluations) code.evaluations++;
  } catch (error) {
    application.interface.error_line.innerHTML = error as string;
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
