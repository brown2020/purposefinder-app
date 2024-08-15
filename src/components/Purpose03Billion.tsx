"use client";

import { PURPOSE_SURVEY } from "@/constants/purposeSurvey";
import GenericTextQuestion from "./GenericTextQuestion";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose03Billion({ nextPath }: Props) {
  return (
    <GenericTextQuestion
      nextPath={nextPath}
      title={`If you were given $1 billion with which to make a positive impact on the world, what would you do?`}
      questionIndex={1}
      beforeElement={
        <div>
          Please describe in brief your idea. What wrong would you right? What
          opportunity would you pursue?
        </div>
      }
      version="purpose"
      questions={PURPOSE_SURVEY}
    />
  );
}
