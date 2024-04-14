import { getAllScaleNotes } from 'zifferjs';
import {
  MidiCCEvent,
  MidiNoteEvent,
} from "../IO/MidiConnection";
import { MidiEvent, MidiParams } from "../Classes/MidiEvent";
import { UserAPI } from './API';
import { Editor } from '../main';

interface ControlChange {
  channel: number;
  control: number;
  value: number;
}

export const midi_outputs = (api: UserAPI) => (): void => {
  api._logMessage(api.MidiConnection.listMidiOutputs(), false);
};

export const midi_output = (api: UserAPI) => (outputName: string): void => {
  if (!outputName) {
    console.log(api.MidiConnection.getCurrentMidiPort());
  } else {
    api.MidiConnection.switchMidiOutput(outputName);
  }
};

export const midi = (app: Editor) => (
  value: number | number[] = 60,
  velocity?: number | number[],
  channel?: number | number[],
  port?: number | string | number[] | string[],
): MidiEvent => {
  const event = { note: value, velocity, channel, port } as MidiParams;
  return new MidiEvent(event, app);
};

export const sysex = (api: UserAPI) => (data: Array<number>): void => {
  api.MidiConnection.sendSysExMessage(data);
};

export const pitch_bend = (api: UserAPI) => (value: number, channel: number): void => {
  api.MidiConnection.sendPitchBend(value, channel);
};

export const program_change = (api: UserAPI) => (program: number, channel: number): void => {
  api.MidiConnection.sendProgramChange(program, channel);
};

export const midi_clock = (api: UserAPI) => (): void => {
  api.MidiConnection.sendMidiClock();
};

export const control_change = (api: UserAPI) => ({
  control = 20,
  value = 0,
  channel = 0,
}: ControlChange): void => {
  api.MidiConnection.sendMidiControlChange(control, value, channel);
};

export const cc = control_change;

export const midi_panic = (api: UserAPI) => (): void => {
  api.MidiConnection.panic();
};

export const active_note_events = (api: UserAPI) => (
  channel?: number,
): MidiNoteEvent[] | undefined => {
  let events;
  if (channel) {
    events = api.MidiConnection.activeNotesFromChannel(channel);
  } else {
    events = api.MidiConnection.activeNotes;
  }
  if (events.length > 0) return events;
  else return undefined;
};

export const transmission = (api: UserAPI) => (): boolean => {
  return api.MidiConnection.activeNotes.length > 0;
};

export const active_notes = (api: UserAPI) => (channel?: number): number[] | undefined => {
  const events = active_note_events(api)(channel);
  if (events && events.length > 0) return events.map((e) => e.note);
  else return undefined;
};

export const kill_active_notes = (api: UserAPI) => (): void => {
  api.MidiConnection.activeNotes = [];
};

export const sticky_notes = (api: UserAPI) => (channel?: number): number[] | undefined => {
  let notes;
  if (channel) notes = api.MidiConnection.stickyNotesFromChannel(channel);
  else notes = api.MidiConnection.stickyNotes;
  if (notes.length > 0) return notes.map((e: any) => e.note);
  else return undefined;
};

export const kill_sticky_notes = (api: UserAPI) => (): void => {
  api.MidiConnection.stickyNotes = [];
};

export const buffer = (api: UserAPI) => (channel?: number): boolean => {
  if (channel)
    return (
      api.MidiConnection.findNoteFromBufferInChannel(channel) !== undefined
    );
  else return api.MidiConnection.noteInputBuffer.length > 0;
};

export const buffer_event = (api: UserAPI) => (channel?: number): MidiNoteEvent | undefined => {
  if (channel)
    return api.MidiConnection.findNoteFromBufferInChannel(channel);
  else return api.MidiConnection.noteInputBuffer.shift();
};

export const buffer_note = (api: UserAPI) => (channel?: number): number | undefined => {
  const note = buffer_event(api)(channel);
  return note ? note.note : undefined;
};

export const last_note_event = (api: UserAPI) => (channel?: number): MidiNoteEvent | undefined => {
  if (channel) return api.MidiConnection.lastNoteInChannel[channel];
  else return api.MidiConnection.lastNote;
};

export const last_note = (api: UserAPI) => (channel?: number): number => {
  const note = last_note_event(api)(channel);
  return note ? note.note : 60;
};

export const ccIn = (api: UserAPI) => (control: number, channel?: number): number => {
  if (channel) {
    if (api.MidiConnection.lastCCInChannel[channel]) {
      return api.MidiConnection.lastCCInChannel[channel][control];
    } else return 0;
  } else return api.MidiConnection.lastCC[control] || 0;
};

export const has_cc = (api: UserAPI) => (channel?: number): boolean => {
  if (channel)
    return (
      api.MidiConnection.findCCFromBufferInChannel(channel) !== undefined
    );
  else return api.MidiConnection.ccInputBuffer.length > 0;
};

export const buffer_cc = (api: UserAPI) => (channel?: number): MidiCCEvent | undefined => {
  if (channel) return api.MidiConnection.findCCFromBufferInChannel(channel);
  else return api.MidiConnection.ccInputBuffer.shift();
};

export const show_scale = (api: UserAPI) => (
  root: number | string,
  scale: number | string,
  channel: number = 0,
  port: number | string = api.MidiConnection.currentOutputIndex || 0,
  soundOff: boolean = false,
): void => {
  if (!api.scale_aid || scale !== api.scale_aid) {
    hide_scale(api)(channel, port);
    const scaleNotes = getAllScaleNotes(scale, root);
    scaleNotes.forEach((note) => {
      api.MidiConnection.sendMidiOn(note, channel, 1, port);
      if (soundOff) api.MidiConnection.sendAllSoundOff(channel, port);
    });
    api.scale_aid = scale;
  }
};

export const hide_scale = (api: UserAPI) => (
  channel: number = 0,
  port: number | string = api.MidiConnection.currentOutputIndex || 0,
): void => {
  const allNotes = Array.from(Array(128).keys());
  allNotes.forEach((note) => {
    api.MidiConnection.sendMidiOff(note, channel, port);
  });
  api.scale_aid = undefined;
};

export const midi_notes_off = (api: UserAPI) => (
  channel: number = 0,
  port: number | string = api.MidiConnection.currentOutputIndex || 0,
): void => {
  api.MidiConnection.sendAllNotesOff(channel, port);
};

export const midi_sound_off = (api: UserAPI) => (
  channel: number = 0,
  port: number | string = api.MidiConnection.currentOutputIndex || 0,
): void => {
  api.MidiConnection.sendAllSoundOff(channel, port);
};
