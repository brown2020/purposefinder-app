/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, Dispatch, SetStateAction, useCallback, useMemo, memo } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { useAuthStore, usePurpose, useMoonshot } from "@/stores";
import Image from "next/image";

import defaultImage from "@/app/assets/falcon.jpeg";

type Props = {
  setImagesLength: Dispatch<SetStateAction<number>>;
  version: string;
};

const ImageSelector = memo(function ImageSelector({ setImagesLength, version }: Props) {
  const uid = useAuthStore((s) => s.uid);
  const { purposeData, updatePurpose } = usePurpose();
  const { moonshotData, updateMoonshot } = useMoonshot();

  const useData = useMemo(() => 
    version === "moonshot" ? moonshotData : purposeData,
    [version, moonshotData, purposeData]
  );
  
  const updateData = useMemo(() => 
    version === "moonshot" ? updateMoonshot : updatePurpose,
    [version, updateMoonshot, updatePurpose]
  );
  
  const selectedImage = useMemo(() => 
    version === "moonshot" ? moonshotData.moonshotImage : purposeData.mtpImage,
    [version, moonshotData.moonshotImage, purposeData.mtpImage]
  );

  const [fileUrls, setFileUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "profiles", uid, "covers"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const urls = snapshot.docs
        .map((doc) => doc.data().downloadUrl)
        .filter(Boolean);
      setFileUrls([...urls, defaultImage.src]);
      setImagesLength(urls.length);
    });

    return () => unsubscribe();
  }, [setImagesLength, uid]);

  const handleImageClick = useCallback((url: string) => {
    if (version === "moonshot") {
      updateData({ ...useData, moonshotImage: url });
    } else {
      updateData({ ...useData, mtpImage: url });
    }
  }, [version, updateData, useData]);

  // Memoized image rendering to prevent unnecessary re-renders
  const renderedImages = useMemo(() => 
    fileUrls.map((url, index) => (
      <Image
        key={index}
        src={url}
        alt={`Cover ${index}`}
        width={128}
        height={128}
        onClick={() => handleImageClick(url)}
        className={`h-32 w-32 object-cover rounded-md cursor-pointer ring-4
                        ${url === selectedImage
            ? "ring-yellow-500"
            : "ring-transparent"
          }`}
      />
    )),
    [fileUrls, selectedImage, handleImageClick]
  );

  return (
    <div className="flex overflow-x-auto p-2 space-x-3 bg-gray-200">
      {renderedImages}
    </div>
  );
});

export default ImageSelector;
