"use client";

import GenericTuning from "./GenericTuning";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose09Tuning({ nextPath, version }: Props) {
  return (
    <GenericTuning
      nextPath={nextPath}
      buttonText="Save my Moonshot"
      version="moonshot"
    />
  );
}
