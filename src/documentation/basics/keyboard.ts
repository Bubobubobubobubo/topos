import { key_shortcut } from "../../Documentation";
import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const shortcuts = (app: Editor): string => {
  let makeExample = makeExampleFactory(app);
  return `
# Keybindings
	
Topos is made to be controlled entirely with a keyboard. It is recommanded to stop using the mouse as much as possible when you are _live coding_. Here is a list of the most important keybindings:
	
### Transport

| Shortcut | Key   | Description                                                |
|----------|-------|------------------------------------------------------------|
|**Start/Pause** transport|${key_shortcut(
    "Ctrl + P",
  )}|Start or pause audio playback|
|**Stop** the transport |${key_shortcut(
    "Ctrl + S",
  )}|Stop and rewind audio playback|
	
### Moving in the interface

| Shortcut | Key   | Description                                                |
|----------|-------|------------------------------------------------------------|
|Universe switch|${key_shortcut("Ctrl + B")}|Switch to a new universe|
|Global Script|${key_shortcut("Ctrl + G")} or ${key_shortcut(
    "F10",
  )}|Switch to global script |
|Local scripts|${key_shortcut("Ctrl + L")} or ${key_shortcut(
    "F11",
  )}|Switch to local scripts |
|Init script|${key_shortcut("Ctrl + L")}|Switch to init script|
|Note File|${key_shortcut("Ctrl + N")}|Switch to note file|
|Local Script|${key_shortcut("F1")} to ${key_shortcut(
    "F9",
  )}|Switch to a specific local script|
|Documentation|${key_shortcut("Ctrl + D")}|Open the documentation|
	
### Evaluating code

| Shortcut | Key   | Description                                                |
|----------|-------|------------------------------------------------------------|
|Evaluate|${key_shortcut("Ctrl + Enter")}| Evaluate the current script        |
|Local Eval|${key_shortcut("Ctrl + F1")} to ${key_shortcut(
    "Ctrl + F9",
  )}|Local File Evaluation|
|Force Eval|${key_shortcut(
    "Ctrl + Shift + Enter",
  )}|Force evaluation of the current script|
	
### Special

| Shortcut | Key   | Description                                                |
|----------|-------|------------------------------------------------------------|
|Vim Mode|${key_shortcut("Ctrl + V")}| Switch between Vim and Normal Mode|
|Maximize|${key_shortcut("Ctrl + M")}| Show/Hide the interface|

# Keyboard Fill

By pressing the ${key_shortcut(
    "Alt",
  )} key, you can trigger the <ic>Fill</ic> mode which can either be <ic>true</ic> or <ic>false</ic>. The fill will be set to <ic>true</ic> as long as the key is held. Try pressing ${key_shortcut(
    "Alt",
  )} when playing this example:

${makeExample(
  "Claping twice as fast with fill",
  `
beat(fill() ? 1/4 : 1/2)::sound('cp').out()
`,
  true,
)}

`;
};
