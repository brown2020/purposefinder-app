"use client";

import useProfileStore from "@/zustand/useProfileStore";
import GenericGenerate from "./GenericGenerate";

type Props = { nextPath: string; prevPath: string; version?: string };
export default function MoonshotGenerate({ nextPath, prevPath }: Props) {
  const firstName = useProfileStore((s) => s.profile.firstName) || "";

  const items: string[] = [
    `Click "Generate Ideas" to see suggestions from our Al model. To add more options, click again`,
    `When you find one you like, click on it to select it as your draft Moonshot. During the next step you can edit and fine tune your Moonshot further.`,
    `If the AI-generated options are missing key ideas you'd like incorporated, add your guidance below.`,
  ];

  return (
    <GenericGenerate
      nextPath={nextPath}
      prevPath={prevPath}
      version="moonshot"
      title={`Let's generate some Moonshot ideas${
        firstName && `, ${firstName}`
      }.`}
      items={items}
    />
  );
}
