import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { readStreamableValue } from "ai/rsc";
import toast from "react-hot-toast";
import { MOONSHOT_SYSTEMPROMPT } from "@/constants/moonshotSystemPrompt";
import { MTP_SYSTEMPROMPT_LONG } from "@/constants/systemPrompt";
import { generateResponse } from "@/actions/generateResponse";
import { usePurpose, useMoonshot } from "@/stores";
import { initDataType, QuestionType } from "@/types/QuestionAnswerType";

interface UseGenericGenerateProps {
  version: "moonshot" | "purpose" | "intro";
  initData: initDataType;
  onContinue: () => void;
}

export function useGenericGenerate({
  version,
  initData,
  onContinue,
}: UseGenericGenerateProps) {
  const isMoonshot = useMemo(() => version === "moonshot", [version]);
  const { updatePurpose } = usePurpose();
  const { updateMoonshot } = useMoonshot();
  
  const [guidancePrompt, setGuidancePrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState(false);

  const systemPrompt = useMemo(() => 
    isMoonshot ? MOONSHOT_SYSTEMPROMPT : MTP_SYSTEMPROMPT_LONG,
    [isMoonshot]
  );
  
  const versionLabel = useMemo(() => 
    isMoonshot ? "Moonshot" : "MTP",
    [isMoonshot]
  );

  const resultEndRef = useRef<HTMLDivElement | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Initialize data from initData
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

  // Auto-scroll effects
  useEffect(() => {
    if (finished && resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop =
        resultsContainerRef.current.scrollHeight;
    }
  }, [finished, results]);

  useEffect(() => {
    resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  const handleResultsString = useCallback(async (surveyResult: string) => {
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

      setFinished(true);
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
  }, [systemPrompt, guidancePrompt, results, isMoonshot, versionLabel, initData]);

  const handleSubmit = useCallback(async () => {
    const questionsAndAnswers = Object.entries(initData.answers).map(
      ([question, answer]) => ({
        question,
        answer: Array.isArray(answer) ? answer.join(", ") : answer,
      })
    );
    handleResultsString(JSON.stringify(questionsAndAnswers));
  }, [handleResultsString, initData]);

  const handleContinue = useCallback(async () => {
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
  }, [guidancePrompt, answer, results, isMoonshot, initData, updateMoonshot, updatePurpose, onContinue]);

  const handleOptionSelect = useCallback((option: string) => {
    setAnswer(option);
  }, []);

  const handleGuidanceChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGuidancePrompt(e.target.value);
  }, []);

  return {
    // State
    guidancePrompt,
    answer,
    results,
    loading,
    versionLabel,
    
    // Refs
    resultEndRef,
    resultsContainerRef,
    
    // Handlers
    handleSubmit,
    handleContinue,
    handleOptionSelect,
    handleGuidanceChange,
  };
}
