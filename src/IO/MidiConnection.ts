import { UserAPI } from "../API";

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

  private midiAccess: MIDIAccess | null = null;
  public midiOutputs: MIDIOutput[] = [];
  public midiInputs: MIDIInput[] = [];
  private currentOutputIndex: number = 0;
  private currentInputIndex: number|undefined = undefined;
  private midiClockInput?: MIDIInput|undefined = undefined;
  private lastClockTime: number = 0;
  private lastBPM: number;
  private clockBuffer: number[] = [];
  private clockBufferLength = 100;
  private scheduledNotes: { [noteNumber: number]: number } = {}; // { noteNumber: timeoutId }
  private api: UserAPI;

  constructor(api: UserAPI) {
    this.api = api;
    this.lastBPM = api.bpm();
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
        this.updateMidiClockSelect();
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
     * Sends a MIDI Start message to the currently selected MIDI output.
     */
    const output = this.midiOutputs[this.currentOutputIndex];
    if (output) {
      output.send([0xfa]); // Send MIDI Start message
    }
  }

  public sendStopMessage(): void {
    /**
     * Sends a MIDI Stop message to the currently selected MIDI output.
     */
    const output = this.midiOutputs[this.currentOutputIndex];
    if (output) {
      output.send([0xfc]); // Send MIDI Stop message
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

  public setMidiClock(inputName: string|number): void {
    /**
     * Sets the MIDI input to use for MIDI clock messages.
     *
     * @param inputName Name of the MIDI input to use for MIDI clock messages
     */
    const inputIndex = this.getMidiInputIndex(inputName);
    if (inputIndex !== -1) {
      this.midiClockInput = this.midiInputs[inputIndex];
      this.registerMidiClockListener();
    } else {
      this.midiClockInput = undefined;
    }
  }

  public updateMidiClockSelect() {
    /**
     * Updates the MIDI clock input select element with the available MIDI inputs.
     */
    if(this.midiInputs.length > 0) {
      const select = document.getElementById("midi-clock-input") as HTMLSelectElement;
      select.innerHTML = "";
      // Defaults to internal clock
      const defaultOption = document.createElement("option");
      defaultOption.value = "-1";
      defaultOption.text = "Internal";
      select.appendChild(defaultOption);
      // Add MIDI inputs to clock select input
      this.midiInputs.forEach((input, index) => {
        const option = document.createElement("option");
        option.value = index.toString();
        option.text = input.name || "No name input";
        select.appendChild(option);
      });
      select.value = this.currentInputIndex ? this.currentInputIndex.toString() : "-1";
      // Add listener
      select.addEventListener("change", (event) => {
        const value = (event.target as HTMLSelectElement).value;
        if(value === "-1") {
          if(this.midiClockInput) this.midiClockInput.onmidimessage = null;
          this.midiClockInput = undefined;
        } else {
          this.currentInputIndex = parseInt(value);
          if(this.midiClockInput) this.midiClockInput.onmidimessage = null;
          this.midiClockInput = this.midiInputs[this.currentInputIndex];
          this.registerMidiClockListener();
        }
      });
    }
  }

  public registerMidiClockListener(): void {
    /**
     * Registers a listener for MIDI clock messages on the currently selected MIDI input.
     */
    if (this.midiClockInput) {
      this.midiClockInput.onmidimessage = (event: Event) => {
        const message = event as MIDIMessageEvent;
        if (message.data[0] === 0xf8) {
          const timestamp = performance.now();
          const delta = timestamp - this.lastClockTime;
          const bpm = 60 * (1000 / delta / 24);
          this.lastClockTime = timestamp;
          this.clockBuffer.push(bpm);
          if(this.clockBuffer.length>this.clockBufferLength) this.clockBuffer.shift();
          const estimatedBPM = this.estimatedBPM();
          if(estimatedBPM !== this.lastBPM) {
            this.api.bpm(this.estimatedBPM());
            this.lastBPM = estimatedBPM;
          }
        } else if(message.data[0] === 0xfa) {
          console.log("MIDI start received");
        } else if(message.data[0] === 0xfc) {
          console.log("MIDI stop received");
        } else if(message.data[0] === 0xfb) {
          console.log("MIDI continue received");
        } else if(message.data[0] === 0xfe) {
          console.log("MIDI active sensing received");
        } else {
          // Ignore other MIDI messages
          console.log("Ignored MIDI message: ", message.data);
        }
      }
    }
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
    const output = this.midiOutputs[this.currentOutputIndex];
    if (output) {
      output.send([0xf8]); // Send a single MIDI clock message
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
          `Invalid MIDI output index. Index must be in the range 0-${
            this.midiOutputs.length - 1
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
          `Invalid MIDI input index. Index must be in the range 0-${
            this.midiInputs.length - 1
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
