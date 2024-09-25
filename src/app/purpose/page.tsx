"use client";

import { useEffect, useMemo } from "react";
import SurveyPage from "@/componentPages/SurveyPage";
import { PURPOSE_JSON } from "@/constants/purposeSurvey";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { QuestionType } from "@/types/QuestionAnswerType";

export default function PurposePage() {
  const purposeData = usePurposeStore((s) => s.purposeData);
  const fetchPurpose = usePurposeStore((s) => s.fetchPurpose);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);

  const updateFunction = (answers: QuestionType[]) => {
    updatePurpose({ answers });
  };
  useEffect(() => {
    fetchPurpose();
  }, [fetchPurpose]);

  const purpose = useMemo(() => {
    const subDataIds = PURPOSE_JSON.map(item => item.id);
    const answers = purposeData?.answers.filter(item => subDataIds.includes(item.id));
    return {
      ...purposeData,
      answers
    }
  }, [purposeData]);
  return (
    <SurveyPage
      version="purpose"
      initialQuestions={PURPOSE_JSON}
      initData={purpose}
      updateFunction={updateFunction}
    />
  );
}
