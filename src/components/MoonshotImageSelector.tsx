/* eslint-disable @next/next/no-img-element */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { useMoonshotStore } from "@/zustand/useMoonshotStore";

type Props = {
  setImagesLength: Dispatch<SetStateAction<number>>;
};
export default function MoonshotImageSelector({ setImagesLength }: Props) {
  const uid = useAuthStore((s) => s.uid);
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);
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
    updateMoonshot({ ...moonshotData, moonshotImage: url });
  };

  return (
    <div className="flex overflow-x-scroll p-2 space-x-4">
      {fileUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Cover ${index}`}
          onClick={() => handleImageClick(url)}
          className={`w-32 h-32 object-cover rounded-md cursor-pointer
                        ${
                          url === moonshotData.moonshotImage
                            ? "ring-4 ring-yellow-500"
                            : "ring-4 ring-transparent"
                        }`}
        />
      ))}
    </div>
  );
}
