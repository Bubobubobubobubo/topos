import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../Documentation";

export const ziffers_scales = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Scales

  Ziffers supports all the keys and scales. Keys can be defined by using [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation), for example <ic>F3</ic>. Western style (1490 scales) can be with scale names named after greek modes and extended by <a href="https://allthescales.org/intro.php" target="_blank">William Zeitler</a>. You will never really run out of scales to play with using Ziffers. Here is a short list of some possible scales that you can play with:
  
  | Scale name | Intervals              |
  |------------|------------------------|
  | Lydian     | <ic>2221221</ic> |
  | Mixolydian | <ic>2212212</ic> |
  | Aeolian    | <ic>2122122</ic> |
  | Locrian    | <ic>1221222</ic> |
  | Ionian     | <ic>2212221</ic> |
  | Dorian     | <ic>2122212</ic> |
  | Phrygian   | <ic>1222122</ic> |
  | Soryllic   | <ic>11122122</ic>|
  | Modimic    | <ic>412122</ic>  |
  | Ionalian   | <ic>1312122</ic> |
  | ... | And it goes on for   <a href="https://ianring.com/musictheory/scales/traditions/zeitler" target="_blank">**1490** scales (See full list here)</a>. |
  
  ${makeExample(
    "What the hell is the Modimic scale?",
    `
  z1("s (0,8) 0 0 (0,5) 0 0").sound('sine')
    .scale('modimic').fmi(2).fmh(2).room(0.5)
      .size(0.5).sustain(0.1) .delay(0.5)
      .delay(0.125).delayfb(0.25).out();
  beat(.5) :: snd(['kick', 'hat'].beat(.5)).out()
  `,
    true,
  )}

  You can also use more traditional <a href="https://ianring.com/musictheory/scales/traditions/western" target="_blank">western names</a>:
  
  | Scale name | Intervals              |
  |------------|------------------------|
  | Major      | <ic>2212221</ic> |
  | Minor      | <ic>2122122</ic> |
  | Minor pentatonic   | <ic>32232</ic>  |
  | Harmonic minor     | <ic>2122131</ic>|
  | Harmonic major     | <ic>2212131</ic>|
  | Melodic minor      | <ic>2122221</ic>|
  | Melodic major      | <ic>2212122</ic>|
  | Whole              | <ic>222222</ic> |
  | Blues minor        | <ic>321132</ic> |
  | Blues major        | <ic>211323</ic> |
  
  ${makeExample(
    "Let's fall back to a classic blues minor scale",
    `
  z1("s (0,8) 0 0 (0,5) 0 0").sound('sine')
    .scale('blues minor').fmi(2).fmh(2).room(0.5)
      .size(0.5).sustain(0.25).delay(0.25)
      .delay(0.25).delayfb(0.5).out();
  beat(1, 1.75) :: snd(['kick', 'hat'].beat(1)).out()
  `,
    true,
  )}
  
  Microtonal scales can be defined using <a href="https://www.huygens-fokker.org/scala/scl_format.html" target="_blank">Scala format</a> or by extended notation defined by Sevish <a href="https://sevish.com/scaleworkshop/" target="_blank">Scale workshop</a>, for example:
  
  - **Young:** 106. 198. 306.2 400.1 502. 604. 697.9 806.1 898.1 1004.1 1102. 1200.
  - **Wendy carlos:** 17/16 9/8 6/5 5/4 4/3 11/8 3/2 13/8 5/3 7/4 15/8 2/1
  
  
  ${makeExample(
    "Wendy Carlos, here we go!",
    `
  z1("s ^ (0,8) 0 0 _ (0,5) 0 0").sound('sine')
    .scale('17/16 9/8 6/5 5/4 4/3 11/8 3/2 13/8 5/3 7/4 15/8 2/1').fmi(2).fmh(2).room(0.5)
      .size(0.5).sustain(0.15).delay(0.1)
      .delay(0.25).delayfb(0.5).out();
  beat(1, 1.75) :: snd(['kick', 'hat'].beat(1)).out()
  `,
    true,
  )}

${makeExample(
    "Werckmeister scale in Scala format",
    `
  const werckmeister = "107.82 203.91 311.72 401.955 503.91 605.865 701.955 809.775 900. 1007.82 1103.91 1200."

  z0('s (0,3) ^ 0 3 ^ 0 (3,6) 0 _ (3,5) 0 _ 3 ^ 0 (3,5) ^ 0 6 0 _ 3 0')
    .key('C3')
    .scale(werckmeister)
    .sound('sine')
    .fmi(1 + usine(0.5) * irand(1,10))
    .cutoff(100 + usine(.5) * 100) 
    .out()
  
  onbeat(1,1.5,3) :: sound('bd').cutoff(100 + usine(.25) * 1000).out()
`,
    true,
  )}

`;
};
