import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const generators = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Generator functions


${makeExample(
  "More complex function generating chaotic frequencies",
  `
  function* strange(x = 0.1, y = 0, z = 0, rho = 28, beta = 8 / 3, zeta = 10) {
    while (true) {
      const dx = 10 * (y - x);
      const dy = x * (rho - z) - y;
      const dz = x * y - beta * z;
  
      x += dx * 0.01;
      y += dy * 0.01;
      z += dz * 0.01;
  
      const value = 300 + 30 * (Math.sin(x) + Math.tan(y) + Math.cos(z))
      yield value;
    }
  }
  
  beat(0.25) :: sound("triangle")
    .freq(cache("stranger",strange(3,5,2)))
    .adsr(.15,.1,.1,.1)
    .log("freq").out()
  `,
  true,
)};

`;
};
