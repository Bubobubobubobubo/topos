import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const samples = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Audio Samples
	
Audio samples are dynamically loaded from the web. By default, Topos is providing some samples coming from the classic [Dirt-Samples](https://github.com/tidalcycles/Dirt-Samples) but also from the [Topos-Samples](https://github.com/Bubobubobubobubo/Topos-Samples) repository. You can contribute to the latter if you want to share your samples with the community! For each sample folder, we are indicating how many of them are available in parentheses. The samples starting with <ic>ST</ic> are coming from [a wonderful collection](https://archive.org/details/AmigaSoundtrackerSamplePacksst-xx) of Ultimate Tracker Amiga audio samples released by Karsten Obarski. They are very high-pitched as was usual in the tracker era. Pitch them down using <ic>.speed(0.5)</ic>.

`;
};
