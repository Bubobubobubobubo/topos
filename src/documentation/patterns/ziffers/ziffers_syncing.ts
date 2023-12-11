import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const ziffers_syncing = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
  # Synchronization

  Ziffers numbered methods **(z0-z16)** can be used to parse and play patterns. Each method is individually cached and can be used to play multiple patterns simultaneously. By default, each Ziffers expression can have a different duration. This system is thus necessary to make everything fit together in a loop-based environment like Topos.
  
  Numbered methods are synced automatically to **z0** method if it exsists. Syncing can also be done manually by using either the <ic>wait</ic> method, which will always wait for the current pattern to finish before starting the next cycle, or the <ic>sync</ic> method will only wait for the synced pattern to finish on the first time.
  
  ${makeExample(
    "Automatic sync to z0",
    `
  z0('w 0 8').sound('peri').out()
  z1('e 0 4 5 9').sound('bell').out()
  `,
    true,
  )}
  
  ${makeExample(
    "Sync with wait",
    `
  z1('w 0 5').sound('pluck').release(0.1).sustain(0.25).out()
  z2('q 6 3').wait(z1).sound('sine').release(0.16).sustain(0.55).out()
  `,
    true,
  )}
  
  ${makeExample(
    "Sync on first run",
    `
    z1('w __ 0 5 9 3').sound('bin').out()
    z2('q __ 4 2 e 6 3 q 6').sync(z1).sound('east').out()
  `,
    true,
  )}

`;
};


