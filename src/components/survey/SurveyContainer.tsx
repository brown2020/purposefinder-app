"use client";

import { useEffect, memo } from "react";
import { InitDataType, QuestionType } from "@/types";
import { useSurveyState } from "./hooks/useSurveyState";
import { useSurveyForm } from "./hooks/useSurveyForm";
import QuestionRenderer from "./QuestionRenderer";
import SurveyLayout from "./SurveyLayout";

interface SurveyContainerProps {
  initialQuestions: QuestionType[];
  version: "intro" | "purpose" | "moonshot";
  initData: InitDataType;
  updateFunction: (data: QuestionType[]) => void;
}

const SurveyContainer = memo(function SurveyContainer({
  initialQuestions,
  version,
  initData,
  updateFunction,
}: SurveyContainerProps) {
  const {
    currentQuestionIndex,
    currentQuestion,
    shouldShowFullWidth,
    handleQuestionNavigation,
    handleBack,
    handleContinue,
    setQuestionData,
  } = useSurveyState({
    initialQuestions,
    version,
    updateFunction,
  });

  const {
    control,
    register,
    handleSubmit,
    isDirty,
    isValid,
    errors,
  } = useSurveyForm({ initData });

  // Update question data when initial questions change
  useEffect(() => {
    setQuestionData(initialQuestions);
  }, [initialQuestions, setQuestionData]);

  return (
    <SurveyLayout
      version={version}
      currentQuestion={currentQuestion}
      shouldShowFullWidth={shouldShowFullWidth}
      initData={initData}
      currentQuestionIndex={currentQuestionIndex}
      handleQuestionNavigation={handleQuestionNavigation}
      isValid={isValid || !isDirty}
    >
      <QuestionRenderer
        currentQuestion={currentQuestion}
        version={version}
        initData={initData}
        currentQuestionIndex={currentQuestionIndex}
        onBack={handleBack}
        onContinue={handleContinue}
        handleSubmit={handleSubmit}
        control={control}
        register={register}
        errors={errors}
      />
    </SurveyLayout>
  );
});

export default SurveyContainer;
