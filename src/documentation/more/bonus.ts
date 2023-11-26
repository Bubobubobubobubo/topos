import { type Editor } from "../../main";
import { key_shortcut, makeExampleFactory } from "../../Documentation";

export const bonus = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);

  return `
# Bonus features

Some features have been included as a bonus. These features are often about patterning over things that are not directly related to sound: pictures, video, etc.

## Hydra Visual Live Coding

<div class="mx-12 bg-neutral-600 rounded-lg flex flex-col items-center justify-center">
<warning>⚠️ This feature can generate flashing images that could trigger photosensitivity or epileptic seizures. ⚠️ </warning>
</div>

[Hydra](https://hydra.ojack.xyz/?sketch_id=mahalia_1) is a popular live-codable video synthesizer developed by [Olivia Jack](https://ojack.xyz/) and other contributors. It follows an analog synthesizer patching metaphor to encourage live coding complex shaders. Being very easy to use, extremely powerful and also very rewarding to use, Hydra has become a popular choice for adding visuals into a live code performance.

${makeExample(
  "Hydra integration",
  `beat(4) :: hydra.osc(3, 0.5, 2).out()`,
  true
)}

Close the documentation to see the effect: ${key_shortcut(
    "Ctrl+D"
  )}! **Boom, all shiny!**

Be careful not to call <ic>hydra</ic> too often as it can impact performances. You can use any rhythmical function like <ic>beat()</ic> function to limit the number of function calls. You can write any Topos code like <ic>[1,2,3].beat()</ic> to bring some life and movement in your Hydra sketches.

Stopping **Hydra** is simple:

${makeExample(
  "Stopping Hydra",
  `
beat(4) :: stop_hydra()     // this one
beat(4) :: hydra.hush() // or this one
`,
  true
)}


### Changing the resolution

You can change Hydra resolution using this simple method:

${makeExample(
  "Changing Hydra resolution",
  `hydra.setResolution(1024, 768)`,
  true
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
  true
)}
`;
};
