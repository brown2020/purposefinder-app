"use client";

import { PURPOSE_SURVEY } from "@/constants/purposeSurvey";
import { QuestionType } from "@/types/QuestionAnswerType";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const questions: QuestionType[] = PURPOSE_SURVEY;

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose07Verbs({ nextPath }: Props) {
  const purposeData = usePurposeStore((s) => s.purposeData);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);
  const router = useRouter();

  const currentQuestionIndex = 5;
  const [currentAnswer, setCurrentAnswer] = useState<string[]>([]);
  const [customAnswer, setCustomAnswer] = useState("");
  const currentQuestion = questions[currentQuestionIndex];

  const [currentQuestionOptions, setCurrentQuestionOptions] = useState<
    string[]
  >([]);

  useEffect(() => {
    const savedAnswers = purposeData?.answers || [];
    const existingAnswer = savedAnswers[currentQuestionIndex]?.answer || [];
    setCurrentAnswer(existingAnswer);

    setCurrentQuestionOptions(questions[currentQuestionIndex].options || []);
  }, [currentQuestionIndex, purposeData?.answers]);

  const handleAddCustomOption = () => {
    if (customAnswer && !currentQuestionOptions.includes(customAnswer)) {
      setCurrentQuestionOptions([...currentQuestionOptions, customAnswer]);
      handleMultiselectWrapAnswerChange(customAnswer);
      setCustomAnswer("");
    }
  };

  const handleNext = useCallback(() => {
    let updatedAnswers = purposeData?.answers ? [...purposeData.answers] : [];

    const existingAnswer = updatedAnswers[currentQuestionIndex] || {};
    const defaultAnswer = { id: "", type: "", options: [] };

    updatedAnswers[currentQuestionIndex] = {
      ...defaultAnswer,
      ...existingAnswer,
      question: questions[currentQuestionIndex].question,
      answer: currentAnswer,
    };

    updatePurpose({ ...purposeData, answers: updatedAnswers });

    setTimeout(() => router.push(nextPath), 100);
  }, [currentAnswer, nextPath, purposeData, router, updatePurpose]);

  const handleMultiselectWrapAnswerChange = (selectedOption: string) => {
    const answerSet = new Set(currentAnswer);

    if (answerSet.has(selectedOption)) {
      // Remove the option if it's already selected
      answerSet.delete(selectedOption);
    } else {
      // Check if adding this option would exceed maxAnswers
      if (
        currentQuestion.maxAnswers &&
        answerSet.size >= currentQuestion.maxAnswers // Ensure this checks for equality as well
      ) {
        alert(`Maximum of ${currentQuestion.maxAnswers} answers allowed.`);
        return; // Prevent adding the new option
      }
      // Add the option if it's part of the current options
      if (currentQuestionOptions.includes(selectedOption)) {
        answerSet.add(selectedOption);
      }
    }

    // Convert the Set back to an array for further operations
    let newArray = Array.from(answerSet);

    // Immediately before updating the state, filter newArray to remove any answers not included in currentQuestionOptions
    newArray = newArray.filter((answer) =>
      currentQuestionOptions.includes(answer)
    );

    // Add a delay to allow state to update
    setTimeout(() => setCurrentAnswer(newArray), 100);
  };

  return (
    <div className="flex flex-col h-full w-full justify-center gap-5 p-4">
      <div className="text-3xl md:text-4xl font-semibold">
        Your Action Verbs
      </div>

      <div className="text-xl md:text-2xl">
        Your MTP is about action. Choose UP TO THREE high-impact verbs that
        describe the impact you wish to create in the world.
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={customAnswer}
          onChange={(e) => setCustomAnswer(e.target.value)}
          className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full"
          placeholder="Add your own"
        />
        <button
          onClick={handleAddCustomOption}
          className="btn-primary w-28"
          disabled={!customAnswer}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-1 h-full sm:h-auto">
        {currentQuestionOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleMultiselectWrapAnswerChange(option)}
            className={`flex-none text-left ${
              currentAnswer.includes(option)
                ? "bg-green-500 text-white rounded-lg border border-green-500"
                : "border rounded-lg border-gray-500"
            } rounded p-2`}
          >
            {option}
          </button>
        ))}
      </div>

      <button autoFocus onClick={() => handleNext()} className="btn btn-blue">
        Continue
      </button>
    </div>
  );
}
