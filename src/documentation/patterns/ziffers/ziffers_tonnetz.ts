import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const ziffers_tonnetz = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Tonnetz
	
* TBD

${makeExample(
  "Triad transformations",
  `
z1('i').tonnetz("p l r").sound('wt_stereo')
  .adsr(0, .1, 0, 0).out()`,
  true,
)}

`;
};
