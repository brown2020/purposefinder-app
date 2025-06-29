"use client";

import { useEffect, useMemo } from "react";
import SurveyPage from "@/components/survey/SurveyPage";
import { MOONSHOT_JSON } from "@/constants/moonshotSurvey";
import { useMoonshot } from "@/stores";
import { QuestionType } from "@/types";

export default function MoonshotPage() {
  const { moonshotData, fetchMoonshot, updateMoonshot } = useMoonshot();
  const updateFunction = (answers: QuestionType[]) => {
    updateMoonshot({ answers });
  };
  useEffect(() => {
    fetchMoonshot();
  }, [fetchMoonshot]);

  const moonshot = useMemo(() => {
    const subDataIds = MOONSHOT_JSON.map(item => item.id);
    const answers = moonshotData?.answers.filter(item => subDataIds.includes(item.id));
    return {
      ...moonshotData,
      answers
    }
  }, [moonshotData]);

  return (
    <SurveyPage
      version="moonshot"
      initialQuestions={MOONSHOT_JSON}
      initData={moonshot}
      updateFunction={updateFunction}
    />
  );
}
