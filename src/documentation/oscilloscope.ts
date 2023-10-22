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
    fftSize: 256, // multiples of 128
    orientation: "horizontal", // "vertical" or "horizontal"
    is3D: false, // 3D oscilloscope
    size: 1, // size of the oscilloscope
})
  `,
  true
)}

Note that these values can be patterned as well! You can transform the oscilloscope into its own light show if you want. The picture is not stable anyway so you won't have much use of it for precision work :)

  `;
};
