"use client";

import { MOONSHOT_SURVEY } from "@/constants/moonshotSurvey";
import GenericTextQuestion from "./GenericTextQuestion";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Moonshot06Rough({ nextPath }: Props) {
  return (
    <GenericTextQuestion
      nextPath={nextPath}
      title={`Your rough ideas for a Moonshot`}
      questionIndex={3}
      beforeElement={
        <div>
          If you already have any ideas for your Moonshot, you can enter them
          here. If not, you can leave this blank.
        </div>
      }
      version="moonshot"
      questions={MOONSHOT_SURVEY}
    />
  );
}
