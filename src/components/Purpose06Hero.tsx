"use client";

import GenericTextQuestion from "./GenericTextQuestion";
import { PURPOSE_SURVEY } from "@/constants/purposeSurvey";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose06Hero({ nextPath }: Props) {
  const examples = [
    "Renewable energy pioneers",
    "Trailblazing female entrepreneurs",
    "Underserved youth",
    "Small-scale farmers",
    "Longevity researchers",
  ];

  return (
    <GenericTextQuestion
      nextPath={nextPath}
      title={`Who do you want to be a HERO to? Which individuals or communities do you desire to impact most? Who should be the focus of your MTP?`}
      questionIndex={4}
      afterElement={
        <div className="flex flex-col gap-2">
          <div>Be as specific as possible. Here are some examples:</div>
          <div>
            {examples.map((example) => (
              <div key={example}>• {example}</div>
            ))}
          </div>
        </div>
      }
      version="purpose"
      questions={PURPOSE_SURVEY}
    />
  );
}
