import { makeExampleFactory } from "../Documentation";
import { type Editor } from "../main";

export const chaining = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Chaining

You might have noticed that **Topos** is using chains a lot. Chains are a very common pattern when programming, especially when you deal with objets that can be composed from many changing properties. Method chaining is used by many objects but mostly by <ic>sound()</ic> and <ic>midi()</ic>. It looks like this:

${makeExample(
  "Method chaining",
  `
beat(1)::sound('bd').speed(2).lpf(500).out()
`,
  true,
)}

Method chains become fun if you add just a little bit of complexity to them. You can start to add conditions, start to register complex chains to be re-used later on, etc.. We will not remind you how to write basic chains. The whole documentation is full of examples! Let's explore more delicate patterns!

## Registering a chain

You can use the <ic>register(...args)</ic> function to... register a chain that you would like to re-use later on.

${makeExample(
  "Re-creating a classic Tidal function",
  `
// Playing with extreme panning and playback rate
register('juxrev', n=>n.pan([0, 1]).speed([1, -1]))

// Using our new abstraction
beat(1)::sound('fhh').juxrev().out()
`,
  true,
)}

This is an extremely powerful construct. For example, you can use it to create synthesizer presets and reuse them later on. You can also define parameters for your registered functions. For example:

${makeExample(
  "Re-creating a classic Tidal function",
  `
// Registering a specific synth architecture
register('sub', (n,x=4,y=80)=>n.ad(0, .25)
  .fmi(x).pan([0, 1])
  .delay(0.5).delayt(1/8).delayfb(1/3)
  .lpf(25+usine(1/3)*y)
  .lpad(4, 0, .25)
)

// Using it with an arpeggio
rhythm(.25, [6, 8].beat(), 12)::sound('sine')
  .note([0, 2, 4, 5].scale('minor', 50).beat(0.5))
  .sub(8).out()`,
  true,
)}


## Conditional chaining

There are cases when you don't always want to apply one or many elements that are composing your chain. You can use conditionals to set a specific probability for the chaining to happen.

All functions from the sound object can be used to modify the event, for example:

${makeExample(
  "Modifying sound events with probabilities",
  `
beat(.5) && sound('fhh')
  .odds(1/4, s => s.speed(irand(1,4)))
  .rarely(s => s.room(0.5).size(8).speed(0.5))
  .out()`,
  true,
)}
${makeExample(
  "Chance to play a random note",
  `
rhythm(.5, 3, 8) && sound('pluck').note(38).out()
beat(.5) && sound('pluck').note(60)
  .often(s => s.note(57))
  .sometimes(s => s.note(64).n(irand(1,4)))
  .note(62)
  .room(0.5).size(3)
  .out()`,
  false,
)}

There is a growing collection of probability and chance methods you can use:

| Function Name  | Description | Example |
|----------------|-------------|---------|
| <ic>evenbar</ic>      | If the current bar is even | <ic>.evenbar(s => s.note(58))</ic> |
| <ic>even</ic>         | If the current beat is even | <ic>.even(s => s.note(59))</ic> |
| <ic>odd</ic>          | If the current beat is odd | <ic>.odd(s => s.note(61))</ic> |
| <ic>odds</ic>         | With a given probability | <ic>.odds(0.3, s => s.note(62))</ic> |
| <ic>never</ic>        | Never transforms the event | <ic>.never(s => s.note(63))</ic> |
| <ic>almostNever</ic>  | With a 2.5% probability. | <ic>.almostNever(s => s.note(64))</ic> |
| <ic>rarely</ic>       | With a 10% probability.  | <ic>.rarely(s => s.note(65))</ic> |
| <ic>scarcely</ic>     | With a 25% probability.  | <ic>.scarcely(s => s.note(66))</ic> |
| <ic>sometimes</ic>    | With a 50% probability.  | <ic>.sometimes(s => s.note(67))</ic> |
| <ic>often</ic>        | With a 75% probability. | <ic>.often(s => s.note(68))</ic> |
| <ic>frequently</ic>   | With a 90% probability. | <ic>.frequently(s => s.note(69))</ic> |
| <ic>almostAlways</ic> | With a 98.5% probability. | <ic>.almostAlways(s => s.note(70))</ic> |
| <ic>always</ic>       | Always transforms the Event.  | <ic>.always(s => s.note(71))</ic> |



### MIDI Chaining

The conditional chaining also applies to MIDI. Values can also be incremented using <ic>+=</ic> notation.

${makeExample(
  "Modifying midi events with probabilities",
  `beat(.5) && midi(60).channel(1)
  .odds(1/4, n => n.channel(2))
  .often(n => n.note+=4)
  .sometimes(s => s.velocity(irand(50,100)))
  .out()`,
  true,
)};

## Ziffers

Ziffers patterns can be chained to <ic>sound()</ic> and <ic>midi()</ic> as well. Chaining is often used as an alternative to passing values in objects as an option, which can be super cumbersome. The available chaining methods are:
* <ic>key(key: string)</ic>: for changing key (_e.g._ <ic>"C"</ic> or <ic>"F#"</ic>)
* <ic>scale(scale: string)</ic>: for changing the current scale (_e.g._ <ic>"rocritonic"</ic> or <ic>"pentatonic"</ic>)
* <ic>octave(n: number)</ic>: for changing octave (_e.g._ <ic>0</ic> or <ic>2</ic>)

* <ic>sound()</ic>: for outputting pattern as a Sound (See **Sounds**)
* <ic>midi()</ic> - for outputting pattern as MIDI (See **MIDI**)

${makeExample(
  "Ziffer player using a sound chain and probabilities!",
  `
z1('s 0 5 7 0 3 7 0 2 7 0 1 7 0 1 6 5 4 3 2')
  .octave([0, 1].beat(2) - 1)
  .scale('pentatonic').sound('pluck')
  .odds(1/4, n => n.delay(0.5).delayt(0.25))
  .odds(1/2, n => n.speed(0.5))
  .room(0.5).size(0.5).out()
`,
  true,
)};
`;
};
