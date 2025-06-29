import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, usePurpose, useMoonshot } from "@/stores";
import { db } from "@/lib/firebase/firebaseConfig";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import defaultImage from "@/app/assets/falcon.jpeg";
import { PromptDataType } from "@/types/promptdata";
import { generateImage } from "@/actions/generateImage";
import { generatePrompt } from "@/lib/utils/promptUtils";
import { captureAndUploadImage } from "@/lib/utils/canvasUtils";
import { InitDataType } from "@/types";

interface UseGenericBeautifyProps {
  version: string;
  initData: InitDataType;
}

export function useGenericBeautify({ version, initData }: UseGenericBeautifyProps) {
  const isMoonshot = version === "moonshot";
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);

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

  // Initialize data from generateImageData
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

  // Update prompt data when visual ideas or style change
  useEffect(() => {
    setPromptData((prevData) => ({
      ...prevData,
      style: generateImageData?.visualStyle || "",
      freestyle: generateImageData?.visualIdeas || "",
    }));
  }, [generateImageData?.visualIdeas, generateImageData?.visualStyle]);

  const saveHistory = useCallback(async (
    promptData: PromptDataType,
    prompt: string,
    downloadUrl: string
  ) => {
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
  }, [uid, isMoonshot, initData, updateMoonshot, updatePurpose]);

  const handleGenerateSDXL = useCallback(async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt: string = generatePrompt(
        imagePrompt,
        imageStyle,
        generateImageData?.messageToShow
      );

      const response = await generateImage(prompt, uid);

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
  }, [uid, imagePrompt, imageStyle, generateImageData?.messageToShow, promptData, saveHistory]);

  const handleSaveToProfile = useCallback(async () => {
    if (!uid) return;

    setSaving(true);
    const downloadUrl = await captureAndUploadImage(uid, "visualization");

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
  }, [uid, isMoonshot, initData, updateMoonshot, updatePurpose, router]);

  const handleImagePromptChange = useCallback((value: string) => {
    setImagePrompt(value);
  }, []);

  const handleImageStyleChange = useCallback((value: string) => {
    setImageStyle(value);
  }, []);

  const handleCreateImage = useCallback((e: React.FormEvent<HTMLButtonElement>) => {
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
  }, [isMoonshot, initData, imagePrompt, imageStyle, updateMoonshot, updatePurpose, promptData, handleGenerateSDXL]);

  return {
    // State
    imagePrompt,
    imageStyle,
    imagesLength,
    loading,
    saving,
    generateImageData,
    
    // Handlers
    handleImagePromptChange,
    handleImageStyleChange,
    handleCreateImage,
    handleSaveToProfile,
    setImagesLength,
  };
}
