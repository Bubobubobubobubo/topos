import { type UserAPI } from "./API";
import { Player } from "./classes/ZPlayer";
export {};

// Extend String prototype
declare global {
    interface String {
        z(): Player;
        speak(): void;
        rate(speed: number): string;
        pitch(pitch: number): string;
        volume(volume: number): string;
        voice(voice: number): string;
        lang(language: string): string;
        options(): SpeechOptions;
    }
}

const isJsonString = (str: string):boolean => {
    return str[0] === '{' && str[str.length - 1] === '}'
}

const stringObject = (str: string, params: object) => {
    if(isJsonString(str)) {
        const obj = JSON.parse(str);
        return JSON.stringify({...obj, ...params});
    } else {
        return JSON.stringify({...params, text: str});
    }
}

export const makeStringExtensions = (api: UserAPI) => {
    String.prototype.speak = function () {
        const options = JSON.parse(this.valueOf());
        new Speaker({ ...options, text: options.text }).speak().then(() => {
            // Done
        }).catch((e) => {
            console.log("Error speaking:", e);
        });
    };

    String.prototype.rate = function (speed: number) {
        return stringObject(this.valueOf(), {rate: speed});
    };

    String.prototype.pitch = function (pitch: number) {
        return stringObject(this.valueOf(), {pitch: pitch});
    };

    String.prototype.lang = function (language: string) {
        return stringObject(this.valueOf(),{lang: language});
    };

    String.prototype.volume = function (volume: number) {
        return stringObject(this.valueOf(), {volume: volume});
    };

    String.prototype.voice = function (voice: number) {
        return stringObject(this.valueOf(), {voice: voice});
    };

    String.prototype.z = function () {
        return api.z(this.valueOf());
    };
}

type SpeechOptions = {
    text?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: number;
    lang?: string;
}

let speakerTimeout: number;

export class Speaker {
    constructor(
        public options: SpeechOptions
    ) {}
    
    speak = () => {
        return new Promise<void>((resolve, reject) => {
        if (this.options.text) {
            const synth = window.speechSynthesis;
            if(synth.speaking) synth.cancel();

            const utterance = new SpeechSynthesisUtterance(this.options.text);
            utterance.rate = this.options.rate || 1;
            utterance.pitch = this.options.pitch || 1;
            utterance.volume = this.options.volume || 1;
            if (this.options.voice) {
                utterance.voice = synth.getVoices()[this.options.voice];
            }
            if(this.options.lang) {
                // Check if language has country code
                if (this.options.lang.length === 2) {
                    utterance.lang = `${this.options.lang}-${this.options.lang.toUpperCase()}`
                } else if (this.options.lang.length === 5) {
                    utterance.lang = this.options.lang;
                } else {
                    // Fallback to en us
                    utterance.lang = 'en-US';
                }
            }

            utterance.onend = () => {
                resolve(); 
            };
        
            utterance.onerror = (error) => {
                reject(error);
            };

            if(synth.speaking) {
                // Cancel again?
                synth.cancel();
                // Set timeout
                if(speakerTimeout) clearTimeout(speakerTimeout);
                speakerTimeout = setTimeout(() => {
                    synth.speak(utterance);
                }, 200);
            } else {
                synth.speak(utterance);
            }

        } else {
            reject("No text provided");
        }

        });
    }
}
