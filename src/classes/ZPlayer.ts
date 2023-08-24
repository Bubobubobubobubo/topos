import { Chord, Pitch, Rest as ZRest, Ziffers } from "zifferjs";
import { Editor } from "../main";
import { Event } from "./AbstractEvents";
import { SkipEvent } from "./SkipEvent";
import { SoundEvent } from "./SoundEvent";
import { NoteEvent } from "./MidiEvent";
import { RestEvent } from "./RestEvent";

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
                const obj = event.getExisting("freq","pitch","key","scale","octave");
                return new SoundEvent(obj, this.app).sound(name);
            } else if(event instanceof ZRest) {
                return RestEvent.createRestProxy(event.duration, this.app);
            } 
        } else {
            return SkipEvent.createSkipProxy();
        }
    }

    midi(value: number|undefined = undefined) {
         if(this.areWeThereYet()) {
            const event = this.next() as Pitch|Chord|ZRest;
            if(event instanceof Pitch) {
                const obj = event.getExisting("note","pitch","bend","key","scale","octave");
                const note = new NoteEvent(obj, this.app);
                return value ? note.note(value) : note;
            } else if(event instanceof ZRest) {
                return RestEvent.createRestProxy(event.duration, this.app);
            } 
        } else {
            return SkipEvent.createSkipProxy();
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