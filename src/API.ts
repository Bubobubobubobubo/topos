import { Editor } from "./main";
import { tryEvaluate } from "./Evaluator";
// @ts-ignore
import { ZZFX, zzfx } from "zzfx";

class MidiConnection{
    private midiAccess: MIDIAccess | null = null;
    private midiOutputs: MIDIOutput[] = [];
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
  
    public sendMidiNote(noteNumber: number, velocity: number, durationMs: number): void {
      const output = this.midiOutputs[this.currentOutputIndex];
      if (output) {
        const noteOnMessage = [0x90, noteNumber, velocity]; 
        const noteOffMessage = [0x80, noteNumber, 0];
  
        // Send Note On
        output.send(noteOnMessage);
  
        // Schedule Note Off
        const timeoutId = setTimeout(() => {
          output.send(noteOffMessage);
          delete this.scheduledNotes[noteNumber];
        }, durationMs);
  
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

export class UserAPI {

    variables: { [key: string]: any } = {}
    globalGain: GainNode 
    audioNodes: AudioNode[] = []
    MidiConnection: MidiConnection = new MidiConnection()

    constructor(public app: Editor) {
        this.globalGain = this.app.audioContext.createGain()
        // Give default parameters to the reverb
        this.globalGain.gain.value = 0.2;
        this.globalGain.connect(this.app.audioContext.destination)
    }

    private registerNode<T extends AudioNode>(node: T): T{
        this.audioNodes.push(node)
        return node
    }

    // =============================================================
    // Utility functions
    // =============================================================
    log = console.log

    public killAll():void {
        this.audioNodes.forEach(node => {
            node.disconnect()
        })
    }

    // Web Audio Gain and Node Management
    mute():void { 
        this.globalGain.gain.value = 0 
    }

    volume(volume: number):void { 
        this.globalGain.gain.value = volume 
    }

    vol = this.volume


    // =============================================================
    // MIDI related functions
    // =============================================================

    public midi_outputs(): void {
        console.log(this.MidiConnection.listMidiOutputs())
    }
    
    public midi_output(outputName: string): void {
        if (!outputName) {
            console.log(this.MidiConnection.getCurrentMidiPort())
        } else {
            this.MidiConnection.switchMidiOutput(outputName)
        }
    }

    public midi_connect(outputName: string): void {
        this.MidiConnection.switchMidiOutput(outputName)
    }

    public note(note: number, velocity: number, duration: number): void {
        this.MidiConnection.sendMidiNote(
            note, velocity, duration
        )
    }

    public midi_clock(): void {
        this.MidiConnection.sendMidiClock()
    }

    public cc(control: number, value: number): void {
        this.MidiConnection.sendMidiControlChange(control, value)
    }

    public midi_panic(): void {
        this.MidiConnection.panic()
    }


    // =============================================================
    // Variable related functions
    // =============================================================

    public var(a: number | string, b?: number): number {
        if (typeof a === 'string' && b === undefined) {
            return this.variables[a]
        } else {
            this.variables[a] = b
            return this.variables[a]
        }
    }
    
    public delVar(name: string): void {
        delete this.variables[name]
    }

    public cleanVar(): void {
        this.variables = {}
    }

    // =============================================================
    // Small algorithmic functions
    // =============================================================
    
    pick<T>(...array: T[]): T { return array[Math.floor(Math.random() * array.length)] }

    seqbeat<T>(...array: T[]): T { return array[this.app.clock.time_position.beat % array.length] }
    seqbar<T>(...array: T[]): T { return array[this.app.clock.time_position.bar % array.length] }
    seqpulse<T>(...array: T[]): T { return array[this.app.clock.time_position.pulse % array.length] }
    
    bpm(bpm: number) { this.app.clock.bpm = bpm }

    time_signature(numerator: number, denominator: number) {
        this.app.clock.time_signature = [ numerator, denominator ]
    }

    almostNever() { return Math.random() > 0.9 }
    sometimes() { return Math.random() > 0.5 }
    rarely() { return Math.random() > 0.75 }
    often() { return Math.random() > 0.25 }
    almostAlways() { return Math.random() > 0.1 }
    randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

    // Iterators
    get i() { return this.app.universes[this.app.selected_universe].global.evaluations }
    e(index:number) { return this.app.universes[this.app.selected_universe].locals[index].evaluations }


    // Script launcher: can launch any number of scripts
    script(...args: number[]): void { 
        args.forEach(arg => { tryEvaluate(this.app, this.app.universes[this.app.selected_universe].locals[arg]) })
   }

    // Small ZZFX interface for playing with this synth
    zzfx(...thing: number[]) {
        zzfx(...thing);
    }

    beat(...beat: number[]): boolean {
        return (
            beat.includes(this.app.clock.time_position.beat) 
             && this.app.clock.time_position.pulse == 1
        )
    }

    every(n: number): boolean { return this.i % n === 0 }

    pulse(...pulse: number[]) {
        return pulse.includes(this.app.clock.time_position.pulse) && this.app.clock.time_position.pulse == 1
    }

    mod(pulse: number) {
        return this.app.clock.time_position.pulse % pulse === 0
    }



    beep(
        frequency: number = 400, duration: number = 0.2,
        type: OscillatorType = "sine", filter: BiquadFilterType = "lowpass",
        cutoff: number = 10000, resonance: number = 1,
    ) {
        const oscillator = this.registerNode(this.app.audioContext.createOscillator());
        const gainNode = this.registerNode(this.app.audioContext.createGain());
        const limiterNode = this.registerNode(this.app.audioContext.createDynamicsCompressor());
        const filterNode = this.registerNode(this.app.audioContext.createBiquadFilter());
        // All this for the limiter
        limiterNode.threshold.setValueAtTime(-5.0, this.app.audioContext.currentTime); 
        limiterNode.knee.setValueAtTime(0, this.app.audioContext.currentTime); 
        limiterNode.ratio.setValueAtTime(20.0, this.app.audioContext.currentTime); 
        limiterNode.attack.setValueAtTime(0.001, this.app.audioContext.currentTime);
        limiterNode.release.setValueAtTime(0.05, this.app.audioContext.currentTime);


        // Filter
        filterNode.type = filter;
        filterNode.frequency.value = cutoff;
        filterNode.Q.value = resonance;
        

        oscillator.type = type; 
        oscillator.frequency.value = frequency || 400;
        gainNode.gain.value = 0.25;
        oscillator
            .connect(filterNode)
            .connect(gainNode)
            .connect(limiterNode)
            .connect(this.globalGain)
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, this.app.audioContext.currentTime + duration);
        oscillator.stop(this.app.audioContext.currentTime + duration);
        // Clean everything after a node has been played
        oscillator.onended = () => {
            oscillator.disconnect();
            gainNode.disconnect();
            filterNode.disconnect();
            limiterNode.disconnect();
        }
    }
}