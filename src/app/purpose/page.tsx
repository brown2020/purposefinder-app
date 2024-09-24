"use client";

import { useEffect } from "react";
import SurveyPage from "@/componentPages/SurveyPage";
import { PURPOSE_JSON } from "@/constants/purposeSurvey";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { QuestionType } from "@/types/QuestionAnswerType";

export default function PurposePage() {
  const purposeData = usePurposeStore((s) => s.purposeData);
  const fetchPurpose = usePurposeStore((s) => s.fetchPurpose);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);

  const updateFunction = (answers:  QuestionType[]) => {
    updatePurpose({ answers });
  };
  useEffect(() => {
    fetchPurpose();
  }, [fetchPurpose]);
  return (
    <SurveyPage
      version="purpose"
      initialQuestions={PURPOSE_JSON}
      initData={purposeData}
      updateFunction={updateFunction}
    />
  );
}
