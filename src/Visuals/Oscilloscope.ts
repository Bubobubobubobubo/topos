// @ts-ignore
import { getAnalyser } from "superdough";
import { Editor } from "../main";

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

export const runOscilloscope = (
  canvas: HTMLCanvasElement,
  app: Editor,
): void => {
  /**
   * Runs the oscilloscope visualization on the provided canvas element.
   *
   * @param canvas - The HTMLCanvasElement on which to render the visualization.
   * @param app - The Editor object containing the configuration for the oscilloscope.
   */
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
    offset_width: number,
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
    const reducedDataSize = Math.floor(
      freqDataArray.length * performanceFactor,
    );
    const numBars = Math.min(
      reducedDataSize,
      app.osc.orientation === "horizontal" ? width : height,
    );
    const barWidth =
      app.osc.orientation === "horizontal" ? width / numBars : height / numBars;
    let barHeight;
    let x = 0,
      y = 0;

    canvasCtx.fillStyle = app.osc.color || `rgb(255, 255, 255)`;

    for (let i = 0; i < numBars; i++) {
      barHeight = Math.floor(
        freqDataArray[Math.floor((i * freqDataArray.length) / numBars)] *
          ((height / 256) * app.osc.size),
      );

      if (app.osc.orientation === "horizontal") {
        canvasCtx.fillRect(
          x + offset_width,
          (height - barHeight) / 2 + offset_height,
          barWidth + 1,
          barHeight,
        );
        x += barWidth;
      } else {
        canvasCtx.fillRect(
          (width - barHeight) / 2 + offset_width,
          y + offset_height,
          barHeight,
          barWidth + 1,
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
        HEIGHT + 2 * OFFSET_HEIGHT,
      );
      return;
    }

    if (analyzer.fftSize !== app.osc.fftSize) {
      // Disconnect and release the old analyzer if it exists
      if (analyzer) {
        analyzer.disconnect();
        analyzer = null; // Release the reference for garbage collection
      }

      // Create a new analyzer with the updated FFT size
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
        HEIGHT + 2 * OFFSET_HEIGHT,
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
