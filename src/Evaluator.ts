import type { Editor } from './main';
import type { File } from './AppSettings';

const delay = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('Operation took too long')), ms));

const tryCatchWrapper = (application: Editor, code: string): Promise<boolean> => {
  return new Promise((resolve, _) => {
    try {
      Function(`with (this) {try{${code}} catch (e) {console.log(e)}};`).call(application.api);
      resolve(true);
    } catch (error) {
      console.log(error);
      resolve(false);
    }
  });
}

export const tryEvaluate = async (
  application: Editor, 
  code: File,
  timeout = 5000
  ): Promise<void> => {
  try {
    code.evaluations++;
    const isCodeValid = await Promise.race([tryCatchWrapper(
      application, 
      `let i = ${code.evaluations};` + code.candidate,
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
  try {
    await Promise.race([tryCatchWrapper(application, code.committed as string), delay(timeout)]);
    if (code.evaluations)
      code.evaluations++;
  } catch (error) {
    console.log(error);
  }
}

export const evaluateCommand = async (application: Editor, command: string, timeout = 5000): Promise<void> => {
  try {
    await Promise.race([tryCatchWrapper(application, command), delay(timeout)]);
  } catch (error) {
    console.log(error);
  }
}