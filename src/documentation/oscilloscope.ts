import { type Editor } from "../main";
import { makeExampleFactory } from "../Documentation";

export const oscilloscope = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `# Oscilloscope
  `;
};
