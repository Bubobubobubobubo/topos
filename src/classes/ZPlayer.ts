import { Chord, Pitch, Rest as ZRest, Ziffers } from "zifferjs";
import { Editor } from "../main";
import { Event } from "./AbstractEvents";
import { SkipEvent } from "./SkipEvent";
import { SoundEvent } from "./SoundEvent";
import { NoteEvent } from "./MidiEvent";
import { RestEvent } from "./RestEvent";

export type InputOptions = { [key: string]: string | number };

export class Player extends Event {
    input: string;
    ziffers: Ziffers;
    initCallTime: number = 0;
    startCallTime: number = 0;
    lastCallTime: number = 0;
    waitTime = 0;
    startBeat: number = 0;
    played: boolean = false;
    current!: Pitch|Chord|ZRest;
    retro: boolean = false;
    index: number = -1;
    zid: string|undefined = undefined;
    options: InputOptions = {};

    constructor(input: string, options: InputOptions, public app: Editor) {
        super(app);
        this.input = input;
        this.options = options;
        this.ziffers = new Ziffers(input, options);
    }

    get ticks(): number {
        const dur = this.ziffers.duration;
        return dur * 4 * this.app.clock.ppqn;
    }

    nextEndTime(): number {
        return this.startCallTime + this.ticks;
    }

    updateLastCallTime(): void {
        if (this.notStarted() || this.played) {
            this.lastCallTime = this.app.clock.pulses_since_origin;
            this.played = false;
        }
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

    firstRun = (): boolean => {
        return this.origin()<=0 && this.notStarted();
    }

    atTheBeginning = (): boolean => {
         return this.pulse()===0 && this.ziffers.index===0;
    }

    origin = (): number => {
        return this.app.clock.pulses_since_origin+1;
    }

    pulse = (): number => {
        return this.app.clock.time_position.pulse;
    }

    nextBeat = (): number => {
        return this.app.clock.next_beat_in_ticks;
    }

    // Check if it's time to play the event
    areWeThereYet = (): boolean => {
        // If clock has stopped
        if(this.app.clock.pulses_since_origin<this.lastCallTime) {
            this.lastCallTime = 0;
            this.index = 0;
        }

        // Main logic
        const howAboutNow = (
            (   // If pattern is just starting
                this.notStarted() && 
                (this.app.clock.time_position.pulse === 1 ||
                this.app.clock.pulses_since_origin+1 >= this.app.clock.next_beat_in_ticks) &&
                (this.app.clock.pulses_since_origin+1 >= this.waitTime)
            )
            ||
            (   // If pattern is already playing
                this.current &&
                (this.pulseToSecond(this.app.clock.pulses_since_origin+1) >= 
                this.pulseToSecond(this.lastCallTime) +
                (this.current.duration*4) * this.pulseToSecond(this.app.api.ppqn())) &&
                (this.app.clock.pulses_since_origin+1 >= this.waitTime)
            )
        );

        // Increment index of how many times sound/midi have been called
        this.index = howAboutNow ? this.index+1 : this.index;

        if(howAboutNow && this.notStarted()) {
            this.initCallTime = this.app.clock.pulses_since_origin+1;
        }

        if(this.atTheBeginning()) {
            this.startCallTime = this.app.clock.pulses_since_origin;
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
        if(this.index === -1 && this.ziffers.index === -1) {
            this.ziffers.retrograde();
        }
        return this;
    }

    wait(value: number) {
        if(this.index === -1 && this.ziffers.index === -1) {
           
           // TODO: THIS LATER!

            /* if(typeof value === "string") {
                const cueKey = this.app.api.patternCues.get(value);
                if(cueKey) {
                    const waitedPatter = this.app.api.patternCache.get(cueKey) as Player;
                    if(waitedPatter) {
                        this.waitTime = waitedPatter.nextEndTime();
                    }
                }
            } */
            
            this.waitTime = this.origin() + Math.ceil(value*4*this.app.clock.ppqn); 
             
        }
        return this;
    }

    out = (): void => {
        // TODO?
    }


}