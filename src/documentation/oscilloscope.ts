import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const oscilloscope = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `# Oscilloscope

You can turn on the oscilloscope to generate interesting visuals or to inspect audio. Use the <ic>scope()</ic> function to turn it on and off. The oscilloscope is off by default.

${makeExample(
  "Oscilloscope configuration",
  `
scope({
    enabled: true, // off by default
    color: "#fdba74", // any valid CSS color or "random"
    thickness: 4, // stroke thickness
    offsetY: 0, // Horizontal offset
    offsetX: 0, // Vertical offset
    fftSize: 256, // multiples of 128
    orientation: "horizontal", // "vertical" or "horizontal"
    mode: "scope" | "3D" | "freqscope", // scope mode
    size: 1, // size of the oscilloscope
    refresh: 1 // refresh rate (in pulses)
})
  `,
  true
)}

${makeExample(
  "Demo with multiple scope mode",
  `
rhythm(.5, [4,5].dur(4*3, 4*1), 8)::sound('fhardkick').out()
beat(0.25)::sound('square').freq([
  [250, 250/2, 250/4].pick(),
  [250, 250/2, 250/4].beat() / 2 * 4,
  ])
  .fmi([1,2,3,4].bar()).fmh(fill()? 0 : 4)
  .lpf(100+usine(1/4)*1200).lpad(4, 0, .5)
  .room(0.5).size(8).vib(0.5).vibmod(0.125)
  .ad(0, .125).out()
beat(2)::sound('fsoftsnare').shape(0.5).out()
scope({enabled: true, thickness: 8,
  mode: ['freqscope', 'scope', '3D'].beat(),
  color: ['purple', 'green', 'random'].beat(), 
  size: 0.5, fftSize: 2048}) 
    `,
  true
)}

Note that these values can be patterned as well! You can transform the oscilloscope into its own light show if you want. The picture is not stable anyway so you won't have much use of it for precision work :)

  `;
};
