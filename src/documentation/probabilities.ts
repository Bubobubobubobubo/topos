import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const probabilities = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `

# Probabilities

There are some simple functions to play with probabilities.

- <ic>rand(min: number, max:number)</ic>: returns a random number between <ic>min</ic> and <ic>max</ic>. Shorthand _r()_.
- <ic>irand(min: number, max:number)</ic>: returns a random integer between <ic>min</ic> and <ic>max</ic>. Shorthands _ir()_ or _rI()_.

${makeExample(
    "Bleep bloop, what were you expecting?",
    `
rhythm(0.125, 10, 16) :: sound('sid').n(4).note(50 + irand(50, 62) % 8).out()
`,
    true
  )}


- <ic>prob(p: number)</ic>: return <ic>true</ic> _p_% of time, <ic>false</ic> in other cases.
- <ic>toss()</ic>: throwing a coin. Head (<ic>true</ic>) or tails (<ic>false</ic>).


${makeExample(
    "The Teletype experience!",
    `
prob(50) :: script(1);
prob(60) :: script(2);
prob(80) :: script(toss() ? script(3) : script(4))
`,
    true
  )}

- <ic>seed(val: number|string)</ic>: sets the seed of the random number generator. You can use a number or a string. The same seed will always return the same sequence of random numbers.


## Chance operators

Chance operators returning a boolean value are also available. They are super important because they also exist for another mechanism called **chaining**. Checkout the **Chaining** page to learn how to use them in different contexts!

By default chance operators will be evaluated 48 times within a beat. You can change this value by providing a number of beats as an argument. Default value is 1. Change operators can also be used to randomly apply other operators.

- <ic>odds(n: number, beats?: number)</ic>: returns true for every n (odds) (eg. 1/4 = 0.25) in given number of beats
- <ic>never(beats?: number)</ic>: returns false. Can be handy when switching between different probabilities
- <ic>almostNever(beats?: number)</ic>: returns true 0.1% of the time in given number of beats
- <ic>rarely(beats?: number)</ic>: returns true 1% of the time in given number of beats
- <ic>scarcely(beats?: number)</ic>: returns true 10% of the time in given number of beats
- <ic>sometimes(beats?: number)</ic>: returns true 50% of the time in given number of beats
- <ic>often(beats?: number)</ic>: returns true 75% of the time in given number of beats
- <ic>frequently(beats?: number)</ic>: returns true 90% of the time in given number of beats
- <ic>almostAlways(beats?: number)</ic>: returns true 99% of the time in given number of beats
- <ic>always(beats?: number)</ic>: returns true. Can be handy when switching between different probabilities
	
Examples:

${makeExample(
    "Using chance operators",
    `
  rarely() :: sound('hh').out(); // Rarely 48 times is still a lot
  rarely(4) :: sound('bd').out(); // Rarely in 4 beats is bit less
  rarely(8) :: sound('east').out(); // Rarely in 8 beats is even less
  `,
    true
  )}

${makeExample(
    "Using chance with other operators",
    `
  frequently() :: beat(1) :: sound('kick').out();
  often() :: beat(0.5) :: sound('hh').out();
  sometimes() :: onbeat(1,3) :: sound('snare').out();
  `,
    false
  )}

${makeExample(
    "Using chance with chaining",
    `
  beat(0.5) && sound("bd")
  .freq(100)
  .sometimes(s=>s.crush(2.5))
  .out()

  beat(0.5) && sound('arp').freq(100)
  .sometimes(n=>n.freq(200).delay(0.5))
  .rarely(n=>n.freq(300).delay(2.5))
  .almostNever(n=>n.freq(400))
  .out()
  `,
    false
  )}
`
}

