import { type Editor } from './main';

import {
  superdough,
  // @ts-ignore
} from "superdough";

export class Sound {

    values: { [key: string]: any }

    constructor(sound: string, public app: Editor) {
        this.values = { 's': sound }
    }

    unit = (value: number): this => {
        this.values['unit'] = value
        return this;
    }

    frequency = (value: number): this => {
        this.values['frequency'] = value
        return this;
    }

    nudge = (value: number): this => {
        this.values['nudge'] = value
        return this;
    }

    cut = (value: number): this => {
        this.values['cut'] = value
        return this;
    }

    loop = (value: number): this => {
        this.values['loop'] = value
        return this;
    }

    clip = (value: number): this => {
        this.values['clip'] = value
        return this;
    }

    n = (value: number): this => {
        this.values['n'] = value
        return this;
    }

    note = (value: number): this => {
        this.values['note'] = value
        return this;
    }

    speed = (value: number): this => {
        this.values['speed'] = value
        return this;
    }

    begin = (value: number): this => {
        this.values['begin'] = value
        return this;
    }

    end = (value: number): this => {
        this.values['end'] = value
        return this;
    }

    gain = (value: number): this => {
        this.values['gain'] = value
        return this;
    }

    cutoff = (value: number): this => {
        this.values['cutoff'] = value
        return this;
    }

    resonance = (value: number): this => {
        this.values['resonance'] = value
        return this;
    }

    hcutoff = (value: number): this => {
        this.values['hcutoff'] = value
        return this;
    }

    hresonance = (value: number): this => {
        this.values['hresonance'] = value
        return this;
    }

    bandf = (value: number): this => {
        this.values['bandf'] = value
        return this;
    }

    bandq = (value: number): this => {
        this.values['bandq'] = value
        return this;
    }

    coarse = (value: number): this => {
        this.values['coarse'] = value
        return this;
    }

    crush = (value: number): this => {
        this.values['crush'] = value
        return this;
    }

    shape = (value: number): this => {
        this.values['shape'] = value
        return this;
    }

    pan = (value: number): this => {
        this.values['pan'] = value
        return this;
    }

    vowel = (value: number): this => {
        this.values['vowel'] = value
        return this;
    }

    delay = (value: number): this => {
        this.values['delay'] = value
        return this;
    }

    delayfeedback = (value: number): this => {
        this.values['delayfeedback'] = value
        return this;
    }

    delaytime = (value: number): this => {
        this.values['delaytime'] = value
        return this;
    }

    orbit = (value: number): this => {
        this.values['orbit'] = value
        return this;
    }

    room = (value: number): this => {
        this.values['room'] = value
        return this;
    }

    size = (value: number): this => {
        this.values['size'] = value
        return this;
    }

    velocity = (value: number): this => {
        this.values['velocity'] = value
        return this;
    }

    out = (): object => {
        return superdough(this.values, this.app.clock.pulse_duration);
    }
}