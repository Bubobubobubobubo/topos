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
    startBeat: number = 0;
    played: boolean = false;
    current!: Pitch|Chord|ZRest;
    retro: boolean = false;
    tick: number = 0;

    constructor(input: string, options: object, public app: Editor) {
        super(app);
        this.input = input;
        this.ziffers = new Ziffers(input, options);
    }

    notStarted(): boolean {
        return this.ziffers.notStarted();
    }

    next = (): Pitch|Chord|ZRest => {
        this.current =  this.ziffers.next() as Pitch|Chord|ZRest;
        this.played = true;
        return this.current;
    }

    pulseToSecond = (pulse: number): number => {
        return this.app.clock.convertPulseToSecond(pulse);
    }

    areWeThereYet = (): boolean => {
        // If clock has stopped
        if(this.app.clock.pulses_since_origin<this.callTime) {
            this.callTime = 0;
            this.tick = 0;
        }

        const howAboutNow = (
            (this.notStarted() && this.app.clock.time_position.pulse === 1) ||
            (
                this.current &&
                this.pulseToSecond(this.app.api.epulse()+1) >= 
                this.pulseToSecond(this.callTime) +
                (this.current.duration*4) * this.pulseToSecond(this.app.api.ppqn())
            )
        );
        
        this.tick = howAboutNow ? 0 : this.tick+1;
        
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