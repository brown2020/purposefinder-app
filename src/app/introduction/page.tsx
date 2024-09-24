"use client";

import { useEffect } from "react";
import SurveyPage from "@/componentPages/SurveyPage";
import { INTRO_JSON } from "@/constants/introSurvey";
import { useIntroStore } from "@/zustand";
import { QuestionType } from "@/types/QuestionAnswerType";

export default function IntroPage() {
  const introData = useIntroStore((s) => s.introData);
  const fetchIntro = useIntroStore((s) => s.fetchIntro);
  const updateIntro = useIntroStore((s) => s.updateIntro);

  const updateFunction = (answers: QuestionType[]) => {
    updateIntro({ answers });
  };
  useEffect(() => {
    fetchIntro();
  }, [fetchIntro]);

  return (
    <SurveyPage
      version="intro"
      initialQuestions={INTRO_JSON}
      initData={introData}
      updateFunction={updateFunction}
    />
  );
}
