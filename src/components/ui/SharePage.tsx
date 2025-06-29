"use client";

import React, { useEffect, useState } from "react";

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";

import { usePathname, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";

type Props = {
  userId: string;
  version: "moonshot" | "purpose";
};

export default function SharePage({ userId, version = "moonshot" }: Props) {
  const uid = useAuthStore((s) => s.uid);
  const [imageUrl, setImageUrl] = useState("");
  const [sharableUrl, setSharableUrl] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const currentPageUrl = `https://purposefinder.ai${pathname}`;
  console.log("DEBUG currentPageUrl", currentPageUrl);
  const isUser = uid === userId;

  const title =
    version === "moonshot" ? "Check out my Moonshot!" : "Check out my MTP!";
  const versionString = version === "moonshot" ? "Moonshot" : "MTP";

  console.log("DEBUG title", title);

  const documentPaths = {
    moonshot: `users/${userId}/moonshot/main`,
    purpose: `users/${userId}/purpose/main`,
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

  const nextPage = version === "moonshot" ? "/" : isUser ? `/moonshot` : `/`;

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
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchImageUrl();
  }, [docRef, userId, version]);

  console.log("DEBUG sharableUrl", sharableUrl);

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

  if (loading) return null;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto h-full gap-2 pb-12">
      {(sharableUrl || isUser) && imageUrl ? (
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
                <FacebookShareButton url={currentPageUrl} quote={title}>
                  <FacebookIcon size={48} round />
                </FacebookShareButton>

                <TwitterShareButton url={currentPageUrl} title={title}>
                  <TwitterIcon size={48} round />
                </TwitterShareButton>

                <LinkedinShareButton url={currentPageUrl} summary={title}>
                  <LinkedinIcon size={48} round />
                </LinkedinShareButton>

                <EmailShareButton
                  url={currentPageUrl}
                  subject={title}
                  body={bodyText}
                >
                  <EmailIcon size={48} round />
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
      ) : (
        <div className="flex mt-5 mx-5 p-5 bg-green-500 items-center justify-center text-center font-bold text-lg h-32 rounded-md">
          {`The owner has set this ${versionString} to private`}
        </div>
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
