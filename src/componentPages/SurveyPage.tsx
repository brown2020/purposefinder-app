import SidebarImage from "../components/SidebarImage";
import Stepper from "../components/Stepper";
import DynamicForm from "../components/DynamicForm";
import GenericGenerate from "../components/GenericGenerate";
import GenericTuning from "../components/GenericTuning";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import GenericBeautify from "../components/GenericBeautify";
import { initDataType, QuestionType } from "@/types/QuestionAnswerType";

interface SurveyPageProps {
  initialQuestions: QuestionType[];
  version: "intro" | "purpose" | "moonshot";
  initData: initDataType;
  updateFunction: (data: QuestionType[]) => void;
}
export default function SurveyPage({
  initialQuestions,
  version,
  initData,
  updateFunction,
}: SurveyPageProps) {


  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState(initialQuestions);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (initData) {
      const currentAnswers = initData.answers || [];
      if (currentAnswers) {
        currentAnswers.forEach(({ id, answer }: QuestionType) => {
          if (answer !== undefined && answer !== null) {
            setValue(id, answer);
          }
        });
      }
    }
  }, [initData, setValue]);

  useEffect(() => {
    setQuestionData(initialQuestions);
  }, [initialQuestions]);

  const currentQuestion: QuestionType = useMemo(() => {
    return questionData[currentQuestionIndex];
  }, [currentQuestionIndex, questionData]);

  const isLastQuestion = currentQuestionIndex === questionData.length - 1;
  const handleContinue = useCallback(
    async (data: Record<string, string | string[]>) => {
      const currentData = initData;
      if (currentQuestion && currentQuestion.type !== "generate") {
        const updatedAnswers = currentData.answers.map(
          (answer: { id: string }) =>
            answer.id === currentQuestion.id
              ? {
                ...answer,
                answer: Array.isArray(data[currentQuestion.id])
                  ? data[currentQuestion.id]
                  : [data[currentQuestion.id]],
              }
              : answer
        );
        await updateFunction(updatedAnswers as QuestionType[]);
      }
      if (!isLastQuestion) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        if (version === "intro") router.push("/purpose");
        if (version === "purpose") router.push("/moonshot");
        if (version === "moonshot") router.push("/summary");
      }
    },
    [initData, currentQuestion, isLastQuestion, updateFunction, version, router]
  );

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleQuestionNavigation = useCallback(
    (index: number) => {
      const currentData = initData;
      const isAnswered =
        currentData.answers[index] &&
        currentData.answers[index].answer !== undefined;
      if (isAnswered || index <= currentQuestionIndex) {
        setCurrentQuestionIndex(index);
      }
    },
    [initData, currentQuestionIndex]
  );

  const shouldShowFullWidth =
    currentQuestion?.type === "generate" ||
    currentQuestion?.type === "beautify";

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "generate":
        return (
          <GenericGenerate
            version={version}
            title={currentQuestion.question}
            items={currentQuestion.guidance as string[]}
            onContinue={() => handleSubmit(handleContinue)()}
            onBack={handleBack}
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
            onContinue={handleContinue}
            onBack={handleBack}
            version={version}
            question={currentQuestion.question}
            guidance={currentQuestion.guidance as string[]}
          />
        );
      default:
        return (
          <DynamicForm
            currentQuestion={currentQuestion}
            onBack={handleBack}
            onContinue={handleContinue}
            currentQuestionIndex={currentQuestionIndex}
            control={control}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        );
    }
  };

  return (
    <div>
      <div
        className={`flex flex-col ${!shouldShowFullWidth ? "md:flex-row" : ""}`}
      >
        <div
          className={`w-full ${!shouldShowFullWidth ? "md:w-1/2" : ""
            } p-4  py-9 max-h-[calc(100vh-115px)] overflow-auto`}
        >
          {renderQuestion()}
        </div>
        {!shouldShowFullWidth && <SidebarImage currentSet={version} />}
      </div>
      <Stepper
        initialData={initData}
        currentQuestionIndex={currentQuestionIndex}
        handleQuestionNavigation={handleQuestionNavigation}
      />
    </div>
  );
}
