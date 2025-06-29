import { useMemo } from "react";
import { usePurpose } from "@/stores";
import SidebarImage from "./SidebarImage";
import Stepper from "./Stepper";
import { InitDataType, QuestionType } from "@/types";

interface SurveyLayoutProps {
  children: React.ReactNode;
  version: "intro" | "purpose" | "moonshot";
  currentQuestion: QuestionType;
  shouldShowFullWidth: boolean;
  initData: InitDataType;
  currentQuestionIndex: number;
  handleQuestionNavigation: (index: number) => void;
  isValid: boolean;
}

export default function SurveyLayout({
  children,
  version,
  currentQuestion,
  shouldShowFullWidth,
  initData,
  currentQuestionIndex,
  handleQuestionNavigation,
  isValid,
}: SurveyLayoutProps) {
  const { purposeData } = usePurpose();

  const customImageUrl = useMemo(() => {
    return currentQuestion?.id === "driver_mtp" ? purposeData?.mtpCoverImage : "";
  }, [currentQuestion, purposeData]);

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Stepper */}
      <div className="px-4">
        <div className="block md:hidden overflow-auto w-full">
          <Stepper
            initialData={initData}
            currentQuestionIndex={currentQuestionIndex}
            handleQuestionNavigation={handleQuestionNavigation}
            isValid={isValid}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex flex-col ${!shouldShowFullWidth ? "md:flex-row" : ""} flex-1`}
      >
        <div
          className={`w-full ${
            !shouldShowFullWidth ? "md:w-1/2" : ""
          } p-4 overflow-auto flex items-center`}
        >
          {children}
        </div>
        {!shouldShowFullWidth && (
          <SidebarImage currentSet={version} customeUrl={customImageUrl} />
        )}
      </div>

      {/* Desktop Stepper */}
      <div className="md:block hidden">
        <Stepper
          initialData={initData}
          currentQuestionIndex={currentQuestionIndex}
          handleQuestionNavigation={handleQuestionNavigation}
          isValid={isValid}
        />
      </div>
    </div>
  );
}
