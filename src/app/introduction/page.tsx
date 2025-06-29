"use client";

import { useEffect, useMemo } from "react";
import SurveyPage from "@/components/survey/SurveyPage";
import { INTRO_JSON } from "@/constants/introSurvey";
import { useIntro } from "@/stores";
import { QuestionType } from "@/types";

export default function IntroPage() {
  const { introData, fetchIntro, updateIntro } = useIntro();

  const updateFunction = (answers: QuestionType[]) => {
    updateIntro({ answers });
  };
  useEffect(() => {
    fetchIntro();
  }, [fetchIntro]);

  const intro = useMemo(() => {
    const subDataIds = INTRO_JSON.map(item => item.id);
    const answers = introData?.answers.filter(item => subDataIds.includes(item.id));
    return {
      ...introData,
      answers
    }
  }, [introData]);

  return (
    <SurveyPage
      version="intro"
      initialQuestions={INTRO_JSON}
      initData={intro}
      updateFunction={updateFunction}
    />
  );
}
