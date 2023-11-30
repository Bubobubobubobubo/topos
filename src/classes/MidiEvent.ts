import { AudibleEvent } from "./AbstractEvents";
import { type Editor } from "../main";
import { MidiConnection } from "../IO/MidiConnection";
import { noteFromPc } from "zifferjs";
import {
  filterObject,
  arrayOfObjectsToObjectWithArrays,
  objectWithArraysToArrayOfObjects,
} from "../Utils/Generic";

export type MidiParams = {
  note: number;
  bend?: number;
  channel?: number;
  port?: number;
  sustain?: number;
  velocity?: number;
};

export class MidiEvent extends AudibleEvent {
  midiConnection: MidiConnection;

  constructor(
    input: MidiParams,
    public app: Editor,
  ) {
    super(app);
    this.values = input;
    this.midiConnection = app.api.MidiConnection;
  }

  sustain = (value: number | number[]): this => {
    this.values["sustain"] = value;
    return this;
  };

  velocity = (value: number | number[]): this => {
    this.values["velocity"] = value;
    return this;
  };

  channel = (value: number | number[]): this => {
    this.values["channel"] = value;
    return this;
  };

  port = (value: number | string | number[] | string[]): this => {
    if (typeof value === "string") {
      this.values["port"] = this.midiConnection.getMidiOutputIndex(value);
    } else if (Array.isArray(value)) {
      this.values["port"] = value.map((v) =>
        typeof v === "string" ? this.midiConnection.getMidiOutputIndex(v) : v,
      );
    }
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
    // Get key, pitch, parsedScale and octave from this.values object
    const filteredValues = filterObject(this.values, [
      "key",
      "pitch",
      "parsedScale",
      "octave",
    ]);

    const events = objectWithArraysToArrayOfObjects(filteredValues, [
      "parsedScale",
    ]);

    events.forEach((event) => {
      const [note, bend] = noteFromPc(
        (event.key as number) || "C4",
        (event.pitch as number) || 0,
        (event.parsedScale as number[]) || event.scale || "MAJOR",
        (event.octave as number) || 0,
      );
      event.note = note;
      if (bend) event.bend = bend;
    });

    const newArrays = arrayOfObjectsToObjectWithArrays(events) as MidiParams;

    this.values.note = newArrays.note;
    if (newArrays.bend) this.values.bend = newArrays.bend;
  };

  out = (): void => {
    function play(event: MidiEvent, params: MidiParams): void {
      const channel = params.channel ? params.channel : 0;
      const velocity = params.velocity ? params.velocity : 100;
      const note = params.note ? params.note : 60;

      const sustain = params.sustain
        ? params.sustain * event.app.clock.pulse_duration * event.app.api.ppqn()
        : event.app.clock.pulse_duration * event.app.api.ppqn();

      const bend = params.bend ? params.bend : undefined;

      const port = params.port
        ? event.midiConnection.getMidiOutputIndex(params.port)
        : event.midiConnection.getCurrentMidiPortIndex() || 0;

      event.midiConnection.sendMidiNote(
        note,
        channel,
        velocity,
        sustain,
        port,
        bend,
      );
    }

    const events = objectWithArraysToArrayOfObjects(this.values, [
      "parsedScale",
    ]) as MidiParams[];

    events.forEach((p: MidiParams) => {
      play(this, p);
    });
  };
}
