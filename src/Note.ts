import { Event } from './Event';
import { type Editor } from './main';
import { MidiConnection } from "./IO/MidiConnection";
import { freqToMidi, resolvePitchBend } from 'zifferjs';

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
        const funcResult = func(this);
        if(funcResult instanceof Object) {
            return funcResult;
            
        }
        else {
            func(this.values);
            return this;
        }
    }

    freq = (value: number): this => {
        this.values['freq'] = value;
        const midiNote = freqToMidi(value);
        if(midiNote % 1 !== 0) {
            this.values['note'] = Math.floor(midiNote);
            this.values['bend'] = resolvePitchBend(midiNote)[1];
        } else {
            this.values['note'] = midiNote;
        }
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
        this.values.duration * this.app.clock.pulse_duration * this.app.api.ppqn() : 
        this.app.clock.pulse_duration * this.app.api.ppqn();
        
        const bend = this.values.bend ? this.values.bend : undefined;
        
        const port = this.values.port ? 
        this.midiConnection.getMidiOutputIndex(this.values.port) : 
        this.midiConnection.getCurrentMidiPortIndex();

        this.midiConnection.sendMidiNote(note, channel, velocity, duration, port, bend);
    }
    
}