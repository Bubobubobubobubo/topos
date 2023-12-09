import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const ziffers_algorithmic = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Algorithmic operations

  Ziffers provides shorthands for **many** numeric and algorithimic operations such as evaluating random numbers and creating sequences using list operations:
  
  * **List operations:** Cartesian operation (_e.g._ <ic>(3 2 1)+(2 5)</ic>) using the <ic>+</ic> operator. All the arithmetic operators are supported.
  
  ${makeExample(
    "Element-wise operations for melodic generation",
    `
  z1("1/8 _ 0 (0 1 3)+(1 2) 0 (2 3 5)-(1 2)").sound('sine')
    .scale('pentatonic').fmi([0.25,0.5].beat(2)).fmh([2,4].beat(2))
    .room(0.9).size(0.9).sustain(0.1).delay(0.5).delay(0.125)
    .delayfb(0.25).out();
  `,
    true,
  )}

  ${makeExample(
    "List operations",
    `
  z1('q (0 3 1 5)+(2 5) e (0 5 2)*(2 3) (0 5 2)>>(2 3) (0 5 2)%(2 3)').sound('sine')
  .scale("Bebop major")
  .out()
  `,
    true,
  )}
  
  * **Random numbers:** <ic>(4,6)</ic> Random number between 4 and 6
  
  ${makeExample(
    "Random numbers, true computer music at last!",
    `
  z1("s _ (0,8) 0 0 (0,5) 0 0").sound('sine')
    .adsr(0, .1, 0, 0).scale('minor')
    .fmdec(0.25).fmi(2).fmh([0.5, 0.25].beat(2))
    .room(0.9).size(0.5).sustain(0.1) .delay(0.5)
    .delay(0.125).delayfb(0.25).out();
  beat(.5) :: snd(['kick', 'hat'].beat(.5)).out()
  `,
    true,
  )}

  ${makeExample(
    "Random numbers",
    `
  z1('q 0 (2,4) 4 (5,9)').sound('sine')
  .scale("Bebop minor")
  .out()
  `,
    true,
  )}
  
  * **Variables:** <ic>A=(0 2 3 4)</ic> Assign a list to a variable

`;
};
