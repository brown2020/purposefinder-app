/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { useAuthStore, useProfile, usePurpose, useMoonshot } from "@/stores";
import ImageSelector from "../components/ImageSelector";
import { db } from "@/lib/firebase/firebaseConfig";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import defaultImage from "@/app/assets/falcon.jpeg";
import { useEffect, useMemo, useState } from "react";
import { PromptDataType } from "@/types/promptdata";
import { artStyles } from "@/constants/artStyles";
import { selectStyles } from "@/constants/selectStyles";
import Select from "react-select";
import { PulseLoader } from "react-spinners";
import { generateImage } from "@/actions/generateImage";
import { generatePrompt } from "@/lib/utils/promptUtils";
import { captureAndUploadImage } from "@/lib/utils/canvasUtils";
import SVGOverlay from "../components/SVGOverlay";
import { initDataType } from "@/types/QuestionAnswerType";

type Props = {
  title: string;
  items: string[];
  version: string;
  initData: initDataType;
};

export default function GenericBeautify({
  title,
  items,
  version,
  initData,
}: Props) {
  const isMoonshot = version === "moonshot";
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const { profile } = useProfile();
  const { updatePurpose } = usePurpose();
  const { updateMoonshot } = useMoonshot();

  const generateImageData = useMemo(() => {
    const visualIdeas = initData?.visualIdeas || "";
    const visualStyle = initData?.visualStyle || "";
    const imageToShow = isMoonshot
      ? initData?.moonshotImage
      : initData?.mtpImage;
    const messageToShow = isMoonshot
      ? initData?.moonshotFinal
      : initData?.mtpFinal;
    return { visualIdeas, visualStyle, imageToShow, messageToShow };
  }, [initData, isMoonshot]);

  const [imagePrompt, setImagePrompt] = useState<string>(
    generateImageData?.visualIdeas || ""
  );
  const [imageStyle, setImageStyle] = useState<string>(
    generateImageData?.visualStyle || ""
  );
  const [imagesLength, setImagesLength] = useState<number>(0);
  const [promptData, setPromptData] = useState<PromptDataType>({
    style: generateImageData?.visualStyle || "",
    freestyle: generateImageData?.visualIdeas || "",
    downloadUrl: defaultImage.src,
    prompt: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (generateImageData) {
      setImagePrompt(generateImageData?.visualIdeas || "");
      setImageStyle(generateImageData?.visualStyle || "");
      setPromptData({
        style: generateImageData?.visualStyle || "",
        freestyle: generateImageData?.visualIdeas || "",
        downloadUrl: defaultImage.src,
        prompt: "",
      });
    }
  }, [generateImageData]);

  useEffect(() => {
    setPromptData((prevData) => ({
      ...prevData,
      style: generateImageData?.visualStyle || "",
      freestyle: generateImageData?.visualIdeas || "",
    }));
  }, [generateImageData?.visualIdeas, generateImageData?.visualStyle]);

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

    if (isMoonshot) {
      updateMoonshot({
        ...initData,
        moonshotImage: downloadUrl || "",
      });
    } else {
      updatePurpose({
        ...initData,
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
        generateImageData?.messageToShow
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
      if (isMoonshot) {
        updateMoonshot({ ...initData, moonshotCoverImage: downloadUrl });
        setTimeout(() => router.push(`/moonshotpage/${uid}`), 100);
      } else {
        updatePurpose({ ...initData, mtpCoverImage: downloadUrl });
        setTimeout(() => router.push(`/purposepage/${uid}`), 100);
      }
    }

    setSaving(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Left Side */}
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
                  if (isMoonshot) {
                    updateMoonshot({
                      ...initData,
                      visualIdeas: imagePrompt,
                      visualStyle: imageStyle,
                    });
                  } else {
                    updatePurpose({
                      ...initData,
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
                className="btn-primary flex items-center justify-center flex-1 min-h-10"
                onClick={handleSaveToProfile}
              >
                {saving ? <PulseLoader color="#fff" size={12} /> : "Save Image"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <div
          className="relative w-full aspect-square flex items-center justify-center"
          id="visualization"
        >
          <img
            className="object-cover w-full h-full"
            src={generateImageData?.imageToShow || defaultImage.src}
            alt="visualization"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <SVGOverlay
              profileName={profile.firstName || ""}
              version={version}
              message={generateImageData?.messageToShow || "Your MTP Goes Here"}
              updatedAt={initData?.updatedAt?.toDate() || null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
