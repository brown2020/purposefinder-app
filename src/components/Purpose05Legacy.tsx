"use client";

import { PURPOSE_SURVEY } from "@/constants/purposeSurvey";
import GenericTextQuestion from "./GenericTextQuestion";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose05Legacy({ nextPath }: Props) {
  return (
    <GenericTextQuestion
      nextPath={nextPath}
      title={` What legacy do want to leave? In a few decades time, how do you want to be remembered by humanity?`}
      questionIndex={3}
      version="purpose"
      questions={PURPOSE_SURVEY}
    />
  );
}
