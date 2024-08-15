/* eslint-disable @next/next/no-img-element */
"use client";

import GenericBeautify from "./GenericBeautify";

type Props = { nextPath: string; prevPath: string; version?: string };
export default function Purpose10Beautify({ nextPath, prevPath }: Props) {
  const items: string[] = [
    `Create a background image that embodies your vision. Once you're done, you can save it, download it, or share your MTP on social media.`,
    `Type a description of the background image you desire for your MTP in this text box, or let the AI create an image based on your MTP alone.`,
  ];

  return (
    <GenericBeautify
      nextPath={nextPath}
      prevPath={prevPath}
      title={`Now let's make your MTP beautiful.`}
      items={items}
      version="purpose"
      currentStep={9}
      totalSteps={10}
    />
  );
}
