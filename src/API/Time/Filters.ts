import { type Editor } from "../../main";
import { UserAPI } from "../API";

const _euclidean_cycle = (
  pulses: number,
  length: number,
  rotate: number = 0,
): boolean[] => {
  if (pulses == length) return Array.from({ length }, () => true);
  function startsDescent(list: number[], i: number): boolean {
    const length = list.length;
    const nextIndex = (i + 1) % length;
    return list[i]! > list[nextIndex]!? true : false;
  }
  if (pulses >= length) return [true];
  const resList = Array.from(
    { length },
    (_, i) => (((pulses * (i - 1)) % length) + length) % length,
  );
  let cycle = resList.map((_, i) => startsDescent(resList, i));
  if (rotate != 0) {
    cycle = cycle.slice(rotate).concat(cycle.slice(0, rotate));
  }
  return cycle;
}

export const fullseq = () => (sequence: string, duration: number): boolean | Array<boolean> => {
  if (sequence.split("").every((c) => c === "x" || c === "o")) {
    return [...sequence].map((c) => c === "x").beat(duration);
  } else {
    return false;
  }
};

export const seq = (app: any) => (expr: string, duration: number = 0.5): boolean => {
  let len = expr.length * duration;
  let output: number[] = [];

  for (let i = 1; i <= len + 1; i += duration) {
    output.push(Math.floor(i * 10) / 10);
  }
  output.pop();

  output = output.filter((_, idx) => {
    const exprIdx = idx % expr.length;
    return expr[exprIdx] === "x";
  });

  return oncount(app)(output, len);
};

export const beat = (app: Editor) => (n: number | number[] = 1, nudge: number = 0): boolean => {
  const nArray = Array.isArray(n) ? n : [n];
  const results: boolean[] = nArray.map(
    (value) =>
      (app.clock.pulses_since_origin - Math.round(nudge * app.clock.ppqn)) %
      Math.round(value * app.clock.ppqn) === 0,
  );
  return results.some((value) => value === true);
};

export const bar = (app: Editor) => (n: number | number[] = 1, nudge: number = 0): boolean => {
  const nArray = Array.isArray(n) ? n : [n];
  const barLength = (app.clock.time_signature?.[1] ?? 4) * app.clock.ppqn;
  const nudgeInPulses = Math.floor(nudge * barLength);
  const results: boolean[] = nArray.map(
    (value) =>
      (app.clock.pulses_since_origin - nudgeInPulses) %
      Math.floor(value * barLength) === 0,
  );
  return results.some((value) => value === true);
};

export const pulse = (app: Editor) => (n: number | number[] = 1, nudge: number = 0): boolean => {
  const nArray = Array.isArray(n) ? n : [n];
  const results: boolean[] = nArray.map(
    (value) => (app.clock.pulses_since_origin - nudge) % value === 0,
  );
  return results.some((value) => value === true);
};

export const tick = (app: Editor) => (tick: number | number[], offset: number = 0): boolean => {
  const nArray = Array.isArray(tick) ? tick : [tick];
  const results: boolean[] = nArray.map(
    (value) => app.clock.time_position.pulse === value + offset,
  );
  return results.some((value) => value === true);
};

export const dur = (app: Editor) => (n: number | number[]): boolean => {
  let nums: number[] = Array.isArray(n) ? n : [n];
  return beat(app)(nums.dur(...nums));
};


export const flip = (app: Editor) => (chunk: number, ratio: number = 50): boolean => {
  let realChunk = chunk * 2;
  const time_pos = app.clock.pulses_since_origin;
  const full_chunk = Math.floor(realChunk * app.clock.ppqn);
  const threshold = Math.floor((ratio / 100) * full_chunk);
  const pos_within_chunk = time_pos % full_chunk;
  return pos_within_chunk < threshold;
};

export const flipbar = (app: Editor) => (chunk: number = 1): boolean => {
  let realFlip = chunk;
  const time_pos = app.clock.time_position.bar;
  const current_chunk = Math.floor(time_pos / realFlip);
  return current_chunk % 2 === 0;
};

export const onbar = (app: Editor) => (
  bars: number[] | number,
  n: number = app.clock.time_signature[0] || 4,
): boolean => {
  let current_bar = (app.clock.time_position.bar % n) + 1;
  return typeof bars === "number"
    ? bars === current_bar
    : bars.some((b) => b === current_bar);
};

export const onbeat = (api: UserAPI) => (...beat: number[]): boolean => {
  let final_pulses: boolean[] = [];
  beat.forEach((b) => {
    let beatNumber = b % api.nominator() || api.nominator();
    let integral_part = Math.floor(beatNumber);
    integral_part = integral_part === 0 ? api.nominator() : integral_part;
    let decimal_part = Math.floor((beatNumber - integral_part) * api.app.clock.ppqn + 1);
    if (decimal_part <= 0)
      decimal_part += api.app.clock.ppqn * api.nominator();
    final_pulses.push(
      integral_part === api.cbeat() && api.cpulse() === decimal_part,
    );
  });
  return final_pulses.some((p) => p === true);
};

export const oncount = (app: Editor) => (beats: number[] | number, count: number): boolean => {
  if (typeof beats === "number") beats = [beats];
  const origin = app.clock.pulses_since_origin;
  let final_pulses: boolean[] = [];
  beats.forEach((b) => {
    b = b < 1 ? 0 : b - 1;
    const beatInTicks = Math.ceil(b * app.clock.ppqn);
    const meterPosition = origin % (app.clock.ppqn * count);
    final_pulses.push(meterPosition === beatInTicks);
  });
  return final_pulses.some((p) => p === true);
};

export const oneuclid = (app: Editor) => (pulses: number, length: number, rotate: number = 0): boolean => {
  const cycle = _euclidean_cycle(pulses, length, rotate);
  const beats = cycle.reduce((acc: number[], x: boolean, i: number) => {
    if (x) acc.push(i + 1);
    return acc;
  }, []);
  return oncount(app)(beats, length);
};

export const euclid = () => (iterator: number, pulses: number, length: number, rotate: number = 0): boolean => {
  /**
   * Returns a Euclidean cycle of size length, with n pulses, rotated or not.
   */
  const cycle = _euclidean_cycle(pulses, length, rotate);
  return cycle && cycle[iterator % length] === true;
};
export const ec = euclid;

export const rhythm = (app: Editor) => (div: number, pulses: number, length: number, rotate: number = 0): boolean => {
  /**
   * Returns a rhythm based on Euclidean cycle.
   */
  return (
    beat(app)(div) && _euclidean_cycle(pulses, length, rotate).beat(div)
  );
};
export const ry = rhythm;

export const nrhythm = (app: Editor) => (div: number, pulses: number, length: number, rotate: number = 0): boolean => {
  /**
   * Returns a negated rhythm based on Euclidean cycle.
   */
  let rhythm = _euclidean_cycle(pulses, length, rotate).map((n: any) => !n);
  return (
    beat(app)(div) && rhythm.beat(div)
  );
};
export const nry = nrhythm;

export const bin = () => (iterator: number, n: number): boolean => {
  /**
   * Returns a binary cycle of size n.
   */
  let convert: string = n.toString(2);
  let tobin: boolean[] = convert.split("").map((x: string) => x === "1");
  return tobin[iterator % tobin.length] || false;
};

export const binrhythm = (app: Editor) => (div: number, n: number): boolean => {
  /**
   * Returns a binary rhythm based on division and binary cycle.
   */
  let convert: string = n.toString(2);
  let tobin: boolean[] = convert.split("").map((x: string) => x === "1");
  return beat(app)(div) && tobin.beat(div);
};
export const bry = binrhythm;
