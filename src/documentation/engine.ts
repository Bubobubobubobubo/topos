import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const sound = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `


## Sample Controls

There are some basic controls over the playback of each sample. This allows you to get into more serious sampling if you take the time to really work with your audio materials.
	
| Method  | Alias | Description                                            |
|---------|-------|--------------------------------------------------------|
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
	
${makeExample(
    "Playing an amen break",
    `
// Note that stretch has the same value as beat
beat(4) :: sound('amen1').n(11).stretch(4).out()
beat(1) :: sound('kick').shape(0.35).out()`,
    true,
  )};

	
## Filters
	
There are three basic filters: a _lowpass_, _highpass_ and _bandpass_ filters with rather soft slope. Each of them can take up to two arguments. You can also use only the _cutoff_ frequency and the resonance will stay to its default nominal value. You will learn more about the usage of filters in the synths page!
	
| Method     | Alias | Description                             |
|------------|-------|-----------------------------------------|
| <ic>cutoff</ic>     | lpf   | Cutoff frequency of the lowpass filter  |
| <ic>resonance</ic>  | lpq   | Resonance of the lowpass filter         |
| <ic>hcutoff</ic>    | hpf   | Cutoff frequency of the highpass filter |
| <ic>hresonance</ic> | hpq   | Resonance of the highpass filter        |
| <ic>bandf</ic>      | bpf   | Cutoff frequency of the bandpass filter |
| <ic>bandq</ic>      | bpq   | Resonance of the bandpass filter        |
| <ic>vowel</ic> |       | Formant filter with (vocal quality)     |

${makeExample(
    "Filter sweep using a low frequency oscillator",
    `
beat(.5) && snd('sawtooth')
  .cutoff([2000,500].pick() + usine(.5) * 4000)
  .resonance(0.9).freq([100,150].pick())
  .out()
	`,
    true
  )};
	
	
## Compression

This effect is leveraging the basic WebAudio compressor. More information can be found about it on the [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode?retiredLocale=de#instance_properties) page. This can be come quite complex :)

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>comp</ic>     | cmp | Compressor threshold value (dB) over which compressor operates |
| <ic>ratio</ic>     | rt | Compressor ratio: input amount in dB needed for 1dB change in the output   |
| <ic>knee</ic>     | kn | dB value defining the range over which the signal transitions to compressed section |
| <ic>compAttack</ic>     | cmpa | In seconds, time to decrease the gain by 10db |
| <ic>compRelease</ic>     | cmpr | In seconds, time to increase the gain by 10db |


`;
};
