import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../Documentation";

export const ziffers_syncing = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Synchronization

Ziffers patterns can be synced to any event by using **cue**, **sync**, **wait** and **listen** methods.

## Sync with cue

The <ic>cue(name: string)</ic> methods can be used to send cue messages for ziffers patterns. The <ic>wait(name: string)</ic> method is used to wait for the cue message to be received before starting the next cycle.

${makeExample(
    "Sending cue from event and wait",
    `
beat(4.0) :: sound("bd").cue("foo").out()
z1("e 0 3 2 1 2 1").wait("foo").sound("sine").out()
`,
    true,
  )}

The <ic>sync(name: string)</ic> method is used to sync the ziffers pattern to the cue message. 

    ${makeExample(
    "Delayed start using individual cue",
    `
        register('christmas', n=>n.room(0.25).size(2).speed([0.5, 0.25, 0.125])
            .delay(0.5).delayt(1/3).delayfb(0.5).bpf(200+usine(1/3)*500).out())
        onbar(1) :: cue("bar")
        onbar(2) :: cue('baz')
        z1("<0.25 0.125> 0 4 2 -2").sync("bar").sound("ST40:25").christmas()
        z2("<0.25 0.125> 0 6 4 -4").sync("baz").sound("ST40:25").christmas()
        `,
    true,
  )}

The <ic>listen(name: string)</ic> method can be used to listen for the cue messages and play one event from the pattern for every cue.

    ${makeExample(
    "Delayed start using individual cue",
    `
        beat(1.0) :: cue("boom")

        z1("bd <hh ho>").listen("boom")
          .sound().out()        
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


