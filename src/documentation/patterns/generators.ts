import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const generators = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Generator functions

JavaScript [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) are powerful functions for generating value sequences. They can be used to generate melodies, rhythms or control parameters.

In Topos generator functions should be called using the <ic>cache(key, function)</ic> function to store the current state of the generator. This function takes two arguments: the name for the cache and the generator instance. 

Once the generator is cached the values will be returned from the named cache even if the generator function is modified. To clear the current cache and to re-evaluate the modified generator use the **Shift+Ctrl+Backspace** shortcut. Alternatively you can cache the modified generator using a different name.

The resulted values can be played using either <ic>pitch()</ic> or <ic>freq()</ic> or as Ziffers patterns. When playing the values using <ic>pitch()</ic> different scales and chained methods can be used to alter the result, for example <ic>mod(value: number)</ic> to limit the integer range or <ic>scale(name: string)</ic> etc. to change the resulting note.

${makeExample(
"Simple looping generator function",
`
function* simple() {
    let x = 0;
    while (x < 12) {
        yield x+x;
        x+=1;
    }
}

beat(.25) && sound("triangle").pitch(cache("simple",simple())).scale("minor").out()
`,
true,
)};

${makeExample(
"Infinite frequency generator",
`
    function* poly(x=0) {
     while (true) {
        const s = Math.tan(x/10)+Math.sin(x/20);
        yield 2 * Math.pow(s, 3) - 6 * Math.pow(s, 2) + 5 * s + 200;
        x++;
     }  
    }
    
    beat(.125) && sound("triangle").freq(cache("mathyshit",poly())).out()
`,
true,
)};

${makeExample(
  "Truly scale free chaos inspired by Lorentz attractor",
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

## OEIS integer sequences

To find some inspiration or to enter into a void one can visit [OEIS](https://oeis.org/) to find some interesting integer sequences. Many of the sequences are also included in Topos from [JISG](https://github.com/acerix/jisg/tree/main/src/oeis) (Javascript Integer Sequence Generators) project.

One of these implemented generators is the Inventory sequence [A342585](https://github.com/acerix/jisg/blob/main/src/oeis/A342585.ts) made famous by [Neil Sloane](https://www.youtube.com/watch?v=rBU9E-ZOZAI).

Those OEIS sequences implemented by the **JISG** can be referenced directly with the identifiers in the cache function. For example:

${makeExample(
    "Inventory sequence",
    `
    rhythm(0.5,[8,7,5,6].bar(4),9) :: sound("triangle")
    .pitch(cache("Inventory",A342585))
    .mod(11).scale("minor")
    .adsr(.25,.05,.5,.5)
    .room(2.0).size(0.5)
    .gain(1).out()
    `,
    true,
    )};

## Using generators with Ziffers

Alternatively generators can be used with Ziffers to generate longer patterns. In this case the generator function should be passed as an argument to the ziffers function. Ziffers patterns are cached separately so there is no need for using **cache()** function. Ziffers expects values from the generators to be integers or strings in ziffers syntax.

${makeExample(
    "Ziffers patterns using a generator functions",
`
function* poly(x) {
    while (true) {
      yield 64 * Math.pow(x, 6) - 480 * Math.pow(x, 4) + 720 * Math.pow(x, 2);
      x++;
    }
  }
  
z0(poly(1)).noteLength(0.5).semitones(2,2,3,2,2,2).sound("sine").out()
z1(poly(8)).noteLength(0.25).semitones(2,1,2,1,2,2).sound("sine").out()
z2(poly(-3)).noteLength(1.0).semitones(2,2,2,1,3,2).sound("sine").out()
`,
    true,
  )};


`
};
