import { Editor } from "../../main";

export const mouseX = (app: Editor) => (): number => {
  /**
   * @returns The current x position of the mouse
   */
  return app._mouseX;
};

export const mouseY = (app: Editor) => (): number => {
  /**
   * @returns The current y position of the mouse
   */
  return app._mouseY;
};

export const noteX = (app: Editor) => (): number => {
  /**
   * @returns The current x position scaled to 0-127 using screen width
   */
  return Math.floor((app._mouseX / document.body.clientWidth) * 127);
};

export const noteY = (app: Editor) => (): number => {
  /**
   * @returns The current y position scaled to 0-127 using screen height
   */
  return Math.floor((app._mouseY / document.body.clientHeight) * 127);
};
