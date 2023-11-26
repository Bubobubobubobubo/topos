import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const loading_samples = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `# Loading custom samples


Topos is exposing the <ic>samples</ic> function that you can use to load your own set of samples. 

Samples are loaded on-the-fly from the web. Topos is a web application living in the browser. It is running in a sandboxed environment. Thus, it cannot have access to the files stored on your local system. Loading samples requires building a _map_ of the audio files, where a name is associated to a specific file:

${makeExample(
  "Loading samples from a map",
  `samples({
    bd: ['bd/BT0AADA.wav','bd/BT0AAD0.wav'],
    sd: ['sd/rytm-01-classic.wav','sd/rytm-00-hard.wav'],
    hh: ['hh27/000_hh27closedhh.wav','hh/000_hh3closedhh.wav'],
  }, 'github:tidalcycles/Dirt-Samples/master/');`,
  true,
)}

This example is loading two samples from each folder declared in the original repository (in the <ic>strudel.json</ic> file). You can then play with them using the syntax you are already used to:

${makeExample(
  "Playing with the loaded samples",
  `rhythm(.5, 5, 8)::sound('bd').n(ir(1,2)).end(1).out()
  `,
  true,
)}

Internally, Topos is loading samples using a different technique where sample maps are directly taken from the previously mentioned <ic>strudel.json</ic> file that lives in each repository:

${makeExample(
  "This is how Topos is loading its own samples",
  `
// Visit the concerned repos and search for 'strudel.json'
samples("github:tidalcycles/Dirt-Samples/master");
samples("github:Bubobubobubobubo/Dough-Samples/main");
samples("github:Bubobubobubobubo/Dough-Amiga/main");
`,
  true,
)}

To learn more about the audio sample loading mechanism, please refer to [this page](https://strudel.tidalcycles.org/learn/samples) written by Felix Roos who has implemented the sample loading mechanism. The API is absolutely identic in Topos!

# Loading sounds using Shabda

You can load samples coming from [Freesound](https://freesound.org/) using the [Shabda](https://shabda.ndre.gr/) API. To do so, study the following example:

${makeExample(
  "Loading samples from shabda",
  `
// Prepend the sample you want with 'shabda:'
samples("shabda:ocean")

// Use the sound without 'shabda:'
beat(1)::sound('ocean').clip(1).out()
`,
  true,
)}

You can also use the <ic>.n</ic> attribute like usual to load a different sample.
`;
};
