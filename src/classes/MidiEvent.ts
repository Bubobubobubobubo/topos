import { AudibleEvent } from "./AbstractEvents";
import { type Editor } from "../main";
import { MidiConnection } from "../IO/MidiConnection";
import { midiToFreq, noteFromPc } from "zifferjs";

export type MidiParams = {
  note: number;
  bend?: number;
  channel?: number;
  port?: number;
  sustain?: number;
}

export class MidiEvent extends AudibleEvent {
  midiConnection: MidiConnection;

  constructor(input: number | object, public app: Editor) {
    super(app);
    if (typeof input === "number") this.values["note"] = input;
    else this.values = input;
    this.midiConnection = app.api.MidiConnection;
  }

  chord = (value: MidiParams[]): this => {
    this.values["chord"] = value;
    return this;
  };
  
  note = (value: number): this => {
    this.values["note"] = value;
    return this;
  };

  sustain = (value: number): this => {
    this.values["sustain"] = value;
    return this;
  };

  channel = (value: number): this => {
    this.values["channel"] = value;
    return this;
  };

  port = (value: number | string): this => {
    this.values["port"] = this.midiConnection.getMidiOutputIndex(value);
    return this;
  };

  add = (value: number): this => {
    this.values.note += value;
    return this;
  };

  modify = (func: Function): this => {
    const funcResult = func(this);
    if (funcResult instanceof Object) {
      return funcResult;
    } else {
      func(this.values);
      this.update();
      return this;
    }
  };

  bend = (value: number): this => {
    this.values["bend"] = value;
    return this;
  };

  random = (min: number = 0, max: number = 127): this => {
    min = Math.min(Math.max(min, 0), 127);
    max = Math.min(Math.max(max, 0), 127);
    this.values["note"] = Math.floor(this.randomGen() * (max - min + 1)) + min;
    return this;
  };

  update = (): void => {
    const [note, bend] = noteFromPc(
      this.values.key || "C4",
      this.values.pitch || 0,
      this.values.parsedScale || "MAJOR",
      this.values.octave || 0
    );
    this.values.note = note;
    this.values.freq = midiToFreq(note);
    if (bend) this.values.bend = bend;
  };

  out = (): void => {
    function play(event: MidiEvent, params?: MidiParams): void {
      const paramChannel = params && params.channel ? params.channel : 0;
      const channel = event.values.channel ? event.values.channel : paramChannel;
      const velocity = event.values.velocity ? event.values.velocity : 100;
      const paramNote = params && params.note ? params.note : 60;
      const note = event.values.note ? event.values.note : paramNote;

      const sustain = event.values.sustain
        ? event.values.sustain *
          event.app.clock.pulse_duration *
          event.app.api.ppqn()
        : event.app.clock.pulse_duration * event.app.api.ppqn();

      const bend = event.values.bend ? event.values.bend : undefined;

      const port = event.values.port
        ? event.midiConnection.getMidiOutputIndex(event.values.port)
        : event.midiConnection.getCurrentMidiPortIndex();

      event.midiConnection.sendMidiNote(
        note,
        channel,
        velocity,
        sustain,
        port,
        bend
      );
    }

    if(this.values.chord) {
      this.values.chord.forEach((p: MidiParams) => {
        play(this, p);
      });
    } else {
      play(this);
    }
    
  };
}
