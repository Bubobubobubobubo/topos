import { Editor } from "./main";
import { scale } from './Scales';
import { tryEvaluate } from "./Evaluator";
import { MidiConnection } from "./IO/MidiConnection";
// @ts-ignore
import { ZZFX, zzfx } from "zzfx";

export class UserAPI {

    variables: { [key: string]: any } = {}
    MidiConnection: MidiConnection = new MidiConnection()

    constructor(public app: Editor) { }

    // =============================================================
    // Utility functions
    // =============================================================

    log = console.log

    scale = scale

    rate(rate: number): void {
        // TODO: Implement this. This function should change the rate at which the global script
        // is evaluated. This is useful for slowing down the script, or speeding it up. The default
        // would be 1.0, which is the current rate (very speedy).
    }
    r = this.rate

    script(...args: number[]): void { 
        args.forEach(arg => { tryEvaluate(this.app, this.app.universes[
            this.app.selected_universe].locals[arg]) })
    }
    s = this.script

    clearscript(script: number): void { 
        this.app.universes[this.app.selected_universe].locals[script] = {
            candidate: '', committed: '', evaluations: 0
        }
    }
    cs = this.clearscript

    copyscript(from: number, to: number): void {
        // Copy a script to another script
        this.app.universes[this.app.selected_universe].locals[to] = 
        this.app.universes[this.app.selected_universe].locals[from]
    }
    cps = this.copyscript


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

    public note(note: number, channel: number, velocity: number, duration: number): void {
        this.MidiConnection.sendMidiNote( note, channel, velocity, duration)
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

    public variable(a: number | string, b?: any): any {
        if (typeof a === 'string' && b === undefined) {
            return this.variables[a]
        } else {
            this.variables[a] = b
            return this.variables[a]
        }
    }
    v = this.variable
    
    public delete_variable(name: string): void {
        delete this.variables[name]
    }
    dv = this.delete_variable

    public clear_variables(): void {
        this.variables = {}
    }
    cv = this.clear_variables

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

    public quantize(value: number, quantization: number[]): number {
      if (quantization.length === 0) { return value }
      let closest = quantization[0]
      quantization.forEach(q => {
        if (Math.abs(q - value) < Math.abs(closest - value)) { closest = q }
      })
      return closest
    }
    quant = this.quantize

    public clamp(value: number, min: number, max: number): number {
      return Math.min(Math.max(value, min), max)
    }
    cmp = this.clamp

    // =============================================================
    // Transport functions
    // =============================================================
    
    bpm(bpm: number):void {
      this.app.clock.bpm = bpm 
    }

    time_signature(numerator: number, denominator: number):void {
        this.app.clock.time_signature = [ numerator, denominator ]
    }

    // =============================================================
    // Probability functions
    // =============================================================

    public almostNever() { return Math.random() > 0.9 }
    public sometimes() { return Math.random() > 0.5 }
    public rarely() { return Math.random() > 0.75 }
    public often() { return Math.random() > 0.25 }
    public almostAlways() { return Math.random() > 0.1 }
    public randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
    public dice(sides: number) { return Math.floor(Math.random() * sides) + 1 }

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
    public evaluations_number(index:number): number { 
        return this.app.universes[this.app.selected_universe].locals[index].evaluations 
    }
    e = this.evaluations_number

    // =============================================================
    // Time markers
    // =============================================================
    get tick(): number { return this.app.clock.tick }
    get bar(): number { return this.app.clock.time_position.bar }
    get pulse(): number { return this.app.clock.time_position.pulse }
    get beat(): number { return this.app.clock.time_position.beat }
    get beats_since_origin(): number { return this.app.clock.beats_since_origin }

    onbar(...bar: number[]): boolean {
        return bar.some(b => b === this.app.clock.time_position.bar)
    }

    onbeat(...beat: number[]): boolean {
        let final_pulses: boolean[] = []
        beat.forEach(b => {
            b = b % this.app.clock.time_signature[0]
            let integral_part = Math.floor(b);
            let decimal_part = b - integral_part;
            final_pulses.push(
                integral_part === this.app.clock.time_position.beat &&
                this.app.clock.time_position.pulse === decimal_part * this.app.clock.ppqn
            )
        });
        return final_pulses.some(p => p == true)
    }

    every(...n: number[]): boolean { 
        return n.some(n => this.i % n === 0)
    }
    
    mod(...pulse: number[]): boolean { return pulse.some(p => this.app.clock.time_position.pulse % p === 0) }

    modbar(...bar: number[]): boolean { return bar.some(b => this.app.clock.time_position.bar % b === 0) }
    
    // =============================================================
    // Trivial functions
    // =============================================================

    // Small ZZFX interface for playing with this synth
    zzfx = (...thing: number[]) => zzfx(...thing);

}
