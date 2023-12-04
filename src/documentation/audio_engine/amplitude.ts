import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const amplitude = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `# Amplitude

Controlling the volume is probably the most important concept you need to know about. Let's learn the basics.

## Volume / Gain
	
| Method   | Alias | Description                                                                        |
|----------|-------|------------------------------------------------------------------------------------|
| <ic>gain</ic>     |       | Volume of the synth/sample (exponential).                                           |
| <ic>velocity</ic> | vel   | Velocity (amplitude) from <ic>0</ic> to <ic>1</ic>. Multipled with gain.           |
| <ic>dbgain</ic>   | db    | Attenuation in dB from <ic>-inf</ic> to <ic>+10</ic> (acts as a sound mixer fader).|
	
${makeExample(
  "Velocity manipulated by a counter",
  `
beat(.5)::snd('cp').vel($(1)%10 / 10).out()`,
  true,
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
beat(.25)::smooth(sound('sawtooth')
  .note([50,57,55,60].beat(1))).out();
beat(.25)::smooth(sound('sawtooth')
  .note([50,57,55,60].add(12).beat(1.5))).out();
	`,
  true,
)};
	
Sometimes, using a full ADSR envelope is a bit overkill. There are other simpler controls to manipulate the envelope like the <ic>.ad</ic> method:


${makeExample(
  "Replacing .adsr by .ad",
  `
let smooth = (sound) => {
  return sound.cutoff(r(100,500))
       .lpadsr(usaw(1/8) * 8, 0.05, .125, 0, 0)
       .gain(r(0.25, 0.4)).ad(0, .25)
       .room(0.9).size(2).o(2).vib(r(2,8)).vibmod(0.125)
}
beat(.25)::smooth(sound('sawtooth')
  .note([50,57,55,60].beat(1))).out();
beat(.25)::smooth(sound('sawtooth')
  .note([50,57,55,60].add(12).beat(1.5))).out();
	`,
  true,
)};

`;
};
