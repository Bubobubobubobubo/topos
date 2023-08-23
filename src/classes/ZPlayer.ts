import { Chord, Pitch, Rest as ZRest, Ziffers } from "zifferjs";
import { Editor } from "../main";
import { Event, Skip } from "./Event";
import { Sound } from "./Sound";
import { Note } from "./Note";
import { Rest } from "./Rest";

export class Player extends Event {
    input: string;
    ziffers: Ziffers;
    callTime: number = 0;
    played: boolean = false;
    current!: Pitch|Chord|ZRest;
    retro: boolean = false;
    tick: number = 0;

    constructor(input: string, options: object, public app: Editor) {
        super(app);
        this.input = input;
        this.ziffers = new Ziffers(input, options);
    }

    next = (): Pitch|Chord|ZRest => {
        this.current =  this.ziffers.next() as Pitch|Chord|ZRest;
        this.played = true;
        return this.current;
    }

    areWeThereYet = (): boolean => {
        const howAboutNow = (this.ziffers.notStarted() || this.app.api.epulse() > this.callTime+(this.current.duration*this.app.api.ppqn()));
        if(howAboutNow) {
            this.tick = 0;
        } else {
            this.tick++;
        }
        return howAboutNow;
    }

    sound(name: string) {
        if(this.areWeThereYet()) {
            const event = this.next() as Pitch|Chord|ZRest;
            if(event instanceof Pitch) {
                // TODO: Quick hack. Select which attributes to use, but some ziffers stuff is needed for chaining key change etc.
                const obj = event.getExisting("freq","pitch","key","scale","octave");
                return new Sound(obj, this.app).sound(name);
            } else if(event instanceof ZRest) {
                return Rest.createRestProxy(event.duration, this.app);
            } 
        } else {
            return Skip.createRestProxy();
        }
    }

    note(value: number|undefined = undefined) {
         if(this.areWeThereYet()) {
            const event = this.next() as Pitch|Chord|ZRest;
            if(event instanceof Pitch) {
                  // TODO: Quick hack. Select which attributes to use, but some ziffers stuff is needed for chaining key change etc.
                const obj = event.getExisting("note","pitch","bend","key","scale","octave");
                const note = new Note(obj, this.app);
                return value ? note.note(value) : note;
            } else if(event instanceof ZRest) {
                return Rest.createRestProxy(event.duration, this.app);
            } 
        } else {
            return Skip.createRestProxy();
        }
    }

    scale(name: string) {
        this.ziffers.scale(name);
        return this;
    }

    key(name: string) {
        this.ziffers.key(name);
        return this;
    }

    octave(value: number) {
        this.ziffers.octave(value);
        return this;
    }

    retrograde() {
        if(this.tick === 0 && this.ziffers.index === 0) {
            this.ziffers.retrograde();
        }
        return this;
    }

    out = (): void => {
        // TODO?
    }


}