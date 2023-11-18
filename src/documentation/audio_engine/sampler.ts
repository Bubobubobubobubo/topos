import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const sampler = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `# Sampler

The sampler is a rather complex beast. There is a lot you can do by manipulating samples, from simple playback to complex granulation, wavetable synthesis and concrete music.

	
| Method  | Alias  | Description                                            |
|---------|--------|--------------------------------------------------------|
| <ic>n</ic>       |       | Select a sample in the current folder (from <ic>0</ic> to infinity)                 |
| <ic>begin</ic>   |       | Beginning of the sample playback (between <ic>0</ic> and <ic>1</ic>)     |
| <ic>end</ic>     |       | End of the sample (between <ic>0</ic> and <ic>1</ic>)                    |
| <ic>loopBegin</ic> |     | Beginning of the loop section (between <ic>0</ic> and <ic>1</ic>)        |
| <ic>loopEnd</ic> |     | End of the loop section (between <ic>0</ic> and <ic>1</ic>)        |
| <ic>loop</ic>    |       | Whether to loop or not the audio sample          |
| <ic>stretch</ic>    |       | Stretches the audio playback rate of a sample over <ic>n</ic> beats          |
| <ic>speed</ic>   |       | Playback speed (<ic>2</ic> = twice as fast)         |
| <ic>cut</ic>     |       | Set with <ic>0</ic> or <ic>1</ic>. Will cut the sample as soon as another sample is played on the same bus |
| <ic>clip</ic>    |       | Multiply the duration of the sample with the given number |
| <ic>pan</ic>     |       | Stereo position of the audio playback (<ic>0</ic> = left, <ic>1</ic> = right)|
| <ic>vib</ic>     |       | vibrato speed (in hertz)|
| <ic>vibmod</ic>     |       | vibrato depth (from <ic>0</ic> to <ic>n</ic>)|
	
Let's apply some of these methods naïvely. We will then break everything using simpler examples.

${makeExample(
    "Complex sampling duties",
    `
// Using some of the modifiers described above :)
beat(.5)::snd('pad').begin(0.2)
  .speed([1, 0.9, 0.8].beat(4))
  .n(2).pan(usine(.5))
  .end(rand(0.3,0.8))
  .room(0.8).size(0.5)
  .clip(1).out()
	`,
    true
  )};


## Playback speed / pitching samples

Let's play with the <ic>speed</ic> parameter to control the pitch of sample playback:

${makeExample("Controlling the playback speed", `
beat(0.5)::sound('notes')
  .speed([1,2,3,4].palindrome().beat(0.5)).out()
`, true)}

It also works by using negative values. It reverses the playback:

${makeExample("Playing samples backwards", `
beat(0.5)::sound('notes')
  .speed(-[1,2,3,4].palindrome().beat(0.5)).out()
`, true)}
	
Of course you can play melodies using samples:


${makeExample("Playing melodies using samples", `
beat(0.5)::sound('notes')
  .room(0.5).size(4)
  .note([0, 2, 3, 4, 5].scale('minor', 50).beat(0.5)).out()
`, true)}

## Panning

To pan samples, use the <ic>.pan</ic> method with a number between <ic>0</ic> and <ic>1</ic>.


${makeExample("Playing melodies using samples", `
beat(0.25)::sound('notes')
  .room(0.5).size(4).pan(r(0, 1))
  .note([0, 2, 3, 4, 5].scale('minor', 50).beat(0.25)).out()
`, true)}


## Looping over a sample

Using <ic>loop</ic> (<ic>1</ic> for looping), <ic>loopBegin</ic> and <ic>loopEnd</ic> (between <ic>0</ic> and <ic>1</ic>), you can loop over the length of a sample. It can be super effective to create granular effects.


${makeExample("Granulation using loop", `
beat(0.25)::sound('fikea').loop(1)
  .lpf(ir(2000, 5000))
  .loopBegin(0).loopEnd(r(0, 1))
  .room(0.5).size(4).pan(r(0, 1))
  .note([0, 2, 3, 4, 5].scale('minor', 50).beat(0.25)).out()
`, true)}

## Stretching a sample

The <ic>stretch</ic> parameter can help you to stretch long samples like amen breaks:

${makeExample(
    "Playing an amen break",
    `
// Note that stretch has the same value as beat
beat(4) :: sound('amen1').n(11).stretch(4).out()
beat(1) :: sound('kick').shape(0.35).out()`,
    true,
  )};

## Cutting samples

Sometimes, you will find it necessary to cut a sample. It can be because the sample is too long but also because it takes too much CPU to play too many samples at the same time.

Know about the <ic>begin</ic> and <ic>end</ic> parameters. They are not related to the sampler itself, but to the length of the event you are playing. Let's cut the granular example:

${makeExample("Cutting a sample using end", `
beat(0.25)::sound('notes')
  .end(usine(1/2)/0.5)
  .room(0.5).size(4).pan(r(0, 1))
  .note([0, 2, 3, 4, 5].scale('minor', 50).beat(0.25)).out()
`, true)}

You can also use <ic>clip</ic> to cut the sample everytime a new sample comes in:


${makeExample("Cutting a sample using end", `
beat(0.125)::sound('notes')
  .cut(1)
  .room(0.5).size(4).pan(r(0, 1))
  .note([0, 2, 3, 4, 5].scale('minor', 50).beat(0.125) 
  + [-12,12].beat()).out()
`, true)}

## Adding vibrato to samples

You can add vibrato to any sample using <ic>vib</ic> and <ic>vibmod</ic>:

${makeExample("Adding vibrato to a sample", `

beat(1)::sound('fhang').vib([1, 2, 4].bar()).vibmod([0.5, 2].beat()).out()
`, true)}


`}


