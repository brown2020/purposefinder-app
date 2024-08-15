export const generatePrompt = async (
  visual?: string,
  artStyle?: string,
  mtp?: string
) => {
  let promptDesign: string = "";

  if (visual) {
    promptDesign += visual;
  } else {
    promptDesign += "An inspiring scene";
  }

  if (artStyle) {
    promptDesign +=
      "\n\nPainted this in the following artistic style: " + artStyle;
  }

  if (mtp) {
    promptDesign +=
      "\n\nThe image will be used as a background for my personal Massive Transformative Purpose (MTP) statement: " +
      mtp;
  }

  promptDesign +=
    "\n\nThe image should be inspiring and beautiful without words. No text or logos.";

  return promptDesign;
};
