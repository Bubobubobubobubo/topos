import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const ziffers_syncing = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Synchronization

Ziffers patterns can be synced to any event using <ic>cue(name: string))</ic> and <ic>wait(name: string)</ic> or by using <ic>sync(name: Function)</ic> and <ic>wait(name: Function)</ic> methods from the ziffers patterns. 

## Sync with cue

The <ic>cue(name: string)</ic> methods can be used to send cue messages for ziffers patterns. The <ic>wait(name: string)</ic> method is used to wait for the cue message to start the pattern.

    ${makeExample(
        "Sending cue from event",
        `
        beat(4.0) :: sound("bd").cue("foo").out();
        z1("q 0 3 e 2 1 2 1").wait("foo").sound("sine").out();
        `,
        true,
    )}

    ${makeExample(
        "Delayed start using individual cue",
        `
        onbar(3) :: cue("bar")
        z1("0 4 2 -2").wait("bar")
          .sound("ST40:3").stretch([2,1,3,.1].beat(0.5)).out();
        `,
        true,
    )}

## Sync with beat

Patterns can also be synced using beat and setting the note length of events to zero using **z** duration character or <ic>noteLength(number)</ic> method.

${makeExample(
    "Syncing with beat",
    `
beat(.5) :: z1("<bd sn:3> hh:5").noteLength(0)
    .sound().out()
  
beat([2.0,0.5,1.5].bar(1)) :: 
    z2("z _ 0 0 <2 1>").sound("bass:5")
    .dur(0.5).out()
    `,
    true,
)}

## Automatic sync for ziffers patterns

   Numbered methods **(z0-z16)** are synced automatically to **z0** method if it exsists. Syncing can also be done manually by using either the <ic>wait</ic> method, which will always wait for the current pattern to finish before starting the next cycle, or the <ic>sync</ic> method will only wait for the synced pattern to finish on the first time.
  
  ${makeExample(
    "Automatic sync to z0",
    `
  z0('w 0 8').sound('peri').out()
  z1('e 0 4 5 9').sound('bell').out()
  `,
    true,
  )}

## Syncing patterns to each other

   Patterns can also be synced together using the <ic>sync(name: Function)</ic> method. This will sync the pattern to the start of the referenced pattern. Copy this example and first run z1 and then z2 at random position.
  
   ${makeExample(
    "Sync on first run",
    `
    z1('w __ 0 5 9 3').sound('bin').out()
    z2('q __ 4 2 e 6 3 q 6').sync(z1).sound('east').out()
  `,
    true,
  )}

## Sync with wait

   Syncing can also be done using <ic>wait(name: Function)</ic> method. This will wait for the referenced pattern to finish before starting the next cycle.
  
  ${makeExample(
    "Sync with wait",
    `
  z1('w 0 5').sound('pluck').release(0.1).sustain(0.25).out()
  z2('q 6 3').wait(z1).sound('sine').release(0.16).sustain(0.55).out()
  `,
    true,
  )}

`;
};


