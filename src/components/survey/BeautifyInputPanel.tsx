import TextareaAutosize from "react-textarea-autosize";
import Select from "react-select";
import { PulseLoader } from "react-spinners";
import ImageSelector from "../ui/ImageSelector";
import { artStyles } from "@/constants/artStyles";
import { selectStyles } from "@/constants/selectStyles";

interface BeautifyInputPanelProps {
  title: string;
  items: string[];
  imagePrompt: string;
  imageStyle: string;
  loading: boolean;
  imagesLength: number;
  version: string;
  onImagePromptChange: (value: string) => void;
  onImageStyleChange: (value: string) => void;
  onCreateImage: (e: React.FormEvent<HTMLButtonElement>) => void;
  onSaveToProfile: () => void;
  onSetImagesLength: React.Dispatch<React.SetStateAction<number>>;
  saving: boolean;
}

export default function BeautifyInputPanel({
  title,
  items,
  imagePrompt,
  imageStyle,
  loading,
  imagesLength,
  version,
  onImagePromptChange,
  onImageStyleChange,
  onCreateImage,
  onSaveToProfile,
  onSetImagesLength,
  saving,
}: BeautifyInputPanelProps) {

  
  return (
    <div className="flex-1 flex items-center justify-between">
      <div className="p-4">
        <div className="text-3xl md:text-4xl font-semibold mb-4">{title}</div>
        <div className="flex flex-col gap-3 text-xl md:text-2xl mb-4">
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>

        <div className="flex flex-col space-y-3 mb-4">
          <TextareaAutosize
            autoFocus
            minRows={2}
            value={imagePrompt || ""}
            placeholder="Describe an image"
            onChange={(e) => onImagePromptChange(e.target.value)}
            className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full"
          />

          <div className="flex gap-2 items-end mb-4">
            <div className="w-full">
              <div>Artistic Style (optional)</div>
              <Select
                isClearable={true}
                isSearchable={true}
                name="styles"
                value={artStyles.find(style => style.value === imageStyle) || null}
                onChange={(v) => onImageStyleChange(v ? v.value : "")}
                options={artStyles}
                styles={selectStyles}
              />
            </div>

            <button
              className="btn btn-blue h-10 flex items-center justify-center disabled:opacity-50"
              disabled={loading || imagesLength > 20}
              onClick={onCreateImage}
            >
              {loading ? (
                <PulseLoader color="#fff" size={12} />
              ) : imagesLength > 20 ? (
                "Over Limit"
              ) : (
                "Create Image"
              )}
            </button>
          </div>

          <div className="w-full py-4">
            <div className="text-xl">Select Previous Background</div>
            <ImageSelector
              setImagesLength={onSetImagesLength}
              version={version}
            />
          </div>

          <div className="flex w-full gap-2 mb-4">
            <button
              className="btn-primary flex items-center justify-center flex-1 min-h-10"
              onClick={onSaveToProfile}
            >
              {saving ? <PulseLoader color="#fff" size={12} /> : "Save Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
