import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const distortion = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `# Distortion 

## Distorsion, saturation, destruction

Three additional effects that are easy enough to understand. These effects are deteriorating the signal, making it easy to get digital or gritty audio sample playback or synthesizers destroyed beyond recognition. Be careful with your signal level!
	
| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>coarse</ic>     |           | Artificial sample-rate lowering |
| <ic>crush</ic>      |           | bitcrushing. <ic>1</ic> is extreme, the more you go up, the less it takes effect.  |
| <ic>shape</ic>      |           | Waveshaping distortion (between <ic>0</ic> and <ic>1</ic>)          |
	
	
${makeExample(
    "Crunch... crunch... crunch!",
    `
beat(.5)::snd('pad').coarse($(1) % 16).clip(.5).out(); // Comment me
beat(.5)::snd('pad').crush([16, 8, 4].beat(2)).clip(.5).out()
	`,
    true
  )};

`}


