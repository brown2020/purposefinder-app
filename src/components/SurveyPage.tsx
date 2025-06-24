"use client";

import SidebarImage from "../components/SidebarImage";
import Stepper from "../components/Stepper";
import DynamicForm from "../components/DynamicForm";
import GenericGenerate from "../components/GenericGenerate";
import GenericTuning from "../components/GenericTuning";
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { initDataType, QuestionType } from "@/types/QuestionAnswerType";
import { usePurpose } from "@/stores";
import dynamic from "next/dynamic";

// Dynamic import for heavy GenericBeautify component
const GenericBeautify = dynamic(() => import("../components/GenericBeautify"), {
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

interface SurveyPageProps {
  initialQuestions: QuestionType[];
  version: "intro" | "purpose" | "moonshot";
  initData: initDataType;
  updateFunction: (data: QuestionType[]) => void;
}

const SurveyPage = memo(function SurveyPage({
  initialQuestions,
  version,
  initData,
  updateFunction,
}: SurveyPageProps) {
  const router = useRouter();
  const { purposeData } = usePurpose();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState(initialQuestions);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { isDirty, isValid, errors },
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

  const customImageUrl = useMemo(() => {
    return currentQuestion?.id === "driver_mtp" ? purposeData?.mtpCoverImage : ""
  }, [currentQuestion, purposeData]);

  const isLastQuestion = useMemo(() => {
    return currentQuestionIndex === questionData.length - 1;
  }, [currentQuestionIndex, questionData.length]);

  // Memoized navigation handlers to prevent re-creation on every render
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
      // Restore original navigation logic based on survey version
      if (version === "intro") router.push("/purpose");
      else if (version === "purpose") router.push("/moonshot");
      else if (version === "moonshot") router.push("/profile");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [questionData, isLastQuestion, updateFunction, router, currentQuestionIndex, version]);

  const shouldShowFullWidth = useMemo(() => {
    return currentQuestion?.type === "generate" || currentQuestion?.type === "beautify";
  }, [currentQuestion]);

  const renderQuestion = useCallback(() => {
    if (!currentQuestion?.type) return null;
    switch (currentQuestion?.type) {
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
            currentQuestion={currentQuestion}
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
  }, [currentQuestion, version, initData, handleContinue, handleBack, currentQuestionIndex, control, register, handleSubmit, errors]);

  return (
    <div>
      <div className="px-4">

        <div className="block md:hidden overflow-auto w-full ">
          <Stepper
            initialData={initData}
            currentQuestionIndex={currentQuestionIndex}
            handleQuestionNavigation={handleQuestionNavigation}
            isValid={isValid || !isDirty}
          />
        </div>
      </div>
      <div
        className={`flex flex-col ${!shouldShowFullWidth ? "md:flex-row" : ""} md:h-[calc(100vh-115px)]`}
      >
        <div
          className={`w-full ${!shouldShowFullWidth ? "md:w-1/2" : ""
            } p-4 py-9 md:max-h-[calc(100vh-120px)] h-full md:overflow-auto flex items-center`}
        >
          {renderQuestion()}
        </div>
        {!shouldShowFullWidth && <SidebarImage currentSet={version} customeUrl={customImageUrl} />}
      </div>
      <div className="md:block hidden">
        <Stepper
          initialData={initData}
          currentQuestionIndex={currentQuestionIndex}
          handleQuestionNavigation={handleQuestionNavigation}
          isValid={isValid || !isDirty}
        />
      </div>
    </div>
  );
});

export default SurveyPage;
