import { Editor } from "./main";
import { scale } from './Scales';
import { tryEvaluate } from "./Evaluator";
import { MidiConnection } from "./IO/MidiConnection";
import { next } from "zifferjs";
import { 
    superdough, 
    samples, 
    initAudioOnFirstClick, 
    registerSynthSounds 
} from 'superdough';


const init = Promise.all([
    initAudioOnFirstClick(),
    samples('github:tidalcycles/Dirt-Samples/master'),
    registerSynthSounds(),
]);



class DrunkWalk {

    /**
     * A class that implements a "drunk walk" algorithm. This is useful for generating random
     * numbers in a constrained range. The "drunk" starts at a position, and then makes a step
     * of +1, 0, or -1. The "drunk" can be constrained to a range, and can wrap around the range.
     * 
     * @param min - The minimum value of the range
     * @param max - The maximum value of the range
     * @param wrap - Whether or not the "drunk" should wrap around the range
     * @param position - The starting/current position of the "drunk"
     */

    public min: number;
    public max: number;
    private wrap: boolean;
    public position: number;

    constructor(min: number, max: number, wrap: boolean) {
        this.min = min;
        this.max = max;
        this.wrap = wrap;
        this.position = 0;
    }

    step(): void {

        /**
         * Makes a step in the "drunk walk" algorithm. This is a random step of +1, 0, or -1.
         */

        const stepSize: number = Math.floor(Math.random() * 3) - 1;
        this.position += stepSize;

        if (this.wrap) {
            if (this.position > this.max) {
                this.position = this.min;
            } else if (this.position < this.min) {
                this.position = this.max;
            }
        } else {
            if (this.position < this.min) {
                this.position = this.min;
            } else if (this.position > this.max) {
                this.position = this.max;
            }
        }
    }

    getPosition(): number {
        /**
         * @returns The current position of the "drunk"
         */
        return this.position;
    }

    toggleWrap(b: boolean): void {
        /**
         * Whether or not the "drunk" should wrap around the range
         * 
         * @param b - Whether or not the "drunk" should wrap around the range
         */
        this.wrap = b;
    }
}

export class UserAPI {

    /**
     * The UserAPI class is the interface between the user's code and the backend. It provides
     * access to the AudioContext, to the MIDI Interface, to internal variables, mouse position, 
     * useful functions, etc... This is the class that is exposed to the user's action and any 
     * function destined to the user should be placed here.
     */

    private variables: { [key: string]: any } = {}
    private iterators: { [key: string]: any } = {}
    private _drunk: DrunkWalk = new DrunkWalk(-100, 100, false);

    MidiConnection: MidiConnection = new MidiConnection()
    load: samples

    constructor (public app: Editor) {
        this.load = samples("github:tidalcycles/Dirt-Samples/master");
    }

    // =============================================================
    // Time functions
    // =============================================================

    get time(): number {
        /**
         * @returns The current time for the AudioContext
         */
        return this.app.audioContext.currentTime
    }

    // =============================================================
    // Mouse functions
    // =============================================================

    get mouseX(): number { 
        /**
         * @returns The current x position of the mouse
         */
        return this.app._mouseX 
    }

    get mouseY(): number { 
        /**
         * @returns The current y position of the mouse
         */
        return this.app._mouseY 
    }

    // =============================================================
    // Utility functions
    // =============================================================

    log = console.log

    scale = scale

    rate(rate: number): void {
        rate = rate;
        // TODO: Implement this. This function should change the rate at which the global script
        // is evaluated. This is useful for slowing down the script, or speeding it up. The default
        // would be 1.0, which is the current rate (very speedy).
    }

    script(...args: number[]): void {
        /**
         * Evaluates 1-n local script(s)
         * 
         * @param args - The scripts to evaluate
         * @returns The result of the evaluation
         */
        args.forEach(arg => {
            tryEvaluate(
                this.app, 
                this.app.universes[this.app.selected_universe].locals[arg],
            )
        })
    }
    s = this.script

    clearscript(script: number): void {
        /**
         * Clears a local script
         * 
         * @param script - The script to clear
         */
        this.app.universes[this.app.selected_universe].locals[script] = {
            candidate: '', committed: '', evaluations: 0
        }
    }
    cs = this.clearscript

    copyscript(from: number, to: number): void {
        /**
         * Copy from a local script to another local script
         * 
         * @param from - The script to copy from
         * @param to - The script to copy to
         */
        this.app.universes[this.app.selected_universe].locals[to] =
            this.app.universes[this.app.selected_universe].locals[from]
    }
    cps = this.copyscript

    // =============================================================
    // MIDI related functions
    // =============================================================

    public midi_outputs(): Array<MIDIOutput> {
        /**
         * Prints a list of available MIDI outputs in the console.
         * 
         * @returns A list of available MIDI outputs
         */
        console.log(this.MidiConnection.listMidiOutputs());
        return this.MidiConnection.midiOutputs;
    }

    public midi_output(outputName: string): void {
        /**
         * Switches the MIDI output to the specified output.
         * 
         * @param outputName - The name of the MIDI output to switch to
         */
        if (!outputName) {
            console.log(this.MidiConnection.getCurrentMidiPort())
        } else {
            this.MidiConnection.switchMidiOutput(outputName)
        }
    }

    public note(note: number, channel: number = 0, velocity: number = 100, duration: number = 0.5): void {
        /**
         * Sends a MIDI note to the current MIDI output.
         * TODO: Fix note duration
         * 
         * @param note - The MIDI note to send
         * @param channel - The MIDI channel to send the note on
         * @param velocity - The velocity of the note
         * @param duration - The duration of the note (in ms)
         * 
         */
        this.MidiConnection.sendMidiNote(note, channel, velocity, duration)
    }

    public zn(input: string, options: {[key: string]: any} = {}): void {
        const node = next(input, options);
        const channel = options.channel ? options.channel : 0;
        const velocity = options.velocity ? options.velocity : 100;
        const sustain = options.sustain ? options.sustain : 0.5;
        if(node.bend) this.MidiConnection.sendPitchBend(node.bend, channel);
        this.MidiConnection.sendMidiNote(node.note!, channel, velocity, sustain);
        if(node.bend) this.MidiConnection.sendPitchBend(8192, channel);
    }

    public sysex(data: Array<number>): void {
        /**
         * Sends a MIDI sysex message to the current MIDI output.
         * 
         * @param data - The sysex data to send
         */
        this.MidiConnection.sendSysExMessage(data)
    }

    public pitch_bend(value: number, channel: number): void {
        /**
         * Sends a MIDI pitch bend to the current MIDI output.
         *  
         * @param value - The value of the pitch bend
         * @param channel - The MIDI channel to send the pitch bend on
         *  
         * @returns The value of the pitch bend
         */
        this.MidiConnection.sendPitchBend(value, channel)
    }


    public program_change(program: number, channel: number): void {
        /**
         * Sends a MIDI program change to the current MIDI output.
         * 
         * @param program - The MIDI program to send
         * @param channel - The MIDI channel to send the program change on
         */
        this.MidiConnection.sendProgramChange(program, channel)
    }

    public midi_clock(): void {
        /**
         * Sends a MIDI clock to the current MIDI output.
         */
        this.MidiConnection.sendMidiClock()
    }

    public cc(control: number, value: number): void {
        /**
         * Sends a MIDI control change to the current MIDI output.
         * 
         * @param control - The MIDI control to send
         * @param value - The value of the control
         */
        this.MidiConnection.sendMidiControlChange(control, value)
    }

    public midi_panic(): void {
        /**
         * Sends a MIDI panic message to the current MIDI output.
         */
        this.MidiConnection.panic()
    }

    // =============================================================
    // Iterator related functions
    // =============================================================

    public iterator(name: string, limit?: number, step?: number): number {
        /**
         * Returns the current value of an iterator, and increments it by the step value.
         * 
         * @param name - The name of the iterator
         * @param limit - The upper limit of the iterator
         * @param step - The step value of the iterator
         * @returns The current value of the iterator
         */
    
        if (!(name in this.iterators)) {
            // Create new iterator with default step of 1
            this.iterators[name] = {
                value: 0,
                step: step ?? 1,
                limit
            };
        } else {
            // Check if limit has changed
            if (this.iterators[name].limit !== limit) {
                // Reset value to 0 and update limit
                this.iterators[name].value = 0;
                this.iterators[name].limit = limit;
            }
    
            // Check if step has changed
            if (this.iterators[name].step !== step) {
                // Update step
                this.iterators[name].step = step ?? this.iterators[name].step;
            }
    
            // Increment existing iterator by step value
            this.iterators[name].value += this.iterators[name].step;
    
            // Check for limit overshoot
            if (this.iterators[name].limit !== undefined &&
                this.iterators[name].value > this.iterators[name].limit) {
                this.iterators[name].value = 0;
            }
        }
    
        // Return current iterator value
        return this.iterators[name].value;
    }
    $ = this.iterator

    // =============================================================
    // Drunk mechanism
    // =============================================================

    get drunk() {
        /**
         * 
         * This function returns the current the drunk mechanism's
         * current value.
         * 
         * @returns The current position of the drunk mechanism
         */
        this._drunk.step();
        return this._drunk.getPosition();
    }

    set drunk(position: number) {
        /**
         * Sets the current position of the drunk mechanism.
         * 
         * @param position - The value to set the drunk mechanism to
         */
       this._drunk.position = position;
    }

    set drunk_max(max: number) {
        /**
         * Sets the maximum value of the drunk mechanism.
         * 
         * @param max - The maximum value of the drunk mechanism
         */
        this._drunk.max = max;
    }

    set drunk_min(min: number) {
        /**
         * Sets the minimum value of the drunk mechanism.
         * 
         * @param min - The minimum value of the drunk mechanism
         */
        this._drunk.min = min;
    }

    set drunk_wrap(wrap: boolean) {
        /**
         * Sets whether the drunk mechanism should wrap around
         * 
         * @param wrap - Whether the drunk mechanism should wrap around
         */
        this._drunk.toggleWrap(wrap);
    }

    // =============================================================
    // Variable related functions
    // =============================================================

    public variable(a: number | string, b?: any): any {
        /**
         * Sets or returns the value of a variable internal to API.
         * 
         * @param a - The name of the variable
         * @param b - [optional] The value to set the variable to
         * @returns The value of the variable 
         */
        if (typeof a === 'string' && b === undefined) {
            return this.variables[a]
        } else {
            this.variables[a] = b
            return this.variables[a]
        }
    }
    v = this.variable

    public delete_variable(name: string): void {
        /**
         * Deletes a variable internal to API.
         * 
         * @param name - The name of the variable to delete
         */
        delete this.variables[name]
    }
    dv = this.delete_variable

    public clear_variables(): void {
        /**
         * Clears all variables internal to API.
         * 
         * @remarks
         * This function will delete all variables without warning. 
         * Use with caution.
         */
        this.variables = {}
    }
    cv = this.clear_variables

    // =============================================================
    // Small algorithmic functions
    // =============================================================

    pick<T>(...array: T[]): T {
        /**
         * Returns a random element from an array.
         * 
         * @param array - The array of values to pick from
         */
        return array[Math.floor(Math.random() * array.length)] 
    }

    seqbeat<T>(...array: T[]): T {
        /**
         * Returns an element from an array based on the current beat.
         * 
         * @param array - The array of values to pick from
         */
        return array[this.app.clock.time_position.beat % array.length] 
    }

    mel<T>(iterator: number, array: T[]): T {
        /**
         * Returns an element from an array based on the current value of an iterator.
         * 
         * @param iterator - The name of the iterator
         * @param array - The array of values to pick from
         */
        return array[iterator % array.length]
    }

    seqbar<T>(...array: T[]): T {
        /**
         * Returns an element from an array based on the current bar.
         * 
         * @param array - The array of values to pick from
         */
        return array[this.app.clock.time_position.bar % array.length] 
    }

    seqpulse<T>(...array: T[]): T {
        /**
         * Returns an element from an array based on the current pulse.
         * 
         * @param array - The array of values to pick from
         */
        return array[this.app.clock.time_position.pulse % array.length]
    }

    // =============================================================
    // Randomness functions
    // =============================================================

    randI(min: number, max: number): number {
        /**
         * Returns a random integer between min and max.
         * 
         * @param min - The minimum value of the random number
         * @param max - The maximum value of the random number
         * @returns A random integer between min and max
         */
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    rand(min: number, max: number): number {
        /**
         * Returns a random float between min and max.
         * 
         * @param min - The minimum value of the random number
         * @param max - The maximum value of the random number
         * @returns A random float between min and max
         */
        return Math.random() * (max - min) + min
    }
    rI = this.randI; r = this.rand

    // =============================================================
    // Quantification functions
    // =============================================================

    public quantize(value: number, quantization: number[]): number {
        /**
         * Returns the closest value in an array to a given value.
         * 
         * @param value - The value to quantize
         * @param quantization - The array of values to quantize to
         * @returns The closest value in the array to the given value
         */
        if (quantization.length === 0) { return value }
        let closest = quantization[0]
        quantization.forEach(q => {
            if (Math.abs(q - value) < Math.abs(closest - value)) { closest = q }
        })
        return closest
    }
    quant = this.quantize

    public clamp(value: number, min: number, max: number): number {
        /**
         * Returns a value clamped between min and max.
         * 
         * @param value - The value to clamp
         * @param min - The minimum value of the clamped value
         * @param max - The maximum value of the clamped value
         * @returns A value clamped between min and max
         */
        return Math.min(Math.max(value, min), max)
    }
    cmp = this.clamp

    // =============================================================
    // Transport functions
    // =============================================================

    bpm(bpm?: number): number {
        /**
         * Sets or returns the current bpm.
         * 
         * @param bpm - [optional] The bpm to set
         * @returns The current bpm
         */
        if (bpm === undefined)
            return this.app.clock.bpm

        if (bpm < 1 || bpm > 500)
            console.log(`Setting bpm to ${bpm}`)
            this.app.clock.bpm = bpm
        return bpm
    }
    tempo = this.bpm

    time_signature(numerator: number, denominator: number): void {
        /**
         * Sets the time signature.
         * 
         * @param numerator - The numerator of the time signature
         * @param denominator - The denominator of the time signature
         * @returns The current time signature
         */
        this.app.clock.time_signature = [numerator, denominator]
    }

    // =============================================================
    // Probability functions
    // =============================================================

    public almostNever():boolean {
        /**
         * Returns true 10% of the time.
         * 
         * @returns True 10% of the time
         */
        return Math.random() > 0.9 
    }

    public sometimes(): boolean {
        /**
         * Returns true 50% of the time.
         * 
         * @returns True 50% of the time
         */
        return Math.random() > 0.5
    }

    public rarely():boolean {
        /**
         * Returns true 25% of the time.
         * 
         * @returns True 25% of the time
         */
        return Math.random() > 0.75
    }

    public often(): boolean {
        /**
         * Returns true 75% of the time.
         * 
         * @returns True 75% of the time
         */
        return Math.random() > 0.25
    }

    public almostAlways():boolean { 
        /**
         * Returns true 90% of the time.
         * 
         * @returns True 90% of the time
         */
        return Math.random() > 0.1 
    }

    public dice(sides: number):number {
        /**
         * Returns the value of a dice roll with n sides.
         * 
         * @param sides - The number of sides on the dice
         * @returns The value of a dice roll with n sides
         */
        return Math.floor(Math.random() * sides) + 1
    }

    // =============================================================
    // Iterator functions (for loops, with evaluation count, etc...)
    // =============================================================

    get i() {
        /**
         * Returns the current iteration of global file.
         * 
         * @returns The current iteration of global file 
         */
        return this.app.universes[this.app.selected_universe].global.evaluations
    }

    // =============================================================
    // Time markers
    // =============================================================

    get bar(): number { 
        /**
         * Returns the current bar number
         * 
         * @returns The current bar number
         */
        return this.app.clock.time_position.bar 
    }
 
    get tick(): number { 
        /**
         * Returns the current tick number
         * 
         * @returns The current tick number
         */
        return this.app.clock.tick 
    }

    get pulse(): number { 
        /**
         * Returns the current pulse number
         * 
         * @returns The current pulse number
         */
        return this.app.clock.time_position.pulse 
    }

    get beat(): number { 
        /** 
         * Returns the current beat number
         * 
         * @returns The current beat number
         */
        return this.app.clock.time_position.beat 
    }

    get t_beat(): number {
        /**
         * Returns the current beat number since the origin of time
         * TODO: fix! Why is this not working?
         */
        return Math.floor(this.app.clock.tick / this.app.clock.ppqn)
    }


    onbar(n: number, ...bar: number[]): boolean { 
        // n is acting as a modulo on the bar number
        const bar_list = [...Array(n).keys()].map(i => i + 1);
        console.log(bar.some(b => bar_list.includes(b % n)))
        return bar.some(b => bar_list.includes(b % n))
    }

    onbeat(...beat: number[]): boolean {
        /**
         * Returns true if the current beat is in the given list of beats.
         *  
         * @remarks
         * This function can also operate with decimal beats!
         *
         * @param beat - The beats to check
         * @returns True if the current beat is in the given list of beats
         */
        let final_pulses: boolean[] = []
        beat.forEach(b => {
            b = 1 + (b % this.app.clock.time_signature[0])
            let integral_part = Math.floor(b);
            let decimal_part = b - integral_part;
            final_pulses.push(
                integral_part === this.app.clock.time_position.beat &&
                this.app.clock.time_position.pulse === decimal_part * this.app.clock.ppqn
            )
        });
        return final_pulses.some(p => p == true)
    }

    stop(): void { 
        /**
         * Stops the clock.
         * 
         * @see silence
         * @see hush
         */
        this.app.clock.pause() 
        this.app.setButtonHighlighting("pause", true);
    }
    silence = this.stop 
    hush = this.stop

    prob(p: number): boolean {
        /**
         * Returns true p% of the time.
         * 
         * @param p - The probability of returning true
         * @returns True p% of the time
         */
        return Math.random() * 100 < p
    }

    toss(): boolean {
        /**
         * Returns true 50% of the time.
         * 
         * @returns True 50% of the time
         * @see sometimes
         * @see rarely
         * @see often
         * @see almostAlways
         * @see almostNever
         */
        return Math.random() > 0.5
    }

    min(...values: number[]): number {
        /**
         * Returns the minimum value of a list of numbers.
         * 
         * @param values - The list of numbers
         * @returns The minimum value of the list of numbers
         */
        return Math.min(...values)
    }

    max(...values: number[]): number {
        /**
         * Returns the maximum value of a list of numbers.
         * 
         * @param values - The list of numbers
         * @returns The maximum value of the list of numbers
         */
        return Math.max(...values)
    }

    limit(value: number, min: number, max: number): number {
        /**
         * Limits a value between a minimum and a maximum.
         * 
         * @param value - The value to limit
         * @param min - The minimum value
         * @param max - The maximum value
         * @returns The limited value
         */
        return Math.min(Math.max(value, min), max)
    }


    delay(ms: number, func: Function): void {
        /**
         * Delays the execution of a function by a given number of milliseconds.
         * 
         * @param ms - The number of milliseconds to delay the function by
         * @param func - The function to execute
         * @returns The current time signature
         */
        setTimeout(func, ms)
    }

    delayr(ms: number, nb: number, func: Function): void {
        /**
         * Delays the execution of a function by a given number of milliseconds, repeated a given number of times.
         * 
         * @param ms - The number of milliseconds to delay the function by
         * @param nb - The number of times to repeat the delay
         * @param func - The function to execute
         * @returns The current time signature
         */
        const list = [...Array(nb).keys()].map(i => ms * i);
        list.forEach((ms, _) => {
            setTimeout(func, ms)
        });
    }

    mod(...pulse: number[]): boolean {
        /**
         * Returns true if the current pulse is a modulo of any of the given pulses.
         * 
         * @param pulse - The pulse to check for
         * @returns True if the current pulse is a modulo of any of the given pulses
         */
        return pulse.some(p => this.app.clock.time_position.pulse % p === 0)
    }

    modbar(...bar: number[]): boolean {
        /**
         * Returns true if the current bar is a modulo of any of the given bars.
         * 
         * @param bar - The bar to check for
         * @returns True if the current bar is a modulo of any of the given bars
         * 
         */
        return bar.some(b => this.app.clock.time_position.bar % b === 0)
    }

    euclid(iterator: number, pulses: number, length: number, rotate: number=0): boolean { 
        /**
         * Returns a euclidean cycle of size length, with n pulses, rotated or not.
         * 
         * @param iterator - Iteration number in the euclidian cycle
         * @param pulses - The number of pulses in the cycle
         * @param length - The length of the cycle
         * @param rotate - Rotation of the euclidian sequence
         * @returns boolean value based on the euclidian sequence
         */
        return this._euclidean_cycle(pulses, length, rotate)[iterator % length];
     }

    _euclidean_cycle(pulses: number, length: number, rotate: number = 0): boolean[] {
       function startsDescent(list: number[], i: number): boolean {
            const length = list.length;
            const nextIndex = (i + 1) % length;
            return list[i] > list[nextIndex] ? true : false;
        }
        if (pulses >= length) return [true];
        const resList = Array.from({length}, (_, i) => ((pulses * (i - 1)) % length + length) % length);
        let cycle = resList.map((_, i) => startsDescent(resList, i));
        if(rotate!=0) {
            cycle = cycle.slice(rotate).concat(cycle.slice(0, rotate));
        }
        return cycle;
    }

    bin(iterator: number, n: number): boolean {
        /**
         * Returns a binary cycle of size n.
         * 
         * @param iterator - Iteration number in the binary cycle
         * @param n - The number to convert to binary
         * @returns boolean value based on the binary sequence
         */
        let convert: string = n.toString(2);
        let tobin: boolean[] = convert.split("").map((x: string) => x === "1");
        return tobin[iterator % tobin.length];
    }

    // =============================================================
    // Low Frequency Oscillators
    // =============================================================

    sine(freq: number = 1, offset: number=0): number {
        /**
         * Returns a sine wave between -1 and 1.
         * 
         * @param freq - The frequency of the sine wave
         * @param offset - The offset of the sine wave
         * @returns A sine wave between -1 and 1
         */
        return Math.sin(this.app.clock.ctx.currentTime * Math.PI * 2 * freq) + offset
    }

    saw(freq: number = 1, offset: number=0): number {
        /**
         * Returns a saw wave between -1 and 1.
         * 
         * @param freq - The frequency of the saw wave
         * @param offset - The offset of the saw wave
         * @returns A saw wave between -1 and 1
         * @see triangle
         * @see square
         * @see sine
         * @see noise
         */
        return (this.app.clock.ctx.currentTime * freq) % 1 * 2 - 1 + offset
    }

    triangle(freq: number = 1, offset: number=0): number {
        /**
         * Returns a triangle wave between -1 and 1.
         * 
         * @returns A triangle wave between -1 and 1
         * @see saw
         * @see square
         * @see sine
         * @see noise
         */
        return Math.abs(this.saw(freq, offset)) * 2 - 1
    }

    square(freq: number = 1, offset: number=0): number {
        /**
         * Returns a square wave between -1 and 1.
         * 
         * @returns A square wave between -1 and 1
         * @see saw
         * @see triangle
         * @see sine
         * @see noise
         */
        return this.saw(freq, offset) > 0 ? 1 : -1
    }

    noise(): number {
        /**
         * Returns a random value between -1 and 1.
         * 
         * @returns A random value between -1 and 1
         * @see saw
         * @see triangle
         * @see square
         * @see sine
         * @see noise
         */
        return Math.random() * 2 - 1
    }

    // =============================================================
    // Math functions
    // =============================================================

    abs = Math.abs    

    // =============================================================
    // Trivial functions
    // =============================================================

    sound = async (values: object, delay: number = 0.00) => {
        superdough(values, delay) 
    }
}
