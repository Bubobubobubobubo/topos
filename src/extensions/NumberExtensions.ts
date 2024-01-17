import { type UserAPI } from "../API";
import { MidiEvent } from "../classes/MidiEvent";
import { Player } from "../classes/ZPlayer";
import { SoundEvent } from "../classes/SoundEvent";
import { SkipEvent } from "../classes/SkipEvent";


declare global {
  interface Number {
    z(): Player;
    z0(): Player;
    z1(): Player;
    z2(): Player;
    z3(): Player;
    z4(): Player;
    z5(): Player;
    z6(): Player;
    z7(): Player;
    z8(): Player;
    z9(): Player;
    z10(): Player;
    z11(): Player;
    z12(): Player;
    z13(): Player;
    z14(): Player;
    z15(): Player;
    z16(): Player;
    midi(): MidiEvent;
    sound(name: string): SoundEvent | SkipEvent,
    linlin(a: number, b: number, c: number, d: number): number,
    linexp(a: number, b: number, c: number, d: number): number,
    explin(a: number, b: number, c: number, d: number): number,
    expexp(a: number, b: number, c: number, d: number): number,
    lincurve(inMin: number, inMax: number,
      outMin: number, outMax: number,
      curve: number): number;
  }
}

export const makeNumberExtensions = (api: UserAPI) => {

  Number.prototype.linlin = function(a: number, b: number, c: number, d: number) {
    if (this.valueOf() < a) return c;
    if (this.valueOf() > b) return d;
    return (this.valueOf() - a) / (b - a) * (d - c) + c;
  };

  Number.prototype.explin = function(a: number, b: number, c: number, d: number) {
    if (this.valueOf() <= a) return c;
    if (this.valueOf() >= b) return d;
    return (Math.log(this.valueOf() / a)) / (Math.log(b / a)) * (d - c) + c;
  };

  Number.prototype.expexp = function(a: number, b: number, c: number, d: number) {
    if (this.valueOf() <= a) return c;
    if (this.valueOf() >= b) return d;
    return Math.pow(d / c, Math.log(this.valueOf() / a) / Math.log(b / a)) * c;
  };

  Number.prototype.lincurve = function(
    inMin: number, inMax: number,
    outMin: number, outMax: number,
    curve: number) {
    if (this.valueOf() <= inMin) return outMin;
    if (this.valueOf() >= inMax) return outMax;
    if (Math.abs(curve) < 0.001) {
      return (this.valueOf() - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
    };
    let grow = Math.exp(curve);
    let a = outMax - outMin / (1.0 - grow);
    let b = outMin + a;
    let scaled = (this.valueOf() - inMin) / (inMax - inMin);
    return b - (a * Math.pow(grow, scaled))
  }

  Number.prototype.linexp = function(a: number, b: number, c: number, d: number) {
    if (this.valueOf() <= a) return c;
    if (this.valueOf() >= b) return d;
    return Math.pow(d / c, (this.valueOf() - a) / (b - a)) * c;
  };

  Number.prototype.z0 = function(options: { [key: string]: any } = {}) {
    return api.z0(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z1 = function(options: { [key: string]: any } = {}) {
    return api.z1(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z2 = function(options: { [key: string]: any } = {}) {
    return api.z2(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z3 = function(options: { [key: string]: any } = {}) {
    return api.z3(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z4 = function(options: { [key: string]: any } = {}) {
    return api.z4(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z5 = function(options: { [key: string]: any } = {}) {
    return api.z5(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z6 = function(options: { [key: string]: any } = {}) {
    return api.z6(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z7 = function(options: { [key: string]: any } = {}) {
    return api.z7(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z8 = function(options: { [key: string]: any } = {}) {
    return api.z8(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z9 = function(options: { [key: string]: any } = {}) {
    return api.z9(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z10 = function(options: { [key: string]: any } = {}) {
    return api.z10(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z11 = function(options: { [key: string]: any } = {}) {
    return api.z11(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z12 = function(options: { [key: string]: any } = {}) {
    return api.z12(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z13 = function(options: { [key: string]: any } = {}) {
    return api.z13(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z14 = function(options: { [key: string]: any } = {}) {
    return api.z14(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z15 = function(options: { [key: string]: any } = {}) {
    return api.z15(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.z16 = function(options: { [key: string]: any } = {}) {
    return api.z16(this.valueOf().toString().split("").join(" "), options);
  };

  Number.prototype.midi = function(...kwargs: any[]) {
    return api.midi(this.valueOf(), ...kwargs);
  };

  Number.prototype.sound = function(name: string): SoundEvent | SkipEvent {
    if (Number.isInteger(this.valueOf())) {
      return (api.sound(name) as SoundEvent).note(this.valueOf());
    } else {
      return (api.sound(name) as SoundEvent).freq(this.valueOf());
    }
  };
};
