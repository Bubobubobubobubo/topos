import type { Editor } from "./main";
import type { File } from "./Editor/FileManagement";

async function tryCatchWrapper(application: Editor, code: string): Promise<boolean> {
  try {
    await new Function(`"use strict"; ${code}`).call(application.api);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function tryEvaluate(application: Editor, code: File): Promise<void> {
  const wrappedCode = `let i = ${code.evaluations}; ${code.candidate}`;
  const isCodeValid = await tryCatchWrapper(application, wrappedCode);
  if (isCodeValid) {
    code.committed = code.candidate;
  } else {
    console.error("Compilation error!");
  }
}

export async function evaluateOnce(application: Editor, code: File): Promise<void> {
  const wrappedCode = `let i = ${code.evaluations}; ${code.candidate}`;
  const isCodeValid = await tryCatchWrapper(application, wrappedCode);
  if (isCodeValid) {
    code.committed = code.candidate;
  } else {
    console.error("Compilation error!");
  }
}