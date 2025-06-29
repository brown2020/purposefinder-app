import { useCallback } from "react";
import { UseFormHandleSubmit, Control, UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";
import dynamic from "next/dynamic";
import DynamicForm from "../forms/DynamicForm";
import GenericGenerate from "./GenericGenerate";
import GenericTuning from "./GenericTuning";
import { InitDataType, QuestionType } from "@/types";

// Dynamic import for heavy GenericBeautify component
const GenericBeautify = dynamic(() => import("./GenericBeautify"), {
  loading: () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  ),
  ssr: false, // Disable SSR since it uses image generation APIs
});

interface QuestionRendererProps {
  currentQuestion: QuestionType;
  version: "intro" | "purpose" | "moonshot";
  initData: InitDataType;
  currentQuestionIndex: number;
  onBack: () => void;
  onContinue: (data: Record<string, string | string[]>) => void;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
}

export default function QuestionRenderer({
  currentQuestion,
  version,
  initData,
  currentQuestionIndex,
  onBack,
  onContinue,
  handleSubmit,
  control,
  register,
  errors,
}: QuestionRendererProps) {
  const renderQuestion = useCallback(() => {
    if (!currentQuestion?.type) return null;

    switch (currentQuestion?.type) {
      case "generate":
        return (
          <GenericGenerate
            version={version}
            title={currentQuestion.question}
            items={currentQuestion.guidance as string[]}
            onContinue={() => handleSubmit(onContinue)()}
            onBack={onBack}
            initData={initData}
          />
        );
      case "beautify":
        const message = version === "purpose" ? "MTP" : "Moonshot";
        const items: string[] = [
          `Create a background image that embodies your vision. Once you're done, you can save it, download it, or share your ${message} on social media.`,
          `Type a description of the background image you desire for your  ${message} in this text box, or let the AI create an image based on your  ${message} alone.`,
        ];

        return (
          <GenericBeautify
            title={currentQuestion.question}
            items={items}
            version={version}
            initData={initData}
          />
        );
      case "tuning":
        return (
          <GenericTuning
            onContinue={onContinue}
            onBack={onBack}
            version={version}
            currentQuestion={currentQuestion}
          />
        );
      default:
        return (
          <DynamicForm
            currentQuestion={currentQuestion}
            onBack={onBack}
            onContinue={onContinue}
            currentQuestionIndex={currentQuestionIndex}
            control={control}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        );
    }
  }, [currentQuestion, version, initData, onContinue, onBack, currentQuestionIndex, control, register, handleSubmit, errors]);

  return <>{renderQuestion()}</>;
}
