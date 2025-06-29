type ProgressProps = {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
};

export default function ProgressBar({
  currentStep,
  totalSteps,
  onBack,
}: ProgressProps) {
  const progressWidth = ((currentStep + 1) / totalSteps) * 100;
  const progressText = `${currentStep + 1}/${totalSteps}`;

  return (
    <div className="flex items-center gap-1 p-4">
      {currentStep > 0 && (
        <button
          onClick={onBack}
          disabled={currentStep === 0}
          className="text-xs border border-gray-500 flex items-center justify-center w-14 h-5 py-1 text-gray-500 bg-white rounded-md"
        >
          Back
        </button>
      )}
      <div className="w-full bg-white h-5 rounded-full border border-gray-500 overflow-hidden relative">
        <div
          className="bg-blue-300 h-5"
          style={{ width: `${progressWidth}%` }}
        ></div>
        {/* Overlay text */}
        <div className="absolute w-full flex justify-center items-center h-full top-0">
          <span className="text-black text-sm">{progressText}</span>
        </div>
      </div>
    </div>
  );
}
