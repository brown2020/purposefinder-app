"use client";

import React, { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
  EmailShareButton,
} from "react-share";

import { usePathname, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuthStore } from "@/zustand/useAuthStore";
import Image from "next/image";

type Props = {
  userId: string;
  version: "moonshot" | "purpose";
  itemId?: string;
};

export default function SharePage({
  userId,
  version = "moonshot",
  itemId,
}: Props) {
  const uid = useAuthStore((s) => s.uid);
  const [imageUrl, setImageUrl] = useState("");
  const [sharableUrl, setSharableUrl] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const currentPageUrl = `https://purposefinder.ai/${pathname}`;
  const isUser = uid === userId;

  const title =
    version === "moonshot" ? "Check out my Moonshot!" : "Check out my MTP!";

  const documentPaths = {
    moonshot: `users/${userId}/moonshot/main`,
    purpose: itemId
      ? `users/${userId}/purposes/${itemId}`
      : `users/${userId}/purpose/main`,
  };

  const docRef = doc(db, documentPaths[version]);

  const fileIntro =
    version === "moonshot" ? "MoonshotPlanner" : "PurposeFinder";

  const nextButtonText =
    version === "moonshot"
      ? "Create Your MTP & Moonshot"
      : isUser
      ? "Next: Create Your Moonshot"
      : "Create Your MTP & Moonshot";

  const nextPage =
    version === "moonshot" ? "/" : isUser ? `/moonshot` : `/`;

  const bodyText = `I wanted to share my ${
    version === "moonshot" ? "Moonshot" : "MTP"
  } with you. Check it out here:`;

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          console.log("No such document!");
          setImageUrl("");
          setSharableUrl(false);
          return;
        }

        const data = docSnap.data();
        setImageUrl(
          version === "moonshot" ? data.moonshotCoverImage : data.mtpCoverImage
        );
        setSharableUrl(
          version === "moonshot"
            ? data.moonshotSharableUrl
            : data.mtpSharableUrl
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error getting document:", error.message);
        } else {
          console.log("An unknown error occurred while getting the document.");
        }
        setImageUrl("");
        setSharableUrl(false);
      }
    };
    if (userId) fetchImageUrl();
  }, [docRef, userId, version]);

  const toggleSharableStatus = async () => {
    const makeSharable = !sharableUrl;
    const fieldName =
      version === "moonshot" ? "moonshotSharableUrl" : "mtpSharableUrl";
    await updateDoc(docRef, { [fieldName]: makeSharable });
    setSharableUrl(makeSharable);
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const imageBlob = await response.blob();
      const timestamp = new Date().toISOString().replace(/[\W_]+/g, "");
      const filename = `${fileIntro}_${timestamp}.png`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(imageBlob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error downloading the image:", error.message);
      } else {
        console.error("An unknown error occurred while downloading the image.");
      }
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto h-full gap-2 pb-12">
      {(sharableUrl || isUser) && imageUrl && (
        <>
          <Image
            className="h-full w-full object-cover"
            src={imageUrl}
            alt="Visual Result"
            height={512}
            width={512}
            priority
          />

          <div className="flex items-center w-full gap-1">
            {sharableUrl && (
              <div className="flex gap-3 mx-auto h-12">
                <FacebookShareButton url={currentPageUrl} title={title}>
                  <FacebookIcon size={48} />
                </FacebookShareButton>

                <TwitterShareButton url={currentPageUrl} title={title}>
                  <TwitterIcon size={48} />
                </TwitterShareButton>

                <LinkedinShareButton url={currentPageUrl}>
                  <LinkedinIcon size={48} />
                </LinkedinShareButton>

                <EmailShareButton
                  url={currentPageUrl}
                  subject={title}
                  body={bodyText}
                >
                  <EmailIcon size={48} />
                </EmailShareButton>
              </div>
            )}
          </div>
          {isUser && (
            <button
              className="btn-primary2 h-12 flex items-center justify-center mx-4"
              onClick={toggleSharableStatus}
            >
              {sharableUrl ? "Make Private" : "Make Sharable"}
            </button>
          )}

          {uid === userId && !window.ReactNativeWebView && imageUrl && (
            <button
              className="btn-primary2 h-12 flex items-center justify-center mx-3"
              onClick={downloadImage}
            >
              Download
            </button>
          )}
        </>
      )}

      <button
        className="btn-primary2 h-12 flex items-center justify-center mx-4 mb-20"
        onClick={() => {
          setTimeout(() => router.push(nextPage), 100);
        }}
      >
        {nextButtonText}
      </button>
    </div>
  );
}
