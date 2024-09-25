import React, { useMemo } from 'react';
import { QuestionType } from '@/types/QuestionAnswerType';
import { IntroType, MoonshotType, PurposeType } from '@/zustand';


interface StepperProps {
    initialData: IntroType | PurposeType | MoonshotType;
    currentQuestionIndex: number;

    handleQuestionNavigation: (index: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ initialData, currentQuestionIndex, handleQuestionNavigation }) => {
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
                        const isAnswered = (lastAnswerIndex + 1) >= index;
                        const isCurrent = index === currentQuestionIndex;
                        return (
                            <li key={question.id} className="mb-2 mx-1">
                                <button
                                    onClick={() => handleQuestionNavigation(index)}
                                    disabled={!isAnswered && index > currentQuestionIndex}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${isCurrent
                                        ? 'bg-blue-600 text-white cursor-pointer'
                                        : isAnswered || index < currentQuestionIndex
                                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
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