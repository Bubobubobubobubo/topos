import type { Editor } from './main';
import type { File } from './AppSettings';

/* This mode of evaluation can only work if the whole buffer is evaluated at once */
export const tryEvaluate = (application: Editor, code: File): void => {
    let isValidCode: boolean;
    try {
        Function(`with (this) {try{${code.candidate}} catch (e) {console.log(e)}};`).call(application.api)
        code.evaluations++;
        isValidCode = true;
    } catch (error) {
        Function(`with (this) {try{${code.committed}} catch (e) {console.log(e)}};`).call(application.api)
        code.evaluations++;
        isValidCode = false;
    }

    if (isValidCode) {
        code.committed = code.candidate;
    } else {
        evaluate(application, code);
    }
}

export const evaluate = (application: Editor, code: File): void => {
    Function(`with (this) {try{${code.committed}} catch (e) {console.log(e)}};`).call(application.api)
    code.evaluations++;
}

export const evaluateCommand = (application: Editor, command: string): void => {
    Function(`with (this) {try{${command}} catch (e) {console.log(e)}};`).call(application.api)
}