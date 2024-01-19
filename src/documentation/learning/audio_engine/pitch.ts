import { type Editor } from "../../../main";
import { makeExampleFactory } from "../../../Documentation";

export const pitch = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `# Pitch 


## Pitch envelope
	
Similar to the amplitude envelope, you can use an envelope to shape the pitch
of your sounds (can be samples or synthesizers). This is super useful to create
new timbres out of existing sounds.
	
| Method  | Alias | Description                                   |
|---------|-------|-----------------------------------------------|
| <ic>pattack</ic>  | patt   | Attack time |
| <ic>pdecay</ic>   | pdec   | Decay time |
| <ic>psustain</ic> | psus   | Sustain value |
| <ic>prelease</ic> | prel   | Release time |
| <ic>penv</ic>    |       | Pitch envelope strength (positive or negative) |
| <ic>panchor</ic>    |       | Envelope anchor range (0 - 1) |
	
Resume writing the pitch documentation here.

`;
};
