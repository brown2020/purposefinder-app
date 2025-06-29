"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import { usePurpose, useMoonshot } from "@/stores";
import { QuestionType } from "@/types/QuestionAnswerType";

type Props = {
  onContinue: (data: Record<string, string | string[]>) => void;
  onBack: () => void;
  version: "purpose" | "moonshot" | "intro";
  currentQuestion: QuestionType;
};

export default function GenericTuning({
  onContinue,
  onBack,
  version,
  currentQuestion,
}: Props) {
  const { purposeData, updatePurpose } = usePurpose();
  const { moonshotData, updateMoonshot } = useMoonshot();
  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    const isMoonshot = version === "moonshot";
    const data = isMoonshot ? moonshotData : purposeData;
    
    // First try to get the selected value from the generate step
    let selectedValue = "";
    if (isMoonshot && "moonshotSelected" in data && data.moonshotSelected) {
      selectedValue = data.moonshotSelected;
    } else if (!isMoonshot && "mtpSelected" in data && data.mtpSelected) {
      selectedValue = data.mtpSelected;
    } else {
      // Fallback to looking in answers array
      const currentAnswer = data.answers.find((question: QuestionType) => question.id === currentQuestion.id);
      if (currentAnswer && currentAnswer.answer && currentAnswer.answer.length > 0) {
        selectedValue = currentAnswer.answer[0];
      }
    }
    
    if (selectedValue) {
      setAnswer(selectedValue);
    }
  }, [moonshotData, purposeData, version, currentQuestion]);

  async function handleSave() {
    try {
      if (version === "moonshot") {
        const updatedAnswers = moonshotData.answers.map((question) => {
          if (question.id === currentQuestion.id) {
            return {
              ...question,
              answer: [answer],
            };
          }
          return question;
        });
        await updateMoonshot({
          moonshotFinal: answer,
          moonshotSelected: answer,
          answers: updatedAnswers,
        });
        toast.success("Moonshot saved successfully!");
      } else {
        const updatedAnswers = purposeData.answers.map((question) => {
          if (question.id === currentQuestion.id) {
            return {
              ...question,
              answer: [answer],
            };
          }
          return question;
        });
        await updatePurpose({
          mtpFinal: answer,
          mtpSelected: answer,
          answers: updatedAnswers,
        });
        toast.success("MTP saved successfully!");
      }
      onContinue({ final: answer, mtp: answer });
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error(
        `Error saving ${version === "moonshot" ? "Moonshot" : "MTP"}`
      );
    }
  }

  return (
    <div className="flex flex-col h-full justify-center gap-5 py-4 w-full">
      <div className="text-3xl md:text-4xl font-semibold">{currentQuestion?.question}</div>

      <div className="mt-5">
        {Array.isArray(currentQuestion?.guidance) && currentQuestion?.guidance?.length > 0
          ? currentQuestion?.guidance?.map((guidance: string, index: number) => {
              return (
                <p className="text-xl md:text-2xl mt-4" key={index}>
                  {guidance}
                </p>
              );
            })
          : null}
      </div>

      <TextareaAutosize
        autoFocus
        minRows={2}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full shrink-0"
      />

      <div className="flex justify-between gap-8 mt-4">
        <button
          onClick={onBack}
          className="bg-gray-300 font-semibold text-gray-700  py-2  min-w-32 px-9 rounded-full"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 font-semibold  text-white py-2 px-9 rounded-full"
        >
         {currentQuestion?.button || "Save and Continue"}
        </button>
      </div>
    </div>
  );
}
