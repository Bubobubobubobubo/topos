import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const filters = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Filters

Filters can be applied to both synthesizers and samples. They are used to shape the sound by removing or emphasizing certain frequencies. They are also used to create movement in the sound by modulating the cutoff frequency of the filter over time. 

- **lowpass filter**: filters the high frequencies, keeping the low frequencies.
- **highpass filter**: filtering the low frequencies, keeping the high frequencies.
- **bandpass filter**: filters the low and high frequencies around a frequency band, keeping what's in the middle.

${makeExample(
  "Filtering the high frequencies of an oscillator",
  `beat(.5) :: sound('sawtooth').cutoff(50 + usine(1/8) * 2000).out()`,
  true,
)}

These filters all come with their own set of parameters. Note that we are describing the parameters of the three different filter types here. Choose the right parameters depending on the filter type you are using:


### Lowpass filter

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>cutoff</ic>     | <ic>lpf</ic>       | cutoff frequency of the lowpass filter |
| <ic>resonance</ic>  | <ic>lpq</ic>       | resonance of the lowpass filter (0-1) |

${makeExample(
  "Filtering a bass",
  `beat(.5) :: sound('jvbass').lpf([250,1000,8000].beat()).out()`,
  true,
)}

### Highpass filter

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>hcutoff</ic>     | <ic>hpf</ic>       | cutoff frequency of the highpass filter |
| <ic>hresonance</ic>  | <ic>hpq</ic>       | resonance of the highpass filter (0-1) |

${makeExample(
  "Filtering a noise source",
  `beat(.5) :: sound('gtr').hpf([250,1000, 2000, 3000, 4000].beat()).end(0.5).out()`,
  true,
)}

### Bandpass filter

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>bandf</ic>      | <ic>bpf</ic>       | cutoff frequency of the bandpass filter |
| <ic>bandq</ic>      | <ic>bpq</ic>       | resonance of the bandpass filter (0-1) |

${makeExample(
  "Sweeping the filter on the same guitar sample",
  `beat(.5) :: sound('gtr').bandf(100 + usine(1/8) * 4000).end(0.5).out()`,
  true,
)}

Alternatively, <ic>lpf</ic>, <ic>hpf</ic> and <ic>bpf</ic> can take a second argument, the **resonance**.

## Filter order (type)

You can also use the <ic>ftype</ic> method to change the filter type (order). There are two types by default, <ic>12db</ic> for a gentle slope or <ic>24db</ic> for a really steep filtering slope. The <ic>24db</ic> type is particularly useful for substractive synthesis if you are trying to emulate some of the Moog or Prophet sounds:

- <ic>ftype(type: string)</ic>: sets the filter type (order), either <ic>12db</ic> or <ic>24db</ic>.

${makeExample(
  "Filtering a bass",
  `beat(.5) :: sound('jvbass').ftype(['12db', '24db'].beat(4)).lpf([250,1000,8000].beat()).out()`,
  true,
)}

## Filter envelopes

The examples we have studied so far are static. They filter the sound around a fixed cutoff frequency. To make the sound more interesting, you can use the ADSR filter envelopes to shape the filter cutoff frequency over time. You will always find amplitude and filter envelopes on most commercial synthesizers. This is done using the following methods:

### Lowpass envelope

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>lpenv</ic>      | <ic>lpe</ic>       | lowpass frequency modulation amount (negative or positive) |
| <ic>lpattack</ic>   | <ic>lpa</ic>       | attack of the lowpass filter    |
| <ic>lpdecay</ic>    | <ic>lpd</ic>       | decay of the lowpass filter     |
| <ic>lpsustain</ic>  | <ic>lps</ic>       | sustain of the lowpass filter   |
| <ic>lprelease</ic>  | <ic>lpr</ic>       | release of the lowpass filter   |
| <ic>lpadsr</ic>     |                    | (**takes five arguments**) set all the parameters  |


${makeExample(
  "Filtering a sawtooth wave dynamically",
  `beat(.5) :: sound('sawtooth').note([48,60].beat())
  .cutoff(5000).lpa([0.05, 0.25, 0.5].beat(2))
  .lpenv(-8).lpq(10).out()`,
  true,
)}

### Highpass envelope

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>hpenv</ic>      | <ic>hpe</ic>       | highpass frequency modulation amount (negative or positive) |
| <ic>hpattack</ic>   | <ic>hpa</ic>       | attack of the highpass filter    |
| <ic>hpdecay</ic>    | <ic>hpd</ic>       | decay of the highpass filter     |
| <ic>hpsustain</ic>  | <ic>hps</ic>       | sustain of the highpass filter   |
| <ic>hprelease</ic>  | <ic>hpr</ic>       | release of the highpass filter   |
| <ic>hpadsr</ic>     |           | (**takes five arguments**) set all the parameters  |


${makeExample(
  "Let's use another filter using the same example",
  `beat(.5) :: sound('sawtooth').note([48,60].beat())
  .hcutoff(1000).hpa([0.05, 0.25, 0.5].beat(2))
  .hpenv(8).hpq(10).out()`,
  true,
)}

### Bandpass envelope

| Method     | Alias     | Description                     |
|------------|-----------|---------------------------------|
| <ic>bpenv</ic>      | <ic>bpe</ic>       | bandpass frequency modulation amount (negative or positive) |
| <ic>bpattack</ic>   | <ic>bpa</ic>       | attack of the bandpass filter    |
| <ic>bpdecay</ic>    | <ic>bpd</ic>       | decay of the bandpass filter     |
| <ic>bpsustain</ic>  | <ic>bps</ic>       | sustain of the bandpass filter   |
| <ic>bprelease</ic>  | <ic>bpr</ic>       | release of the bandpass filter   |
| <ic>bpadsr</ic>     |           | (**takes five arguments**) set all the parameters  |


${makeExample(
  "And the bandpass filter, just for fun",
  `beat(.5) :: sound('sawtooth').note([48,60].beat())
  .bandf([500,1000,2000].beat(2))
  .bpa([0.25, 0.125, 0.5].beat(2) * 4)
  .bpenv(-4).release(2).out()
  `,
  true,
)}


`;
};
