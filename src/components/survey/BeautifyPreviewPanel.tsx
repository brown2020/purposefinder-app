import Image from "next/image";
import SVGOverlay from "../ui/SVGOverlay";
import defaultImage from "@/app/assets/falcon.jpeg";

interface BeautifyPreviewPanelProps {
  imageToShow: string;
  messageToShow: string;
  profileName: string;
  version: string;
  updatedAt: Date | null;
}

export default function BeautifyPreviewPanel({
  imageToShow,
  messageToShow,
  profileName,
  version,
  updatedAt,
}: BeautifyPreviewPanelProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-200 overflow-hidden">
      <div
        className="relative w-full h-full max-w-full max-h-full flex items-center justify-center"
        id="visualization"
      >
        <Image
          className="object-cover w-full h-full"
          src={imageToShow || defaultImage.src}
          alt="visualization"
          fill
          sizes="50vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <SVGOverlay
            profileName={profileName || ""}
            version={version}
            message={messageToShow || "Your MTP Goes Here"}
            updatedAt={updatedAt || null}
          />
        </div>
      </div>
    </div>
  );
}
