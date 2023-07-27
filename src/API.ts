import { Editor } from "./main";
import { tryEvaluate } from "./Evaluator";
import { ZZFX, zzfx } from "zzfx";


export class UserAPI {

    variables: { [key: string]: any } = {}
    globalGain: GainNode 
    audioNodes: AudioNode[] = []

    constructor(public app: Editor) {
        this.globalGain = this.app.audioContext.createGain()
        // Give default parameters to the reverb

        this.globalGain.gain.value = 0.2;
        this.globalGain.connect(this.app.audioContext.destination)
    }

    private registerNode<T>(node: T): T{
        this.audioNodes.push(node)
        return node
    }

    killAll() {
        this.audioNodes.forEach(node => {
            node.disconnect()
        })
    }

    var(name: string, value: any) {
        this.variables[name] = value
    }
    get(name: string) { return this.variables[name] }
    
    pick<T>(array: T[]): T { return array[Math.floor(Math.random() * array.length)] }

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

    on(beat: number = 1, pulse: number = 1): boolean {
        return this.app.clock.time_position.beat === beat && this.app.clock.time_position.pulse === pulse
    }

    pulse(pulse: number) {
        return this.app.clock.time_position.pulse === pulse
    }

    modPulse(pulse: number) {
        return this.app.clock.time_position.pulse % pulse === 0
    }

    mute() {
        this.globalGain.gain.value = 0
    }

    volume(volume: number) {
        this.globalGain.gain.value = volume
    }
    vol = this.volume


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