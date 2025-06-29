import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { InitDataType, QuestionType } from "@/types";

interface UseSurveyFormProps {
  initData: InitDataType;
}

export function useSurveyForm({ initData }: UseSurveyFormProps) {
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

  return {
    control,
    register,
    setValue,
    handleSubmit,
    isDirty,
    isValid,
    errors,
  };
}
