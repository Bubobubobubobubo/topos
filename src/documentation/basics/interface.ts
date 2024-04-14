import { key_shortcut, makeExampleFactory } from "../Documentation";
import { type Editor } from "../../main";
import topos_arch from "./topos_arch.svg";
import many_universes from "./many_universes.svg";

export const software_interface = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Interface
	
The Topos interface is designed on a simple concept: _scripts_ and _universes_. By understanding how the interface works, you will already understand quite a lot. Make sure to learn the dedicated keybindings as well. They will give you extra powers!
	
<object type="image/svg+xml" data=${topos_arch} style="width: 100%; height: auto; background-color: transparent"></object>


# Scripts

Every Topos session is composed of **local**, **global** and **init** scripts. These scripts form a structure called a "_universe_".  The scripts can describe whatever you want: songs, sketches, small tools, or whatever. All the scripts are written using the JavaScript programming language. They describe a musical or algorithmic process. You can call them anytime.
	
- **the global script** (${key_shortcut(
    "Ctrl + G",
  )}): _Evaluated for every clock pulse_. The central piece, acting as the conductor for all the other scripts. You can also jam directly from the global script to test your ideas before pushing them to a separate script. You can also access that script using the ${key_shortcut(
    "F10",
  )} key.
- **the local scripts** (${key_shortcut(
    "Ctrl + L",
  )}): _Evaluated on demand_. Local scripts are used to store anything too complex to sit in the global script. It can be a musical process, a whole section of your composition, a complex controller that you've built for your hardware, etc... You can also switch to one of the local scripts by using the function keys (${key_shortcut(
    "F1",
  )} to ${key_shortcut("F9")}).
- **the init script** (${key_shortcut(
    "Ctrl + I",
  )}): _Evaluated on program load_. Used to set up the software the session to the desired state before playing, for example changing bpm or to initialize global variables (See Functions). You can also access that script using the ${key_shortcut(
    "F11",
  )} key.
- **the note file** (${key_shortcut(
    "Ctrl + N",
  )}): _Not evaluated_. Used to store your thoughts or commentaries about the session you are currently playing. It is nothing more than a scratchpad really!
	

${makeExample(
    "Calling scripts to form a musical piece",
    `
beat(1) :: script(1) // Calling local script n°1 
flip(4) :: beat(.5) :: script(2) // Calling script n°2
`,
    true,
  )}

${makeExample(
    "Script execution can become musical too!",
    `
// Use algorithms to pick a script.
beat(1) :: script([1, 3, 5].pick())
flip(4) :: beat([.5, .25].beat(16)) :: script(
  [5, 6, 7, 8].beat())
`,
    false,
  )}

### Navigating the interface

The interface is centered around the manipulation of scripts. Take a look at the left bar:
- **pencil icon:** notes. Used to take project notes about your "_universe_".
- **down arrow**: init script. Runs once when the project is loaded.
- **text with note**: global script, it acts as the **conductor** for your piece.
- **folder icon**: local scripts (from 1 to 9).

### Managing scripts programatically

There are some useful functions to help you manage your scripts:

- <ic>copy_script(from: number, to: number)</ic>: copy the content of a script to another.
- <ic>delete_script(index: number)</ic>: clear the content of a script. Warning: this is irreversible! 




# Universes
	
<object type="image/svg+xml" data=${many_universes} style="width: 100%; height: auto; background-color: transparent"></object>


A set of files is called a _universe_. You can switch between universes immediately immediately by pressing ${key_shortcut(
    "Ctrl + B",
  )}. You can also create a new universe by entering a name. Load a universe by typing its name. Once a universe is loaded, it is not possible to call any data/code from any other universe. Switching between universes does not stop the transport nor reset the clock. The context switches but time keeps flowing. This can be useful for transitioning between songs / parts. 

There are some useful functions to help you manage your universes:

- <ic>copy_universe(from: string, to: string)</ic>: copy the content of a universe to another.
- <ic>delete_universe(name: string)</ic>: delete a universe. Warning: this is irreversible!
	
# Sharing your work
	
**Click the share button**. The URL of the website will change to something much longer. This URL will automatically be copied to your clipboard.  Send this link to your friends to share the universe you are currently working on with them. You can use a service like [tinyurl](https://tinyurl.com/) to shorten your links.

	
- The imported universe will always get a randomly generated name such as: <ic>random_silly_llama</ic>.
- Topos will automatically fetch and switch to the universe that was sent to you.


`;
};
