"use client";

import { useEffect, useMemo } from "react";
import SurveyPage from "@/components/SurveyPage";
import { PURPOSE_JSON } from "@/constants/purposeSurvey";
import { usePurpose } from "@/stores";
import { QuestionType } from "@/types/QuestionAnswerType";

export default function PurposePage() {
  const { purposeData, fetchPurpose, updatePurpose } = usePurpose();

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
