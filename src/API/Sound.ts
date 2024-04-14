import { SoundEvent } from "../Classes/SoundEvent";
import { SkipEvent } from "../Classes/SkipEvent";
import { Editor } from "../main";

export const sound = (app: Editor) => (sound: string | string[] | null | undefined) => {
  /**
   * Creates a sound event if a sound is specified, otherwise returns a skip event.
   * @param sound - The sound identifier or array of identifiers to play.
   * @returns SoundEvent if sound is defined, otherwise SkipEvent.
   */
  if (sound) return new SoundEvent(sound, app);
  else return new SkipEvent();
};

export const snd = sound;

export const speak = () => (text: string, lang: string = "en-US", voiceIndex: number = 0, rate: number = 1, pitch: number = 1): void => {
  /**
   * Speaks the given text using the browser's speech synthesis API.
   * @param text - The text to speak.
   * @param lang - The language code (e.g., "en-US").
   * @param voiceIndex - The index of the voice to use from the speechSynthesis voice list.
   * @param rate - The rate at which to speak the text.
   * @param pitch - The pitch at which to speak the text.
   */
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;
  msg.rate = rate;
  msg.pitch = pitch;

  // Set the voice using a provided index
  const voices = window.speechSynthesis.getVoices();
  msg.voice = voices[voiceIndex] || null;

  window.speechSynthesis.speak(msg);

  msg.onend = () => {
    console.log("Finished speaking:", text);
  };

  msg.onerror = (event) => {
    console.error("Speech synthesis error:", event);
  };
};
