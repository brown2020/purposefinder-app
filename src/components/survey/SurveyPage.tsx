"use client";

import SurveyContainer from "./SurveyContainer";
import { InitDataType, QuestionType } from "@/types";

interface SurveyPageProps {
  initialQuestions: QuestionType[];
  version: "intro" | "purpose" | "moonshot";
  initData: InitDataType;
  updateFunction: (data: QuestionType[]) => void;
}

export default function SurveyPage({
  initialQuestions,
  version,
  initData,
  updateFunction,
}: SurveyPageProps) {
  return (
    <SurveyContainer
      initialQuestions={initialQuestions}
      version={version}
      initData={initData}
      updateFunction={updateFunction}
    />
  );
}
