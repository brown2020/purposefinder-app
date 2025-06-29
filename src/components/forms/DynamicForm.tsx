import React from "react";
import {
  UseFormRegister,
  Control,
  FieldErrors,
  Controller,
  UseFormHandleSubmit,
  FieldValues,
} from "react-hook-form";
import CustomMultiTag from "../ui/CustomMultiTag";
import { useRouter } from "next/navigation";
import { QuestionType } from "@/types";


interface DynamicFormProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  currentQuestion: QuestionType;
  onBack: () => void;
  onContinue: (data: T) => void; // Specify T here to enforce type consistency
  currentQuestionIndex: number;
  handleSubmit: UseFormHandleSubmit<T>;
  errors: FieldErrors<T>;
}

const DynamicForm: React.FC<DynamicFormProps<FieldValues>> = ({
  // questions,
  currentQuestion,
  onBack,
  onContinue,
  currentQuestionIndex,
  control,
  register,
  handleSubmit,
  errors,
}) => {
  const router = useRouter();
  const onSubmit = (data: FieldValues) => {
    onContinue(data);
  };

  const renderField = (question: QuestionType) => {
    if (!question.type) return null;
    switch (question.type) {
      case "text-area":
      case "textarea-fixed":
        return (
          <textarea
            {...register(question.id)}
            className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full shrink-0"
            placeholder={question.placeholder || "Type your answer here..."}
            rows={3}
          />
        );
      case "multiple-choice":
      case "select":
        return (
          <select
            {...register(question.id)}
            className="w-full p-2 border rounded-sm"
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "multiselect":
      case "multiselect-wrap":
        return (
          <div className="">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <Controller
                  name={question.id}
                  control={control}
                  defaultValue={question?.answer?.includes(option)} // Ensure defaultValue is set to an empty array
                  rules={{
                    required: "This field is required",
                    validate: (value) =>
                      !question.maxAnswers ||
                      value.length <= question.maxAnswers ||
                      `Please select up to ${question.maxAnswers} options`,
                  }}
                  render={({ field }) => {
                    return (
                      <input
                        type="checkbox"
                        value={option}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), option]
                            : (field.value || []).filter(
                              (val: string) => val !== option
                            );
                          field.onChange(newValue);
                        }}
                        checked={field.value?.includes(option) || false}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    );
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case "select-tags":
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{
              required: "This field is required",
              validate: (value) =>
                !question.maxAnswers ||
                (value && value.length <= question.maxAnswers) ||
                `Please select up to ${question.maxAnswers} options`,
            }}
            render={({ field }) => (
              <CustomMultiTag
                options={question.options || []}
                placeholder={question.placeholder || "Type your answer here..."}
                maxTags={question.maxAnswers}
                value={field.value || []}
                onChange={(newValue) => {
                  field.onChange(newValue);
                  field.onBlur();
                }}
              />
            )}
          />
        );
      default:
        return "";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div>
        {[currentQuestion].map((currentQuestion) => {
          return (
            <div key={currentQuestion.id}>
              <label className="text-3xl md:text-4xl font-semibold">
                {currentQuestion.question || currentQuestion.title}
              </label>
              <div className="mt-5">
                {Array.isArray(currentQuestion?.guidance) &&
                  currentQuestion?.guidance?.length > 0
                  ? currentQuestion?.guidance?.map(
                    (guidance: string, index: number) => {
                      return (
                        <p className="text-xl md:text-2xl mt-4" key={index}>
                          {guidance}
                        </p>
                      );
                    }
                  )
                  : null}
              </div>

              <div className="mt-5">
                {Array.isArray(currentQuestion?.attribute) &&
                  currentQuestion?.attribute?.length > 0 ? (
                  <ul className="list-disc pl-5 mb-2 mt-4">
                    {currentQuestion?.attribute?.map(
                      (attribute: string, index: number) => (
                        <li className="text-xl md:text-2xl" key={index}>
                          {attribute}
                        </li>
                      )
                    )}
                  </ul>
                ) : null}
              </div>

              <div className="mt-4">{renderField(currentQuestion)}</div>

              <p className="text-red-500 text-sm min-h-5">
                {errors[currentQuestion.id] ? errors[currentQuestion.id]?.message as string : ""}
              </p>
            </div>
          );
        })}
      </div>

      {currentQuestion?.id === "driver_mtp" && (
        <div className="flex justify-center space-y-3 mt-5">
          <button
            className="font-semibold bg-[#F1F5F9] h-10 disabled:opacity-50 px-9 w-fit rounded-full"
            onClick={() => {
              router.push("/purpose");
            }}
          >
            Back to Purpose Finder
          </button>
        </div>
      )}

      <div className="flex justify-between gap-5 mt-3">
        {currentQuestionIndex > 0 ? (
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 font-semibold text-gray-700  py-2  min-w-32 px-9 rounded-full"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          type="submit"
          className="bg-blue-500  font-semibold text-white py-2 px-9 rounded-full"
        >
          {currentQuestion?.button || "Continue"}
          {/* {isLastQuestion ? "Submit" : "Continue"} */}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
