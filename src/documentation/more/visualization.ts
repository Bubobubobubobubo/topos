import { type Editor } from "../../main";
import { key_shortcut, makeExampleFactory } from "../../Documentation";

export const visualization = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);

  return `
# Vizualisation

While Topos is mainly being developed as a live coding environment for algorithmic music composition, it also includes some features for live code visualizatoins. This section will introduce you to these features.

## Hydra Visual Live Coding

<div class="mx-12 bg-neutral-600 rounded-lg flex flex-col items-center justify-center">
<warning>⚠️ This feature can generate flashing images that could trigger photosensitivity or epileptic seizures. ⚠️ </warning>
</div>

[Hydra](https://hydra.ojack.xyz/?sketch_id=mahalia_1) is a popular live-codable video synthesizer developed by [Olivia Jack](https://ojack.xyz/) and other contributors. It follows an analog synthesizer patching metaphor to encourage live coding complex shaders. Being very easy to use, extremely powerful and also very rewarding to use, Hydra has become a popular choice for adding visuals into a live code performance.

${makeExample(
  "Hydra integration",
  `beat(4) :: hydra.osc(3, 0.5, 2).out()`,
  false,
)}

Close the documentation to see the effect: ${key_shortcut(
    "Ctrl+D",
  )}! **Boom, all shiny!**

Be careful not to call <ic>hydra</ic> too often as it can impact performances. You can use any rhythmical function like <ic>beat()</ic> function to limit the number of function calls. You can write any Topos code like <ic>[1,2,3].beat()</ic> to bring some life and movement in your Hydra sketches.

Stopping **Hydra** is simple:

${makeExample(
  "Stopping Hydra",
  `
beat(4) :: stop_hydra()     // this one
beat(4) :: hydra.hush() // or this one
`,
  false,
)}

### Changing the resolution

You can change Hydra resolution using this simple method:

${makeExample(
  "Changing Hydra resolution",
  `hydra.setResolution(1024, 768)`,
  false,
)}

### Documentation

I won't teach Hydra. You can find some great resources directly on the [Hydra website](https://hydra.ojack.xyz/):
  - [Hydra interactive documentation](https://hydra.ojack.xyz/docs/)
  - [List of Hydra Functions](https://hydra.ojack.xyz/api/)
  - [Source code on GitHub](https://github.com/hydra-synth/hydra)

### The Hydra namespace

In comparison with the basic Hydra editor, please note that you have to prefix all Hydra functions with <ic>hydra.</ic> to avoid conflicts with Topos functions. For example, <ic>osc()</ic> becomes <ic>hydra.osc()</ic>.

${makeExample("Hydra namespace", `hydra.voronoi(20).out()`, true)}

## GIF player

Topos embeds a small <ic>.gif</ic> picture player with a small API. GIFs are automatically fading out after the given duration. Look at the following example:

${makeExample(
  "Playing many gifs",
  `
beat(0.25)::gif({
  url:v('gif')[$(1)%6], // Any URL will do!
  opacity: r(0.5, 1), // Opacity (0-1)
  size:"300px", // CSS size property
  center:false, // Centering on the screen?
  filter:'none', // CSS Filter
  dur: 2, // In beats (Topos unit)
  rotation: ir(1, 360), // Rotation (in degrees)
  posX: ir(1,1200), // CSS Horizontal Position
  posY: ir(1, 800), // CSS Vertical Position
`,
  false,
)}


## Canvas live coding

Documentation in progress! Copy the example and run it separately (Showing sualization examples in the documentation not implemented yet).

* <ic>draw(f: Function)</ic> - Draws to a canvas with the given function.

${makeExample(
  "Drawing to canvas",
  `
beat(0.5) && clear() && draw(context => {
    context.fillStyle = 'red';

    // Begin the path for the heart shape
    context.beginPath();
    const x = wc();
    const y = hc();
    context.fillStyle = 'red';

    // Begin the path for the heart shape
    context.beginPath();

    context.moveTo(x + 125, y + 50);
    context.bezierCurveTo(x + 75, y, x, y + 75, x + 125, y + 175);
    context.bezierCurveTo(x + 250, y + 75, x + 175, y, x + 125, y + 50);

    // Fill the heart with red color
    context.fill();
})
`,
  false,
)}

* <ic<image(url, x, y, width, height, rotation)</ic> - Draws an image to a canvas.

${makeExample(
    "Image to canvas",
    `
    beat(0.5) && clear() && image("http://localhost:8000/topos_frog.svg",200,200+epulse()%15)
    `,
    false,
    )}

* <ic>clear()</ic> - Clears the canvas.
* <ic>background(fill: string)</ic> - Sets the background color, image or gradient.
* <ic>w()</ic> - Returns the canvas width.
* <ic>h()</ic> - Returns the canvas height.
* <ic>wc()</ic> - Returns the center of the canvas width.
* <ic>hc()</ic> - Returns the center of the canvas height.

### Text to canvas

* <ic>drawText(text, fontSize, rotation, font, x, y)</ic> - Draws text to a canvas.

${makeExample(
"Writing to canvas",
`
beat(0.5) && clear() && drawText("Hello world!", 100, 0, "Arial", 100, 100)
`,
false,
)}

* <ic>randomChar(number, min, max)</ic> - Returns a number of random characters from given unicode range.

${makeExample(
"Drawing random characters to canvas",
`
beat(0.5) && clear() && drawText(randomChar(10,1000,2000),30)
`,
false,
)}

* <ic>emoji(size)</ic> - Returns a random emojis as text.

* <ic>animals(size)</ic> - Returns a random animal emojis as text.

* <ic>food(size)</ic> - Returns a random food emojis as text.

${makeExample(
    "Drawing food emojis to canvas",
    `
beat(0.5) && clear() && drawText({x: 10, y: epulse()%700, text: food(50)})
`,
    false,
    )}

* <ic>expression(size)</ic> - Returns a random expression emojis as text.

### Shapes

In addition to supporting drawing to canvas directly, Topos also include some pre-defined shapes for convenience. The predefined shapes are:
* <ic>smiley(happiness, radius, eyes, fill, rotate, x, y)</ic>
* <ic>ball(radius,fill,x,y)</ic>
* <ic>box(width, height, fill, rotate)</ic>
* <ic>pointy(width, height, fill, rotate, x, y)</ic>
* <ic>equilateral(radius, fill, rotate, x, y)</ic>
* <ic>star(points, radius, fill rotate, outerRadius, x, y</ic>
* <ic>pie(slices, eaten, radius, fill, secondary, stroke, rotate, x, y</ic>
* <ic>donut(slices, eaten, radius, hole, fill, secondary, stroke, rotate, x, y</ic>
* <ic>balloid(petals, radius, curve, fill, secondary, x, y)</ic>
* <ic>stroke(width, stroke, rotate, x1, y1, x2, y2)</ic>

### Gradients

* <ic>linearGradient(x1, y1, x2, y2, ...stops)</ic> - Creates a <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient">linear gradient</a>.
* <ic>radialGradient(x1, y1, r1, x2, y2, r2, ...stops)</ic> - Creates a <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient">radial gradient</a>.
* <ic>conicGradient(x, y, angle, ...stops)</ic> - Creates a <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createConicGradient">conic gradient</a>.


`;
};
