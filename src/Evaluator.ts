import type { Editor } from './main';
import type { File } from './AppSettings';

function codeInterceptor(code: string): string {
  return code
    .replace(/->/g, "&&")
    .replace(/t\[(\d+),(\d+)\]/g, 'mod($1,$2)')
    .replace(/b\[(\d+),(\d+)\]/g, '[$1,$2].includes(beat)')
    .replace(/eb\[(\d+),(\d+)\]/g, '[$1,$2].includes(ebeat)')
    .replace(/m\[(\d+),(\d+)\]/g, '[$1,$2].includes(bar)')
}

const delay = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('Operation took too long')), ms));

const tryCatchWrapper = (application: Editor, code: string): Promise<boolean> => {
  /**
   * This function wraps a string of code in a try/catch block and returns a promise 
   * that resolves to true if the code is valid and false if the code is invalid after
   * being evaluated.
   * 
   * @param application - The main application instance 
   * @param code - The string of code to wrap and evaluate
   * @returns A promise that resolves to true if the code is valid and false if the code is invalid
   */
  return new Promise((resolve, _) => {
    try {
      Function(`with (this) {try{${codeInterceptor(code)}} catch (e) {console.log(e)}};`).call(application.api);
      resolve(true);
    } catch (error) {
      console.log(error);
      resolve(false);
    }
  });
}

export const tryEvaluate = async (
  /**
   * This function attempts to evaluate a string of code in the context of user API.
   * If the code is invalid, it will attempt to evaluate the previous valid code.
   * 
   * @param application - The main application instance
   * @param code - The set of files to evaluate
   * @param timeout - The timeout in milliseconds
   * @returns A promise that resolves to void
   * 
   */
  application: Editor, 
  code: File,
  timeout = 5000
  ): Promise<void> => {
  try {
    code.evaluations!++;
    const isCodeValid = await Promise.race([tryCatchWrapper(
      application, 
      `let i = ${code.evaluations};` + codeInterceptor(code.candidate as string),
    ), delay(timeout)]);

    if (isCodeValid) {
      code.committed = code.candidate;
    } else {
      await evaluate(application, code, timeout);
    }
  } catch (error) {
    console.log(error);
  }
}

export const evaluate = async (application: Editor, code: File, timeout = 1000): Promise<void> => {
  /**
   * This function evaluates a string of code in the context of user API.
   * 
   * @param application - The main application instance
   * @param code - The set of files to evaluate
   * @param timeout - The timeout in milliseconds
   * @returns A promise that resolves to void
   */
  try {
    await Promise.race([tryCatchWrapper(application, codeInterceptor(code.committed as string)), delay(timeout)]);
    if (code.evaluations)
      code.evaluations++;
  } catch (error) {
    console.log(error);
  }
}