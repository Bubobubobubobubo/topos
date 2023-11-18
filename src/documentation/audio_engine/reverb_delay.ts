import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const reverb = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `# Reverberation and delay

## Reverb
	
A good sounding reverb. This reverb unit is using a convolution that gets updated everytime you change a parameter.
For that reason, it is often a good idea to set fixed reverb values per orbit. Do not try to pattern the reverb too much. 
	
| Method     | Alias | Description                     |
|------------|-------|---------------------------------|
| <ic>room</ic> | rm | Reverb level (between <ic>0</ic> and <ic>1</ic> |
| <ic>size</ic> | sz  | Reverb room size of the reverb, between <ic>0</ic> and <ic>n</ic> |
| <ic>roomfade</ic> |     | Reverb fade time, in seconds |
| <ic>roomlp</ic> |     | Reverb lowpass starting frequency (in hertz) |
| <ic>roomdim</ic> |     | Reverb lowpass frequency at -60db (in hertz) |

${makeExample(
    "Clapping in the cavern",
    `
beat(2)::snd('cp').room(0.5).size(4).out()
	`,
    true
  )};

	
## Delay
	
A good sounding delay unit that can go into feedback territory. Use it without moderation.
	
| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>delay</ic>      |           | Delay _wet/dry_ (between <ic>0</ic> and <ic>1</ic>) |
| <ic>delaytime</ic>  | delayt    | Delay time (in milliseconds)    |
| <ic>delayfeedback</ic> | delayfb | Delay feedback (between <ic>0</ic> and <ic>1</ic>) |
	
${makeExample(
    "Who doesn't like delay?",
    `
beat(2)::snd('cp').delay(0.5).delaytime(0.75).delayfb(0.8).out()
beat(4)::snd('snare').out()
beat(1)::snd('kick').out()
	`,
    true
  )};
	

`}
