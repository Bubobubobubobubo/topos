import { noteNameToMidi } from "zifferjs";
import { type UserAPI } from "../API";
import { Player } from "../classes/ZPlayer";
export {};

// Extend String prototype
declare global {
    interface String {
        speak(): void;
        rate(speed: number): string;
        pitch(pitch: number): string;
        volume(volume: number): string;
        voice(voice: number): string;
        lang(language: string): string;
        options(): SpeechOptions;
        z(): Player;
        z0(): Player;
        z1(): Player;
        z2(): Player;
        z3(): Player;
        z4(): Player;
        z5(): Player;
        z6(): Player;
        z7(): Player;
        z8(): Player;
        z9(): Player;
        z10(): Player;
        z11(): Player;
        z12(): Player;
        z13(): Player;
        z14(): Player;
        z15(): Player;
        z16(): Player;
        note(): number;
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

    String.prototype.z = function (options: {[key: string]: any} = {}) {
        return api.z(this.valueOf(), options);
    };
 
    String.prototype.z0 = function (options: {[key: string]: any} = {}) {
        return api.z0(this.valueOf(), options);
    };

    String.prototype.z1 = function (options: {[key: string]: any} = {}) {
        return api.z1(this.valueOf(), options);
    };

    String.prototype.z2 = function (options: {[key: string]: any} = {}) {
        return api.z2(this.valueOf(), options);
    };

    String.prototype.z3 = function (options: {[key: string]: any} = {}) {
        return api.z3(this.valueOf(), options);
    };

    String.prototype.z4 = function (options: {[key: string]: any} = {}) {
        return api.z4(this.valueOf(), options);
    };

    String.prototype.z5 = function (options: {[key: string]: any} = {}) {
        return api.z5(this.valueOf(), options);
    };

    String.prototype.z6 = function (options: {[key: string]: any} = {}) {
        return api.z6(this.valueOf(), options);
    };

    String.prototype.z7 = function (options: {[key: string]: any} = {}) {
        return api.z7(this.valueOf(), options);
    };

    String.prototype.z8 = function (options: {[key: string]: any} = {}) {
        return api.z8(this.valueOf(), options);
    };

    String.prototype.z9 = function (options: {[key: string]: any} = {}) {
        return api.z9(this.valueOf(), options);
    };

    String.prototype.z10 = function (options: {[key: string]: any} = {}) {
        return api.z10(this.valueOf(), options);
    };

    String.prototype.z11 = function (options: {[key: string]: any} = {}) {
        return api.z11(this.valueOf(), options);
    };

    String.prototype.z12 = function (options: {[key: string]: any} = {}) {
        return api.z12(this.valueOf(), options);
    };

    String.prototype.z13 = function (options: {[key: string]: any} = {}) {
        return api.z13(this.valueOf(), options);
    };

    String.prototype.z14 = function (options: {[key: string]: any} = {}) {
        return api.z14(this.valueOf(), options);
    };

    String.prototype.z15 = function (options: {[key: string]: any} = {}) {
        return api.z15(this.valueOf(), options);
    };

    String.prototype.z16 = function (options: {[key: string]: any} = {}) {
        return api.z16(this.valueOf(), options);
    };

    String.prototype.note = function () {
        try {
            return parseInt(this.valueOf());
        } catch (e) {
            return noteNameToMidi(this.valueOf());
        }
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
                // @ts-ignore
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
