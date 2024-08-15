/* eslint-disable @next/next/no-img-element */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useAuthStore } from "@/zustand/useAuthStore";

import defaultImage from "@/app/assets/falcon.jpeg";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { useMoonshotStore } from "@/zustand/useMoonshotStore";

type Props = {
  setImagesLength: Dispatch<SetStateAction<number>>;
  version: string;
};
export default function ImageSelector({ setImagesLength, version }: Props) {
  const uid = useAuthStore((s) => s.uid);
  const purposeData = usePurposeStore((s) => s.purposeData);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);

  const useData = version === "moonshot" ? moonshotData : purposeData;
  const updateData = version === "moonshot" ? updateMoonshot : updatePurpose;
  const useImage =
    version === "moonshot" ? moonshotData.moonshotImage : purposeData.mtpImage;
  const router = useRouter();
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  console.log("ImageSelector.tsx: useData", useData, version);

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
        <img
          key={index}
          src={url}
          alt={`Cover ${index}`}
          onClick={() => handleImageClick(url)}
          className={`h-32 object-cover rounded-md cursor-pointer ring-4
                          ${
                            url === useImage
                              ? "ring-yellow-500"
                              : "ring-transparent"
                          }`}
        />
      ))}
    </div>
  );
}
