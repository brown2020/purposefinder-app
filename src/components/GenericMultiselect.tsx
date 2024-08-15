"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useMoonshotStore } from "@/zustand/useMoonshotStore";
import { QuestionType } from "@/types/QuestionAnswerType";
import { useIntroStore } from "@/zustand/useIntroStore";

type Props = {
  nextPath: string;
  questionIndex: number;
  title: string;
  beforeElement?: JSX.Element;
  buttonText: string;
  version: string;
  questions: QuestionType[];
};

export default function GenericMultiselect({
  nextPath,
  questionIndex,
  title,
  beforeElement,
  buttonText,
  version,
  questions,
}: Props) {
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);
  const introData = useIntroStore((s) => s.introData);
  const updateIntro = useIntroStore((s) => s.updateIntro);

  const answerData = version === "intro" ? introData : moonshotData;
  const updateAnswers = version === "intro" ? updateIntro : updateMoonshot;

  const router = useRouter();

  const currentQuestionIndex = questionIndex;
  const [currentAnswer, setCurrentAnswer] = useState<string[]>([]);
  const [shouldProceedToNext, setShouldProceedToNext] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const maxAnswers = currentQuestion.maxAnswers || 1;

  const [currentQuestionOptions, setCurrentQuestionOptions] = useState<
    string[]
  >([]);

  useEffect(() => {
    const savedAnswers = answerData?.answers || [];
    const existingAnswer = savedAnswers[currentQuestionIndex];

    if (existingAnswer && existingAnswer.answer.length > 0) {
      setCurrentAnswer(existingAnswer.answer);
    } else {
      setCurrentAnswer([]);
    }

    setCurrentQuestionOptions(questions[currentQuestionIndex].options || []);
  }, [answerData?.answers, currentQuestionIndex, questions]);

  const handleNext = useCallback(() => {
    let updatedAnswers = answerData?.answers ? [...answerData.answers] : [];

    if (currentQuestion.type !== "statement") {
      const existingAnswer = updatedAnswers[currentQuestionIndex] || {};
      const defaultAnswer = { id: "", type: "", options: [] };

      updatedAnswers[currentQuestionIndex] = {
        ...defaultAnswer,
        ...existingAnswer,
        question: questions[currentQuestionIndex].question,
        answer: currentAnswer,
      };

      updateAnswers({
        ...answerData,
        answers: updatedAnswers,
      });
    }

    setTimeout(() => router.push(nextPath), 100);
  }, [
    answerData,
    currentAnswer,
    currentQuestion.type,
    currentQuestionIndex,
    nextPath,
    questions,
    router,
    updateAnswers,
  ]);

  useEffect(() => {
    if (shouldProceedToNext) {
      handleNext();
      setShouldProceedToNext(false); // Reset the flag after moving to the next question
    }
  }, [currentAnswer, handleNext, shouldProceedToNext]);

  const handleMultiselectAnswerChange = (
    selectedOption: string,
    isChecked: boolean
  ) => {
    // Create a new Set from currentAnswer to handle additions or removals
    let newAnswerSet = new Set(currentAnswer);

    // Add or remove the selected option based on isChecked
    if (isChecked) {
      // Check if adding the new selection would exceed the maxAnswers limit
      if (newAnswerSet.size < maxAnswers) {
        newAnswerSet.add(selectedOption);
      } else {
        // Optionally, inform the user they've reached the selection limit
        alert(`You can select up to ${maxAnswers} options.`);
        return; // Prevent adding the new selection
      }
    } else {
      newAnswerSet.delete(selectedOption); // Always allow removal
    }

    // Convert the Set back to an array
    let newAnswers = Array.from(newAnswerSet);

    // Filter the newAnswers to ensure they are part of the current question's options
    newAnswers = newAnswers.filter((answer) =>
      currentQuestionOptions.includes(answer)
    );

    // Update the state with the cleaned-up list of answers
    setTimeout(() => setCurrentAnswer(newAnswers), 100);
  };

  return (
    <div className="flex flex-col h-full flex-1 md:flex-row">
      <div className="flex flex-col flex-1 justify-center md:h-full p-5 gap-5">
        <div className="text-3xl md:text-4xl font-semibold">{title}</div>
        <div className="text-xl md:text-2xl">
          {beforeElement && beforeElement}
        </div>

        <div className="flex flex-col">
          {currentQuestionOptions.map((option, index) => (
            <label key={index} className="checkbox-container">
              <input
                type="checkbox"
                checked={currentAnswer.includes(option)}
                onChange={(e) =>
                  handleMultiselectAnswerChange(option, e.target.checked)
                }
                className="custom-checkbox"
                hidden
              />

              <span className="cursor-pointer text-xl">{option}</span>
            </label>
          ))}

          <button onClick={handleNext} className="btn btn-blue mr-auto">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
