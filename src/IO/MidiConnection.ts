import { UserAPI } from "../API";
import { AppSettings } from "../AppSettings";

export type MidiNoteEvent = {
  note: number;
  velocity: number;
  channel: number;
  timestamp: number;
}

export type MidiCCEvent = {
  control: number;
  value: number;
  channel: number;
  timestamp: number;
}

export class MidiConnection {
  /**
   * Wrapper class for Web MIDI API. Provides methods for sending MIDI messages.
   *
   *
   * @param midiAccess - Web MIDI API access object
   * @param midiOutputs - Array of MIDI output objects
   * @param currentOutputIndex - Index of the currently selected MIDI output
   * @param scheduledNotes - Object containing scheduled notes. Keys are note numbers and values are timeout IDs.
   */

  /* Midi output */
  private api: UserAPI;
  private settings: AppSettings;
  private midiAccess: MIDIAccess | null = null;
  public midiOutputs: MIDIOutput[] = [];
  private currentOutputIndex: number = 0;
  private scheduledNotes: { [noteNumber: number]: number } = {}; // { noteNumber: timeoutId }

  /* Midi input */
  public midiInputs: MIDIInput[] = [];
  private currentInputIndex: number | undefined = undefined;
  public bufferLength: number = 512; // 32*16
  public noteInputBuffer: MidiNoteEvent[] = [];
  public ccInputBuffer: MidiCCEvent[] = [];
  public activeNotes: MidiNoteEvent[] = [];
  public stickyNotes: MidiNoteEvent[] = [];
  public lastNote: MidiNoteEvent | undefined = undefined;
  public lastCC: { [control: number]: number } = {};
  public lastNoteInChannel: { [channel: number]: MidiNoteEvent } = {};
  public lastCCInChannel: { [channel: number]: { [control: number]: number } } = {};

  /* MIDI clock stuff */
  private midiClockInputIndex: number | undefined = undefined;
  private midiClockInput?: MIDIInput | undefined = undefined;
  private lastTimestamp: number = 0;
  private midiClockDelta: number = 0;
  private lastBPM: number;
  private roundedBPM: number = 0;
  private clockBuffer: number[] = [];
  private clockBufferLength = 24;
  private clockTicks = 0;
  private clockErrorCount = 0;
  private skipOnError = 0;

  constructor(api: UserAPI, settings: AppSettings) {
    this.api = api;
    this.settings = settings;
    this.lastBPM = api.bpm();
    this.roundedBPM = this.lastBPM;
    this.initializeMidiAccess();
  }

  private async initializeMidiAccess(): Promise<void> {
    /**
     * Initializes Web MIDI API access and populates the list of MIDI outputs.
     *
     * @returns Promise
     */
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.midiOutputs = Array.from(this.midiAccess.outputs.values());
      if (this.midiOutputs.length === 0) {
        console.warn("No MIDI outputs available.");
        this.currentOutputIndex = -1;
      }
      this.midiInputs = Array.from(this.midiAccess.inputs.values());
      if (this.midiInputs.length === 0) {
        console.warn("No MIDI inputs available.");
      } else {
        this.updateInputSelects();
      }
    } catch (error) {
      console.error("Failed to initialize MIDI:", error);
    }
  }

  public getCurrentMidiPort(): string | null {
    /**
     * Returns the name of the currently selected MIDI output.
     *
     * @returns Name of the currently selected MIDI output or null if no MIDI output is selected or available.
     */
    if (
      this.midiOutputs.length > 0 &&
      this.currentOutputIndex >= 0 &&
      this.currentOutputIndex < this.midiOutputs.length
    ) {
      return this.midiOutputs[this.currentOutputIndex].name;
    } else {
      console.error("No MIDI output selected or available.");
      return null;
    }
  }

  public sendStartMessage(): void {
    /**
     * Sends a MIDI Start message to the currently selected MIDI output and MIDI clock is not used
     */
    if (!this.midiClockInput) {
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        output.send([0xfa]); // Send MIDI Start message
      }
    }
  }

  public sendStopMessage(): void {
    /**
     * Sends a MIDI Stop message to the currently selected MIDI output and MIDI clock is not used
     */
    if (!this.midiClockInput) {
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        output.send([0xfc]); // Send MIDI Stop message
      }
    }
  }

  public getCurrentMidiPortIndex(): number {
    /**
     * Returns the index of the currently selected MIDI output.
     *
     * @returns Index of the currently selected MIDI output or -1 if no MIDI output is selected or available.
     */
    if (
      this.midiOutputs.length > 0 &&
      this.currentOutputIndex >= 0 &&
      this.currentOutputIndex < this.midiOutputs.length
    ) {
      return this.currentOutputIndex;
    } else {
      console.error("No MIDI output selected or available.");
      return -1;
    }
  }

  public setMidiClock(inputName: string | number): void {
    /**
     * Sets the MIDI input to use for MIDI clock messages.
     *
     * @param inputName Name of the MIDI input to use for MIDI clock messages
     */
    const inputIndex = this.getMidiInputIndex(inputName);
    if (inputIndex !== -1) {
      this.midiClockInputIndex = inputIndex;
      this.midiClockInput = this.midiInputs[inputIndex];
      this.registerMidiInputListener(inputIndex);
    } else {
      this.midiClockInput = undefined;
    }
  }

  public updateInputSelects() {
    /**
     * Updates the MIDI clock input select element with the available MIDI inputs.
     */
    if (this.midiInputs.length > 0) {
      const midiClockSelect = document.getElementById("midi-clock-input") as HTMLSelectElement;
      const midiInputSelect = document.getElementById("default-midi-input") as HTMLSelectElement;

      midiClockSelect.innerHTML = "";
      midiInputSelect.innerHTML = "";

      // Set Midi clock as Internal by default
      const defaultOption = document.createElement("option");
      defaultOption.value = "-1";
      defaultOption.text = "Internal";
      midiClockSelect.appendChild(defaultOption);

      // Set default input as None by default
      const defaultInputOption = document.createElement("option");
      defaultInputOption.value = "-1";
      defaultInputOption.text = "None";
      midiInputSelect.appendChild(defaultInputOption);

      // Add MIDI inputs to clock select input and default midi input
      this.midiInputs.forEach((input, index) => {
        const option = document.createElement("option");
        option.value = index.toString();
        option.text = input.name || index.toString();
        midiClockSelect.appendChild(option);
        midiInputSelect.appendChild(option.cloneNode(true));
      });

      if (this.settings.midi_clock_input) {
        const clockMidiInputIndex = this.getMidiInputIndex(this.settings.midi_clock_input);
        midiClockSelect.value = clockMidiInputIndex.toString();
        if (clockMidiInputIndex > 0) {
          this.midiClockInput = this.midiInputs[clockMidiInputIndex];
          this.registerMidiInputListener(clockMidiInputIndex);
        }
      } else {
        midiClockSelect.value = "-1";
      }

      if (this.settings.default_midi_input) {
        const defaultMidiInputIndex = this.getMidiInputIndex(this.settings.default_midi_input);
        midiInputSelect.value = defaultMidiInputIndex.toString();
        if (defaultMidiInputIndex > 0) {
          this.currentInputIndex = defaultMidiInputIndex;
          this.registerMidiInputListener(defaultMidiInputIndex);
        }
      } else {
        midiInputSelect.value = "-1";
      }

      // Add midi clock listener
      midiClockSelect.addEventListener("change", (event) => {
        const value = (event.target as HTMLSelectElement).value;
        if (value === "-1") {
          if (this.midiClockInput && this.midiClockInputIndex != this.currentInputIndex) this.midiClockInput.onmidimessage = null;
          this.midiClockInput = undefined;
          this.settings.midi_clock_input = undefined;
        } else {
          const clockInputIndex = parseInt(value);
          this.midiClockInputIndex = clockInputIndex;
          if (this.midiClockInput && this.midiClockInputIndex != this.currentInputIndex) this.midiClockInput.onmidimessage = null;
          this.midiClockInput = this.midiInputs[clockInputIndex];
          this.registerMidiInputListener(clockInputIndex);
          this.settings.midi_clock_input = this.midiClockInput.name || undefined;
        }
      });

      // Add mini input listener
      midiInputSelect.addEventListener("change", (event) => {
        const value = (event.target as HTMLSelectElement).value;
        if (value === "-1") {
          if (this.currentInputIndex && this.currentInputIndex != this.midiClockInputIndex) this.unregisterMidiInputListener(this.currentInputIndex);
          this.currentInputIndex = undefined;
          this.settings.default_midi_input = undefined;
        } else {
          if (this.currentInputIndex && this.currentInputIndex != this.midiClockInputIndex) this.unregisterMidiInputListener(this.currentInputIndex);
          this.currentInputIndex = parseInt(value);
          this.registerMidiInputListener(this.currentInputIndex);
          this.settings.default_midi_input = this.midiInputs[this.currentInputIndex].name || undefined;
        }
      });

    }
  }

  public registerMidiInputListener(inputIndex: number): void {
    /**
     * Register midi input listener and store last value as global parameter named channel_{number}
     */
    if (inputIndex !== undefined) {
      const input = this.midiInputs[inputIndex];
      if (input && !input.onmidimessage) {
        input.onmidimessage = (event: Event) => {
          const message = event as MIDIMessageEvent;
          /* MIDI CLOCK */
          if (input.name === this.settings.midi_clock_input) {
            if (message.data[0] === 0xf8) {
              if (this.skipOnError > 0) {
                this.skipOnError -= 1;
              } else {
                this.onMidiClock(event.timeStamp);
              }
            } else if (message.data[0] === 0xfa) {
              console.log("MIDI start received");
              this.api.stop();
              this.api.play();
            } else if (message.data[0] === 0xfc) {
              console.log("MIDI stop received");
              this.api.pause();
            } else if (message.data[0] === 0xfb) {
              console.log("MIDI continue received");
              this.api.play();
            } else if (message.data[0] === 0xfe) {
              console.log("MIDI active sensing received");
            }
          }
          /* DEFAULT MIDI INPUT */
          if (input.name === this.settings.default_midi_input) {

            // If message is one of note ons
            if (message.data[0] >= 0x90 && message.data[0] <= 0x9F) {
              const channel = message.data[0] - 0x90 + 1;
              const note = message.data[1];
              const velocity = message.data[2];

              this.lastNote = { note, velocity, channel, timestamp: event.timeStamp };
              this.lastNoteInChannel[channel] = { note, velocity, channel, timestamp: event.timeStamp };

              if (this.settings.midi_channels_scripts) this.api.script(channel);

              this.pushToMidiInputBuffer({ note, velocity, channel, timestamp: event.timeStamp });
              this.activeNotes.push({ note, velocity, channel, timestamp: event.timeStamp });

              const sticky = this.removeFromStickyNotes(note, channel);
              if (!sticky) this.stickyNotes.push({ note, velocity, channel, timestamp: event.timeStamp });
            }

            // If note off
            if (message.data[0] >= 0x80 && message.data[0] <= 0x8F) {
              const channel = message.data[0] - 0x80 + 1;
              const note = message.data[1];
              this.removeFromActiveNotes(note, channel);
            }

            // If message is one of CCs
            if (message.data[0] >= 0xB0 && message.data[0] <= 0xBF) {

              const channel = message.data[0] - 0xB0 + 1;
              const control = message.data[1];
              const value = message.data[2];

              this.lastCC[control] = value;
              if (this.lastCCInChannel[channel]) {
                this.lastCCInChannel[channel][control] = value;
              } else {
                this.lastCCInChannel[channel] = {};
                this.lastCCInChannel[channel][control] = value;
              }

              //console.log(`CC: ${control} VALUE: ${value} CHANNEL: ${channel}`);

              this.pushToMidiCCBuffer({ control, value, channel, timestamp: event.timeStamp });

            }


          }
        }
      }
    }
  }

  /* Methods for handling active midi notes */

  public removeFromActiveNotes(note: number, channel: number): void {
    const index = this.activeNotes.findIndex((e) => e.note === note && e.channel === channel);
    if (index >= 0) this.activeNotes.splice(index, 1);
  }

  public removeFromStickyNotes(note: number, channel: number): boolean {
    const index = this.stickyNotes.findIndex((e) => e.note === note && e.channel === channel);
    if (index >= 0) {
      this.stickyNotes.splice(index, 1);
      return true;
    } else { return false; }
  }

  public stickyNotesFromChannel(channel: number): MidiNoteEvent[] {
    return this.stickyNotes.filter((e) => e.channel === channel);
  }

  public activeNotesFromChannel(channel: number): MidiNoteEvent[] {
    return this.activeNotes.filter((e) => e.channel === channel);
  }

  public killActiveNotes(): void {
    this.activeNotes = [];
  }

  public killActiveNotesFromChannel(channel: number): void {
    this.activeNotes = this.activeNotes.filter((e) => e.channel !== channel);
  }

  /* Methods for handling midi input buffers */

  private pushToMidiInputBuffer(event: MidiNoteEvent): void {
    this.noteInputBuffer.push(event);
    if (this.noteInputBuffer.length > this.bufferLength) {
      this.noteInputBuffer.shift();
    }
  }

  private pushToMidiCCBuffer(event: MidiCCEvent): void {
    this.ccInputBuffer.push(event);
    if (this.ccInputBuffer.length > this.bufferLength) {
      this.ccInputBuffer.shift();
    }
  }

  public findNoteFromBufferInChannel(channel: number | undefined) {
    const index = this.noteInputBuffer.findIndex((e) => e.channel === channel);
    if (index >= 0) {
      const event = this.noteInputBuffer[index];
      this.noteInputBuffer.splice(index, 1);
      return event;
    } else {
      return undefined;
    }
  }

  public findCCFromBufferInChannel(channel: number | undefined) {
    const index = this.ccInputBuffer.findIndex((e) => e.channel === channel);
    if (index >= 0) {
      const event = this.ccInputBuffer[index];
      this.ccInputBuffer.splice(index, 1);
      return event;
    } else {
      return undefined;
    }
  }

  public unregisterMidiInputListener(inputIndex: number): void {
    /**
     * Unregister midi input listener
     */
    if (inputIndex !== undefined) {
      const input = this.midiInputs[inputIndex];
      if (input) {
        input.onmidimessage = null;
      }
    }
  }


  public onMidiClock(timestamp: number): void {
    /**
     * Called when a MIDI clock message is received.
     */

    this.clockTicks += 1;

    if (this.lastTimestamp > 0) {

      if (this.lastTimestamp === timestamp) {
        // This is error handling for odd MIDI clock messages with the same timestamp
        this.clockErrorCount += 1;
      } else {
        if (this.clockErrorCount > 0) {
          console.log("Timestamp error count: ", this.clockErrorCount);
          console.log("Current timestamp: ", timestamp);
          console.log("Last timestamp: ", this.lastTimestamp);
          console.log("Last delta: ", this.midiClockDelta);
          console.log("Current delta: ", timestamp - this.lastTimestamp);
          console.log("BPMs", this.clockBuffer);
          this.clockErrorCount = 0;
          /* I dont know why this happens. But when it does, deltas for the following messages are off.
             So skipping ~ quarted of clock resolution usually helps */
          this.skipOnError = this.settings.midi_clock_ppqn / 4;
          timestamp = 0; // timestamp 0 == lastTimestamp 0
        } else {

          this.midiClockDelta = timestamp - this.lastTimestamp;
          this.lastBPM = 60 * (1000 / this.midiClockDelta / this.settings.midi_clock_ppqn);

          this.clockBuffer.push(this.lastBPM);
          if (this.clockBuffer.length > this.clockBufferLength) this.clockBuffer.shift();

          const estimatedBPM = this.estimatedBPM();
          if (estimatedBPM !== this.roundedBPM) {
            console.log("Estimated BPM: ", estimatedBPM);
            this.api.bpm(estimatedBPM);
            this.roundedBPM = estimatedBPM;
          }

        }
      }
    }

    this.lastTimestamp = timestamp;

  }

  public estimatedBPM(): number {
    /**
     * Returns the estimated BPM based on the last 24 MIDI clock messages.
     *
     * @returns Estimated BPM
     */
    const sum = this.clockBuffer.reduce((a, b) => a + b);
    return Math.round(sum / this.clockBuffer.length);
  }

  public sendMidiClock(): void {
    /**
     * Sends a single MIDI clock message to the currently selected MIDI output.
     */
    if (!this.midiClockInput) {
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        output.send([0xf8]); // Send a single MIDI clock message
      }
    }
  }

  public switchMidiOutput(outputName: string): boolean {
    /**
     * Switches the currently selected MIDI output.
     *
     * @param outputName Name of the MIDI output to switch to
     * @returns True if the MIDI output was found and switched to, false otherwise
     */
    const index = this.getMidiOutputIndex(outputName);
    if (index !== -1) {
      this.currentOutputIndex = index;
      return true;
    } else {
      return false;
    }
  }

  public getMidiOutputIndex(output: string | number): number {
    /**
     * Returns the index of the MIDI output with the specified name.
     *
     * @param outputName Name of the MIDI output
     * @returns Index of the new MIDI output or current output if new is not valid
     *
     */
    if (typeof output === "number") {
      if (output < 0 || output >= this.midiOutputs.length) {
        console.error(
          `Invalid MIDI output index. Index must be in the range 0-${this.midiOutputs.length - 1
          }.`
        );
        return this.currentOutputIndex;
      } else {
        return output;
      }
    } else {
      const index = this.midiOutputs.findIndex((o) => o.name === output);
      if (index !== -1) {
        return index;
      } else {
        console.error(`MIDI output "${output}" not found.`);
        return this.currentOutputIndex;
      }
    }
  }

  public getMidiInputIndex(input: string | number): number {
    /**
     * Returns the index of the MIDI input with the specified name.
     *
     * @param input Name or index of the MIDI input
     * @returns Index of the new MIDI input or -1 if not valid
     *
     */
    if (typeof input === "number") {
      if (input < 0 || input >= this.midiInputs.length) {
        console.error(
          `Invalid MIDI input index. Index must be in the range 0-${this.midiInputs.length - 1
          }.`
        );
        return -1;
      } else {
        return input;
      }
    } else {
      const index = this.midiInputs.findIndex((o) => o.name === input);
      if (index !== -1) {
        return index;
      } else {
        console.error(`MIDI input "${input}" not found.`);
        return -1;
      }
    }
  }

  public listMidiOutputs(): string {
    /**
     * Lists all available MIDI outputs to the console.
     */
    let final_string = "Available MIDI Outputs: ";
    this.midiOutputs.forEach((output, index) => {
      final_string += `(${index + 1}) ${output.name} `;
    });
    return final_string;
  }

  public sendMidiNote(
    noteNumber: number,
    channel: number,
    velocity: number,
    duration: number,
    port: number | string = this.currentOutputIndex,
    bend: number | undefined = undefined
  ): void {
    /**
     * Sending a MIDI Note on/off message with the same note number and channel. Automatically manages
     * the note off message after the specified duration.
     *
     * @param noteNumber MIDI note number (0-127)
     * @param channel MIDI channel (0-15)
     * @param velocity MIDI velocity (0-127)
     * @param duration Duration in milliseconds
     *
     */

    if (typeof port === "string") port = this.getMidiOutputIndex(port);
    const output = this.midiOutputs[port];
    noteNumber = Math.min(Math.max(noteNumber, 0), 127);
    if (output) {
      const noteOnMessage = [0x90 + channel, noteNumber, velocity];
      const noteOffMessage = [0x80 + channel, noteNumber, 0];

      // Send Note On
      output.send(noteOnMessage);

      if (bend) this.sendPitchBend(bend, channel, port);

      // Schedule Note Off
      const timeoutId = setTimeout(() => {
        output.send(noteOffMessage);
        if (bend) this.sendPitchBend(8192, channel, port);
        delete this.scheduledNotes[noteNumber];
      }, (duration - 0.02) * 1000);

      this.scheduledNotes[noteNumber] = timeoutId;
    } else {
      console.error("MIDI output not available.");
    }
  }

  public sendSysExMessage(message: number[]): void {
    /**
     * Sends a SysEx message to the currently selected MIDI output.
     *
     * @param message Array of SysEx message bytes
     *
     * @example
     * // Send a SysEx message to set the pitch bend range to 12 semitones
     * sendSysExMessage([0xF0, 0x43, 0x10, 0x4C, 0x08, 0x00, 0x01, 0x00, 0x02, 0xF7]);
     */
    const output = this.midiOutputs[this.currentOutputIndex];
    if (output) {
      output.send(message);
    } else {
      console.error("MIDI output not available.");
    }
  }

  public sendPitchBend(
    value: number,
    channel: number,
    port: number | string = this.currentOutputIndex
  ): void {
    /**
     * Sends a MIDI Pitch Bend message to the currently selected MIDI output.
     *
     * @param value MIDI pitch bend value (0-16383)
     * @param channel MIDI channel (0-15)
     *
     */
    if (value < 0 || value > 16383) {
      console.error(
        "Invalid pitch bend value. Value must be in the range 0-16383."
      );
    }
    if (channel < 0 || channel > 15) {
      console.error("Invalid MIDI channel. Channel must be in the range 0-15.");
    }
    if (typeof port === "string") port = this.getMidiOutputIndex(port);
    const output = this.midiOutputs[port];
    if (output) {
      const lsb = value & 0x7f;
      const msb = (value >> 7) & 0x7f;
      output.send([0xe0 | channel, lsb, msb]);
    } else {
      console.error("MIDI output not available.");
    }
  }

  public sendProgramChange(programNumber: number, channel: number): void {
    /**
     * Sends a MIDI Program Change message to the currently selected MIDI output.
     *
     * @param programNumber MIDI program number (0-127)
     * @param channel MIDI channel (0-15)
     *
     * @example
     * // Send a Program Change message to select program 1 on channel 1
     * sendProgramChange(0, 0);
     */
    const output = this.midiOutputs[this.currentOutputIndex];
    if (output) {
      output.send([0xc0 + channel, programNumber]); // Program Change
    } else {
      console.error("MIDI output not available.");
    }
  }

  public sendMidiControlChange(
    controlNumber: number,
    value: number,
    channel: number
  ): void {
    /**
     * Sends a MIDI Control Change message to the currently selected MIDI output.
     *
     * @param controlNumber MIDI control number (0-127)
     * @param value MIDI control value (0-127)
     * @param channel MIDI channel (0-15)
     */
    const output = this.midiOutputs[this.currentOutputIndex];
    if (output) {
      output.send([0xb0 + channel, controlNumber, value]); // Control Change
    } else {
      console.error("MIDI output not available.");
    }
  }

  public panic(): void {
    /**
     * Sends a Note Off message for all scheduled notes.
     */
    const output = this.midiOutputs[this.currentOutputIndex];
    if (output) {
      for (const noteNumber in this.scheduledNotes) {
        const timeoutId = this.scheduledNotes[noteNumber];
        clearTimeout(timeoutId);
        output.send([0x80, parseInt(noteNumber), 0]); // Note Off
      }
      this.scheduledNotes = {};
    } else {
      console.error("MIDI output not available.");
    }
  }
}
