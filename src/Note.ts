import { Event } from './Event';
import { type Editor } from './main';
import { MidiConnection } from "./IO/MidiConnection";
export class Note extends Event {
    values: { [key: string]: any };
    midiConnection: MidiConnection;

    constructor(input: number|object, public app: Editor) {
        super(app);
        if(typeof input === 'number') input = { 'note': input };
        this.values = input;
        this.midiConnection = app.api.MidiConnection
    }

    note = (value: number): this => {
        this.values['note'] = value;
        return this;
    }

    duration = (value: number): this => {
        this.values['duration'] = value;
        return this;
    }

    channel = (value: number): this => {
        this.values['channel'] = value;
        return this;
    }

    port = (value: number|string): this => {
        this.values['port'] = this.midiConnection.getMidiOutputIndex(value);
        return this;
    }

    add = (value: number): this => {
        this.values.note += value;
        return this;
    }

    modify = (func: Function): this => {
        if(typeof func === 'function') {
        const funcResult = func(this);
        if(funcResult instanceof Object) {
            console.log("IS OBJECT?");
            return funcResult;
            
        }
        else {
            func(this.values);
            return this;
        }
    }
    }

    // TODO: Add bend
    freq = (value: number): this => {
        this.values['freq'] = value;
        return this;
    }

    bend = (value: number): this => {
        this.values['bend'] = value;
        return this;
    }
    
    random = (min: number = 0, max: number = 127): this => {
        min = Math.min(Math.max(min, 0), 127);
        max = Math.min(Math.max(max, 0), 127);
        this.values['note'] = Math.floor(this.randomGen() * (max - min + 1)) + min;
        return this;
    }

    out = (): void => {
        const note = this.values.note ? this.values.note : 60;
        const channel = this.values.channel ? this.values.channel : 0;
        const velocity = this.values.velocity ? this.values.velocity : 100;
        
        const duration = this.values.duration ? 
        this.values.duration * Math.floor(this.app.clock.pulse_duration * this.app.api.ppqn()) : 
        this.app.clock.pulse_duration * this.app.api.ppqn();
        
        const bend = this.values.bend ? this.values.bend : undefined;
        
        const port = this.values.port ? 
        this.midiConnection.getMidiOutputIndex(this.values.port) : 
        this.midiConnection.getCurrentMidiPortIndex();

        if (bend) this.midiConnection.sendPitchBend(bend, channel);
        this.midiConnection.sendMidiNote(note, channel, velocity, duration, port);
        if (bend) this.midiConnection.sendPitchBend(8192, channel);
    }
    
}