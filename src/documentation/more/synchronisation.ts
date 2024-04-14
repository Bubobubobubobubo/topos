import { type Editor } from "../../main";
import { makeExampleFactory } from "../Documentation";

export const synchronisation = (app: Editor): string => {
  // @ts-ignore
  let makeExample = makeExampleFactory(app);
  return `
# Synchronisation

Synchronisation is currently a work in progress. If you are a programmer and if you know something about the topic, please help us to make it work! In the meantime, Topos can already be synchronised but it takes some getting used to.

## MIDI clock Synchronisation

Topos can be controlled from external hadware or software using MIDI clock messages. The options to do so are located in the settings menu. You will need to connect an external MIDI controller or to ready virtual MIDI port.

1) Connect a MIDI input as MIDI Clock in the settings panel. 
2) Topos will listen to incoming Clock messages and will use them to estimate the current BPM. 
3) Topos will also listen to <ic>Start</ic>, <ic>Stop</ic> and <ic>Continue</ic> messages.

Different MIDI devices can send clock at different resolution, define Clock PPQN in settings to match the resolution of your device. 

## Clock nudge

In the settings menu, you will find two ways to _nudge_ the clock, allowing you to finetune synchronisation:
- **clock nudge**: nudge the event clock backwards or forward in time (in milliseconds).
- **audio nudge**: nudge the **synths** and **sampler** forward (in milliseconds).
  - note that you need to give some time to the system (2ms+) in order to give it enough time to load and play sounds.

  `;
};
