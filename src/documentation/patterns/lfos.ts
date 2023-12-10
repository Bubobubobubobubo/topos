import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const lfos = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Low Frequency Oscillators

Low Frequency Oscillators (_LFOs_) are an important piece in any digital audio workstation or synthesizer. Topos implements some basic waveforms you can play with to automatically modulate your paremeters. 
	
- <ic>sine(freq: number = 1, times: number = 1, offset: number= 0): number</ic>: returns a sinusoïdal oscillation between <ic>-1</ic> and <ic>1</ic>.
  - <ic>freq</ic> : frequency in hertz.
  - <ic>times</ic> : output value multiplier.
  - <ic>offset</ic>: linear offset.
- <ic>usine(freq: number = 1, times: number = 1, offset: number= 0): number</ic>: returns a sinusoïdal oscillation between <ic>0</ic> and <ic>1</ic>. The <ic>u</ic> stands for _unipolar_.
	
${makeExample(
  "Modulating the speed of a sample player using a sine LFO",
  `beat(.25) && snd('cp').speed(1 + usine(0.25) * 2).out()`,
  true,
)};

- <ic>triangle(freq: number = 1, times: number = 1, offset: number= 0): number</ic>: returns a triangle oscillation between <ic>-1</ic> and <ic>1</ic>.
- <ic>utriangle(freq: number = 1, times: number = 1, offset: number= 0): number</ic>: returns a triangle oscillation between <ic>0</ic> and <ic>1</ic>. The <ic>u</ic> stands for _unipolar_.

${makeExample(
  "Modulating the speed of a sample player using a triangle LFO",
  `beat(.25) && snd('cp').speed(1 + utriangle(0.25) * 2).out()`,
  true,
)}
	
- <ic>saw(freq: number = 1, times: number = 1, offset: number= 0): number</ic>: returns a sawtooth-like oscillation between <ic>-1</ic> and <ic>1</ic>.
- <ic>usaw(freq: number = 1, times: number = 1, offset: number= 0): number</ic>: returns a sawtooth-like oscillation between <ic>0</ic> and <ic>1</ic>. The <ic>u</ic> stands for _unipolar_.

${makeExample(
  "Modulating the speed of a sample player using a saw LFO",
  `beat(.25) && snd('cp').speed(1 + usaw(0.25) * 2).out()`,
  true,
)}
	
- <ic>square(freq: number = 1, times: number = 1, offset: number= 0, duty: number = .5): number</ic>: returns a square wave oscillation between <ic>-1</ic> and <ic>1</ic>. You can also control the duty cycle using the <ic>duty</ic> parameter.
- <ic>usquare(freq: number = 1, times: number = 1, offset: number= 0, duty: number = .5): number</ic>: returns a square wave oscillation between <ic>0</ic> and <ic>1</ic>. The <ic>u</ic> stands for _unipolar_. You can also control the duty cycle using the <ic>duty</ic> parameter.
	
${makeExample(
  "Modulating the speed of a sample player using a square LFO",
  `beat(.25) && snd('cp').speed(1 + usquare(0.25, 0, 0.25) * 2).out()`,
  true,
)};
	
- <ic>noise(times: number = 1)</ic>: returns a random value between -1 and 1.
	
${makeExample(
  "Modulating the speed of a sample player using noise",
  `beat(.25) && snd('cp').speed(1 + noise() * 2).out()`,
  true,
)};

`;
};
