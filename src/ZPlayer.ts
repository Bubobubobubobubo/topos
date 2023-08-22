import { Chord, Pitch, Rest as ZRest, Ziffers } from "zifferjs";
import { Editor } from "./main";
import { Event } from "./Event";
import { Sound } from "./Sound";
import { Note } from "./Note";
import { Rest } from "./Rest";

export class Player extends Event {
    input: string;
    ziffers: Ziffers;
    callTime: number = 0;
    played: boolean = false;
    current!: Pitch|Chord|ZRest;

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
        return (this.ziffers.notStarted() || this.app.api.epulse() > this.callTime+(this.current.duration*this.app.api.ppqn()))
    }

    sound(name: string) {
        if(this.areWeThereYet()) {
            const event = this.next() as Pitch|Chord|ZRest;
            if(event instanceof Pitch) {
                // TODO: Quick hack. Select which attributes to use, but some ziffers stuff is needed for chaining key change etc.
                return new Sound(event.asObject(), this.app).sound(name);
            } else if(event instanceof Rest) {
                return Rest.createRestProxy(event.duration, this.app);
            }
        } else {
            // Not really a rest, but calling for skipping undefined methods
            return Rest.createRestProxy(0, this.app);
        }
    }

    note(value: number|undefined = undefined) {
         if(this.areWeThereYet()) {
            const event = this.next() as Pitch|Chord|ZRest;
            if(event instanceof Pitch) {
                  // TODO: Quick hack. Select which attributes to use, but some ziffers stuff is needed for chaining key change etc.
                const note = new Note(event.asObject(), this.app);
                return value ? note.note(value) : note;
            } else if(event instanceof ZRest) {
                return Rest.createRestProxy(event.duration, this.app);
            }
        } else {
            // Not really a rest, but calling for skipping undefined methods
            return Rest.createRestProxy(0, this.app);
        }
    }

    out = (): void => {
        // TODO?
    }


}