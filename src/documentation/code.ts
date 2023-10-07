import { type Editor } from "../main";
import { makeExampleFactory, key_shortcut } from "../Documentation";

export const code = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Code
	
Topos is using the [JavaScript](https://en.wikipedia.org/wiki/JavaScript) syntax because it lives in a web browser where JS is the default programming language. It is also a language that you can learn to speak quite fast if you are already familiar with other programming languages. You are not going to write a lot of code anyway but familiarity with the language can help. Here are some good resources:
	
- [MDN (Mozilla Web Docs)](https://developer.mozilla.org/): it covers pretty much anything and is considered to be a reliable source to learn how the web currently works. We use it quite a lot to develop Topos. 
	
- [Learn JS in Y Minutes](https://learnxinyminutes.com/docs/javascript/): a good tour of the language. Can be useful as a refresher.
	
- [The Modern JavaScript Tutorial](https://javascript.info/): another well known source to learn the language.
	
You **do not need to have any prior knowledge of programming** to use Topos. It can also be used as a **valuable resource** to learn some basic programming.
	
## How is the code evaluated?
	
The code you enter in any of the scripts is evaluated in strict mode. This tells your browser that the code you run can be optimized quite agressively. We need this because by default, **the global script is evaluated 48 times per beat**. It also means that you can crash at the speed of light :smile:. The local and initialisation scripts are evaluated on demand, one run at a time. There are some things to keep in mind:
	
- **about variables:** the state of your variables is not kept between iterations. If you write <ic>let a = 2</ic> and change the value later on, the value will be reset to <ic>2</ic> after each run! There are other ways to deal with variables and to share variables between scripts! Some variables like **iterators** can keep their state between iterations because they are saved **with the file itself**.
- **about errors and printing:** your code will crash! Don't worry, it will hopefully try to crash in the most gracious way possible. To check if your code is erroring, you will have to open the dev console with ${key_shortcut(
    "Ctrl + Shift + I"
  )}. You cannot directly use <ic>console.log('hello, world')</ic> in the interface but you can use <ic>log(message)</ic> to print a one line message. You will have to open the console as well to see your messages being printed there!
- **about new syntax:** sometimes, we have taken liberties with the JavaScript syntax in order to make it easier/faster to write on stage. <ic>&&</ic> can also be written <ic>::</ic> or <ic>-></ic> because it is faster to type or better for the eyes!
	
## Common idioms

There are some techniques that Topos players are using to keep their JavaScript short and tidy. Don't try to write the shortest possible code but use shortcuts when it makes sense. It's sometimes very comforting to take time to write utilities and scripts that you will often reuse. Take a look at the following examples:

${makeExample(
    "Shortening your if conditions",
    `
// The && symbol (overriden by :: in Topos) is very often used for conditions!
beat(.75) :: snd('linnhats').n([1,4,5].beat()).out()
beat(1) :: snd('bd').out()
//if (true) && log('very true')
// These two lines are the same:
// beat(1) && snd('bd').out() 
//// beat(1) :: snd('bd').out() 

`,
    true
  )}

${makeExample(
    "More complex conditions using ?",
    `
// The ? symbol can be used to write a if/true/false condition
beat(4) ? snd('kick').out() : beat(2) :: snd('snare').out()
// (true) ? log('very true') : log('very false')
`,
    false
  )}


${makeExample(
    "Using not and other short symbols",
    `
// The ! symbol can be used to reverse a condition
beat(4) ? snd('kick').out() : beat(2) :: snd('snare').out()
!beat(2) :: beat(0.5) :: snd('clap').out()
`,
    false
  )}

## About crashes and bugs
	
Things will crash, that's also part of the show. You will learn progressively to avoid mistakes and to write safer code. Do not hesitate to kill the page or to stop the transport if you feel overwhelmed by an algorithm blowing up. There are no safeties in place to save you. This is to ensure that you have all the available possible room to write bespoke code and experiment with your ideas through code.

${makeExample(
    "This example will crash! Who cares?",
    `// This is crashing. Open your console!
qjldfqsdklqsjdlkqjsdlqkjdlksjd
`,
    false
  )}

`;
};
