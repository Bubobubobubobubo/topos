import { key_shortcut } from "../Documentation";

export const shortcuts = (): string => {
  return `
# Keybindings
	
Topos is made to be controlled entirely with a keyboard. It is recommanded to stop using the mouse as much as possible when you are _live coding_. Some of the keybindings might not work like expected on Windows/Linux. They all work on MacOS. A fix is on the way. Here is a list of the most important keybindings:
	
## Transport

| Shortcut | Key   | Description                                                |
|----------|-------|------------------------------------------------------------|
|**Start/Pause** transport|${key_shortcut(
    "Ctrl + P"
  )}|Start or pause audio playback|
|**Stop** the transport |${key_shortcut(
    "Ctrl + S"
  )}|Stop and rewind audio playback|
	
## Moving in the interface

| Shortcut | Key   | Description                                                |
|----------|-------|------------------------------------------------------------|
|Universe switch|${key_shortcut("Ctrl + B")}|Switch to a new universe|
|Global Script|${key_shortcut("Ctrl + G")} or ${key_shortcut(
    "F10"
  )}|Switch to global script |
|Local scripts|${key_shortcut("Ctrl + L")} or ${key_shortcut(
    "F11"
  )}|Switch to local scripts |
|Init script|${key_shortcut("Ctrl + L")}|Switch to init script|
|Note File|${key_shortcut("Ctrl + N")}|Switch to note file|
|Local Script|${key_shortcut("F1")} to ${key_shortcut(
    "F9"
  )}|Switch to a specific local script|
|Documentation|${key_shortcut("Ctrl + D")}|Open the documentation|
	
## Evaluating code

| Shortcut | Key   | Description                                                |
|----------|-------|------------------------------------------------------------|
|Evaluate|${key_shortcut("Ctrl + Enter")}| Evaluate the current script        |
|Local Eval|${key_shortcut("Ctrl + F1")} to ${key_shortcut(
    "Ctrl + F9"
  )}|Local File Evaluation|
	
## Special

| Shortcut | Key   | Description                                                |
|----------|-------|------------------------------------------------------------|
|Vim Mode|${key_shortcut("Ctrl + V")}| Switch between Vim and Normal Mode|
`;
};
