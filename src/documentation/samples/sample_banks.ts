import { type Editor } from "../../main";
import { makeExampleFactory } from "../../Documentation";

export const sample_banks = (application: Editor): string => {
  // @ts-ignore
  const makeExample = makeExampleFactory(application);
  return `# Sample Banks

There is a <ic>bank</ic> attribute that can help you to sort audio samples from large collections.

**AJKPercusyn**, **AkaiLinn**, **AkaiMPC60**, **AkaiXR10**, **AlesisHR16**, **AlesisSR16**, **BossDR110**, **BossDR220**, **BossDR55**, **BossDR550**, **BossDR660**, **CasioRZ1**, **CasioSK1**, **CasioVL1**, **DoepferMS404**, **EmuDrumulator**, **EmuModular**, **EmuSP12**, **KorgDDM110**, **KorgKPR77**, **KorgKR55**, **KorgKRZ**, **KorgM1**, **KorgMinipops**, **KorgPoly800**, **KorgT3**, **Linn9000**, **LinnDrum**, **LinnLM1**, **LinnLM2**, **MFB512**, **MPC1000**, **MoogConcertMateMG1**, **OberheimDMX**, **RhodesPolaris**, **RhythmAce**, **RolandCompurhythm1000**, **RolandCompurhythm78**, **RolandCompurhythm8000**, **RolandD110**, **RolandD70**, **RolandDDR30**, **RolandJD990**, **RolandMC202**, **RolandMC303**, **RolandMT32**, **RolandR8**, **RolandS50**, **RolandSH09**, **RolandSystem100**, **RolandTR505**, **RolandTR606**, **RolandTR626**, **RolandTR707**, **RolandTR727**, **RolandTR808**, **RolandTR909**, **SakataDPM48**, **SequentialCircuitsDrumtracks**, **SequentialCircuitsTom**, **SergeModular**, **SimmonsSDS400**, **SimmonsSDS5**, **SoundmastersR88**, **UnivoxMicroRhythmer12**, **ViscoSpaceDrum**, **XdrumLM8953**, **YamahaRM50**, **YamahaRX21**, **YamahaRX5**, **YamahaRY30**, **YamahaTG33**.
`;
};
