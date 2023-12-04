import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const audio_basics = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `# Audio Basics
	
The Topos audio engine is [SuperDough](https://www.npmjs.com/package/superdough). This audio engine that takes advantage of the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). The engine is capable of many things such as playing samples, synths and effects all at once. It is a very powerful and almost limitless tool to create complex sounds and textures. A set of default sounds are already provided but you can also load your own audio samples if you wish! Let's learn the basics.
	
## Sound basics
	
Use the <ic>sound(name: string)</ic> function to play a sound. You can also write <ic>snd</ic>. A sound can be:
- an audio sample: taken from the samples currently loaded
- a synthesizer: the name of a specific waveform

Whatever you choose, the syntax stays the same. See the following example:

${makeExample(
  "Playing sounds is easy",
  `
beat(1) && sound('bd').out()
beat(0.5) && sound('hh').out()
`,
  true,
)}
	
These commands, in plain english, can be translated to:
	
> Every beat, play a kick drum.
> Every half-beat, play a high-hat.
	
Let's make this example a bit more complex:

${makeExample(
  "Adding some effects",
  `
beat(1) && sound('bd').coarse(0.25).room(0.5).orbit(2).out();
beat(0.5) && sound('hh').delay(0.25).delaytime(0.125).out();
`,
  true,
)}
	
Now, it translates as follows:
	
> Every beat, play a kick drum with some amount of distortion on the third audio bus.
> Every half-beat, play a high-hat with 25% of the sound injected in
> a delay unit, with a delay time of 0.125 seconds.
	
If you remove <ic>beat</ic> instruction, you will end up with a deluge of kick drums and high-hats. <ic>beat</ic> in that case, is used to filter time. It is a very useful instruction to create basic rhythms. Check out the **Time** section if you haven't read it already.

## The <ic>.out</ic> method

To play a sound, you always need the <ic>.out()</ic> method at the end of your chain. THis method tells **Topos** to send the chain to the audio engine. The <ic>.out</ic> method can take an optional argument to send the sound to a numbered effect bus, from <ic>0</ic> to <ic>n</ic> :

${makeExample(
  "Using the .out method",
  `
// Playing a clap on the third bus (0-indexed)
beat(1)::sound('cp').out(2)
`,
  true,
)}

Try to remove <ic>.out</ic>. You will see that no sound is playing at all!

## Sound chains

- Sounds are **composed** by adding qualifiers/parameters that modify the sound or synthesizer you have picked (_e.g_ <ic>sound('...').blabla(...)..something(...).out()</ic>. Think of it as _audio chains_. 
	
${makeExample(
  "Complex sonic object",
  `
beat(1) :: sound('pad').n(1)
  .begin(rand(0, 0.4))
  .freq([50,52].beat())
  .size(0.9).room(0.9)
  .velocity(0.25)
  .pan(usine()).release(2).out()`,
  true,
)}

## Picking a specific sound
	
If you choose the sound <ic>kick</ic>, you are asking for the first sample in the <ic>kick</ic> folder. All the sample names are folders. Synthesizers are not affected by this. Here is what the <ic>kick</ic>might be looking like:
	
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
  true,
)}

You can also use the <ic>:</ic> to pick a sample number directly from the <ic>sound</ic> function:

	${makeExample(
    "Picking a sample using :",
    `
beat(1) && sound('kick:3').out()
`,
    true,
  )}

You can use any number to pick a sound. Don't be afraid of using a number too big. If the number exceeds the number of available samples, it will simply wrap around and loop infinitely over the folder. Let's demonstrate this by using the mouse over a very large sample folder:
	
${makeExample(
  "Picking a sample... with the mouse!",
  `
// Move your mouse to change the sample being used!
beat(.25) && sound('ST09').n(Math.floor(mouseX())).out()`,
  true,
)}
	

The <ic>.n</ic> method is also used for synthesizers but it behaves differently. When using a synthesizer, this method can help you determine the number of harmonics in your waveform. See the **Synthesizers** section to learn more about this.

## Orbits and audio busses
	
**Topos** is inheriting some audio bus management principles taken from the [SuperDirt](https://github.com/musikinformatik/SuperDirt) and [Superdough](https://www.npmjs.com/package/superdough) engine, a WebAudio based recreation of the same engine. 

Each sound that you play is associated with an audio bus, called an _orbit_. Some effects are affecting **all sounds currently playing on that bus**. These are called **global effects**, to distinguish from **local effects**:
	
- **global effects**: _reverberation_ and _delay_.
- **local effects**: everything else :smile:

There is a special method to choose the _orbit_ that your sound is going to use:
	
| Method   | Alias | Description                                                |
|----------|-------|------------------------------------------------------------|
| <ic>orbit</ic>    | o      | Orbit number                                               |

You can play a sound _dry_ and another sound _wet_. Take a look at this example where the reverb is only affecting one of the sounds:

${makeExample(
  "Dry and wet",
  `

// This sound is dry
beat(1)::sound('hh').out()

// This sound is wet (reverb)
beat(2)::sound('cp').orbit(2).room(0.5).size(8).out()
`,
  true,
)}
	
## The art of chaining
	
Learning to create complex chains is very important when using **Topos**. It can take some time to learn all the possible parameters. Don't worry, it's actually rather easy to learn.

${makeExample(
  "Complex chain",
  `
beat(0.25) && sound('fhh')
  .sometimes(s=>s.speed([2, 0.5].pick()))
  .room(0.9).size(0.9).gain(1)
  .cutoff(usine(1/2) * 5000)
  .out()`,
  true,
)}
	
Most audio parameters can be used both for samples and synthesizers. This is quite unconventional if you are familiar with a more traditional music software.
`;
};
