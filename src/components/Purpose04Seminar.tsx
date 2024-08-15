"use client";

import { PURPOSE_SURVEY } from "@/constants/purposeSurvey";
import GenericTextQuestion from "./GenericTextQuestion";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose04Seminar({ nextPath }: Props) {
  return (
    <GenericTextQuestion
      nextPath={nextPath}
      title={`Imagine a day-long seminar so intriguing that you would clear your schedule to attend. What is the theme of that seminar?`}
      questionIndex={2}
      version="purpose"
      questions={PURPOSE_SURVEY}
    />
  );
}
