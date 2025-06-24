/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { useAuthStore, usePurpose, useMoonshot } from "@/stores";
import Image from "next/image";

import defaultImage from "@/app/assets/falcon.jpeg";

type Props = {
  setImagesLength: Dispatch<SetStateAction<number>>;
  version: string;
};
export default function ImageSelector({ setImagesLength, version }: Props) {
  const uid = useAuthStore((s) => s.uid);
  const { purposeData, updatePurpose } = usePurpose();
  const { moonshotData, updateMoonshot } = useMoonshot();

  const useData = version === "moonshot" ? moonshotData : purposeData;
  const updateData = version === "moonshot" ? updateMoonshot : updatePurpose;
  const selectedImage = version === "moonshot" ? moonshotData.moonshotImage : purposeData.mtpImage;

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

  const handleImageClick = (url: string) => {
    if (version === "moonshot") {
      updateData({ ...useData, moonshotImage: url });
    } else {
      updateData({ ...useData, mtpImage: url });
    }
  };

  return (
    <div className="flex overflow-x-auto p-2 space-x-3 bg-gray-200">
      {fileUrls.map((url, index) => (
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
      ))}
    </div>
  );
}
