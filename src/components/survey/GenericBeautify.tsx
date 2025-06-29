/* eslint-disable @next/next/no-img-element */
"use client";

import { useProfile } from "@/stores";
import { useGenericBeautify } from "./hooks/useGenericBeautify";
import BeautifyInputPanel from "./BeautifyInputPanel";
import BeautifyPreviewPanel from "./BeautifyPreviewPanel";
import { InitDataType } from "@/types";

type Props = {
  title: string;
  items: string[];
  version: string;
  initData: InitDataType;
};

export default function GenericBeautify({
  title,
  items,
  version,
  initData,
}: Props) {
  const { profile } = useProfile();

  const {
    imagePrompt,
    imageStyle,
    imagesLength,
    loading,
    saving,
    generateImageData,
    handleImagePromptChange,
    handleImageStyleChange,
    handleCreateImage,
    handleSaveToProfile,
    setImagesLength,
  } = useGenericBeautify({
    version,
    initData,
  });

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <BeautifyInputPanel
        title={title}
        items={items}
        imagePrompt={imagePrompt}
        imageStyle={imageStyle}
        loading={loading}
        imagesLength={imagesLength}
        version={version}
        onImagePromptChange={handleImagePromptChange}
        onImageStyleChange={handleImageStyleChange}
        onCreateImage={handleCreateImage}
        onSaveToProfile={handleSaveToProfile}
        onSetImagesLength={setImagesLength}
        saving={saving}
      />
      
      <BeautifyPreviewPanel
        imageToShow={generateImageData?.imageToShow || ""}
        messageToShow={generateImageData?.messageToShow || "Your MTP Goes Here"}
        profileName={profile.firstName || ""}
        version={version}
        updatedAt={initData?.updatedAt?.toDate() || null}
      />
    </div>
  );
}
