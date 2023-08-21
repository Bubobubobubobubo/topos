import { type Editor } from './main';

export class Event {
    seedValue: string|undefined = undefined;
    randomGen: Function = Math.random;
    app: Editor;

    constructor(app: Editor) {
        this.app = app;
        if(this.app.api.currentSeed) {
            this.randomGen = this.app.api.randomGen;
        }
    }

    sometimesBy = (probability: number, func: Function): Event => {
        if(this.randomGen() < probability) {
            return this.modify(func);
        }
        return this;
    }

    sometimes = (func: Function): Event => {
        return this.sometimesBy(0.5, func);
    }

    rarely = (func: Function): Event => {
        return this.sometimesBy(0.1, func);
    }

    often = (func: Function): Event => {
        return this.sometimesBy(0.9, func);
    }

    modify = (func: Function): Event => {
        return func(this);
    }

    seed = (value: string|number): Event => {
        this.seedValue = value.toString();
        this.randomGen = this.app.api.localSeededRandom(this.seedValue);
        return this;
    }

    clear = (): Event => {
        this.app.api.clearLocalSeed(this.seedValue);
        return this;
    }

    apply = (func: Function): Event => {
        return this.modify(func);
    }

}