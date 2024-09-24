"use client";

import SurveyPage from "@/componentPages/SurveyPage";
import { MOONSHOT_JSON } from "@/constants/moonshotSurvey";
import { QuestionType } from "@/types/QuestionAnswerType";
import { useMoonshotStore } from "@/zustand/useMoonshotStore";
import { useEffect } from "react";

export default function MoonshotPage() {
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const fetchMoonshot = useMoonshotStore((s) => s.fetchMoonshot);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);
  const updateFunction = (answers:  QuestionType[]) => {
    updateMoonshot({ answers });
  };
  useEffect(() => {
    fetchMoonshot();
  }, [fetchMoonshot]);
  return (
    <SurveyPage
      version="moonshot"
      initialQuestions={MOONSHOT_JSON}
      initData={moonshotData}
      updateFunction={updateFunction}
    />
  );
}
