export const SCALES: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  wholeTone: [0, 2, 4, 6, 8, 10],
  majorPentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  blues: [0, 3, 5, 6, 7, 10],
  diminished: [0, 2, 3, 5, 6, 8, 9, 11],
  neapolitanMinor: [0, 1, 3, 5, 7, 8, 11],
  neapolitanMajor: [0, 1, 3, 5, 7, 9, 11],
  enigmatic: [0, 1, 4, 6, 8, 10, 11],
  doubleHarmonic: [0, 1, 4, 5, 7, 8, 11],
  octatonic: [0, 2, 3, 5, 6, 8, 9, 11],
  bebopDominant: [0, 2, 4, 5, 7, 9, 10, 11],
  bebopMajor: [0, 2, 4, 5, 7, 8, 9, 11],
  bebopMinor: [0, 2, 3, 5, 7, 8, 9, 11],
  bebopDorian: [0, 2, 3, 4, 5, 7, 9, 10],
  harmonicMajor: [0, 2, 4, 5, 7, 8, 11],
  hungarianMinor: [0, 2, 3, 6, 7, 8, 11],
  hungarianMajor: [0, 3, 4, 6, 7, 9, 10],
  oriental: [0, 1, 4, 5, 6, 9, 10],
  romanianMinor: [0, 2, 3, 6, 7, 9, 10],
  spanishGypsy: [0, 1, 4, 5, 7, 8, 10],
  jewish: [0, 1, 4, 5, 7, 8, 10],
  hindu: [0, 2, 4, 5, 7, 8, 10],
  japanese: [0, 1, 5, 7, 8],
  hirajoshi: [0, 2, 3, 7, 8],
  kumoi: [0, 2, 3, 7, 9],
  inSen: [0, 1, 5, 7, 10],
  iwato: [0, 1, 5, 6, 10],
  yo: [0, 2, 5, 7, 9],
  minorBlues: [0, 3, 5, 6, 7, 10],
  algerian: [0, 2, 3, 5, 6, 7, 8, 11],
  augmented: [0, 3, 4, 7, 8, 11],
  balinese: [0, 1, 3, 7, 8],
  byzantine: [0, 1, 4, 5, 7, 8, 11],
  chinese: [0, 4, 6, 7, 11],
  egyptian: [0, 2, 5, 7, 10],
  eightToneSpanish: [0, 1, 3, 4, 5, 6, 8, 10],
  hawaiian: [0, 2, 3, 5, 7, 9, 10],
  hindustan: [0, 2, 4, 5, 7, 8, 10],
  persian: [0, 1, 4, 5, 6, 8, 11],
  eastIndianPurvi: [0, 1, 4, 6, 7, 8, 11],
  orientalA: [0, 1, 4, 5, 6, 9, 10],
};


// Legacy function, see Array.prototype.scale @ ArrayExtensions.ts
/*
export function scale(
  n: number,
  scaleName: string = "major",
  octave: number = 4
): number {
  /*
   * Returns the MIDI note number for the given scale degree in the given scale.
   * @param {number} n - The scale degree, where 0 is the tonic.
   * @param {string} scaleName - The name of the scale.
   * @param {number} octave - The octave number.
   * @returns {number} The MIDI note number.
   * /
  const scale = SCALES[scaleName];

  if (!scale) {
    throw new Error(`Unknown scale ${scaleName}`);
  }

  let index = n % scale.length;
  if (index < 0) index += scale.length; // adjust for negative indexes
  let additionalOctaves = Math.floor(n / scale.length);
  return 60 + (octave + additionalOctaves) * 12 + scale[index];
}

*/
