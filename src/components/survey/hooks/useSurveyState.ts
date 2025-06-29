import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QuestionType } from "@/types";

interface UseSurveyStateProps {
  initialQuestions: QuestionType[];
  version: string;
  initData?: unknown;
  updateFunction: (questions: QuestionType[]) => void;
}

export function useSurveyState({
  initialQuestions,
  version,
  updateFunction,
}: UseSurveyStateProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState(initialQuestions);

  const currentQuestion: QuestionType = useMemo(() => {
    return questionData[currentQuestionIndex];
  }, [currentQuestionIndex, questionData]);

  const isLastQuestion = useMemo(() => {
    return currentQuestionIndex === questionData.length - 1;
  }, [currentQuestionIndex, questionData.length]);

  const shouldShowFullWidth = useMemo(() => {
    return currentQuestion?.type === "generate" || currentQuestion?.type === "beautify";
  }, [currentQuestion]);

  // Navigation handlers
  const handleQuestionNavigation = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleContinue = useCallback((data: Record<string, string | string[]>) => {
    const updatedQuestions = questionData.map((question) => {
      if (data[question.id] !== undefined) {
        return {
          ...question,
          answer: Array.isArray(data[question.id])
            ? (data[question.id] as string[])
            : [data[question.id] as string],
        };
      }
      return question;
    });

    setQuestionData(updatedQuestions);

    if (isLastQuestion) {
      updateFunction(updatedQuestions);
      // Navigation logic based on survey version
      if (version === "intro") router.push("/purpose");
      else if (version === "purpose") router.push("/moonshot");
      else if (version === "moonshot") router.push("/profile");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [questionData, isLastQuestion, updateFunction, router, currentQuestionIndex, version]);

  return {
    currentQuestionIndex,
    questionData,
    currentQuestion,
    isLastQuestion,
    shouldShowFullWidth,
    handleQuestionNavigation,
    handleBack,
    handleContinue,
    setQuestionData,
  };
}
