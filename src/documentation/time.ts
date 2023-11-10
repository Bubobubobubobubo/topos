import { makeExampleFactory } from "../Documentation";
import { type Editor } from "../main";
import times from "./times.svg";

export const time = (application: Editor): string => {
  //@ts-ignore
  const makeExample = makeExampleFactory(application);
  return `
# What is time?

There are two ways to think _intuitively_ about time:

- **linear time:** the _arrow_ of time, minutes/days/years passing. Time moving forward. In musical terms, a _piece_, _song_.
- **cyclical time:** seasons, cycles, etc. In musical terms, repetitions, _beats_, _sections_, etc.

A musician's job is to interweave cyclical and linear time, repetition and continuity.

<object type="image/svg+xml" data=${times} style="width: 100%; height: auto; background-color: transparent"></object>


# Time and programming

When you program on a computer, you can adopt a similar mindset to think about time, where time is sometimes cyclic, sometimes linear:
- **linear:** _runtime_, _process time_, _wall clock time_, etc...
- **cyclic:** _recursion_, repeating function, routine, etc.

# Time and Topos

By making music with **Topos**, you will mingle repetitive structures of different scale and deal with composition as well:
- **linear time:** using _bars_, _beats_, _pulses_, transport (_start_/_pause_/_stop_), etc...
- **cyclical time:** euclidean rhythms, beats, pulsed time, etc...


`;
};
