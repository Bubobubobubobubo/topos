// @ts-ignore
import { getAnalyser } from "superdough";
import { type Editor } from "./main";

/**
 * Draw a circle at a specific position on the canvas.
 * @param {number} x - The x-coordinate of the circle's center.
 * @param {number} y - The y-coordinate of the circle's center.
 * @param {number} radius - The radius of the circle.
 * @param {string} color - The fill color of the circle.
 */
export const drawCircle = (
  app: Editor,
  x: number,
  y: number,
  radius: number,
  color: string
): void => {
  // @ts-ignore
  const canvas: HTMLCanvasElement = app.interface.feedback;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

/**
 * Blinks a script indicator circle.
 * @param script - The type of script.
 * @param no - The shift amount multiplier.
 */
export const blinkScript = (
  app: Editor,
  script: "local" | "global" | "init",
  no?: number
) => {
  if (no !== undefined && no < 1 && no > 9) return;
  const blinkDuration =
    (app.clock.bpm / 60 / app.clock.time_signature[1]) * 200;
  // @ts-ignore
  const ctx = app.interface.feedback.getContext("2d"); // Assuming a canvas context

  /**
   * Draws a circle at a given shift.
   * @param shift - The pixel distance from the origin.
   */
  const _drawBlinker = (shift: number) => {
    const horizontalOffset = 50;
    drawCircle(
      app,
      horizontalOffset + shift,
      app.interface.feedback.clientHeight - 15,
      8,
      "#fdba74"
    );
  };

  /**
   * Clears the circle at a given shift.
   * @param shift - The pixel distance from the origin.
   */
  const _clearBlinker = (shift: number) => {
    const x = 50 + shift;
    const y = app.interface.feedback.clientHeight - 15;
    const radius = 8;
    ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
  };

  if (script === "local" && no !== undefined) {
    const shiftAmount = no * 25;

    // Clear existing timeout if any
    if (app.blinkTimeouts[shiftAmount]) {
      clearTimeout(app.blinkTimeouts[shiftAmount]);
    }

    _drawBlinker(shiftAmount);

    // Save timeout ID for later clearing
    app.blinkTimeouts[shiftAmount] = setTimeout(() => {
      _clearBlinker(shiftAmount);
      // Clear the canvas before drawing new blinkers
      (app.interface.feedback as HTMLCanvasElement)
        .getContext("2d")!
        .clearRect(
          0,
          0,
          (app.interface.feedback as HTMLCanvasElement).width,
          (app.interface.feedback as HTMLCanvasElement).height
        );
      drawEmptyBlinkers(app);
    }, blinkDuration);
  }
};

/**
 * Draws a series of 9 white circles.
 * @param app - The Editor application context.
 */
export const drawEmptyBlinkers = (app: Editor) => {
  for (let no = 1; no <= 9; no++) {
    const shiftAmount = no * 25;
    drawCircle(
      app,
      50 + shiftAmount,
      app.interface.feedback.clientHeight - 15,
      8,
      "white"
    );
  }
};

export interface OscilloscopeConfig {
  enabled: boolean;
  color: string;
  thickness: number;
  fftSize: number; // multiples of 256
  orientation: "horizontal" | "vertical";
  is3D: boolean;
}

/**
 * Initializes and runs an oscilloscope using an AnalyzerNode.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the oscilloscope.
 * @param {OscilloscopeConfig} config - Configuration for the oscilloscope's appearance and behavior.
 */
export const runOscilloscope = (
  canvas: HTMLCanvasElement,
  app: Editor
): void => {
  let config = app.oscilloscope_config;
  let analyzer = getAnalyser(config.fftSize);
  let dataArray = new Float32Array(analyzer.frequencyBinCount);
  const canvasCtx = canvas.getContext("2d")!;
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  function draw() {
    if (!app.oscilloscope_config.enabled) {
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      return;
    }

    // Update analyzer and dataArray if fftSize changes
    if (analyzer.fftSize !== app.oscilloscope_config.fftSize) {
      analyzer = getAnalyser(app.oscilloscope_config.fftSize);
      dataArray = new Float32Array(analyzer.frequencyBinCount);
    }

    requestAnimationFrame(draw);
    analyzer.getFloatTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgba(0, 0, 0, 0)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = app.oscilloscope_config.thickness;
    canvasCtx.strokeStyle = app.oscilloscope_config.color;
    canvasCtx.beginPath();

    // Drawing logic varies based on orientation and 3D setting
    if (app.oscilloscope_config.is3D) {
      // For demonstration, assume dataArray alternates between left and right channel
      for (let i = 0; i < dataArray.length; i += 2) {
        const x = dataArray[i] * WIDTH + WIDTH / 2;
        const y = dataArray[i + 1] * HEIGHT + HEIGHT / 2;
        i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
      }
    } else if (app.oscilloscope_config.orientation === "horizontal") {
      let x = 0;
      const sliceWidth = (WIDTH * 1.0) / dataArray.length;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] * 0.5 * HEIGHT;
        const y = v + HEIGHT / 2;
        i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    } else {
      // Vertical drawing logic
    }

    canvasCtx.stroke();
  }

  draw();
};
