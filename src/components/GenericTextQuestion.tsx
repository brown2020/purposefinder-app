"use client";

import { QuestionType } from "@/types/QuestionAnswerType";
import { useMoonshotStore } from "@/zustand/useMoonshotStore";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  nextPath: string;
  title: string;
  questionIndex: number;
  beforeElement?: JSX.Element;
  afterElement?: JSX.Element;
  version: string;
  questions: QuestionType[];
};
export default function GenericTextQuestion({
  nextPath,
  title,
  questionIndex,
  beforeElement,
  afterElement,
  version,
  questions,
}: Props) {
  const router = useRouter();
  const purposeData = usePurposeStore((s) => s.purposeData);
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);

  const answerData = version === "purpose" ? purposeData : moonshotData;
  const updateAnswer = version === "purpose" ? updatePurpose : updateMoonshot;

  const [currentAnswer, setCurrentAnswer] = useState<string[]>([]);

  useEffect(() => {
    const savedAnswers = answerData?.answers || [];
    const existingAnswer = savedAnswers[questionIndex]?.answer || [];
    setCurrentAnswer(existingAnswer);
  }, [questionIndex, answerData?.answers]);

  const handleNext = useCallback(() => {
    const updatedAnswers = answerData?.answers ? [...answerData.answers] : [];
    const existingAnswer = updatedAnswers[questionIndex] || {};
    const defaultAnswer = { id: "", type: "", options: [] };

    updatedAnswers[questionIndex] = {
      ...defaultAnswer,
      ...existingAnswer,
      question: questions[questionIndex].question,
      answer: currentAnswer,
    };

    console.log("updatedAnswers=====", updatedAnswers);

    updateAnswer({ ...answerData, answers: updatedAnswers });

    setTimeout(() => router.push(nextPath), 100);
  }, [
    answerData,
    questionIndex,
    questions,
    currentAnswer,
    updateAnswer,
    router,
    nextPath,
  ]);

  const handleAnswerChange = (userAnswer: string[]) => {
    setCurrentAnswer(userAnswer);
  };

  return (
    <div className="flex flex-col md:h-full justify-center gap-5 p-4">
      <div className="text-3xl md:text-4xl font-semibold">{title}</div>

      {beforeElement && (
        <div className="text-xl md:text-2xl">{beforeElement}</div>
      )}

      <TextareaAutosize
        autoFocus
        placeholder="Type your answer here..."
        minRows={4}
        value={currentAnswer}
        onChange={(e) => handleAnswerChange([e.target.value])}
        onKeyDown={(e) => {
          const target = e.target as HTMLTextAreaElement;
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAnswerChange([target.value]);
          }
        }}
        className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full flex-shrink-0"
      />

      {afterElement && (
        <div className="text-xl md:text-2xl">{afterElement}</div>
      )}

      <button
        autoFocus
        onClick={handleNext}
        onKeyDown={(e) => {
          if (e.key === "Enter") setTimeout(() => router.push(nextPath), 100);
        }}
        className="btn btn-blue"
      >
        Continue
      </button>
    </div>
  );
}
