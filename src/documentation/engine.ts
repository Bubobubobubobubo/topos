import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const sound = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Audio engine
	
The Topos audio engine is based on the [SuperDough](https://www.npmjs.com/package/superdough) audio backend that takes advantage of the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). The engine is capable of many things such as playing samples, synths and effects all at once. It is a very powerful and almost limitless tool to create complex sounds and textures. A set of default sounds are already provided but you can also load your own audio samples if you wish!
	
## Sound basics
	
The basic function to play a sound is... <ic>sound(name: string)</ic> (you can also write <ic>snd</ic> to save some precious time). If the given sound (or synthesizer) is already declared, it will be automatically queried/started and will start playing. Evaluate the following script in the global window:
	
${makeExample(
    "Playing sounds is easy",
    `
beat(1) && sound('bd').out()
beat(0.5) && sound('hh').out()
`,
    true
  )}
	
In plain english, this translates to:
	
> Every beat, play a kick drum.
> Every half-beat, play a high-hat.
	
Let's make it slightly more complex:

${makeExample(
    "Adding some effects",
    `
beat(1) && sound('bd').coarse(0.25).room(0.5).orbit(2).out();
beat(0.5) && sound('hh').delay(0.25).delaytime(0.125).out();
`,
    true
  )}
	
Now, it reads as follow:
	
> Every beat, play a kick drum with some amount of distortion.
> Every half-beat, play a high-hat with 25% of the sound injected in
> a delay unit, with a delay time of 0.125 seconds.
	
Let's pause for a moment and explain what is going on:

- If you remove <ic>beat</ic> instruction, you will end up with a deluge of kick drums and high-hats. <ic>beat</ic> in that case, is used to filter time. It is a very useful instruction to create basic rhythms. Check out the **Time** page if you haven't read it already.
- Playing a sound always ends up with the <ic>.out()</ic> method that gives the instruction to send a message to the audio engine.
- Sounds are **composed** by adding qualifiers/parameters that will modify the sound or synthesizer being played (_e.g_ <ic>sound('...').blabla(...)..something(...).out()</ic>. Think of it as _audio chains_. 
	
${makeExample(
    '"Composing" a complex sonic object by making a sound chain',
    `
beat(1) :: sound('pad').n(1)
  .begin(rand(0, 0.4))
  .freq([50,52].beat())
  .size(0.9).room(0.9)
  .velocity(0.25)
  .pan(usine()).release(2).out()`,
    true
  )}

## Audio Sample Folders / Sample Files
	
When you type <ic>kick</ic> in the <ic>sound('kick').out()</ic> expression, you are referring to a sample folder containing multiple audio samples. If you look at the sample folder, it would look something like this:
	
\`\`\`shell
.
├── KICK9.wav
├── kick1.wav
├── kick10.wav
├── kick2-1.wav
├── kick2.wav
├── kick3-1.wav
├── kick3.wav
├── kick4.wav
├── kick5.wav
├── kick6.wav
├── kick7.wav
└── kick8.wav
\`\`\`
	
The <ic>.n(number)</ic> method can be used to pick a sample from the currently selected sample folder. For instance, the following script will play a random sample from the _kick_ folder:
${makeExample(
    "Picking a sample",
    `
beat(1) && sound('kick').n([1,2,3,4,5,6,7,8].pick()).out()
`,
    true
  )}
	
Don't worry about the number. If it gets too big, it will be automatically wrapped to the number of samples in the folder. You can type any number, it will always fall on a sample. Let's use our mouse to select a sample number in a folder:
	
${makeExample(
    "Picking a sample... with your mouse!",
    `
// Move your mouse to change the sample being used!
beat(.25) && sound('numbers').n(Math.floor(mouseX())).out()`,
    true
  )}
	
**Note:** the <ic>sound</ic> function can also be used to play synthesizers (see the **Synthesizers** page). In that case, the <ic>.n(n: number)</ic> becomes totally useless!
	
## Learning about sound modifiers
	
As we said earlier, the <ic>sound('sample_name')</ic> function can be chained to _specify_ a sound more. For instance, you can add a filter and some effects to your high-hat:
${makeExample(
    "Let's make something more complex",
    `
beat(0.25) && sound('jvbass')
  .sometimes(s=>s.speed([2, 0.5].pick()))
  .room(0.9).size(0.9).gain(1)
  .cutoff(usine(1/2) * 5000)
  .out()`,
    true
  )}
	
There are many possible arguments that you can add to your sounds. Learning them can take a long time but it will open up a lot of possibilities. Let's try to make it through all of them. They can all be used both with synthesizers and audio samples, which is kind of unconventional with normal / standard electronic music softwares.
	
## Orbits and audio busses
	
Topos is inheriting some audio bus management principles taken from the [SuperDirt](https://github.com/musikinformatik/SuperDirt) and [Superdough](https://www.npmjs.com/package/superdough) engine, a WebAudio based recreation of the same engine. Each sound that you play is associated with an audio bus, called an _orbit_. Some effects are affecting **all sounds currently playing on that bus**. These are called **global effects**, to distinguish from **local effects**:
	
- **global effects**: _reverberation_ and _delay_.
- **local effects**: everything else :smile:

There is a special method to choose the _orbit_ that your sound is going to use:
	
| Method   | Alias | Description                                                |
|----------|-------|------------------------------------------------------------|
| <ic>orbit</ic>    | o      | Orbit number                                               |

	
## Amplitude
	
Simple controls over the amplitude (volume) of a given sound.
	
| Method   | Alias | Description                                                                        |
|----------|-------|------------------------------------------------------------------------------------|
| <ic>gain</ic>     |       | Volume of the synth/sample (exponential)                                           |
| <ic>velocity</ic> | vel   | Velocity (amplitude) from <ic>0</ic> to <ic>1</ic>. Multipled with gain            |
| <ic>dbgain</ic>   | db    | Attenuation in dB from <ic>-inf</ic> to <ic>+10</ic> (acts as a sound mixer fader) |
	
${makeExample(
    "Velocity manipulated by a counter",
    `
beat(.5)::snd('cp').vel($(1)%10 / 10).out()`,
    true
  )}
	
## Amplitude Enveloppe
	
**Superdough** is applying an **ADSR** envelope to every sound being played. This is a very standard and conventional amplitude envelope composed of four stages: _attack_, _decay_, _sustain_ and _release_. You will find the same parameters on most synthesizers.
	
| Method  | Alias | Description                                   |
|---------|-------|-----------------------------------------------|
| <ic>attack</ic>  | atk   | Attack value (time to maximum volume)         |
| <ic>decay</ic>   | dec   | Decay value (time to decay to sustain level)  |
| <ic>sustain</ic> | sus   | Sustain value (gain when sound is held)       |
| <ic>release</ic> | rel   | Release value (time for the sound to die off) |
	
Note that the **sustain** value is not a duration but an amplitude value (how loud). The other values are the time for each stage to take place. Here is a fairly complete example using the <ic>sawtooth</ic> basic waveform.
	
${makeExample(
    "Simple synthesizer",
    `
let smooth = (sound) => {
  return sound.cutoff(r(100,500))
       .lpadsr(usaw(1/8) * 8, 0.05, .125, 0, 0)
       .gain(r(0.25, 0.4)).adsr(0, r(.2,.4), r(0,0.5), 0)
       .room(0.9).size(2).o(2).vib(r(2,8)).vibmod(0.125)
}
beat(.25)::smooth(sound('sawtooth').note([50,57,55,60].beat(1))).out();
beat(.25)::smooth(sound('sawtooth').note([50,57,55,60].add(12).beat(1.5))).out();
	`,
    true
  )};
	
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
	
There are three basic filters: a _lowpass_, _highpass_ and _bandpass_ filters with rather soft slope. Each of them can take up to two arguments. You can also use only the _cutoff_ frequency and the resonance will stay to its default nominal value.
	
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
	
## Reverb
	
A basic reverberator that you can use to give some depth to your sounds. This simple reverb design has a _LoFI_ quality that can be quite useful on certain sounds.
	
| Method     | Alias | Description                     |
|------------|-------|---------------------------------|
| <ic>room</ic> |     | The more, the bigger the reverb (between <ic>0</ic> and <ic>1</ic>.|
| <ic>size</ic> |     | Reverberation amount |

${makeExample(
    "Clapping in the cavern",
    `
beat(2)::snd('cp').room(1).size(0.9).out()
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
	
## Distorsion, saturation, destruction
	
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
`;
};
