import { type Editor } from "../../main";

const HORIZONTALOFFSETPERCENT = 0.025;
const VERTICALOFFSETPERCENT = 0.025;
const RADIUSPERCENT = 0.010;
const SHIFTPERCENT = 0.025;

export const drawCircle = (
  /**
   * Draw a circle at a specific position on the canvas.
   * @param {number} x - The x-coordinate of the circle's center.
   * @param {number} y - The y-coordinate of the circle's center.
   * @param {number} radius - The radius of the circle.
   * @param {string} color - The fill color of the circle.
   */
  app: Editor,
  x: number,
  y: number,
  radius: number,
  color: string,
): void => {
  // @ts-ignore
  const canvas: HTMLCanvasElement = app.interface.feedback;
  const ctx = canvas.getContext("2d");
  console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
  if (!ctx) return;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

export const blinkScript = (
  /**
   * Blinks a script indicator circle.
   * @param script - The type of script.
   * @param no - The shift amount multiplier.
   */
  app: Editor,
  script: "local" | "global" | "init",
  no?: number,
) => {
  if (no !== undefined && no < 1 && no > 9) return;
  const blinkDuration =
    (app.clock.bpm / 60 / app.clock.time_position.num) * 200;
  // @ts-ignore
  const ctx = app.interface.feedback.getContext("2d");

  const _drawBlinker = (shift: number) => {
    const horizontalOffsetPercent = HORIZONTALOFFSETPERCENT;
    const verticalOffsetPercent = VERTICALOFFSETPERCENT;
    const radiusPercent = RADIUSPERCENT;
    drawCircle(
      app,
      (app.interface.feedback as HTMLCanvasElement).width * horizontalOffsetPercent + shift,
      (app.interface.feedback as HTMLCanvasElement).height * (1 - verticalOffsetPercent),
      (app.interface.feedback as HTMLCanvasElement).width * radiusPercent,
      "#fdba74",
    );
  };

  const _clearBlinker = (shift: number) => {
    const horizontalOffsetPercent = HORIZONTALOFFSETPERCENT;
    const verticalOffsetPercent = VERTICALOFFSETPERCENT;
    const radiusPercent = RADIUSPERCENT;
    const x = (app.interface.feedback as HTMLCanvasElement).width * horizontalOffsetPercent + shift;
    const y = (app.interface.feedback as HTMLCanvasElement).height * (1 - verticalOffsetPercent);
    const radius = (app.interface.feedback as HTMLCanvasElement).width * radiusPercent;
    ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
  };

  if (script === "local" && no !== undefined) {
    const shiftPercent = SHIFTPERCENT;
    const shiftAmount = no * (app.interface.feedback as HTMLCanvasElement).width * shiftPercent;

    // Clear existing timeout if any
    if (app.blinkTimeouts[shiftAmount]) {
      clearTimeout(app.blinkTimeouts[shiftAmount]);
    }

    _drawBlinker(shiftAmount);

    // Save timeout ID for later clearing
    // @ts-ignore
    app.blinkTimeouts[shiftAmount] = setTimeout(() => {
      _clearBlinker(shiftAmount);
      // Clear the canvas before drawing new blinkers
      (app.interface.feedback as HTMLCanvasElement)
        .getContext("2d")!
        .clearRect(
          0,
          0,
          (app.interface.feedback as HTMLCanvasElement).width,
          (app.interface.feedback as HTMLCanvasElement).height,
        );
    }, blinkDuration);
  }
};

export const scriptBlinkers = () => {
  /**
   * Manages animation updates using requestAnimationFrame.
   * @param app - The Editor application context.
   */

  let lastFrameTime = Date.now();
  const frameRate = 10;
  const minFrameDelay = 1000 / frameRate;

  const update = () => {
    const now = Date.now();
    const timeSinceLastFrame = now - lastFrameTime;

    if (timeSinceLastFrame >= minFrameDelay) {
      lastFrameTime = now;
    }
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};
