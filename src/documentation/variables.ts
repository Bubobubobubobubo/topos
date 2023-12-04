import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const variables = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `

# Variables

By default, each script is independant from each other. Scripts live in their own bubble and you cannot get or set variables affecting a script from any other script.

**However**, everybody knows that global variables are cool and should be used everywhere. Global variables are an incredibely powerful tool to radically alter a composition in a few lines of code.
	
- <ic>variable(a: number | string, b?: any)</ic>: if only one argument is provided, the value of the variable will be returned through its name, denoted by the first argument. If a second argument is used, it will be saved as a global variable under the name of the first argument.
	- <ic>delete_variable(name: string)</ic>: deletes a global variable from storage.
	- <ic>clear_variables()</ic>: clear **ALL** variables. **This is a destructive operation**!
	
**Note:** since this example is running in the documentation, we cannot take advantage of the multiple scripts paradigm. Try to send a variable from the global file to the local file n°6.

${makeExample(
  "Setting a global variable",
  `
v('my_cool_variable', 2)
`,
  true,
)}

${makeExample(
  "Getting that variable back and printing!",
  `
// Note that we just use one argument
log(v('my_cool_variable'))
`,
  false,
)}


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
