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
        options(): SpeechOptions;
    }
}

const speechOptionsMap = new Map<string, SpeechOptions>();

export const makeStringExtensions = (api: UserAPI) => {
    String.prototype.speak = function () {
        const options = speechOptionsMap.get(this.valueOf()) || {};
        new Speech({ ...options, text: this.valueOf() }).say();
    };

    String.prototype.rate = function (speed: number) {
        const options = speechOptionsMap.get(this.valueOf()) || {};
        speechOptionsMap.set(this.valueOf(), { ...options, rate: speed });
        return this.valueOf();
    };

    String.prototype.pitch = function (pitch: number) {
        const options = speechOptionsMap.get(this.valueOf()) || {};
        speechOptionsMap.set(this.valueOf(), { ...options, pitch: pitch });
        return this.valueOf();
    };

    String.prototype.volume = function (volume: number) {
        const options = speechOptionsMap.get(this.valueOf()) || {};
        speechOptionsMap.set(this.valueOf(), { ...options, volume: volume });
        return this.valueOf();
    };

    String.prototype.voice = function (voice: number) {
        const options = speechOptionsMap.get(this.valueOf()) || {};
        speechOptionsMap.set(this.valueOf(), { ...options, voice: voice });
        return this.valueOf();
    };

    String.prototype.options = function (): SpeechOptions {
        return speechOptionsMap.get(this.valueOf()) || {};
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
}

class Speech {
    constructor(
        public options: SpeechOptions
    ) {}
    
    say = () => {
        if (this.options.text) {
            const synth = window.speechSynthesis;
            synth.cancel();
            const utterance = new SpeechSynthesisUtterance(this.options.text);
            utterance.rate = this.options.rate || 1;
            utterance.pitch = this.options.pitch || 1;
            utterance.volume = this.options.volume || 1;
            if (this.options.voice) {
                utterance.voice = synth.getVoices()[this.options.voice];
            }
            synth.speak(utterance);
        }
    }
}
