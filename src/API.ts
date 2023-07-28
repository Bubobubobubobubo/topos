import { Editor } from "./main";
import { tryEvaluate } from "./Evaluator";
import { BasicSynth, PercussionSynth } from "./WebSynth";
import { MidiConnection } from "./IO/MidiConnection";
import * as Tone from 'tone';
// @ts-ignore
import { ZZFX, zzfx } from "zzfx";

export class UserAPI {

    variables: { [key: string]: any } = {}
    MidiConnection: MidiConnection = new MidiConnection()

    constructor(public app: Editor) {
    }

    // =============================================================
    // Utility functions
    // =============================================================
    log = console.log

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

    public v(a: number | string, b?: any): any {
        if (typeof a === 'string' && b === undefined) {
            return this.variables[a]
        } else {
            this.variables[a] = b
            return this.variables[a]
        }
    }
    
    public dv(name: string): void {
        delete this.variables[name]
    }

    public cv(): void {
        this.variables = {}
    }

    // =============================================================
    // Small algorithmic functions
    // =============================================================
    
    pick<T>(...array: T[]): T { return array[Math.floor(Math.random() * array.length)] }

    seqbeat<T>(...array: T[]): T { return array[this.app.clock.time_position.beat % array.length] }
    seqbar<T>(...array: T[]): T { return array[this.app.clock.time_position.bar % array.length] }
    seqpulse<T>(...array: T[]): T { return array[this.app.clock.time_position.pulse % array.length] }

    // =============================================================
    // Randomness functions
    // =============================================================

    randI(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }
    randF(min: number, max: number): number { return Math.random() * (max - min) + min }
    rI = this.randI; rF = this.randF

    // =============================================================
    // Quantification functions
    // =============================================================

    quantize(value: number, quantization: number[]): number {
      // Takes a value, and a quantization array, and returns the closest value in the quantization array
      // Example: quantize(0.7, [0, 0.5, 1]) => 0.5
      // If the quantization array is empty, return the value

      if (quantization.length === 0) { return value }
      let closest = quantization[0]
      quantization.forEach(q => {
        if (Math.abs(q - value) < Math.abs(closest - value)) { closest = q }
      })
      return closest
    }

    clamp(value: number, min: number, max: number): number {
      return Math.min(Math.max(value, min), max)
    }

    // =============================================================
    // Time functions
    // =============================================================
    
    bpm(bpm: number) {
      this.app.clock.bpm = bpm 
    }

    time_signature(numerator: number, denominator: number) {
        this.app.clock.time_signature = [ numerator, denominator ]
    }

    // =============================================================
    // Probability functions
    // =============================================================

    almostNever() { return Math.random() > 0.9 }
    sometimes() { return Math.random() > 0.5 }
    rarely() { return Math.random() > 0.75 }
    often() { return Math.random() > 0.25 }
    almostAlways() { return Math.random() > 0.1 }
    randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
    dice(sides: number) { return Math.floor(Math.random() * sides) + 1 }

    // =============================================================
    // Iterator functions (for loops, with evaluation count, etc...)
    // =============================================================

    get i() { return this.app.universes[this.app.selected_universe].global.evaluations }
    get e1() { return this.app.universes[this.app.selected_universe].locals[0].evaluations }
    get e2() { return this.app.universes[this.app.selected_universe].locals[1].evaluations }
    get e3() { return this.app.universes[this.app.selected_universe].locals[2].evaluations }
    get e4() { return this.app.universes[this.app.selected_universe].locals[3].evaluations }
    get e5() { return this.app.universes[this.app.selected_universe].locals[4].evaluations }
    get e6() { return this.app.universes[this.app.selected_universe].locals[5].evaluations }
    get e7() { return this.app.universes[this.app.selected_universe].locals[6].evaluations }
    get e8() { return this.app.universes[this.app.selected_universe].locals[7].evaluations }
    get e9() { return this.app.universes[this.app.selected_universe].locals[8].evaluations }
    e(index:number) { return this.app.universes[this.app.selected_universe].locals[index].evaluations }


    // Script launcher: can launch any number of scripts
    script(...args: number[]): void { 
        args.forEach(arg => { tryEvaluate(this.app, this.app.universes[this.app.selected_universe].locals[arg]) })
    }
    s = this.script

    // Small ZZFX interface for playing with this synth
    zzfx(...thing: number[]) {
        zzfx(...thing);
    }

    // =============================================================
    // Time markers
    // =============================================================
    get tick(): number { return this.app.clock.tick }
    get bar(): number { return this.app.clock.time_position.bar }
    get pulse(): number { return this.app.clock.time_position.pulse }
    get beat(): number { return this.app.clock.time_position.beat }

    onbeat(...beat: number[]): boolean {
        return (
            beat.includes(this.app.clock.time_position.beat) 
             && this.app.clock.time_position.pulse == 1
        )
    }

    evry(...n: number[]): boolean { 
        return n.some(n => this.i % n === 0)
    }
    
    mod(...pulse: number[]): boolean {

        return pulse.some(p => this.app.clock.time_position.pulse % p === 0)
    }
}