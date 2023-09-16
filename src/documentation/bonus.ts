import { type Editor } from "../main";
import { key_shortcut, makeExampleFactory } from "../Documentation";

export const bonus = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);

  return `
# Bonus features

Some features are not part of the core of Topos but are still very useful. They are not described in the main documentation but are still available in the API. These features are sometimes coming from personal experiments, from a thinking-out-loud process or from a sudden desire to hack things. This bonus set of functionalities is not guaranteed to be stable.

## Hydra Visual Live Coding

<div class="mx-12 bg-neutral-600 rounded-lg flex flex-col items-center justify-center">
<warning>⚠️ This feature can generate flashing images that could trigger photosensitivity or epileptic seizures. ⚠️ </warning>
</div>

[Hydra](https://hydra.ojack.xyz/?sketch_id=mahalia_1) is a popular live-codable video synthesizer developed by [Olivia Jack](https://ojack.xyz/) and other contributors. It follows the metaphor of analog synthesizer patching to allow its user to create complex live visuals from a web browser window. Being very easy to use, extremely powerful and also very rewarding to use, Hydra has become a popular choice for adding visuals into a live code performance. Topos provides a simple way to integrate Hydra into a live coding session and to blend it with regular Topos code.

${makeExample(
  "Hydra integration",
  `mod(4) :: app.hydra.osc(3, 0.5, 2).out()`,
  true
)}

You may feel like it's doing nothing! Press ${key_shortcut(
    "Ctrl+D"
  )} to close the documentation. **Boom, all shiny!**

Be careful not to call <ic>app.hydra</ic> too often as it can impact performances. You can use any rhythmical function like <ic>mod()</ic> function to limit the number of function calls. You can write any Topos code like <ic>[1,2,3].beat()</ic> to bring some life and movement in your Hydra sketches.

Stopping **Hydra** is simple:

${makeExample(
  "Stopping Hydra",
  `
beat(4) :: stop_hydra()     // this one
beat(4) :: app.hydra.hush() // or this one
`,
  true
)}

I won't teach you how to play with Hydra. You can find some great resources on the [Hydra website](https://hydra.ojack.xyz/):
  - [Hydra interactive documentation](https://hydra.ojack.xyz/docs/)
  - [List of Hydra Functions](https://hydra.ojack.xyz/api/)
  - [Source code on GitHub](https://github.com/hydra-synth/hydra)
`;
};
