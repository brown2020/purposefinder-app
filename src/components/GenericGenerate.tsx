"use client";

import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { readStreamableValue } from "ai/rsc";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { MOONSHOT_SYSTEMPROMPT } from "@/constants/moonshotSystemPrompt";
import { MTP_SYSTEMPROMPT_LONG } from "@/constants/systemPrompt";
import { generateResponse } from "@/actions/generateResponse";
import { usePurposeStore } from "@/stores/usePurposeStore";
import { useMoonshotStore } from "@/stores/useMoonshotStore";
import { initDataType, QuestionType } from "@/types/QuestionAnswerType";

type Props = {
  version: "moonshot" | "purpose" | "intro";
  title: string;
  items: string[];
  onContinue: () => void;
  onBack: () => void;
  initData: initDataType;
};

export default function GenericGenerate({
  version,
  title,
  items,
  onContinue,
  onBack,
  initData,
}: Props) {
  const isMoonshot = version === "moonshot";
  const { updatePurpose } = usePurposeStore();
  const { updateMoonshot } = useMoonshotStore();
  const [guidancePrompt, setGuidancePrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState(false);

  const systemPrompt = isMoonshot
    ? MOONSHOT_SYSTEMPROMPT
    : MTP_SYSTEMPROMPT_LONG;
  const versionLabel = isMoonshot ? "Moonshot" : "MTP";

  const resultEndRef = useRef<HTMLDivElement | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      "mtpOptions" in initData &&
      initData?.mtpOptions?.length &&
      !isMoonshot
    ) {
      setResults(initData?.mtpOptions);

      if (initData?.mtpSelected) {
        setAnswer(initData.mtpSelected);
      }

      if (initData?.mtpGuidance) {
        setGuidancePrompt(initData.mtpGuidance);
      }
    } else if (
      "moonshotOptions" in initData &&
      initData?.moonshotOptions?.length &&
      isMoonshot
    ) {
      setResults(initData?.moonshotOptions);

      if (initData?.moonshotSelected) {
        setAnswer(initData.moonshotSelected);
      }

      if (initData?.moonshotGuidance) {
        setGuidancePrompt(initData.moonshotGuidance);
      }
    }
  }, [initData, isMoonshot]);

  useEffect(() => {
    if (finished && resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop =
        resultsContainerRef.current.scrollHeight;
    }
  }, [finished, results]);

  useEffect(() => {
    resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  const handleResultsString = async (surveyResult: string) => {
    try {
      setLoading(true);

      let userPrompt = "";

      if (isMoonshot) {
        userPrompt = `User's Massive Transformative Purpose (MTP) : ${
          "mtpFinal" in initData ? initData.mtpFinal : ""
        }\n\n`;
      }

      userPrompt += `User ${versionLabel} Survey Results: ${surveyResult}\n\nIncorporate the following additional guidance in shaping your response: ${guidancePrompt}.\n\nGenerate 5 ideas for the user's ${versionLabel} based on the survey results and guidance provided.`;

      setFinished(false);

      const result = await generateResponse(systemPrompt, userPrompt);

      for await (const content of readStreamableValue(result)) {
        if (content) {
          const trimmedResults = content
            .trim()
            .replace(/\n+/g, "\n")
            .split("\n")
            .filter((line) => line.trim());

          const uniqueResults: string[] = Array.from(
            new Set([...results, ...trimmedResults])
          );
          setResults(uniqueResults);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error processing results:", error.message);
        toast.error(error.message);
      } else {
        console.error("An unknown error occurred during result processing.");
        toast.error("An unknown error occurred during result processing.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const questionsAndAnswers = Object.entries(initData.answers).map(
      ([question, answer]) => ({
        question,
        answer: Array.isArray(answer) ? answer.join(", ") : answer,
      })
    );
    handleResultsString(JSON.stringify(questionsAndAnswers));
  };

  const handleContinue = async () => {
    const updateData = {
      guidance: guidancePrompt,
      selected: answer,
      options: results,
    };

    if (isMoonshot) {
      const updatedMoonshotAnswers = initData.answers.map(
        (question: QuestionType) => {
          if (question.id === "moonshot_generate") {
            return {
              ...question,
              answer: [answer],
            };
          }
          return question;
        }
      );
      await updateMoonshot({
        moonshotGuidance: updateData.guidance,
        moonshotSelected: updateData.selected,
        moonshotOptions: updateData.options,
        answers: updatedMoonshotAnswers,
      });
    } else {
      const updatedMTPAnswers = initData.answers.map(
        (question: QuestionType) => {
          if (question.id === "mtp_generate") {
            return {
              ...question,
              answer: [answer],
            };
          }
          return question;
        }
      );
      await updatePurpose({
        mtpGuidance: updateData.guidance,
        mtpSelected: updateData.selected,
        mtpOptions: updateData.options,
        answers: updatedMTPAnswers,
      });
    }

    onContinue();
  };
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <div className="md:w-1/2 flex flex-col h-full py-4 overflow-y-auto">
        <div className="flex flex-col h-full justify-center gap-5 flex-1 px-4">
          <div className="text-3xl md:text-4xl font-semibold">{title}</div>

          <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
              <div key={idx} className="text-xl md:text-2xl">
                {item}
              </div>
            ))}
          </div>

          <TextareaAutosize
            className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full shrink-0"
            minRows={3}
            value={guidancePrompt || ""}
            placeholder="Provide additional guidance here"
            onChange={(e) => setGuidancePrompt(e.target.value)}
          />
        </div>
      </div>
      <div className="md:w-1/2 bg-[#FAFAFA] flex flex-col  p-4 h-[calc(100vh-160px)]">
        <div
          ref={resultsContainerRef}
          className="grow overflow-y-auto min-h-[350px]"
        >
          {results?.map((option, index) => (
            <div key={index} className="mb-2">
              <button
                onClick={() => setAnswer(option)}
                className={`w-full text-left rounded p-4 border ${
                  answer === option
                    ? "bg-yellow-500 hover:bg-yellow-500 rounded-lg border-yellow-500"
                    : "bg-white rounded-lg border-slate-300 hover:bg-yellow-200"
                }`}
              >
                {option}
              </button>
            </div>
          ))}
          <div ref={resultEndRef}></div>
        </div>
        <div
          className={`flex justify-center ${
            results.length === 0 ? "items-end grow" : ""
          }`}
        >
          <button
            className="btn btn-muted w-full"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full py-1">
                <PulseLoader color="#fff" size={10} />
              </div>
            ) : (
              "Generate More Ideas"
            )}
          </button>
        </div>
        <div className="flex justify-between gap-8 mt-4">
          <button
            onClick={onBack}
            className="bg-gray-300 btn font-semibold text-gray-700  py-2  min-w-32 px-9 rounded-full"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="bg-blue-500 font-semibold text-white py-2 px-9 rounded-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
