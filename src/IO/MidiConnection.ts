export class MidiConnection{

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
    private currentOutputIndex: number = 0;
    private scheduledNotes: { [noteNumber: number]: number } = {}; // { noteNumber: timeoutId }
  
    constructor() {
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
          console.warn('No MIDI outputs available.');
        }
      } catch (error) {
        console.error('Failed to initialize MIDI:', error);
      }
    }
 
    public getCurrentMidiPort(): string | null {
      /**
       * Returns the name of the currently selected MIDI output.
       * 
       * @returns Name of the currently selected MIDI output or null if no MIDI output is selected or available.
       */
      if (this.midiOutputs.length > 0 && this.currentOutputIndex >= 0 && this.currentOutputIndex < this.midiOutputs.length) {
          return this.midiOutputs[this.currentOutputIndex].name;
      } else {
          console.error('No MIDI output selected or available.');
          return null;
      }
    }


    public sendMidiClock(): void {
      /**
       * Sends a single MIDI clock message to the currently selected MIDI output.
       */
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        output.send([0xF8]); // Send a single MIDI clock message
      } else {
        console.error('MIDI output not available.');
      }
    }
  
    
    public switchMidiOutput(outputName: string): boolean {
      /**
       * Switches the currently selected MIDI output.
       * 
       * @param outputName Name of the MIDI output to switch to
       * @returns True if the MIDI output was found and switched to, false otherwise
       */
      const index = this.midiOutputs.findIndex((output) => output.name === outputName);
      if (index !== -1) {
        this.currentOutputIndex = index;
        return true;
      } else {
        console.error(`MIDI output "${outputName}" not found.`);
        return false;
      }
    }
  
    public listMidiOutputs(): void {
      /**
       * Lists all available MIDI outputs to the console.
       */
      console.log('Available MIDI Outputs:');
      this.midiOutputs.forEach((output, index) => {
        console.log(`${index + 1}. ${output.name}`);
      });
    }


    public sendMidiNote(noteNumber: number, channel: number, velocity: number, duration: number): void {
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
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        const noteOnMessage = [0x90 + channel, noteNumber, velocity];
        const noteOffMessage = [0x80 + channel, noteNumber, 0];
    
        // Send Note On
        output.send(noteOnMessage);
    
        // Schedule Note Off
        const timeoutId = setTimeout(() => {
          output.send(noteOffMessage);
          delete this.scheduledNotes[noteNumber];
        }, (duration - 0.02) * 1000);
    
        this.scheduledNotes[noteNumber] = timeoutId;
      } else {
        console.error('MIDI output not available.');
      }
    }
  
    public sendMidiControlChange(controlNumber: number, value: number): void {
      /**
       * Sends a MIDI Control Change message to the currently selected MIDI output.
       * 
       * @param controlNumber MIDI control number (0-127)
       * @param value MIDI control value (0-127)
       */
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        output.send([0xB0, controlNumber, value]); // Control Change
      } else {
        console.error('MIDI output not available.');
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
        console.error('MIDI output not available.');
      }
    }
  }

