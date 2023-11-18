import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const reverb = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `

# Audio effects

There is a growing collection of audio effects you can use directly baked in the engine. You can create a wide variety of sonic effects by being creative with the parameters they offer.

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
    "Who doesn't like delay?", `
beat(2)::snd('cp').delay(0.5).delaytime(0.75).delayfb(0.8).out()
beat(4)::snd('snare').out()
beat(1)::snd('kick').out()`, true)}

## Phaser

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>phaser</ic> | <ic>phas</ic>  | Phaser speed, between <ic>1</ic> and <ic>n</ic> |
| <ic>phaserDepth</ic> | <ic>phasdepth</ic>  | How much of the signal goes through phaser (<ic>0</ic> to <ic>1</ic>) |
| <ic>phaserSweep</ic> | <ic>phassweep</ic>  | Phaser frequency sweep (in hertz) |
| <ic>phaserCenter</ic> | <ic>phascenter</ic>  | Phaser center frequency (default to 1000) |

${makeExample("Super cool phaser lick", `
rhythm(.5, 7, 8)::sound('wt_stereo')
  .phaser(0.75).phaserSweep(3000)
  .phaserCenter(1500).phaserDepth(1)
  .note([0, 1, 2, 3, 4, 5, 6].scale('pentatonic', 50).beat(0.25))
  .room(0.5).size(4).out()
`, true)}

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
