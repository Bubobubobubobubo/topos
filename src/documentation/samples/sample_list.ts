import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const samples_to_markdown = (
  application: Editor,
  tag_filter?: string,
) => {
  let samples = application.api._all_samples();
  let markdownList = "";
  let keys = Object.keys(samples);
  let i = -1;
  while (i++ < keys.length - 1) {
    //@ts-ignore
    if (!samples[keys[i]].data) continue;
    //@ts-ignore
    if (!samples[keys[i]].data.samples) continue;
    // @ts-ignore
    if (samples[keys[i]].data.tag !== tag_filter) continue;
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

export const injectAllSamples = (application: Editor): string => {
  let generatedPage = samples_to_markdown(application, "Topos");
  return generatedPage;
};

export const injectDrumMachineSamples = (application: Editor): string => {
  let generatedPage = samples_to_markdown(application, "Machines");
  return generatedPage;
};

export const sample_list = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `
# Available audio samples

On this page, you will find an exhaustive list of all the samples currently loaded by default by the system. Samples are sorted by **sample packs**. I am gradually adding more of them.

## Waveforms

A very large collection of wavetables for wavetable synthesis. This collection has been released by Kristoffer Ekstrand: [AKWF Waveforms](https://www.adventurekid.se/akrt/waveforms/adventure-kid-waveforms/). Every sound sample that starts with <ic>wt_</ic> will be looped. Look at this demo:

${makeExample(
  "Wavetable synthesis made easy :)",
  `
beat(0.5)::sound('wt_stereo').n([0, 1].pick()).ad(0, .25).out()
`,
  true,
)}


Pick one folder and spend some time exploring it. There is a lot of different waveforms.

<div class="lg:pl-6 lg:pr-6 w-fit rounded-lg bg-neutral-600 mx-6 mt-2 my-6 px-2 py-2 max-h-96 flex flex-row flex-wrap gap-x-2 gap-y-2 overflow-y-scroll">
${samples_to_markdown(application, "Waveforms")}
</div>

## Drum machines sample pack

A set of 72 classic drum machines created by **Geikha**: [Geikha Drum Machines](https://github.com/geikha/tidal-drum-machines). To use them efficiently, it is best to use the <ic>.bank()</ic> parameter like so:

${makeExample(
  "Using a classic drum machine",
  `
beat(0.5)::sound(['bd', 'cp'].pick()).bank("AkaiLinn").out()
`,
  true,
)}

Here is the complete list of available machines:


<div class="lg:pl-6 lg:pr-6 w-fit rounded-lg bg-neutral-600 mx-6 mt-2 my-6 px-2 py-2 max-h-96 flex flex-row flex-wrap gap-x-2 gap-y-2 overflow-y-scroll">
${samples_to_markdown(application, "Machines")}
</div>

## FoxDot sample pack

The default sample pack used by Ryan Kirkbride's [FoxDot](https://github.com/Qirky/FoxDot). It is a nice curated sample pack that covers all the basic sounds you could want.

<div class="lg:pl-6 lg:pr-6 w-fit rounded-lg bg-neutral-600 mx-6 mt-2 my-6 px-2 py-2 max-h-96 flex flex-row flex-wrap gap-x-2 gap-y-2 overflow-y-scroll">
${samples_to_markdown(application, "FoxDot")}
</div>

## Amiga sample pack

This set of audio samples is taken from [this wonderful collection](https://archive.org/details/AmigaSoundtrackerSamplePacksst-xx) of **Ultimate Tracker Amiga samples**. They were initially made by Karsten Obarski. These files were processed: pitched down one octave, gain down 6db. The audio has been processed with [SoX](https://github.com/chirlu/sox). The script used to do so is also included in this repository.

<div class="lg:pl-6 lg:pr-6 w-fit rounded-lg bg-neutral-600 mx-6 mt-2 my-6 px-2 py-2 max-h-96 flex flex-row flex-wrap gap-x-2 gap-y-2 overflow-y-scroll">
${samples_to_markdown(application, "Amiga")}
</div>

## Amen break sample pack

A collection of many different amen breaks. Use <ic>.stretch()</ic> to play with these:

${makeExample(
  "Stretching an amen break",
  `
beat(4)::sound('amen1').stretch(4).out()
`,
  true,
)}

The stretch should be adapted based on the length of each amen break.

<div class="lg:pl-6 lg:pr-6 w-fit rounded-lg bg-neutral-600 mx-6 mt-2 my-6 px-2 py-2 max-h-96 flex flex-row flex-wrap gap-x-2 gap-y-2 overflow-y-scroll">
${samples_to_markdown(application, "Amen")}
</div>

## TidalCycles sample library

Many live coders are expecting to find the Tidal sample library wherever they go, so here it is :)


<div class="lg:pl-6 lg:pr-6 w-fit rounded-lg bg-neutral-600 mx-6 mt-2 my-6 px-2 py-2 max-h-96 flex flex-row flex-wrap gap-x-2 gap-y-2 overflow-y-scroll">
${samples_to_markdown(application, "Tidal")}
</div>
`;
};
