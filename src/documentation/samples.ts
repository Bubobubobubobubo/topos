import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const samples_to_markdown = (application: Editor) => {
  let samples = application.api._all_samples();
  let markdownList = "";
  let keys = Object.keys(samples);
  let i = -1;
  while (i++ < keys.length - 1) {
    //@ts-ignore
    if (!samples[keys[i]].data) continue;
    //@ts-ignore
    if (!samples[keys[i]].data.samples) continue;
    //markdownList += `**${keys[i]}** (_${
    //  //@ts-ignore
    //  samples[keys[i]].data.samples.length
    //}_) `;
    //

    // Adding new examples for each sample folder!
    const codeId = `sampleExample${i}`;
    application.api.codeExamples[
      codeId
    ] = `sound("${keys[i]}").n(irand(1, 5)).end(1).out()`;
    // @ts-ignore
    const howMany = samples[keys[i]].data.samples.length;

    markdownList += `
<button 
	class="hover:bg-neutral-500 inline px-4 py-2 bg-neutral-700 text-orange-300 text-xl"
	onclick="app.api._playDocExampleOnce(app.api.codeExamples['${codeId}'])"
>
${keys[i]}
<b class="text-white">(${howMany})</b>
</button>`;
  }
  return markdownList;
};

export const injectAvailableSamples = (application: Editor): string => {
  let generatedPage = samples_to_markdown(application);
  return generatedPage;
};

export const samples = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Audio Samples
	
Audio samples are dynamically loaded from the web. By default, Topos is providing some samples coming from the classic [Dirt-Samples](https://github.com/tidalcycles/Dirt-Samples) but also from the [Topos-Samples](https://github.com/Bubobubobubobubo/Topos-Samples) repository. You can contribute to the latter if you want to share your samples with the community! For each sample folder, we are indicating how many of them are available in parentheses. The samples starting with <ic>ST</ic> are coming from [a wonderful collection](https://archive.org/details/AmigaSoundtrackerSamplePacksst-xx) of Ultimate Tracker Amiga audio samples released by Karsten Obarski. They are very high-pitched as was usual in the tracker era. Pitch them down using <ic>.speed(0.5)</ic>.

## Available audio samples
	
<b class="flex lg:pl-6 lg:pr-6 text-bold mb-8">Samples can take a few seconds to load. Please wait if you are not hearing anything. Lower your volume, take it slow. Some sounds might be harsh.</b>
<div class="lg:pl-6 lg:pr-6 w-fit rounded-lg bg-neutral-600 mx-6 mt-2 my-6 px-2 py-2 max-h-96 flex flex-row flex-wrap gap-x-2 gap-y-2 overflow-y-scroll">
${injectAvailableSamples(application)}
</div>

# Loading custom samples

Topos is exposing the <ic>samples</ic> function that you can use to load your own set of samples. Samples are loaded on-the-fly from the web. Topos is a web application living in the browser. It is running in a sandboxed environment. Thus, it cannot have access to the files stored on your local system. Loading samples requires building a _map_ of the audio files, where a name is associated to a specific file:

${makeExample(
  "Loading samples from a map",
  `samples({
    bd: ['bd/BT0AADA.wav','bd/BT0AAD0.wav'],
    sd: ['sd/rytm-01-classic.wav','sd/rytm-00-hard.wav'],
    hh: ['hh27/000_hh27closedhh.wav','hh/000_hh3closedhh.wav'],
  }, 'github:tidalcycles/Dirt-Samples/master/');`,
  true
)}

This example is loading two samples from each folder declared in the original repository (in the <ic>strudel.json</ic> file). You can then play with them using the syntax you are already used to:

${makeExample(
  "Playing with the loaded samples",
  `rhythm(.5, 5, 8)::sound('bd').n(ir(1,2)).end(1).out()
  `,
  true
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
  true
)}

To learn more about the audio sample loading mechanism, please refer to [this page](https://strudel.tidalcycles.org/learn/samples) written by Felix Roos who has implemented the sample loading mechanism. The API is absolutely identic in Topos!

`;
};
