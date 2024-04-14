import { OscilloscopeConfig } from "../DOM/Visuals/Oscilloscope";
import { ShapeObject, createConicGradient, createLinearGradient, createRadialGradient, drawBackground, drawBox, drawBall, drawBalloid, drawDonut, drawEquilateral, drawImage, drawPie, drawSmiley, drawStar, drawStroke, drawText, drawTriangular } from "../DOM/Visuals/CanvasVisuals";
import { Editor } from "../main";

export const w = (app: Editor) => (): number => {
    const canvas: HTMLCanvasElement = app.interface.drawings as HTMLCanvasElement;
    return canvas.clientWidth;
};

export const pulseLocation = (app: Editor) => (): number => {
    return ((app.api.epulse() / app.api.pulsesForBar()) * w(app)()) % w(app)();
};

export const clear = (app: Editor) => (): boolean => {
    const canvas: HTMLCanvasElement = app.interface.drawings as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return true;
};


export const h = (app: Editor) => (): number => {
    const canvas: HTMLCanvasElement = app.interface.drawings as HTMLCanvasElement;
    return canvas.clientHeight;
};

export const hc = (app: Editor) => (): number => {
    return h(app)() / 2;
};

export const wc = (app: Editor) => (): number => {
    return w(app)() / 2;
};

export const background = (app: Editor) => (color: string | number, ...gb: number[]): boolean => {
    drawBackground(app.interface.drawings as HTMLCanvasElement, color, ...gb);
    return true;
};
export const bg = background;

export const linearGradient = (app: Editor) => (x1: number, y1: number, x2: number, y2: number, ...stops: (number | string)[]): CanvasGradient => {
    return createLinearGradient(app.interface.drawings as HTMLCanvasElement, x1, y1, x2, y2, ...stops);
};

export const radialGradient = (app: Editor) => (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, ...stops: (number | string)[]) => {
    return createRadialGradient(app.interface.drawings as HTMLCanvasElement, x1, y1, r1, x2, y2, r2, ...stops);
};

export const conicGradient = (app: Editor) => (x: number, y: number, angle: number, ...stops: (number | string)[]) => {
    return createConicGradient(app.interface.drawings as HTMLCanvasElement, x, y, angle, ...stops);
};

export const draw = (app: Editor) => (func: Function): boolean => {
    if (typeof func === "string") {
        drawText(app.interface.drawings as HTMLCanvasElement, func, 24, 0, "Arial", wc(app)(), hc(app)(), "white", "none");
    } else {
        const canvas: HTMLCanvasElement = app.interface.drawings as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;
        func(ctx);
    }
    return true;
};

// Additional drawing and utility functions in canvas.ts
export const balloid = (app: Editor) => (
    curves: number | ShapeObject = 6,
    radius: number = hc(app)() / 2,
    curve: number = 1.5,
    fillStyle: string = "white",
    secondary: string = "black",
    x: number = wc(app)(),
    y: number = hc(app)(),
): boolean => {
    if (typeof curves === "object") {
        fillStyle = curves.fillStyle || "white";
        x = curves.x || wc(app)();
        y = curves.y || hc(app)();
        curve = curves.curve || 1.5;
        radius = curves.radius || hc(app)() / 2;
        curves = curves.curves || 6;
    }
    drawBalloid(app.interface.drawings as HTMLCanvasElement, curves, radius, curve, fillStyle, secondary, x, y);
    return true;
};

export const equilateral = (app: Editor) => (
    radius: number | ShapeObject = hc(app)() / 3,
    fillStyle: string = "white",
    rotation: number = 0,
    x: number = wc(app)(),
    y: number = hc(app)(),
): boolean => {
    if (typeof radius === "object") {
        fillStyle = radius.fillStyle || "white";
        x = radius.x || wc(app)();
        y = radius.y || hc(app)();
        rotation = radius.rotation || 0;
        radius = radius.radius || hc(app)() / 3;
    }
    drawEquilateral(app.interface.drawings as HTMLCanvasElement, radius, fillStyle, rotation, x, y);
    return true;
};

export const triangular = (app: Editor) => (
    width: number | ShapeObject = hc(app)() / 3,
    height: number = hc(app)() / 3,
    fillStyle: string = "white",
    rotation: number = 0,
    x: number = wc(app)(),
    y: number = hc(app)(),
): boolean => {
    if (typeof width === "object") {
        fillStyle = width.fillStyle || "white";
        x = width.x || wc(app)();
        y = width.y || hc(app)();
        rotation = width.rotation || 0;
        height = width.height || hc(app)() / 3;
        width = width.width || hc(app)() / 3;
    }
    drawTriangular(app.interface.drawings as HTMLCanvasElement, width, height, fillStyle, rotation, x, y);
    return true;
};
export const pointy = triangular;

export const ball = (app: Editor) => (
    radius: number | ShapeObject = hc(app)() / 3,
    fillStyle: string = "white",
    x: number = wc(app)(),
    y: number = hc(app)(),
): boolean => {
    if (typeof radius === "object") {
        fillStyle = radius.fillStyle || "white";
        x = radius.x || wc(app)();
        y = radius.y || hc(app)();
        radius = radius.radius || hc(app)() / 3;
    }
    drawBall(app.interface.drawings as HTMLCanvasElement, radius, fillStyle, x, y);
    return true;
};
export const circle = ball;

export const donut = (app: Editor) => (
    slices: number | ShapeObject = 3,
    eaten: number = 0,
    radius: number = hc(app)() / 3,
    hole: number = hc(app)() / 12,
    fillStyle: string = "white",
    secondary: string = "black",
    stroke: string = "black",
    rotation: number = 0,
    x: number = wc(app)(),
    y: number = hc(app)(),
): boolean => {
    if (typeof slices === "object") {
        fillStyle = slices.fillStyle || "white";
        x = slices.x || wc(app)();
        y = slices.y || hc(app)();
        rotation = slices.rotation || 0;
        radius = slices.radius || hc(app)() / 3;
        eaten = slices.eaten || 0;
        hole = slices.hole || hc(app)() / 12;
        secondary = slices.secondary || "black";
        stroke = slices.stroke || "black";
        slices = slices.slices || 3;
    }
    drawDonut(app.interface.drawings as HTMLCanvasElement, slices, eaten, radius, hole, fillStyle, secondary, stroke, rotation, x, y);
    return true;
};

export const pie = (app: Editor) => (
    slices: number | ShapeObject = 3,
    eaten: number = 0,
    radius: number = hc(app)() / 3,
    fillStyle: string = "white",
    secondary: string = "black",
    stroke: string = "black",
    rotation: number = 0,
    x: number = wc(app)(),
    y: number = hc(app)(),
): boolean => {
    if (typeof slices === "object") {
        fillStyle = slices.fillStyle || "white";
        x = slices.x || wc(app)();
        y = slices.y || hc(app)();
        rotation = slices.rotation || 0;
        radius = slices.radius || hc(app)() / 3;
        secondary = slices.secondary || "black";
        stroke = slices.stroke || "black";
        eaten = slices.eaten || 0;
        slices = slices.slices || 3;
    }
    drawPie(app.interface.drawings as HTMLCanvasElement, slices, eaten, radius, fillStyle, secondary, stroke, rotation, x, y);
    return true;
};

export const star = (app: Editor) => (
    points: number | ShapeObject = 5,
    radius: number = hc(app)() / 3,
    fillStyle: string = "white",
    rotation: number = 0,
    outerRadius: number = radius / 100,
    x: number = wc(app)(),
    y: number = hc(app)(),
): boolean => {
    if (typeof points === "object") {
        radius = points.radius || hc(app)() / 3;
        fillStyle = points.fillStyle || "white";
        x = points.x || wc(app)();
        y = points.y || hc(app)();
        rotation = points.rotation || 0;
        outerRadius = points.outerRadius || radius / 100;
        points = points.points || 5;
    }
    drawStar(app.interface.drawings as HTMLCanvasElement, points, radius, fillStyle, rotation, outerRadius, x, y);
    return true;
};

export const stroke = (app: Editor) => (
    width: number | ShapeObject = 1,
    strokeStyle: string = "white",
    rotation: number = 0,
    x1: number = wc(app)() - wc(app)() / 10,
    y1: number = hc(app)(),
    x2: number = wc(app)() + wc(app)() / 5,
    y2: number = hc(app)(),
): boolean => {
    if (typeof width === "object") {
        strokeStyle = width.strokeStyle || "white";
        x1 = width.x1 || wc(app)() - wc(app)() / 10;
        y1 = width.y1 || hc(app)();
        x2 = width.x2 || wc(app)() + wc(app)() / 5;
        y2 = width.y2 || hc(app)();
        rotation = width.rotation || 0;
        width = width.width || 1;
    }
    drawStroke(app.interface.drawings as HTMLCanvasElement, width, strokeStyle, rotation, x1, y1, x2, y2);
    return true;
};

export const box = (app: Editor) => (
    width: number | ShapeObject = wc(app)() / 4,
    height: number = wc(app)() / 4,
    fillStyle: string = "white",
    rotation: number = 0,
    x: number = wc(app)() - wc(app)() / 8,
    y: number = hc(app)() - hc(app)() / 8,
): boolean => {
    if (typeof width === "object") {
        fillStyle = width.fillStyle || "white";
        x = width.x || wc(app)() - wc(app)() / 4;
        y = width.y || hc(app)() - hc(app)() / 2;
        rotation = width.rotation || 0;
        height = width.height || wc(app)() / 4;
        width = width.width || wc(app)() / 4;
    }
    drawBox(app.interface.drawings as HTMLCanvasElement, width, height, fillStyle, rotation, x, y);
    return true;
};

export const smiley = (app: Editor) => (
    happiness: number | ShapeObject = 0,
    radius: number = hc(app)() / 3,
    eyeSize: number = 3.0,
    fillStyle: string = "yellow",
    rotation: number = 0,
    x: number = wc(app)(),
    y: number = hc(app)(),
): boolean => {
    if (typeof happiness === "object") {
        fillStyle = happiness.fillStyle || "yellow";
        x = happiness.x || wc(app)();
        y = happiness.y || hc(app)();
        rotation = happiness.rotation || 0;
        eyeSize = happiness.eyeSize || 3.0;
        radius = happiness.radius || hc(app)() / 3;
        happiness = happiness.happiness || 0;
    }
    drawSmiley(app.interface.drawings as HTMLCanvasElement, happiness, radius, eyeSize, fillStyle, rotation, x, y);
    return true;
};

export const text = (app: Editor) => (
    text: string | ShapeObject,
    fontSize: number = 24,
    rotation: number = 0,
    font: string = "Arial",
    x: number = wc(app)(),
    y: number = hc(app)(),
    fillStyle: string = "white",
    filter: string = "none",
): boolean => {
    if (typeof text === "object") {
        fillStyle = text.fillStyle || "white";
        x = text.x || wc(app)();
        y = text.y || hc(app)();
        rotation = text.rotation || 0;
        font = text.font || "Arial";
        fontSize = text.fontSize || 24;
        filter = text.filter || "none";
        text = text.text || "";
    }
    drawText(app.interface.drawings as HTMLCanvasElement, text, fontSize, rotation, font, x, y, fillStyle, filter);
    return true;
};

export const image = (app: Editor) => (
    url: string | ShapeObject,
    width: number = wc(app)() / 2,
    height: number = hc(app)() / 2,
    rotation: number = 0,
    x: number = wc(app)(),
    y: number = hc(app)(),
    filter: string = "none",
): boolean => {
    if (typeof url === "object") {
        if (!url.url) return true;
        x = url.x || wc(app)();
        y = url.y || hc(app)();
        rotation = url.rotation || 0;
        width = url.width || 100;
        height = url.height || 100;
        filter = url.filter || "none";
        url = url.url || "";
    }
    drawImage(app.interface.drawings as HTMLCanvasElement, url, width, height, rotation, x, y, filter);
    return true;
};

export const randomChar = () => (length: number = 1, min: number = 0, max: number = 65536): string => {
    return Array.from(
      { length }, () => String.fromCodePoint(Math.floor(Math.random() * (max - min) + min))
    ).join('');
};

export const randomFromRange = () => (min: number, max: number): string => {
    const codePoint = Math.floor(Math.random() * (max - min) + min);
    return String.fromCodePoint(codePoint);
};

export const emoji = () => (n: number = 1): string => {
    return randomChar()(n, 0x1f600, 0x1f64f);
};

export const food = () => (n: number = 1): string => {
    return randomChar()(n, 0x1f32d, 0x1f37f);
};

export const animals = () => (n: number = 1): string => {
    return randomChar()(n, 0x1f400, 0x1f4d3);
};

export const expressions = () => (n: number = 1): string => {
    return randomChar()(n, 0x1f910, 0x1f92f);
};

export const gif = (app: any) => (options: any): void => {
    const {
        url,
        posX = 0,
        posY = 0,
        opacity = 1,
        size = "auto",
        center = false,
        rotation = 0,
        filter = 'none',
        duration = 10
    } = options;

    let real_duration = duration * app.clock.pulse_duration * app.clock.ppqn;
    let fadeOutDuration = real_duration * 0.1;
    let visibilityDuration = real_duration - fadeOutDuration;
    const gifElement = document.createElement("img");
    gifElement.src = url;
    gifElement.style.position = "fixed";
    gifElement.style.left = center ? "50%" : `${posX}px`;
    gifElement.style.top = center ? "50%" : `${posY}px`;
    gifElement.style.opacity = `${opacity}`;
    gifElement.style.zIndex = "1000";  // Ensure it's on top, fixed zIndex
    if (size !== "auto") {
        gifElement.style.width = size;
        gifElement.style.height = size;
    }
    const transformRules = [`rotate(${rotation}deg)`];
    if (center) {
        transformRules.unshift("translate(-50%, -50%)");
    }
    gifElement.style.transform = transformRules.join(" ");
    gifElement.style.filter = filter;
    gifElement.style.transition = `opacity ${fadeOutDuration}s ease`;
    document.body.appendChild(gifElement);

    // Start the fade-out at the end of the visibility duration
    setTimeout(() => {
        gifElement.style.opacity = "0";
    }, visibilityDuration * 1000);

    // Remove the GIF from the DOM after the fade-out duration
    setTimeout(() => {
        if (document.body.contains(gifElement)) {
            document.body.removeChild(gifElement);
        }
    }, real_duration * 1000);
};

export const scope = (app: any) => (config: OscilloscopeConfig): void => {
    /**
     * Configures the oscilloscope.
     * @param config - The configuration object for the oscilloscope.
     */
    app.osc = {
        ...app.osc,
        ...config,
    };
};