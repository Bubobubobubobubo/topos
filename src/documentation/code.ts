import { type Editor } from "../main";
import { makeExampleFactory, key_shortcut } from "../Documentation";

export const code = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Code
	
Topos scripts are using the [JavaScript](https://en.wikipedia.org/wiki/JavaScript) syntax. This is the language used to write pretty much anything in a web browser. JavaScript is easy to learn, and even faster to learn if you are already familiar with other programming languages. Here are some good resources if you want to learn more about it:
	
- [MDN (Mozilla Web Docs)](https://developer.mozilla.org/): it covers pretty much anything and is considered to be a reliable source to learn how the web currently works. Any web developer knows about it. 
	
- [Learn JS in Y Minutes](https://learnxinyminutes.com/docs/javascript/): a good tour of the language. Can be useful as a refresher.
	
- [The Modern JavaScript Tutorial](https://javascript.info/): another well known source to learn the language.
	
**You do not need to have any prior knowledge of programming** to use Topos**.
	
# How is the code evaluated?
	
The code you enter in any of the scripts is evaluated in strict mode. This tells your browser that the code you run can be optimized quite agressively. We need this because by default, **the global script is evaluated 48 times per beat**. It also means that you can crash at the speed of light :smile:. There are some things to keep in mind:
	
- **about variables:** the state of your variables is not kept between iterations. If you write <ic>let a = 2</ic> and remove that value from your script, **it will crash**! Variable and state is not preserved between each run of the script. There are other ways to deal with variables and to share variables between scripts! Some variables like **iterators** can keep their state between iterations because they are saved **with the file itself**. There is also **global variables**.
- **about errors and printing:** your code will crash! Don't worry, we do our best to make it crash in the most gracious way possible. Most errors are caught and displayed in the interface. For weirder bugs, open the dev console with ${key_shortcut(
    "Ctrl + Shift + I"
  )}. You cannot directly use <ic>console.log('hello, world')</ic> in the interface but you can use <ic>log(message)</ic> to print a one line message. You will have to open the console as well to see your messages being printed there!
- **about new syntax:** sometimes, we had some fun with JavaScript's syntax in order to make it easier/faster to write on stage. <ic>&&</ic> can also be written <ic>::</ic> or <ic>-></ic> because it is faster to type or better for the eyes!
	
# Common idioms

There are some techniques to keep code short and tidy. Don't try to write the shortest possible code! Use shortcuts when it makes sense. Take a look at the following examples:

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

# About crashes and bugs
	
Things will crash! It's part of the show! You will learn progressively to avoid mistakes and to write safer code. Do not hesitate to kill the page or to stop the transport if you feel overwhelmed by an algorithm blowing up. There is no safeguard to stop you from doing most things. This is to ensure that you have all the available possible room to write bespoke code and experiment with your ideas through code.

${makeExample(
    "This example will crash! Who cares?",
    `
// This is crashing. See? No harm!
qjldfqsdklqsjdlkqjsdlqkjdlksjd
`,
    true
  )}

`;
};
