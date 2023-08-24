import { type Editor } from '../main';
import { AudibleEvent } from './AbstractEvents';
import { midiToFreq, noteFromPc } from 'zifferjs';

import {
  superdough,
  // @ts-ignore
} from "superdough";

export class SoundEvent extends AudibleEvent {

    constructor(sound: string|object, public app: Editor) {
        super(app);
        if (typeof sound === 'string') this.values = { 's': sound, 'dur': 0.5 };
        else this.values = sound;
    }

    attack = (value: number): this => {
        this.values["attack"] = value;
        return this;
    };
    atk = this.attack;

    decay = (value: number): this => {
        this.values["decay"] = value;
        return this;
    };
    dec = this.decay;

    release = (value: number): this => {
        this.values["release"] = value;
        return this;
    };
    rel = this.release;

    unit = (value: number): this => {
        this.values["unit"] = value;
        return this;
    };

    freq = (value: number): this => {
        this.values["freq"] = value;
        return this;
    };

    fm = (value: number | string): this => {
        if (typeof value === "number") {
            this.values["fmi"] = value;
        } else {
            let values = value.split(":");
            this.values["fmi"] = parseFloat(values[0]);
            if (values.length > 1) this.values["fmh"] = parseFloat(values[1]);
        }
        return this;
    };

    sound = (value: string): this => {
        this.values['s'] = value
        return this;
    };

    fmi = (value: number): this => {
        this.values["fmi"] = value;
        return this;
    };

    fmh = (value: number): this => {
        this.values["fmh"] = value;
        return this;
    };

    nudge = (value: number): this => {
        this.values["nudge"] = value;
        return this;
    };

    cut = (value: number): this => {
        this.values["cut"] = value;
        return this;
    };

    loop = (value: number): this => {
        this.values["loop"] = value;
        return this;
    };

    clip = (value: number): this => {
        this.values["clip"] = value;
        return this;
    };

    n = (value: number): this => {
        this.values["n"] = value;
        return this;
    };

    note = (value: number): this => {
        this.values["note"] = value;
        return this;
    };

    speed = (value: number): this => {
        this.values["speed"] = value;
        return this;
    };

    begin = (value: number): this => {
        this.values["begin"] = value;
        return this;
    };

    end = (value: number): this => {
        this.values["end"] = value;
        return this;
    };

    gain = (value: number): this => {
        this.values["gain"] = value;
        return this;
    };

    cutoff = (value: number): this => {
        this.values["cutoff"] = value;
        return this;
    };

    resonance = (value: number): this => {
        this.values["resonance"] = value;
        return this;
    };

    hcutoff = (value: number): this => {
        this.values["hcutoff"] = value;
        return this;
    };

    hresonance = (value: number): this => {
        this.values["hresonance"] = value;
        return this;
    };

    bandf = (value: number): this => {
        this.values["bandf"] = value;
        return this;
    };

    bandq = (value: number): this => {
        this.values["bandq"] = value;
        return this;
    };

    coarse = (value: number): this => {
        this.values["coarse"] = value;
        return this;
    };

    crush = (value: number): this => {
        this.values["crush"] = value;
        return this;
    };

    shape = (value: number): this => {
        this.values["shape"] = value;
        return this;
    };

    pan = (value: number): this => {
        this.values["pan"] = value;
        return this;
    };

    vowel = (value: number): this => {
        this.values["vowel"] = value;
        return this;
    };

    delay = (value: number): this => {
        this.values["delay"] = value;
        return this;
    };

    delayfeedback = (value: number): this => {
        this.values["delayfeedback"] = value;
        return this;
    };

    delaytime = (value: number): this => {
        this.values["delaytime"] = value;
        return this;
    };

    orbit = (value: number): this => {
        this.values["orbit"] = value;
        return this;
    };

    room = (value: number): this => {
        this.values["room"] = value;
        return this;
    };

    size = (value: number): this => {
        this.values["size"] = value;
        return this;
    };

    velocity = (value: number): this => {
        this.values["velocity"] = value;
        return this;
    };              

    modify = (func: Function): this => {
        const funcResult = func(this);
        if(funcResult instanceof Object) return funcResult;
        else {
            func(this.values);
            return this;
        }
    };

    // NOTE: Sustain of the sound. duration() from the superclass Event is used to change the note length.
    sustain = (value: number): this => {
        this.values["dur"] = value;
        return this;
    };

    update = (): void => {
        if(this.values.key && this.values.pitch && this.values.parsedScale && this.values.octave) {
            const [note,_] = noteFromPc(this.values.key, this.values.pitch, this.values.parsedScale, this.values.octave);
            this.values.freq = midiToFreq(note);
        }
    }

    out = (): object => {
        return superdough(
            this.values,
            this.app.clock.pulse_duration,
            this.values.dur
        );
    };

}