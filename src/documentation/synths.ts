import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const synths = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Synthesizers
	
Topos comes by default with a forever-increasing number of synthesis capabilities. These synths are based on basic [WebAudio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) designs. For heavy synthesis duties, I recommend you to user other synthesizers or softwares through MIDI. There is already a lot you can do with the built-in synths though!
	
# Timbre, pitch and frequency
	
The <ic>sound</ic> function can take the name of a synthesizer or waveform as first argument. This has for effect to turn the sampler we all know and love into a synthesizer. <ic>sine</ic>, <ic>sawtooth</ic>,<ic>triangle</ic>, <ic>square</ic> are the names used to select classic oscillator waveforms. Note that you can also make use of filters and envelopes to shape the sound to your liking.

${makeExample(
    "Listening to the different waveforms from the sweetest to the harshest",
    `
beat(.5) && snd(['sine', 'triangle', 'sawtooth', 'square'].beat()).freq(100).out()
`,
    true
  )}

Two functions are primarily used to control the frequency of the synthesizer:
- <ic>freq(hz: number)</ic>: sets the frequency of the oscillator.
- <ic>note(note: number)</ic>: sets the MIDI note of the oscillator (MIDI note converted to hertz).

${makeExample(
    "Selecting a pitch or note",
    `
beat(.5) && snd('triangle').freq([100,200,400].beat(2)).out()
`,
    true
  )}

## Vibrato

You can also add some amount of vibrato to the sound using the <ic>vib</ic> and <ic>vibmod</ic> methods. These can turn any oscillator into something more lively and/or into a sound effect when used with a high amount of modulation.

${makeExample(
    "Different vibrato settings",
    `
bpm(140);
beat(1) :: sound('triangle')
  .freq(400).release(0.2)
  .vib([1/2, 1, 2, 4].beat())
  .vibmod([1,2,4,8].beat(2))
  .out()`,
    true
  )}

## Controlling the amplitude

Controlling the amplitude and duration of the sound can be done using various techniques. The most important thing to learn is probably how set the amplitude (volume) of your synthesizer:
- <ic>gain(gain: number)</ic>: sets the gain of the oscillator.
- <ic>velocity(velocity: number)</ic>: sets the velocity of the oscillator (velocity is a multiple of gain).

${makeExample(
    "Setting the gain",
    `beat(0.25) :: sound('sawtooth').gain([0.0, 1/8, 1/4, 1/2, 1].beat(0.5)).out()`,
    true
  )}

${makeExample(
    "Setting the velocity",
    `beat(0.25) :: sound('sawtooth').velocity([0.0, 1/8, 1/4, 1/2, 1].beat(0.5)).out()`,
    true
  )}

<div class="mt-4 mb-4 lg:grid lg:grid-cols-4 lg:gap-4">
  <img class="col-span-1 lg:ml-12 bg-gray-100 rounded-lg px-2 py-2", src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ADSR_Envelope_Graph.svg/1280px-ADSR_Envelope_Graph.svg.png" width="400" />
  <z class="pl-8 lg:text-2xl text-base text-white lg:mx-6 mx-2 my-4 leading-normal col-span-3 ">Synthesizers typically come with an amplitude envelope that can help you to shape the sound with a slow attack or long release. This is done in Topos using the amplitude envelope, composed of four parameters: <ic>attack</ic>, <ic>decay</ic>, <ic>sustain</ic> and <ic>release</ic>:</z> 
</div>

- <ic>attack(attack: number)</ic> / <ic>atk(atk: number)</ic>: sets the attack time of the envelope.
- <ic>decay(decay: number)</ic> / <ic>dec(dec: number)</ic>: sets the decay time of the envelope.
- <ic>sustain(sustain: number)</ic> / <ic>sus(sus: number)</ic>: sets the sustain time of the envelope.
- <ic>release(release: number)</ic> / <ic>rel(rel: number)</ic>: sets the release time of the envelope.

${makeExample(
    "Using decay and sustain to set the ADSR envelope",
    `
beat(0.5) :: sound('wt_piano')
  .cutoff(1000 + usine() * 4000)
  .freq(100).decay(.2)
  .sustain([0.1,0.5].beat(4))
  .out()`,
    true
  )}

This ADSR envelope design is important to know because it is used for other aspects of the synthesis engine such as the filters that we are now going to talk about. But wait, I've kept the best for the end. The <ic>adsr()</ic> combines all the parameters together. It is a shortcut for setting the ADSR envelope:

- <ic>adsr(attack: number, decay: number, sustain: number, release: number)</ic>: sets the ADSR envelope.

${makeExample(
    "Replacing the previous example with the adsr() method",
    `
beat(0.5) :: sound('wt_piano')
  .cutoff(1000 + usine() * 4000)
  .freq(100)
  .adsr(0, .2, [0.1,0.5].beat(4), 0)
  .out()
`,
    true
  )}


## Substractive synthesis using filters

The most basic synthesis technique used since the 1970s is called substractive synthesis. This technique is based on the use of rich sound sources (oscillators) as a base to build rich and moving timbres. Because rich sources contain a lot of different harmonics, you might want to filter some of them to obtain the timbre you are looking for. To do so, Topos comes with a set of basic filters that can be used to shape the sound exactly to your liking. There are three filter types by defaut, with more to be added in the future:

- **lowpass filter**: filters the high frequencies, keeping the low frequencies.
- **highpass filter**: filtering the low frequencies, keeping the high frequencies.
- **bandpass filter**: filters the low and high frequencies around a frequency band, keeping what's in the middle.

${makeExample(
    "Filtering the high frequencies of an oscillator",
    `beat(.5) :: sound('sawtooth').cutoff(50 + usine(1/8) * 2000).out()`,
    true
  )}

These filters all come with their own set of parameters. Note that we are describing the parameters of the three different filter types here. Choose the right parameters depending on the filter type you are using:


### Lowpass filter

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| cutoff     | lpf       | cutoff frequency of the lowpass filter |
| resonance  | lpq       | resonance of the lowpass filter |

${makeExample(
    "Filtering a bass",
    `beat(.5) :: sound('jvbass').lpf([250,1000,8000].beat()).out()`,
    true
  )}

### Highpass filter

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| hcutoff     | hpf       | cutoff frequency of the highpass filter |
| hresonance  | hpq       | resonance of the highpass filter |

${makeExample(
    "Filtering a noise source",
    `beat(.5) :: sound('gtr').hpf([250,1000, 2000, 3000, 4000].beat()).end(0.5).out()`,
    true
  )}

### Bandpass filter

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| bandf      | bpf       | cutoff frequency of the bandpass filter |
| bandq      | bpq       | resonance of the bandpass filter |

${makeExample(
    "Sweeping the filter on the same guitar sample",
    `beat(.5) :: sound('gtr').bandf(100 + usine(1/8) * 4000).end(0.5).out()`,
    true
  )}

## Filter order (type)

You can also use the <ic>ftype</ic> method to change the filter type (order). There are two types by default, <ic>12db</ic> for a gentle slope or <ic>24db</ic> for a really steep filtering slope. The <ic>24db</ic> type is particularly useful for substractive synthesis if you are trying to emulate some of the Moog or Prophet sounds:

- <ic>ftype(type: string)</ic>: sets the filter type (order), either <ic>12db</ic> or <ic>24db</ic>.

${makeExample(
    "Filtering a bass",
    `beat(.5) :: sound('jvbass').ftype(['12db', '24db'].beat(4)).lpf([250,1000,8000].beat()).out()`,
    true
  )}

I also encourage you to study these simple examples to get more familiar with the construction of basic substractive synthesizers:

${makeExample(
    "Simple synthesizer voice with filter",
    `
beat(.5) && snd('sawtooth')
  .cutoff([2000,500].pick() + usine(.5) * 4000)
  .resonance(0.9).freq([100,150].pick())
  .out()
	`,
    true
  )}

${makeExample(
    "Blessed by the square wave",
    `
beat(4) :: [100,101].forEach((freq) => sound('square').freq(freq).sustain(0.1).out())
beat(.5) :: [100,101].forEach((freq) => sound('square').freq(freq*2).sustain(0.01).out())
beat([.5, .75, 2].beat()) :: [100,101].forEach((freq) => sound('square')
  .freq(freq*4 + usquare(2) * 200).sustain(0.125).out())
beat(.25) :: sound('square').freq(100*[1,2,4,8].beat()).sustain(0.1).out()`,
    false
  )}

${makeExample(
    "Ghost carillon (move your mouse!)",
    `
beat(1/8)::sound('sine')
  .velocity(rand(0.0, 1.0))
  .delay(0.75).delayt(.5)
  .sustain(0.4)
	.cutoff(2000)
  .freq(mouseX())
	.gain(0.25)
  .out()`,
    false
  )}

## Filter envelopes

The examples we have studied so far are static. They filter the sound around a fixed cutoff frequency. To make the sound more interesting, you can use the ADSR filter envelopes to shape the filter cutoff frequency over time. You will always find amplitude and filter envelopes on most commercial synthesizers. This is done using the following methods:

### Lowpass envelope

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| lpenv      | lpe       | lowpass frequency modulation amount (negative or positive) |
| lpattack   | lpa       | attack of the lowpass filter    |
| lpdecay    | lpd       | decay of the lowpass filter     |
| lpsustain  | lps       | sustain of the lowpass filter   |
| lprelease  | lpr       | release of the lowpass filter   |
| lpadsr     |           | (**takes five arguments**) set all the parameters  |


${makeExample(
    "Filtering a sawtooth wave dynamically",
    `beat(.5) :: sound('sawtooth').note([48,60].beat())
  .cutoff(5000).lpa([0.05, 0.25, 0.5].beat(2))
  .lpenv(-8).lpq(10).out()`,
    true
  )}

### Highpass envelope

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| hpenv      | hpe       | highpass frequency modulation amount (negative or positive) |
| hpattack   | hpa       | attack of the highpass filter    |
| hpdecay    | hpd       | decay of the highpass filter     |
| hpsustain  | hps       | sustain of the highpass filter   |
| hprelease  | hpr       | release of the highpass filter   |
| hpadsr     |           | (**takes five arguments**) set all the parameters  |


${makeExample(
    "Let's use another filter using the same example",
    `beat(.5) :: sound('sawtooth').note([48,60].beat())
  .hcutoff(1000).hpa([0.05, 0.25, 0.5].beat(2))
  .hpenv(8).hpq(10).out()`,
    true
  )}

### Bandpass envelope

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| bpenv      | bpe       | bandpass frequency modulation amount (negative or positive) |
| bpattack   | bpa       | attack of the bandpass filter    |
| bpdecay    | bpd       | decay of the bandpass filter     |
| bpsustain  | bps       | sustain of the bandpass filter   |
| bprelease  | bpr       | release of the bandpass filter   |
| bpadsr     |           | (**takes five arguments**) set all the parameters  |


${makeExample(
    "And the bandpass filter, just for fun",
    `beat(.5) :: sound('sawtooth').note([48,60].beat())
  .bandf([500,1000,2000].beat(2))
  .bpa([0.25, 0.125, 0.5].beat(2) * 4)
  .bpenv(-4).release(2).out()
  `,
    true
  )}


## Wavetable synthesis

Topos can also do wavetable synthesis. Wavetable synthesis allows you to use any sound file as a source to build an oscillator. By default, Topos comes with more than 1000 waveforms thanks to the awesome [AKWF](https://www.adventurekid.se/akrt/waveforms/adventure-kid-waveforms/) pack made by Kristoffer Ekstrand. Any sample name that contains <ic>wt_</ic> as a prefix will be interpreted by the sampler as a wavetable and thus as an oscillator. See for yourself:

${makeExample(
    "Acidity test",
    `
beat(.25) :: sound('wt_symetric:8').note([50,55,57,60].beat(.25) - [12,0]
  .pick()).ftype('12db').adsr(0.05/4, 1/16, 0.25/4, 0)
  .cutoff(1500 + usine(1/8) * 5000).lpadsr(16, 0.2, 0.2, 0.125/2, 0)
  .room(0.9).size(0.9).resonance(20).gain(0.3).out()
beat(1) :: sound('kick').n(4).out()
beat(2) :: sound('snare').out()
beat(.5) :: sound('hh').out()`,
    true
  )}
	

Let's explore the galaxy of possible waveforms. It can be hard to explore them all, there is a **lot** of them:

${makeExample(
    "Let's explore some wavetables",
    `
// Exploring a vast galaxy of waveforms
let collection = [
  'wt_sinharm', 'wt_linear', 'wt_bw_sawrounded',
  'wt_eorgan', 'wt_theremin', 'wt_overtone',
  'wt_fmsynth', 'wt_bitreduced', 'wt_bw_squrounded'];
beat(2) :: v('selec', irand(1, 100))
beat(2) :: v('swave', collection.pick())
beat(0.5) :: sound(v('swave')).n(v('selec')).out()
`,
    true
  )}

You can work with them just like with any other waveform. Having so many of them makes them also very useful for generating sound effects, percussive, sounds, etc...
	
# Frequency Modulation Synthesis (FM)
	
Another really useful technique to know about is FM synthesis, FM standing for _frequency modulation_. Our basic waveforms can take some additional parameters to be transformed into a two operators FM synthesizer (with _carrier_ and _modulator_). FM Synthesis is a very complex and fascinating topic. There are a lot of things you can design using this technique but keep in mind this advice: **simple ratios will yield stable and harmonic sounds, complex ratios will generate noises, percussions and gritty sounds**.
	
- <ic>fmi</ic> (_frequency modulation index_): a floating point value between <ic>1</ic> and <ic>n</ic>.
- <ic>fmh</ic> (_frequency modulation harmonic ratio_): a floating point value between <ic>1</ic> and <ic>n</ic>.
- <ic>fmwave</ic> (_frequency modulation waveform_): a waveform name (_sine_, _triangle_, _sawtooth_ or _pulse_).

There is also an additional parameter, <ic>fm</ic> that combines <ic>fmi</ic> and <ic>fmh</ic> using strings: <ic>fm('2:4')</ic>. Think of it as a static shortcut for getting some timbres more quickly.

${makeExample(
    "80s nostalgia",
    `
beat([.5, 1].beat(8)) && snd('triangle').adsr(0.02, 0.5, 0.5, 0.25)
  .fmi(2).fmh(1.5).note([60,55, 60, 63].beat() - 12)
  .pan(noise()).out()
beat(.25) && snd('triangle').adsr(0.02, 0.1, 0.1, 0.1)
  .fmi([2,4].beat(4)).fmh(1.5)
  .pan(noise()).note([60,55, 60, 63].beat() + [0, 7].pick()).out()
beat(2) :: sound('cp').room(1).sz(1).out()
	`,
    true
  )}

${makeExample(
    "Giving some love to ugly inharmonic sounds",
    `
beat([.5, .25].bar()) :: sound('sine').fm('2.2183:3.18293').sustain(0.05).out()
beat([4].bar()) :: sound('sine').fm('5.2183:4.5').sustain(0.05).out()
beat(.5) :: sound('sine')
  .fmh([1, 1.75].beat())
  .fmi($(1) % 30).orbit(2).room(0.5).out()`,
    true
  )}

${makeExample(
    "Peace and serenity through FM synthesis",
    `
beat(0.25) :: sound('sine')
  .note([60, 67, 70, 72, 77].beat() - [0,12].bar())
  .attack(0.2).release(0.5).gain(0.25)
  .room(0.9).size(0.8).sustain(0.5)
  .fmi(Math.floor(usine(.25) * 10))
  .cutoff(1500).delay(0.5).delayt(0.125)
  .delayfb(0.8).fmh(Math.floor(usine(.5) * 4))
  .out()`,
    true
  )}

**Note:** you can also set the _modulation index_ and the _harmonic ratio_ with the <ic>fm</ic> argument. You will have to feed both as a string: <ic>fm('2:4')</ic>. If you only feed one number, only the _modulation index_ will be updated.

There is also a more advanced set of parameters you can use to control the envelope of the modulator. These parameters are:
- <ic>fmattack</ic> / <ic>fmatk</ic>: attack time of the modulator envelope.
- <ic>fmdecay</ic> / <ic>fmdec</ic>: decay time of the modulator envelope.
- <ic>fmsustain</ic> / <ic>fmsus</ic>: sustain time of the modulator envelope.
- <ic>fmrelease</ic> / <ic>fmrel</ic>: release time of the modulator envelope.

${makeExample(
    "FM Synthesis with envelope control",
    `
beat(.5) :: sound('sine')
  .note([50,53,55,57].beat(.5) - 12)
  .fmi(0.5 + usine(.25) * 1.5)
  .fmh([2,4].beat(.125))
  .fmwave('triangle')
  .fmsus(0).fmdec(0.2).out()
  `,
    true
  )}

## ZzFX

[ZzFX](https://github.com/KilledByAPixel/ZzFX) is a _Zuper Zmall Zound Zynth_. It was created by Frank Force (_aka_ KilledByAPixel) to generate small sound effects for games. It is a very simple synthesizer that can generate a wide range of sounds. It is based on a single oscillator with a simple envelope. ZzFX is very useful for generating percussive sounds and short sound effects. It is also very useful for generating chiptune sounds. You can use it in Topos just like the regular basic synthesizer.

ZZfX can be triggered by picking a default ZZfX waveform in the following list: <ic>z_sine</ic>, <ic>z_triangle</ic>, <ic>z_sawtooth</ic>, <ic>z_tan</ic>, <ic>z_noise</ic>.

${makeExample(
    "Picking a waveform",
    `
beat(.5) :: sound(['z_sine', 'z_triangle', 'z_sawtooth', 'z_tan', 'z_noise'].beat()).out()
`,
    true
  )}
${makeExample(
    "Minimalist chiptune",
    `
beat(.5) :: sound('z_triangle')
  .note([60, 67, 72, 63, 65, 70].beat(.5))
  .zrand(0).curve([1,2,3,4].beat(1))
  .slide(0.01).tremolo(12)
  .noise([0,0.5].beat())
  .decay(0.3).sustain(0)
  .room(0.5).size(0.9)
  .pitchJumpTime(0.01).out() 
`,
    true
  )}

It comes with a set of parameters that can be used to tweak the sound. Don't underestimate this synth! It is very powerful for generating anything ranging from chaotic noise sources to lush pads:

| Method   | Alias | Description                                                |
|----------|-------|------------------------------------------------------------|
|<ic>zrand</ic>| | randomisation factor.|
|<ic>attack</ic>|<ic>atk</ic>| attack time of the envelope.|
|<ic>decay</ic>|<ic>dec</ic>| decay time of the envelope.|
|<ic>sustain</ic>|<ic>sus</ic>| sustain time of the envelope.|
|<ic>release</ic>|<ic>rel</ic>| release time of the envelope.|
|<ic>volume</ic>|<ic>vol</ic>| overall volume |
|<ic>frequency</ic>|freq| sound frequency, also supports <ic>note</ic>.
|<ic>curve</ic>| | Oscillator waveshaping (0-3) |
|<ic>slide</ic>|<ic>sld</ic>| Pitch slide |
|<ic>deltaSlide</ic>|<ic>dslide</ic>| Other pitch slide parameter |
|<ic>pitchJump</ic>|<ic>pj</ic>| Pitch change after pitchJumpTime |
|<ic>pitchJumpTime</ic>|<ic>pjt</ic>| Applies pitchJump after _n_ |
|<ic>noise</ic>| | adds noise|
|<ic>zcrush</ic>| | Bitcrushing |
|<ic>zdelay</ic>| | Weird tiny delay |
|<ic>tremolo</ic>| | Amplitude tremolo (can be loud) |
|<ic>zmod</ic>|| frequency modulation speed.|
|<ic>duration</ic>|| Total sound duration (overrides envelope) |

${makeExample(
    "Chaotic Noise source",
    `
beat(.25) :: sound('z_tan')
  .note(40).noise(rand(0.0, 1.0))
  .pitchJump(84).pitchJumpTime(rand(0.0, 1.0))
  .zcrush([0,1,2,3,4].beat())
  .zmod(rand(0.0, 1.0))
  .cutoff(irand(2000,5000))
  .sustain(0).decay([0.2, 0.1].pick())
  .out() 
`,
    true
  )}
${makeExample(
    "What is happening to me?",
    `
beat(1) :: snd('zzfx').zzfx([
  [4.77,,25,,.15,.2,3,.21,,2.4,,,,,,,.23,.35],
  [1.12,,97,.11,.16,.01,4,.77,,,30,.17,,,-1.9,,.01,.67,.2]
  ].beat()).out()
`,
    false
  )}
${makeExample(
    "Les voitures dans le futur",
    `
beat(1) :: sound(['z_triangle', 'z_sine'].pick())
  .note([60,63,72,75].pick()).tremolo(16)
  .zmod([0, 1/2, 1/8].div(2).pick())
  .attack(0.5).release(0.5).sustain(2).delay(0.8)
  .room(0.9).size(0.9)
  .delayt(0.75).delayfb(0.5).out()
`,
    false
  )}

Note that you can also design sounds [on this website](https://killedbyapixel.github.io/ZzFX/) and copy the generated code in Topos. To do so, please use the <ic>zzfx</ic> method with the generated array:
${makeExample(
    "Designing a sound on the ZzFX website",
    `
 
beat(2) :: sound('zzfx').zzfx([3.62,,452,.16,.1,.21,,2.5,,,403,.05,.29,,,,.17,.34,.22,.68]).out()
`,
    true
  )}

# Speech synthesis

Topos can also speak using the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). There are two ways to use speech synthesis:

- <ic>speak(text: string, lang: string, voice: number, rate: number, pitch: number, volume: number)</ic>
  - <ic>text</ic>: the text you would like to synthesize (_e.g_ <ic>"Wow, Topos can speak!"</ic>).
  - <ic>lang</ic>: language code, for example <ic>en</ic> for English, <ic>fr</ic> for French or with the country code for example British English <ic>en-GB</ic>. See supported values from the [list](https://cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages).
  - <ic>voice</ic>: voice index, for example <ic>0</ic> for the first voice, <ic>1</ic> for the second voice, etc.
  - <ic>rate(number)</ic>: speaking rate, from <ic>0.0</ic> to <ic>10</ic>.
  - <ic>pitch(number)</ic>: speaking pitch, from <ic>0.0</ic> to <ic>2</ic>.
  - <ic>volume(number)</ic>: speaking volume, from <ic>0.0</ic> to <ic>1.0</ic>.

${makeExample(
    "Hello world!",
    `
beat(4) :: speak("Hello world!")
  `,
    true
  )}

${makeExample(
    "Let's hear people talking about Topos",
    `
beat(2) :: speak("Topos!","fr",irand(0,5))
  `,
    true
  )}


You can also use speech by chaining methods to a string:

${makeExample(
    "Foobaba is the real deal",
    `
  onbeat(4) :: "Foobaba".voice(irand(0,10)).speak()
  `,
    true
  )}

${makeExample(
    "Building string and chaining",
    `
  const subject = ["coder","user","loser"].pick()
  const verb = ["is", "was", "isnt"].pick()
  const object = ["happy","sad","tired"].pick()
  const sentence = subject+" "+verb+" "+" "+object
    
  beat(6) :: sentence.pitch(0).rate(0).voice([0,2].pick()).speak()
  `,
    true
  )}

${makeExample(
    "Live coded poetry with array and string chaining",
    `
  bpm(70)

  const croissant = [
    "Volant", "Arc-en-ciel", "Chocolat", "Dansant", 
    "Nuage", "Tournant", "Galaxie", "Chatoyant", 
    "Flamboyant", "Cosmique", "Croissant!"
  ];
  
  onbeat(4) :: croissant.bar()
      .lang("fr")
      .volume(rand(0.2,2.0))
      .rate(rand(.4,.6))
      .speak();
  `,
    true
  )}
`;
};
