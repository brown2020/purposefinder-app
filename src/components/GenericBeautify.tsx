/* eslint-disable @next/next/no-img-element */
"use client";

import useProfileStore from "@/zustand/useProfileStore";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import ProgressBar from "./ProgressBar";
import { useAuthStore } from "@/zustand/useAuthStore";
import ImageSelector from "../components/ImageSelector";
import { db } from "@/firebase/firebaseConfig";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import defaultImage from "@/app/assets/falcon.jpeg";
import { useEffect, useState } from "react";
import { PromptDataType } from "@/types/promptdata";
import { artStyles } from "@/constants/artStyles";
import { selectStyles } from "@/constants/selectStyles";
import Select from "react-select";
import { PulseLoader } from "react-spinners";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { useMoonshotStore } from "@/zustand/useMoonshotStore";
import { generateImage } from "@/actions/generateImage";
import { generatePrompt } from "@/utils/promptUtils";
import { captureAndUploadImage } from "@/utils/canvasUtils";
import SVGOverlay from "../components/SVGOverlay";

type Props = {
  nextPath: string;
  prevPath: string;
  title: string;
  items: string[];
  version: string;
  currentStep: number;
  totalSteps: number;
};

export default function GenericBeautify({
  nextPath,
  prevPath,
  title,
  items,
  version,
  currentStep,
  totalSteps,
}: Props) {
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  const purposeData = usePurposeStore((s) => s.purposeData);
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);

  const visualIdeas =
    version === "moonshot" ? moonshotData.visualIdeas : purposeData.visualIdeas;
  const visualStyle =
    version === "moonshot" ? moonshotData.visualStyle : purposeData.visualStyle;
  const imageToShow =
    version === "moonshot" ? moonshotData.moonshotImage : purposeData.mtpImage;
  const messageToShow =
    version === "moonshot" ? moonshotData.moonshotFinal : purposeData.mtpFinal;

  const [imagePrompt, setImagePrompt] = useState<string>(visualIdeas || "");
  const [imageStyle, setImageStyle] = useState<string>(visualStyle || "");
  const [imagesLength, setImagesLength] = useState<number>(0);
  const [promptData, setPromptData] = useState<PromptDataType>({
    style: visualStyle || "",
    freestyle: visualIdeas || "",
    downloadUrl: defaultImage.src,
    prompt: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    setPromptData((prevData) => ({
      ...prevData,
      style: visualStyle || "",
      freestyle: visualIdeas || "",
    }));
  }, [visualIdeas, visualStyle]);

  async function saveHistory(
    promptData: PromptDataType,
    prompt: string,
    downloadUrl: string
  ) {
    if (!uid) return;

    const coll = collection(db, "profiles", uid, "covers");
    const docRef = doc(coll);
    const p: PromptDataType = {
      ...promptData,
      downloadUrl: downloadUrl,
      prompt: prompt,
      id: docRef.id,
      timestamp: Timestamp.now(),
    };
    setPromptData(p);

    if (version === "moonshot") {
      updateMoonshot({
        ...moonshotData,
        moonshotImage: downloadUrl || "",
      });
    } else {
      updatePurpose({
        ...purposeData,
        mtpImage: downloadUrl || "",
      });
    }

    await setDoc(docRef, p);
  }

  const handleGenerateSDXL = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt: string = generatePrompt(
        imagePrompt,
        imageStyle,
        messageToShow
      );

      const response = await generateImage(prompt, uid);

      console.log("imageurl=====", response.imageUrl);

      const downloadURL = response.imageUrl;
      if (!downloadURL) {
        throw new Error("Error generating image");
      }
      await saveHistory(promptData, prompt, downloadURL);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error generating image:", error.message);
      } else {
        console.error("An unknown error occurred during image generation.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProfile = async () => {
    console.log("handleSaveToProfile");
    if (!uid) return;

    setSaving(true);
    const downloadUrl = await captureAndUploadImage(uid, "visualization");
    console.log("downloadUrl", downloadUrl);

    if (downloadUrl) {
      if (version === "moonshot") {
        updateMoonshot({ ...moonshotData, moonshotCoverImage: downloadUrl });
        setTimeout(() => router.push(`/moonshotpage/${uid}`), 100);
      } else {
        updatePurpose({ ...purposeData, mtpCoverImage: downloadUrl });
        setTimeout(() => router.push(`/purposepage/${uid}`), 100);
      }
    }

    setSaving(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-between">
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
              onChange={(e) => setImagePrompt(e.target.value)}
              className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full"
            />

            <div className="flex gap-2 items-end mb-4">
              <div className="w-full">
                <div>Artistic Style (optional)</div>

                <Select
                  isClearable={true}
                  isSearchable={true}
                  name="styles"
                  onChange={(v) => setImageStyle(v ? v.value : "")}
                  options={artStyles}
                  styles={selectStyles}
                />
              </div>

              <button
                className="btn btn-blue h-10 flex items-center justify-center disabled:opacity-50"
                disabled={loading || imagesLength > 20}
                onClick={(e) => {
                  if (version === "moonshot") {
                    updateMoonshot({
                      ...moonshotData,
                      visualIdeas: imagePrompt,
                      visualStyle: imageStyle,
                    });
                  } else {
                    updatePurpose({
                      ...purposeData,
                      visualIdeas: imagePrompt,
                      visualStyle: imageStyle,
                    });
                  }
                  setPromptData({
                    ...promptData,
                    freestyle: imagePrompt,
                    style: imageStyle,
                  });

                  handleGenerateSDXL(e);
                }}
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
                setImagesLength={setImagesLength}
                version={version}
              />
            </div>

            <div className="flex w-full gap-2 mb-4">
              <button
                className="btn-primary flex items-center justify-center flex-1"
                onClick={handleSaveToProfile}
              >
                {saving ? <PulseLoader color="#fff" size={12} /> : "Save Image"}
              </button>
            </div>
          </div>
        </div>
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={() => router.push(nextPath)}
          onBack={() => router.push(prevPath)}
        />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <div
          className="relative w-full aspect-square flex items-center justify-center"
          id="visualization"
        >
          <img
            className="object-cover w-full h-full"
            src={imageToShow || defaultImage.src}
            alt="visualization"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <SVGOverlay
              profileName={profile.firstName || ""}
              version={version}
              message={messageToShow || "Your MTP Goes Here"}
              updatedAt={
                version === "moonshot"
                  ? moonshotData.updatedAt?.toDate() || null
                  : purposeData.updatedAt?.toDate() || null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
