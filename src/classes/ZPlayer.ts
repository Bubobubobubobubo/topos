import { Chord, Pitch, Rest as ZRest, Ziffers } from "zifferjs";
import { Editor } from "../main";
import { AbstractEvent } from "./AbstractEvents";
import { SkipEvent } from "./SkipEvent";
import { SoundEvent, SoundParams } from "./SoundEvent";
import { MidiEvent, MidiParams } from "./MidiEvent";
import { RestEvent } from "./RestEvent";
import { arrayOfObjectsToObjectWithArrays } from "../Utils/Generic";
import { TonnetzSpaces } from "zifferjs/src/tonnetz";

export type InputOptions = { [key: string]: string | number };

export class Player extends AbstractEvent {
  input: string | number;
  ziffers: Ziffers;
  initCallTime: number = 0;
  startCallTime: number = 0;
  lastCallTime: number = 0;
  waitTime = 0;
  played: boolean = false;
  current!: Pitch | Chord | ZRest;
  retro: boolean = false;
  index: number = -1;
  zid: string = "";
  options: InputOptions = {};
  skipIndex = 0;

  constructor(
    input: string | number | Generator<number>,
    options: InputOptions,
    public app: Editor,
    zid: string = "",
  ) {
    super(app);
    this.options = options;
    if (typeof input === "string") {
      this.input = input;
      this.ziffers = new Ziffers(input, options);
    } else if (typeof input === "number") {
      this.input = input;
      this.ziffers = Ziffers.fromNumber(input, options);
    } else {
      this.ziffers = Ziffers.fromGenerator(input, options);
      this.input = this.ziffers.input;
    }
    this.zid = zid;
  }

  reset() {
    this.initCallTime = 0;
    this.startCallTime = 0;
    this.lastCallTime = 0;
    this.waitTime = 0;
    this.index = 0;
    this.skipIndex = 0;
    this.played = false;
    this.skipIndex = 0;
    this.ziffers.reset();
  }

  get ticks(): number {
    const dur = this.ziffers.duration;
    return dur * 4 * this.app.clock.ppqn;
  }

  nextEndTime(): number {
    return this.startCallTime + this.ticks;
  }

  updateLastCallTime(): void {
    if (this.notStarted() || this.played) {
      this.lastCallTime = this.app.clock.pulses_since_origin;
      this.played = false;
    }
  }

  notStarted(): boolean {
    return this.ziffers.notStarted();
  }

  next = (): Pitch | Chord | ZRest => {
    this.current = this.ziffers.next() as Pitch | Chord | ZRest;
    this.played = true;
    return this.current;
  };

  pulseToSecond = (pulse: number): number => {
    return this.app.clock.convertPulseToSecond(pulse);
  };

  firstRun = (): boolean => {
    return this.notStarted();
  };

  atTheBeginning = (): boolean => {
    return this.skipIndex === 0 && this.ziffers.index <= 0;
  };

  origin = (): number => {
    return this.app.clock.pulses_since_origin + 1;
  };

  pulse = (): number => {
    return this.app.clock.time_position.pulse;
  };

  beat = (): number => {
    return this.app.clock.time_position.beat;
  };

  nextBeat = (): number => {
    return this.app.clock.next_beat_in_ticks;
  };

  nextBeatInTicks = (): number => {
    return this.app.clock.next_beat_in_ticks;
  };

  // Check if it's time to play the event
  areWeThereYet = (): boolean => {
    // If clock has stopped
    if (this.app.clock.pulses_since_origin < this.lastCallTime) {
      this.app.api.resetAllFromCache();
    }

    const patternIsStarting =
      this.notStarted() &&
      (this.pulse() === 0 || this.origin() >= this.nextBeatInTicks()) &&
      this.origin() >= this.waitTime;

    const timeToPlayNext =
      this.current &&
      this.pulseToSecond(this.origin()) >=
        this.pulseToSecond(this.lastCallTime) +
          this.pulseToSecond(this.current.duration * 4 * this.app.clock.ppqn) &&
      this.origin() >= this.waitTime;

    // If pattern is starting or it's time to play next event
    const areWeThereYet = patternIsStarting || timeToPlayNext;

    // Increment index of how many times call is skipped
    this.skipIndex = areWeThereYet ? 0 : this.skipIndex + 1;

    // Increment index of how many times sound/midi have been called
    this.index = areWeThereYet ? this.index + 1 : this.index;

    if (areWeThereYet && this.notStarted()) {
      this.initCallTime = this.app.clock.pulses_since_origin;
    }

    if (this.atTheBeginning()) {
      this.startCallTime = this.app.clock.pulses_since_origin;
    }

    return areWeThereYet;
  };

  sound(name?: string) {
    if (this.areWeThereYet()) {
      const event = this.next() as Pitch | Chord | ZRest;
      const noteLengthInSeconds = this.app.clock.convertPulseToSecond(
        event.duration * 4 * this.app.clock.ppqn,
      );
      if (event instanceof Pitch) {
        const obj = event.getExisting(
          "freq",
          "note",
          "pitch",
          "key",
          "scale",
          "octave",
          "parsedScale",
        ) as SoundParams;
        if (event.sound) name = event.sound as string;
        if (event.soundIndex) obj.n = event.soundIndex as number;
        obj.dur = noteLengthInSeconds;
        return new SoundEvent(obj, this.app).sound(name || "sine");
      } else if (event instanceof Chord) {
        const pitches = event.pitches.map((p) => {
          return p.getExisting(
            "freq",
            "note",
            "pitch",
            "key",
            "scale",
            "octave",
            "parsedScale",
          );
        }) as SoundParams[];
        const add = { dur: noteLengthInSeconds } as SoundParams;
        if (name) add.s = name;
        let sound = arrayOfObjectsToObjectWithArrays(
          pitches,
          add,
        ) as SoundParams;
        return new SoundEvent(sound, this.app);
      } else if (event instanceof ZRest) {
        return RestEvent.createRestProxy(event.duration, this.app);
      }
    } else {
      return SkipEvent.createSkipProxy();
    }
  }

  midi(value: number | undefined = undefined) {
    if (this.areWeThereYet()) {
      const event = this.next() as Pitch | Chord | ZRest;
      const obj = event.getExisting(
        "note",
        "pitch",
        "bend",
        "key",
        "scale",
        "octave",
        "parsedScale",
      ) as MidiParams;
      if (event instanceof Pitch) {
        if (event.soundIndex) obj.channel = event.soundIndex as number;
        const note = new MidiEvent(obj, this.app);
        return value ? note.note(value) : note;
      } else if (event instanceof ZRest) {
        return RestEvent.createRestProxy(event.duration, this.app);
      } else if (event instanceof Chord) {
        const pitches = event.midiChord() as MidiParams[];
        const obj = arrayOfObjectsToObjectWithArrays(pitches) as MidiParams;
        return new MidiEvent(obj, this.app);
      }
    } else {
      return SkipEvent.createSkipProxy();
    }
  }

  scale(name: string) {
    if (this.atTheBeginning()) this.ziffers.scale(name);
    return this;
  }

  key(name: string) {
    if (this.atTheBeginning()) this.ziffers.key(name);
    return this;
  }

  octave(value: number) {
    if (this.atTheBeginning()) this.ziffers.octave(value);
    return this;
  }

  tonnetz(transform: string, tonnetz: TonnetzSpaces = [3, 4, 5]) {
    // @ts-ignore
    if (this.atTheBeginning()) this.ziffers.tonnetz(transform, tonnetz);
    return this;
  }

  triadTonnetz(transform: string, tonnetz: TonnetzSpaces = [3, 4, 5]) {
    if (this.atTheBeginning()) this.ziffers.triadTonnetz(transform, tonnetz);
    return this;
  }

  tetraTonnetz(transform: string, tonnetz: TonnetzSpaces = [3, 4, 5]) {
    if (this.atTheBeginning()) this.ziffers.tetraTonnetz(transform, tonnetz);
    return this;
  }

  octaCycle(tonnetz: TonnetzSpaces = [3, 4, 5]) {
    if (this.atTheBeginning()) this.ziffers.octaCycle(tonnetz);
    return this;
  }

  hexaCycle(tonnetz: TonnetzSpaces = [3, 4, 5]) {
    if (this.atTheBeginning()) this.ziffers.hexaCycle(tonnetz);
    return this;
  }

  enneaCycle(tonnetz: TonnetzSpaces = [3, 4, 5]) {
    if (this.atTheBeginning()) this.ziffers.enneaCycle(tonnetz);
    return this;
  }

  tonnetzChord(chord: string) {
    if (this.atTheBeginning()) this.ziffers.tonnetzChords(chord);
    return this;
  }

  voiceleading() {
    if (this.atTheBeginning()) this.ziffers.lead();
    return this;
  }

  lead = () => this.voiceleading();

  arpeggio(indexes: string|number[], ...rest: number[]) {
    if(typeof indexes === "number") indexes = [indexes, ...rest];
    if (this.atTheBeginning()) this.ziffers.arpeggio(indexes);
    return this;
  }

  invert = (n: number) => {
    if (this.atTheBeginning()) {
      this.ziffers.invert(n);
    }
    return this;
  };

  retrograde() {
    if (this.atTheBeginning()) this.ziffers.retrograde();
    return this;
  }

  wait(value: number | Function) {
    if (this.atTheBeginning()) {
      if (typeof value === "function") {
        const refPat = this.app.api.patternCache.get(value.name) as Player;
        if (refPat) this.waitTime = refPat.nextEndTime();
        return this;
      }
      this.waitTime =
        this.origin() + Math.ceil(value * 4 * this.app.clock.ppqn);
    }
    return this;
  }

  sync(value: string | Function) {
    if (this.atTheBeginning() && this.notStarted()) {
      const origin = this.app.clock.pulses_since_origin;
      const syncId = typeof value === "function" ? value.name : value;
      if (origin > 0) {
        const syncPattern = this.app.api.patternCache.get(syncId) as Player;
        if (syncPattern) {
          const syncPatternDuration = syncPattern.ziffers.duration;
          const syncPatternStart = syncPattern.startCallTime;
          const syncInPulses = syncPatternDuration * 4 * this.app.clock.ppqn;
          this.waitTime = syncPatternStart + syncInPulses;
        }
      }
    }
    return this;
  }

  out = (): void => {
    // TODO?
  };
}
