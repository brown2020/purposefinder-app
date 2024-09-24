import React from 'react';
import { QuestionType } from '@/types/QuestionAnswerType';
import { IntroType, MoonshotType, PurposeType } from '@/zustand';


interface StepperProps {
    initialData: IntroType | PurposeType | MoonshotType;
    currentQuestionIndex: number;

    handleQuestionNavigation: (index: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ initialData, currentQuestionIndex, handleQuestionNavigation }) => {

    const isQuestionAnswered = (questionId: string) => {
        const question = initialData.answers.find((answer) => answer.id === questionId);
        return question && question.answer && question.answer.length > 0;
    };

    return (
        <div className="w-full bg-white sticky bottom-0 z-999 hidden md:block ">
            <ol className="flex  items-center pt-2 justify-center text-sm font-medium text-center text-gray-500 sm:text-base">

                {initialData?.answers.map((question: QuestionType, index: number) => {
                    const isAnswered = isQuestionAnswered(question.id);
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

    );
};

export default Stepper;