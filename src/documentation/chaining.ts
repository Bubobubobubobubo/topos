import { makeExampleFactory, key_shortcut } from "../Documentation";
import { type Editor } from "../main";

export const chaining = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Chaining

Method chaining can be used to manipulate objects returned by both <ic>sound()</ic> and <ic>midi()</ic> functions. Think of it as another way to create interesting musical patterns! Method chaining, unlike patterns, is acting on the sound chain level and is not really dependant on time. You can combine chaining and good old patterns if you want!

Probability functions can be chained to apply different modifiers randomly. Probability functions are named as global probability functions (see **Probabilities** in the **Function** page) but take a function as an input.

## Chaining sound events

All functions from the sound object can be used to modify the event, for example:
${makeExample(
  "Modifying sound events with probabilities",
  `
mod(.5) && sound('numbers')
  .odds(1/4, s => s.speed(irand(1,4)))
  .rarely(s => s.crush(3))
  .out()
`,
  true
)}
${makeExample(
  "Chance to change to a different note",
  `
rhythm(.5, 3, 8) && sound('pluck').note(38).out()
mod(.5) && sound('pluck').note(60)
  .often(s => s.note(57))
  .sometimes(s => s.note(64).n(irand(1,4)))
  .note(62)
  .out()`,
  false
)}

## Chaining midi events

All the functions from the MIDI object can be used to modify the event with probabilities. Values can also be incremented using <ic>+=</ic> notation.

${makeExample(
  "Modifying midi events with probabilities",
  `mod(.5) && midi(60).channel(1)
  .odds(1/4, n => n.channel(2))
  .often(n => n.note+=4)
  .sometimes(s => s.velocity(irand(50,100)))
  .out()`,
  true
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
  .octave([0, 1].div(2) - 1)
  .scale('pentatonic').sound('pluck')
  .odds(1/4, n => n.delay(0.5).delayt(0.25))
  .odds(1/2, n => n.speed(0.5))
  .room(0.5).size(0.5).out()
`,
  true
)};
`;
};
