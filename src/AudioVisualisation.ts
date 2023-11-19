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
  refresh: number;
  color: string;
  thickness: number;
  fftSize: number; // multiples of 256
  orientation: "horizontal" | "vertical";
  mode: "3D" | "scope" | "freqscope";
  offsetX: number;
  offsetY: number;
  size: number;
}

let lastZeroCrossingType: string | null = null; // 'negToPos' or 'posToNeg'
let lastRenderTime: number = 0;

/**
 * Initializes and runs an oscilloscope using an AnalyzerNode.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the oscilloscope.
 * @param {OscilloscopeConfig} config - Configuration for the oscilloscope's appearance and behavior.
 */
export const runOscilloscope = (
  canvas: HTMLCanvasElement,
  app: Editor
): void => {
  let config = app.osc;
  let analyzer = getAnalyser(config.fftSize);
  let dataArray = new Float32Array(analyzer.frequencyBinCount);
  let freqDataArray = new Uint8Array(analyzer.frequencyBinCount);
  const canvasCtx = canvas.getContext("2d")!;
  let lastDrawTime = 0;
  let frameInterval = 1000 / 30;

  function drawFrequencyScope(
    width: number,
    height: number,
    offset_height: number,
    offset_width: number
  ) {
    const maxFPS = 30;
    const now = performance.now();
    const elapsed = now - (lastRenderTime || 0);
  
    if (elapsed < 1000 / maxFPS) return;
    lastRenderTime = now;
  
    analyzer.fftSize = app.osc.fftSize * 4;
    analyzer.getByteFrequencyData(freqDataArray);
    canvasCtx.clearRect(0, 0, width, height);
  
    const performanceFactor = 1;
    const reducedDataSize = Math.floor(freqDataArray.length * performanceFactor);
    const numBars = Math.min(
      reducedDataSize,
      app.osc.orientation === "horizontal" ? width : height
    );
    const barWidth =
      app.osc.orientation === "horizontal" ? width / numBars : height / numBars;
    let barHeight;
    let x = 0,
        y = 0;
  
    canvasCtx.fillStyle = app.osc.color || `rgb(255, 255, 255)`;
  
    for (let i = 0; i < numBars; i++) {
      barHeight = Math.floor(
        freqDataArray[Math.floor(i * freqDataArray.length / numBars)] * ((height / 256) * app.osc.size)
      );
  
      if (app.osc.orientation === "horizontal") {
        canvasCtx.fillRect(
          x + offset_width,
          (height - barHeight) / 2 + offset_height,
          barWidth + 1,
          barHeight
        );
        x += barWidth;
      } else {
        canvasCtx.fillRect(
          (width - barHeight) / 2 + offset_width,
          y + offset_height,
          barHeight,
          barWidth + 1
        );
        y += barWidth;
      }
    }
  }


  function draw() {
    // Update the canvas position on each cycle
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const OFFSET_WIDTH = app.osc.offsetX;
    const OFFSET_HEIGHT = app.osc.offsetY;

    // Apply an offset to the canvas!
    canvasCtx.setTransform(1, 0, 0, 1, OFFSET_WIDTH, OFFSET_HEIGHT);

    const currentTime = Date.now();
    requestAnimationFrame(draw);
    if (currentTime - lastDrawTime < frameInterval) {
      return;
    }
    lastDrawTime = currentTime;

    if (!app.osc.enabled) {
      canvasCtx.clearRect(
        -OFFSET_WIDTH,
        -OFFSET_HEIGHT,
        WIDTH + 2 * OFFSET_WIDTH,
        HEIGHT + 2 * OFFSET_HEIGHT
      );
      return;
    }

    if (analyzer.fftSize !== app.osc.fftSize) {
      analyzer = getAnalyser(app.osc.fftSize);
      dataArray = new Float32Array(analyzer.frequencyBinCount);
    }

    analyzer.getFloatTimeDomainData(dataArray);
    canvasCtx.globalCompositeOperation = "source-over";

    canvasCtx.fillStyle = "rgba(0, 0, 0, 0)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    if (app.clock.time_position.pulse % app.osc.refresh == 0) {
      canvasCtx.clearRect(
        -OFFSET_WIDTH,
        -OFFSET_HEIGHT,
        WIDTH + 2 * OFFSET_WIDTH,
        HEIGHT + 2 * OFFSET_HEIGHT
      );
    }
    canvasCtx.lineWidth = app.osc.thickness;

    if (app.osc.color === "random") {
      if (app.clock.time_position.pulse % 16 === 0) {
        canvasCtx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
      }
    } else {
      canvasCtx.strokeStyle = app.osc.color;
    }
    const remainingRefreshTime =
      app.clock.time_position.pulse % app.osc.refresh;
    const opacityRatio = 1 - remainingRefreshTime / app.osc.refresh;
    canvasCtx.globalAlpha = opacityRatio;
    canvasCtx.beginPath();

    let startIndex = 0;
    for (let i = 1; i < dataArray.length; ++i) {
      let currentType = null;
      if (dataArray[i] >= 0 && dataArray[i - 1] < 0) {
        currentType = "negToPos";
      } else if (dataArray[i] < 0 && dataArray[i - 1] >= 0) {
        currentType = "posToNeg";
      }

      if (currentType) {
        if (
          lastZeroCrossingType === null ||
          currentType === lastZeroCrossingType
        ) {
          startIndex = i;
          lastZeroCrossingType = currentType;
          break;
        }
      }
    }

    if (app.osc.mode === "freqscope") {
      drawFrequencyScope(WIDTH, HEIGHT, OFFSET_HEIGHT, OFFSET_WIDTH);
    } else if (app.osc.mode === "3D") {
      for (let i = startIndex; i < dataArray.length; i += 2) {
        const x = (dataArray[i] * WIDTH * app.osc.size) / 2 + WIDTH / 4;
        const y = (dataArray[i + 1] * HEIGHT * app.osc.size) / 2 + HEIGHT / 4;
        i === startIndex ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
      }
    } else if (
      app.osc.mode === "scope" &&
      app.osc.orientation === "horizontal"
    ) {
      const sliceWidth = (WIDTH * 1.0) / dataArray.length;
      const yOffset = HEIGHT / 4;
      let x = 0;
      for (let i = startIndex; i < dataArray.length; i++) {
        const v = dataArray[i] * 0.5 * HEIGHT * app.osc.size;
        const y = v + yOffset;
        i === startIndex ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(WIDTH, yOffset);
    } else if (app.osc.mode === "scope" && app.osc.orientation === "vertical") {
      const sliceHeight = (HEIGHT * 1.0) / dataArray.length;
      const xOffset = WIDTH / 4;
      let y = 0;
      for (let i = startIndex; i < dataArray.length; i++) {
        const v = dataArray[i] * 0.5 * WIDTH * app.osc.size;
        const x = v + xOffset;
        i === startIndex ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
        y += sliceHeight;
      }
      canvasCtx.lineTo(xOffset, HEIGHT);
    }

    canvasCtx.stroke();
    canvasCtx.globalAlpha = 1.0;
  }

  draw();
};
