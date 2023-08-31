import { type Editor } from "../main";

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
  return `
# Audio Samples
	
Audio samples are dynamically loaded from the web. By default, Topos is providing some samples coming from the classic [Dirt-Samples](https://github.com/tidalcycles/Dirt-Samples) but also from the [Topos-Samples](https://github.com/Bubobubobubobubo/Topos-Samples) repository. You can contribute to the latter if you want to share your samples with the community! For each sample folder, we are indicating how many of them are available in parentheses.

## Available audio samples

	
<b class="flex lg:pl-6 lg:pr-6 text-bold mb-8">Samples can take a few seconds to load. Please wait if you are not hearing anything. Lower your volume, take it slow. Some sounds might be harsh.</b>
<div class="lg:pl-6 lg:pr-6 inline-block w-fit flex flex-row flex-wrap gap-x-2 gap-y-2">
${injectAvailableSamples(application)}
</div>
`;
};
