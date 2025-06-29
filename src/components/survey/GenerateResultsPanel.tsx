import { RefObject } from "react";
import { PulseLoader } from "react-spinners";

interface GenerateResultsPanelProps {
  results: string[];
  answer: string;
  loading: boolean;
  resultsContainerRef: RefObject<HTMLDivElement | null>;
  resultEndRef: RefObject<HTMLDivElement | null>;
  onOptionSelect: (option: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function GenerateResultsPanel({
  results,
  answer,
  loading,
  resultsContainerRef,
  resultEndRef,
  onOptionSelect,
  onSubmit,
  onBack,
  onContinue,
}: GenerateResultsPanelProps) {
  return (
    <div className="md:w-1/2 bg-[#FAFAFA] flex flex-col flex-1">
      <div
        ref={resultsContainerRef}
        className="overflow-y-auto rounded p-4"
        style={{ maxHeight: 'calc(100vh - 248px)', minHeight: '200px' }}
      >
        {results?.map((option, index) => (
          <div key={index} className="mb-2">
            <button
              onClick={() => onOptionSelect(option)}
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
        className={`flex justify-center px-4 ${
          results.length === 0 ? "items-end grow" : ""
        }`}
      >
        <button
          className="btn btn-muted w-full"
          disabled={loading}
          onClick={onSubmit}
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
      
      <div className="flex justify-between gap-8 mt-4 px-4">
        <button
          onClick={onBack}
          className="bg-gray-300 btn font-semibold text-gray-700 py-2 min-w-32 px-9 rounded-full"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="bg-blue-500 font-semibold text-white py-2 px-9 rounded-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
