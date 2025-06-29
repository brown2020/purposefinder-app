import TextareaAutosize from "react-textarea-autosize";

interface GenerateInputPanelProps {
  title: string;
  items: string[];
  guidancePrompt: string;
  onGuidanceChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function GenerateInputPanel({
  title,
  items,
  guidancePrompt,
  onGuidanceChange,
}: GenerateInputPanelProps) {
  return (
    <div className="md:w-1/2 flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col h-full justify-center gap-5 flex-1">
        <div className="text-3xl md:text-4xl font-semibold">{title}</div>

        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="text-xl md:text-2xl">
              {item}
            </div>
          ))}
        </div>

        <TextareaAutosize
          className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 shrink-0 mr-4 w-[calc(100%-1rem)]"
          minRows={3}
          value={guidancePrompt || ""}
          placeholder="Provide additional guidance here"
          onChange={onGuidanceChange}
        />
      </div>
    </div>
  );
}
