import React, { useMemo } from 'react';
import { initDataType, QuestionType } from '@/types/QuestionAnswerType';


interface StepperProps {
    initialData: initDataType;
    currentQuestionIndex: number;
    handleQuestionNavigation: (index: number) => void;
    isValid: boolean
}

const Stepper: React.FC<StepperProps> = ({ initialData, currentQuestionIndex, handleQuestionNavigation, isValid }) => {
    console.log("isValid stepper", isValid)
    const lastAnswerIndex = useMemo(() => {
        const lastIndex = initialData?.answers.reduceRight((acc, item, index) => {
            if (Array.isArray(item.answer) && item.answer.length > 0 && acc === -1) {
                return index;
            }
            return acc;
        }, -1);

        return lastIndex
    }, [initialData?.answers]);

    return (
        <div className="w-full bg-white md:sticky  md:bottom-0 md:z-999">
            <div className='mx-auto w-fit'>
                <ol className="flex  items-center pt-2 md:justify-center text-sm font-medium text-center text-gray-500 sm:text-base">
                    {initialData?.answers.map((question: QuestionType, index: number) => {
                        const isActive = (lastAnswerIndex + 1) >= index;
                        const isCurrent = index === currentQuestionIndex;
                        return (
                            <li key={question.id} className="mb-2 mx-1">
                                <button
                                    onClick={() => handleQuestionNavigation(index)}
                                    disabled={!isValid || (!isActive && index > currentQuestionIndex)}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${isCurrent
                                        ? 'bg-blue-600 text-white cursor-pointer opacity-100'
                                        : isActive || index < currentQuestionIndex
                                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer'
                                            : 'bg-gray-200 text-gray-400'
                                        } ${(!isValid || index < currentQuestionIndex) ? "opacity-70" : ""}`}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>

    );
};

export default Stepper;