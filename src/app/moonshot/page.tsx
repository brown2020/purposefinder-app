"use client";

import { useEffect, useMemo } from "react";
import SurveyPage from "@/components/SurveyPage";
import { MOONSHOT_JSON } from "@/constants/moonshotSurvey";
import { useMoonshotStore } from "@/stores";
import { QuestionType } from "@/types/QuestionAnswerType";

export default function MoonshotPage() {
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const fetchMoonshot = useMoonshotStore((s) => s.fetchMoonshot);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);
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
