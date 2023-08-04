export class MidiConnection{
    private midiAccess: MIDIAccess | null = null;
    public midiOutputs: MIDIOutput[] = [];
    private currentOutputIndex: number = 0;
    private scheduledNotes: { [noteNumber: number]: number } = {}; // { noteNumber: timeoutId }
  
    constructor() {
      this.initializeMidiAccess();
    }
  
    private async initializeMidiAccess(): Promise<void> {
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
        if (this.midiOutputs.length > 0 && this.currentOutputIndex >= 0 && this.currentOutputIndex < this.midiOutputs.length) {
            return this.midiOutputs[this.currentOutputIndex].name;
        } else {
            console.error('No MIDI output selected or available.');
            return null;
        }
    }


    public sendMidiClock(): void {
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        output.send([0xF8]); // Send a single MIDI clock message
      } else {
        console.error('MIDI output not available.');
      }
    }
  
    
    public switchMidiOutput(outputName: string): boolean {
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
      console.log('Available MIDI Outputs:');
      this.midiOutputs.forEach((output, index) => {
        console.log(`${index + 1}. ${output.name}`);
      });
    }


    public sendMidiNote(noteNumber: number, channel: number, velocity: number, durationMs: number): void {
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
        }, durationMs - 100);
    
        this.scheduledNotes[noteNumber] = timeoutId;
      } else {
        console.error('MIDI output not available.');
      }
    }
  
    public sendMidiControlChange(controlNumber: number, value: number): void {
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        output.send([0xB0, controlNumber, value]); // Control Change
      } else {
        console.error('MIDI output not available.');
      }
    }
  
    public panic(): void {
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

