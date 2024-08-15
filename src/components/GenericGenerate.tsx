"use client";

import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import ProgressBar from "./ProgressBar";
import { useMoonshotStore } from "@/zustand/useMoonshotStore";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { useEffect, useRef, useState } from "react";
import { MOONSHOT_SYSTEMPROMPT } from "@/constants/moonshotSystemPrompt";
import { MTP_SYSTEMPROMPT_LONG } from "@/constants/systemPrompt";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { AnswerType } from "@/types/QuestionAnswerType";
import { generateResponse } from "@/actions/generateResponse";
import { readStreamableValue } from "ai/rsc";

type Props = {
  nextPath: string;
  prevPath: string;
  version: string;
  title: string;
  items: string[];
};
export default function GenericGenerate({
  nextPath,
  prevPath,
  version,
  title,
  items,
}: Props) {
  const router = useRouter();
  const moonshotData = useMoonshotStore((state) => state.moonshotData);
  const updateMoonshot = useMoonshotStore((state) => state.updateMoonshot);
  const purposeData = usePurposeStore((state) => state.purposeData);
  const updatePurpose = usePurposeStore((state) => state.updatePurpose);

  const guidance =
    version === "moonshot"
      ? moonshotData.moonshotGuidance
      : purposeData.mtpGuidance;

  const [guidancePrompt, setGuidancePrompt] = useState<string>(guidance);

  const [answer, setAnswer] = useState<string>(
    version === "moonshot"
      ? moonshotData.moonshotSelected || ""
      : purposeData.mtpSelected || ""
  );
  const [results, setResults] = useState<string[]>(
    version === "moonshot"
      ? moonshotData.moonshotOptions || []
      : purposeData.mtpOptions || []
  );

  const prevResultsRef = useRef<string[]>(
    version === "moonshot"
      ? moonshotData.moonshotOptions || []
      : purposeData.mtpOptions || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState(false);

  const systemPrompt =
    version === "moonshot" ? MOONSHOT_SYSTEMPROMPT : MTP_SYSTEMPROMPT_LONG;

  const versionLabel = version === "moonshot" ? "Moonshot" : "MTP";
  const resultEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (finished) {
      prevResultsRef.current = results;
    }
  }, [finished, results]);

  useEffect(() => {
    resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  const handleResultsString = async (surveyResult: string) => {
    try {
      setLoading(true);

      let userPrompt = "";

      if (version === "moonshot") {
        userPrompt = `User's Massive Transformative Purpose (MTP) : ${purposeData.mtpFinal}\n\n`;
      }

      userPrompt += `User ${versionLabel} Survey Results: ${surveyResult}\n\nIncorporate the following additional guidance in shaping your response: ${guidancePrompt}.\n\nGenerate 5 ideas for the user's ${versionLabel} based on the survey results and guidance provided.`;

      console.log("userPrompt=====", userPrompt);

      setFinished(false);

      const result = await generateResponse(systemPrompt, userPrompt);

      for await (const content of readStreamableValue(result)) {
        if (content) {
          const trimmedResults = content
            .trim()
            .replace(/\n+/g, "\n")
            .split("\n")
            .filter((line) => line.trim());

          setResults(trimmedResults);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Error processing results.";
      console.error("Error processing results:", errorMessage);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const extractQuestionsAndAnswers = (answers: AnswerType[]) => {
      return answers.map(({ question, answer }) => {
        const formattedAnswer = Array.isArray(answer)
          ? answer.filter((a) => typeof a === "string")
          : typeof answer === "string"
          ? answer
          : "";

        return { question, answer: formattedAnswer };
      });
    };

    const questionsAndAnswers = extractQuestionsAndAnswers(
      version === "moonshot" ? moonshotData.answers : purposeData.answers
    );

    console.log("questionsAndAnswers", questionsAndAnswers);

    handleResultsString(JSON.stringify(questionsAndAnswers));
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="flex flex-col md:flex-1 md:h-full py-4">
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
            className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full flex-shrink-0"
            minRows={3}
            value={guidancePrompt || ""}
            placeholder="Provide additional guidance here"
            onChange={(e) => setGuidancePrompt(e.target.value)}
          />
        </div>

        <ProgressBar
          currentStep={7}
          totalSteps={10}
          onNext={() => router.push(nextPath)}
          onBack={() => router.push(prevPath)}
        />
      </div>
      <div className="bg-[#FAFAFA] flex flex-col md:h-full flex-1 p-4">
        <div className="flex flex-col justify-center md:h-container-small md:overflow-y-scroll gap-2">
          {results?.map((option, index) => (
            <div key={index}>
              <button
                onClick={() => {
                  setAnswer(option);
                }}
                className={`w-full text-left rounded p-4 border ${
                  answer == option
                    ? "bg-yellow-500 hover:bg-yellow-500 rounded-lg border-yellow-500"
                    : "bg-white rounded-lg border-slate-300 hover:bg-yellow-200"
                } `}
              >
                {option}
              </button>
              <div ref={resultEndRef}></div>
            </div>
          ))}
          <button
            className="btn btn-muted"
            disabled={loading || results?.length > 110}
            onClick={(e) => {
              if (version === "moonshot") {
                console.log("updateMoonshot", answer);
                updateMoonshot({
                  ...moonshotData,
                  moonshotGuidance: guidancePrompt,
                });
              } else {
                console.log("updatePurpose", answer);
                updatePurpose({
                  ...purposeData,
                  mtpGuidance: guidancePrompt,
                });
              }
              handleSubmit();
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full py-1">
                <PulseLoader color="#fff" size={10} />
              </div>
            ) : (
              <>
                {results?.length === 0
                  ? "Generate Ideas"
                  : results?.length > 110
                  ? "Limit Exceeded"
                  : "Generate More Ideas"}
              </>
            )}
          </button>
          <button
            autoFocus
            onClick={() => {
              if (version === "moonshot") {
                console.log("updateMoonshot", answer);
                updateMoonshot({
                  ...moonshotData,
                  moonshotGuidance: guidancePrompt,
                  moonshotFinal: answer,
                  moonshotSelected: answer,
                  moonshotOptions: results,
                });
              } else {
                console.log("updatePurpose", answer);
                updatePurpose({
                  ...purposeData,
                  mtpGuidance: guidancePrompt,
                  mtpFinal: answer,
                  mtpSelected: answer,
                  mtpOptions: results,
                });
              }
              setTimeout(() => router.push(nextPath), 200);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setTimeout(() => router.push(nextPath), 100);
            }}
            className="btn btn-blue"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
