"use client";

import { memo } from "react";
import { useGenericGenerate } from "./hooks/useGenericGenerate";
import GenerateInputPanel from "./GenerateInputPanel";
import GenerateResultsPanel from "./GenerateResultsPanel";
import { initDataType } from "@/types/QuestionAnswerType";

type Props = {
  version: "moonshot" | "purpose" | "intro";
  title: string;
  items: string[];
  onContinue: () => void;
  onBack: () => void;
  initData: initDataType;
};

const GenericGenerate = memo(function GenericGenerate({
  version,
  title,
  items,
  onContinue,
  onBack,
  initData,
}: Props) {
  const {
    guidancePrompt,
    answer,
    results,
    loading,
    resultEndRef,
    resultsContainerRef,
    handleSubmit,
    handleContinue,
    handleOptionSelect,
    handleGuidanceChange,
  } = useGenericGenerate({
    version,
    initData,
    onContinue,
  });

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <GenerateInputPanel
        title={title}
        items={items}
        guidancePrompt={guidancePrompt}
        onGuidanceChange={handleGuidanceChange}
      />
      
      <GenerateResultsPanel
        results={results}
        answer={answer}
        loading={loading}
        resultsContainerRef={resultsContainerRef}
        resultEndRef={resultEndRef}
        onOptionSelect={handleOptionSelect}
        onSubmit={handleSubmit}
        onBack={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
});

export default GenericGenerate;
