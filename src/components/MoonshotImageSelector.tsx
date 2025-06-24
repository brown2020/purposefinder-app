/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useAuthStore, useMoonshot } from "@/stores";

import defaultImage from "@/app/assets/falcon.jpeg";

type Props = {
  setImagesLength: (imagesLength: number) => void;
};
export default function MoonshotImageSelector({ setImagesLength }: Props) {
  const uid = useAuthStore((s) => s.uid);
  const { moonshotData, updateMoonshot } = useMoonshot();
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
