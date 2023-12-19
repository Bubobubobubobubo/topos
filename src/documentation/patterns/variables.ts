import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const variables = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `

# Variables

By default, each script is independant from each other. The variables defined in **script 1** are not available in **script 2**, etc. Moreover, they are overriden everytime the file is evaluated. It means that you cannot store any state or share information. However, you can use global variables to make that possible.

There is a <ic>global</ic> object that you can use to store and retrieve information. It is a simple key/value store. You can store any type of data in it:
	
${makeExample(
  "Setting a global variable",
  `
// This is script n°3
global.my_variable = 2
`,
  true,
)}

${makeExample(
  "Getting that variable back and printing!",
  `
// This is script n°4
log(global.my_variable)
`,
  true,
)}

Now your scripts can share information with each other!

## Counter and iterators

You will often need to use iterators and/or counters to index over data structures (getting a note from a list of notes, etc...). There are functions ready to be used for this. Each script also comes with its own iterator that you can access using the <ic>i</ic> variable. **Note:** the script iteration count is **not** resetted between sessions. It will continue to increase the more you play, even if you just picked up an old project.
	
- <ic>counter(name: number | string, limit?: number, step?: number)</ic>: reads the value of the counter <ic>name</ic>. You can also call this function using the dollar symbol: <ic>$</ic>.
	- <ic>limit?</ic>: counter upper limit before wrapping up.
	- <ic>step?</ic>: incrementor. If step is <ic>2</ic>, the iterator will go: <ic>0, 2, 4, 6</ic>, etc...
	
- <ic>drunk(n?: number)</ic>: returns the value of the internal drunk walk counter. This iterator will sometimes go up, sometimes go down. It comes with companion functions that you can use to finetune its behavior.
	- <ic>drunk_max(max: number)</ic>: sets the maximum value.
	- <ic>drunk_min(min: number)</ic>: sets the minimum value.
	- <ic>drunk_wrap(wrap: boolean)</ic>: whether to wrap the drunk walk to 0 once the upper limit is reached or not.

**Note:** Counters also come with a secret syntax. They can be called with the **$** symbol!

${makeExample(
  "Iterating over a list of samples using a counter",
  `
rhythm(.25, 6, 8) :: sound('dr').n($(1)).end(.25).out()
`,
  true,
)}

${makeExample(
  "Using a more complex counter",
  `
// Limit is 20, step is 5
rhythm(.25, 6, 8) :: sound('dr').n($(1, 20, 5)).end(.25).out()
`,
  false,
)}

${makeExample(
  "Calling the drunk mechanism",
  `
// Limit is 20, step is 5
rhythm(.25, 6, 8) :: sound('dr').n(drunk()).end(.25).out()
`,
  false,
)}



`;
};
