import { getAllScaleNotes } from 'zifferjs';
import {
  MidiCCEvent,
  MidiNoteEvent,
} from "../IO/MidiConnection";
import { MidiEvent, MidiParams } from "../Classes/MidiEvent";

interface ControlChange {
  channel: number;
  control: number;
  value: number;
}


export const midi_outputs = (app: any) => (): void => {
  app._logMessage(app.MidiConnection.listMidiOutputs(), false);
};

export const midi_output = (app: any) => (outputName: string): void => {
  if (!outputName) {
    console.log(app.MidiConnection.getCurrentMidiPort());
  } else {
    app.MidiConnection.switchMidiOutput(outputName);
  }
};

export const midi = (app: any) => (
  value: number | number[] = 60,
  velocity?: number | number[],
  channel?: number | number[],
  port?: number | string | number[] | string[],
): MidiEvent => {
  const event = { note: value, velocity, channel, port } as MidiParams;
  return new MidiEvent(event, app);
};

export const sysex = (app: any) => (data: Array<number>): void => {
  app.MidiConnection.sendSysExMessage(data);
};

export const pitch_bend = (app: any) => (value: number, channel: number): void => {
  app.MidiConnection.sendPitchBend(value, channel);
};

export const program_change = (app: any) => (program: number, channel: number): void => {
  app.MidiConnection.sendProgramChange(program, channel);
};

export const midi_clock = (app: any) => (): void => {
  app.MidiConnection.sendMidiClock();
};

export const control_change = (app: any) => ({
  control = 20,
  value = 0,
  channel = 0,
}: ControlChange): void => {
  app.MidiConnection.sendMidiControlChange(control, value, channel);
};

export const cc = control_change;

export const midi_panic = (app: any) => (): void => {
  app.MidiConnection.panic();
};

export const active_note_events = (app: any) => (
  channel?: number,
): MidiNoteEvent[] | undefined => {
  let events;
  if (channel) {
    events = app.MidiConnection.activeNotesFromChannel(channel);
  } else {
    events = app.MidiConnection.activeNotes;
  }
  if (events.length > 0) return events;
  else return undefined;
};

export const transmission = (app: any) => (): boolean => {
  return app.MidiConnection.activeNotes.length > 0;
};

export const active_notes = (app: any) => (channel?: number): number[] | undefined => {
  const events = active_note_events(app)(channel);
  if (events && events.length > 0) return events.map((e) => e.note);
  else return undefined;
};

export const kill_active_notes = (app: any) => (): void => {
  app.MidiConnection.activeNotes = [];
};

export const sticky_notes = (app: any) => (channel?: number): number[] | undefined => {
  let notes;
  if (channel) notes = app.MidiConnection.stickyNotesFromChannel(channel);
  else notes = app.MidiConnection.stickyNotes;
  if (notes.length > 0) return notes.map((e: any) => e.note);
  else return undefined;
};

export const kill_sticky_notes = (app: any) => (): void => {
  app.MidiConnection.stickyNotes = [];
};

export const buffer = (app: any) => (channel?: number): boolean => {
  if (channel)
    return (
      app.MidiConnection.findNoteFromBufferInChannel(channel) !== undefined
    );
  else return app.MidiConnection.noteInputBuffer.length > 0;
};

export const buffer_event = (app: any) => (channel?: number): MidiNoteEvent | undefined => {
  if (channel)
    return app.MidiConnection.findNoteFromBufferInChannel(channel);
  else return app.MidiConnection.noteInputBuffer.shift();
};

export const buffer_note = (app: any) => (channel?: number): number | undefined => {
  const note = buffer_event(app)(channel);
  return note ? note.note : undefined;
};

export const last_note_event = (app: any) => (channel?: number): MidiNoteEvent | undefined => {
  if (channel) return app.MidiConnection.lastNoteInChannel[channel];
  else return app.MidiConnection.lastNote;
};

export const last_note = (app: any) => (channel?: number): number => {
  const note = last_note_event(app)(channel);
  return note ? note.note : 60;
};

export const ccIn = (app: any) => (control: number, channel?: number): number => {
  if (channel) {
    if (app.MidiConnection.lastCCInChannel[channel]) {
      return app.MidiConnection.lastCCInChannel[channel][control];
    } else return 0;
  } else return app.MidiConnection.lastCC[control] || 0;
};

export const has_cc = (app: any) => (channel?: number): boolean => {
  if (channel)
    return (
      app.MidiConnection.findCCFromBufferInChannel(channel) !== undefined
    );
  else return app.MidiConnection.ccInputBuffer.length > 0;
};

export const buffer_cc = (app: any) => (channel?: number): MidiCCEvent | undefined => {
  if (channel) return app.MidiConnection.findCCFromBufferInChannel(channel);
  else return app.MidiConnection.ccInputBuffer.shift();
};

export const show_scale = (app: any) => (
  root: number | string,
  scale: number | string,
  channel: number = 0,
  port: number | string = app.MidiConnection.currentOutputIndex || 0,
  soundOff: boolean = false,
): void => {
  if (!app.scale_aid || scale !== app.scale_aid) {
    hide_scale(app)(channel, port);
    const scaleNotes = getAllScaleNotes(scale, root);
    scaleNotes.forEach((note) => {
      app.MidiConnection.sendMidiOn(note, channel, 1, port);
      if (soundOff) app.MidiConnection.sendAllSoundOff(channel, port);
    });
    app.scale_aid = scale;
  }
};

export const hide_scale = (app: any) => (
  channel: number = 0,
  port: number | string = app.MidiConnection.currentOutputIndex || 0,
): void => {
  const allNotes = Array.from(Array(128).keys());
  allNotes.forEach((note) => {
    app.MidiConnection.sendMidiOff(note, channel, port);
  });
  app.scale_aid = undefined;
};

export const midi_notes_off = (app: any) => (
  channel: number = 0,
  port: number | string = app.MidiConnection.currentOutputIndex || 0,
): void => {
  app.MidiConnection.sendAllNotesOff(channel, port);
};

export const midi_sound_off = (app: any) => (
  channel: number = 0,
  port: number | string = app.MidiConnection.currentOutputIndex || 0,
): void => {
  app.MidiConnection.sendAllSoundOff(channel, port);
};
