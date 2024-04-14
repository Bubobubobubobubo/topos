export type ShapeObject = {
  x: number;
  y: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  radius: number;
  width: number;
  height: number;
  fillStyle: string;
  secondary: string;
  strokeStyle: string;
  rotation: number;
  points: number;
  outerRadius: number;
  eyeSize: number;
  happiness: number;
  slices: number;
  gap: number;
  font: string;
  fontSize: number;
  text: string;
  filter: string;
  url: string;
  curve: number;
  curves: number;
  stroke: string;
  eaten: number;
  hole: number;
};

export const drawBackground = (
  canvas: HTMLCanvasElement,
  color: string | number,
  ...gb: number[]
): void => {
  /**
   * Set background color of the canvas.
   * @param color - The color to set. String or 3 numbers representing RGB values.
   */
  const ctx = canvas.getContext("2d")!;
  if (typeof color === "number") color = `rgb(${color},${gb[0]},${gb[1]})`;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const createLinearGradient = (
  canvas: HTMLCanvasElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  ...stops: (number | string)[]
): CanvasGradient => {
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  // Parse pairs of values from stops
  for (let i = 0; i < stops.length; i += 2) {
    let color = stops[i + 1];
    if (typeof color === "number")
      color = `rgb(${color},${stops[i + 2]},${stops[i + 3]})`;
    gradient.addColorStop(stops[i] as number, color);
  }
  return gradient;
};

export const createRadialGradient = (
  canvas: HTMLCanvasElement,
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
  ...stops: (number | string)[]
) => {
  /**
   * Set radial gradient on the canvas.
   * @param x1 - The x-coordinate of the start circle
   * @param y1 - The y-coordinate of the start circle
   * @param r1 - The radius of the start circle
   * @param x2 - The x-coordinate of the end circle
   * @param y2 - The y-coordinate of the end circle
   * @param r2 - The radius of the end circle
   * @param stops - The stops to set. Pairs of numbers representing the position and color of the stop.
   */
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
  for (let i = 0; i < stops.length; i += 2) {
    let color = stops[i + 1];
    if (typeof color === "number")
      color = `rgb(${color},${stops[i + 2]},${stops[i + 3]})`;
    gradient.addColorStop(stops[i] as number, color);
  }
  return gradient;
};

export const createConicGradient = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  angle: number,
  ...stops: (number | string)[]
) => {
  /**
   * Set conic gradient on the canvas.
   * @param x - The x-coordinate of the center of the gradient
   * @param y - The y-coordinate of the center of the gradient
   * @param angle - The angle of the gradient, in radians
   * @param stops - The stops to set. Pairs of numbers representing the position and color of the stop.
   */
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createConicGradient(x, y, angle);
  for (let i = 0; i < stops.length; i += 2) {
    let color = stops[i + 1];
    if (typeof color === "number")
      color = `rgb(${color},${stops[i + 2]},${stops[i + 3]})`;
    gradient.addColorStop(stops[i] as number, color);
  }
  return gradient;
};

export const drawGradientImage = (
  canvas: HTMLCanvasElement,
  time: number = 666
) => {
  /* TODO: This works but is really resource heavy. Should do method for requestAnimationFrame? */
  const context = canvas.getContext("2d")!;
  const { width, height } = context.canvas;
  const imageData = context.getImageData(0, 0, width, height);

  for (let p = 0; p < imageData.data.length; p += 4) {
    const i = p / 4;
    const x = i % width;
    const y = (i / width) >>> 0;

    const red = 64 + (128 * x) / width + 64 * Math.sin(time / 1000);
    const green = 64 + (128 * y) / height + 64 * Math.cos(time / 1000);
    const blue = 128;

    imageData.data[p + 0] = red;
    imageData.data[p + 1] = green;
    imageData.data[p + 2] = blue;
    imageData.data[p + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);
  return true;
};

export const drawBalloid = (
  canvas: HTMLCanvasElement,
  curves: number,
  radius: number,
  curve: number,
  fillStyle: string,
  secondary: string,
  x: number,
  y: number
): void => {
  const ctx = canvas.getContext("2d")!;

  // Draw the shape using quadratic Bézier curves
  ctx.beginPath();
  ctx.fillStyle = fillStyle;

  if (curves === 0) {
    // Draw a circle if curves = 0
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  } else if (curves === 1) {
    // Draw a single curve (ellipse) if curves = 1
    ctx.ellipse(x, y, radius * 0.8, radius * curve * 0.7, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  } else if (curves === 2) {
    // Draw a shape with two symmetric curves starting from the top and meeting at the bottom
    ctx.moveTo(x, y - radius);

    // First curve
    ctx.quadraticCurveTo(x + radius * curve, y, x, y + radius);

    // Second symmetric curve
    ctx.quadraticCurveTo(x - radius * curve, y, x, y - radius);

    ctx.closePath();
    ctx.fill();
  } else {
    // Draw the curved shape with the specified number of curves
    ctx.moveTo(x, y - radius);
    let points = [];
    for (let i = 0; i < curves; i++) {
      const startAngle = (i / curves) * 2 * Math.PI;
      const endAngle = startAngle + (2 * Math.PI) / curves;

      const controlX =
        x + radius * curve * Math.cos(startAngle + Math.PI / curves);
      const controlY =
        y + radius * curve * Math.sin(startAngle + Math.PI / curves);
      points.push([
        x + radius * Math.cos(startAngle),
        y + radius * Math.sin(startAngle),
      ]);
      ctx.moveTo(
        x + radius * Math.cos(startAngle),
        y + radius * Math.sin(startAngle)
      );
      ctx.quadraticCurveTo(
        controlX,
        controlY,
        x + radius * Math.cos(endAngle),
        y + radius * Math.sin(endAngle)
      );
    }
    ctx.closePath();
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = secondary;
    // Form the shape from points with straight lines and fill it
    ctx.moveTo(points[0][0], points[0][1]);
    for (let point of points) ctx.lineTo(point[0], point[1]);
    // Close and fill

    ctx.closePath();
    ctx.fill();
  }
};

export const drawEquilateral = (
  canvas: HTMLCanvasElement,
  radius: number,
  fillStyle: string,
  rotation: number,
  x: number,
  y: number
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(radius, radius);
  ctx.lineTo(-radius, radius);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
};

export const drawTriangular = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  fillStyle: string,
  rotation: number,
  x: number,
  y: number
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, -height);
  ctx.lineTo(width, height);
  ctx.lineTo(-width, height);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
};

export const drawBall = (
  canvas: HTMLCanvasElement,
  radius: number,
  fillStyle: string,
  x: number,
  y: number
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.closePath();
};

export const drawDonut = (
  canvas: HTMLCanvasElement,
  slices: number,
  eaten: number,
  radius: number,
  hole: number,
  fillStyle: string,
  secondary: string,
  stroke: string,
  rotation: number,
  x: number,
  y: number
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);

  if (slices < 2) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = slices < 1 ? secondary : fillStyle;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, hole, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = secondary;
    ctx.fill();

    ctx.restore();
  }

  // Draw slices as arcs
  const totalSlices = slices;
  const sliceAngle = (2 * Math.PI) / totalSlices;
  for (let i = 0; i < totalSlices; i++) {
    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;

    // Calculate the position of the outer arc
    const outerStartX = hole * Math.cos(startAngle);
    const outerStartY = hole * Math.sin(startAngle);

    ctx.beginPath();
    ctx.moveTo(outerStartX, outerStartY);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.arc(0, 0, hole, endAngle, startAngle, true);
    ctx.closePath();

    // Fill and stroke the slices with the specified fill style
    if (i < slices - eaten) {
      // Regular slices are white
      ctx.fillStyle = fillStyle;
    } else {
      // Missing slices are black
      ctx.fillStyle = secondary;
    }
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  ctx.restore();
};

export const drawPie = (
  canvas: HTMLCanvasElement,
  slices: number,
  eaten: number,
  radius: number,
  fillStyle: string,
  secondary: string,
  stroke: string,
  rotation: number,
  x: number,
  y: number
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);

  if (slices < 2) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = slices < 1 ? secondary : fillStyle;
    ctx.fill();
    ctx.restore();
  }

  // Draw slices as arcs
  const totalSlices = slices;
  const sliceAngle = (2 * Math.PI) / totalSlices;
  for (let i = 0; i < totalSlices; i++) {
    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.lineTo(0, 0); // Connect to center
    ctx.closePath();

    // Fill and stroke the slices with the specified fill style
    if (i < slices - eaten) {
      // Regular slices are white
      ctx.fillStyle = fillStyle;
    } else {
      // Missing slices are black
      ctx.fillStyle = secondary;
    }
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  ctx.restore();
};

export const drawStar = (
  canvas: HTMLCanvasElement,
  points: number,
  radius: number,
  fillStyle: string,
  rotation: number,
  outerRadius: number,
  x: number,
  y: number
): void => {
  if (points < 1) return drawBall(canvas, radius, fillStyle, x, y);
  if (points == 1) return drawEquilateral(canvas, radius, fillStyle, 0, x, y);
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  for (let i = 0; i < points; i++) {
    ctx.rotate(Math.PI / points);
    ctx.lineTo(0, -(radius * outerRadius));
    ctx.rotate(Math.PI / points);
    ctx.lineTo(0, -radius);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
};

export const drawStroke = (
  canvas: HTMLCanvasElement,
  width: number,
  strokeStyle: string,
  rotation: number = 0,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x1, y1);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x2 - x1, y2 - y1);
  ctx.lineWidth = width;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
  ctx.restore();
};

export const drawBox = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  fillStyle: string,
  rotation: number,
  x: number,
  y: number
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
};

export const drawSmiley = (
  canvas: HTMLCanvasElement,
  happiness: number,
  radius: number,
  eyeSize: number,
  fillStyle: string,
  rotation: number,
  x: number,
  y: number
): void => {
  const ctx = canvas.getContext("2d")!;
  // Map the rotation value to an angle within the range of -PI to PI
  const rotationAngle = (rotation / 100) * Math.PI;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotationAngle);

  // Draw face
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.lineWidth = radius / 20;
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Draw eyes
  const eyeY = -radius / 5;
  const eyeXOffset = radius / 2.5;
  const eyeRadiusX = radius / 8;
  const eyeRadiusY = (eyeSize * radius) / 10;

  ctx.beginPath();
  ctx.ellipse(-eyeXOffset, eyeY, eyeRadiusX, eyeRadiusY, 0, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(eyeXOffset, eyeY, eyeRadiusX, eyeRadiusY, 0, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  // Draw mouth with happiness number -1.0 to 1.0. 0.0 Should be a straight line.
  const mouthY = radius / 2;
  const mouthLength = radius * 0.9;
  const smileFactor = 0.25; // Adjust for the smile curvature

  let controlPointX = 0;
  let controlPointY = 0;

  if (happiness >= 0) {
    controlPointY = mouthY + (happiness * smileFactor * radius) / 2;
  } else {
    controlPointY = mouthY + (happiness * smileFactor * radius) / 2;
  }

  ctx.beginPath();
  ctx.moveTo(-mouthLength / 2, mouthY);
  ctx.quadraticCurveTo(controlPointX, controlPointY, mouthLength / 2, mouthY);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.restore();
};

export const drawText = (
  canvas: HTMLCanvasElement,
  text: string,
  fontSize: number,
  rotation: number,
  font: string,
  x: number,
  y: number,
  fillStyle: string,
  filter: string
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.filter = filter;
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, 0, 0);
  ctx.restore();
};

export const drawImage = (
  canvas: HTMLCanvasElement,
  url: string,
  width: number,
  height: number,
  rotation: number,
  x: number,
  y: number,
  filter: string = "none"
): void => {
  const ctx = canvas.getContext("2d")!;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.filter = filter;
  const image = new Image();
  image.src = url;
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
};
