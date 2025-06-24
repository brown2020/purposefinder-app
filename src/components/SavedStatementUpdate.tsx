/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useMemo, memo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase/firebaseConfig";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { FadeLoader, PulseLoader } from "react-spinners";
import { safeHtml2Canvas } from "@/lib/utils/canvasUtils";
import {
  useAuthStore,
  useProfile,
  usePurpose,
  useMoonshot,
} from "@/stores";

const SavedStatementUpdate = memo(function SavedStatementUpdate() {
  const uid = useAuthStore((s) => s.uid);
  const [savingMtp, setSavingMtp] = useState(false);
  const [savingMoonshot, setSavingMoonshot] = useState(false);

  const { purposeData, updatePurpose } = usePurpose();
  const { moonshotData, updateMoonshot } = useMoonshot();
  const { profile } = useProfile();

  const [newMtpFinal, setNewMtpFinal] = useState(purposeData.mtpFinal);
  const [newMoonshotFinal, setNewMoonshotFinal] = useState(moonshotData.moonshotFinal);

  const hasChanges = useMemo(() =>
    newMtpFinal !== purposeData.mtpFinal || newMoonshotFinal !== moonshotData.moonshotFinal,
    [newMtpFinal, purposeData.mtpFinal, newMoonshotFinal, moonshotData.moonshotFinal]
  );

  const imageContainerStyle = useMemo(() =>
    "w-full h-auto aspect-square bg-gray-100 flex justify-center items-center bg-gray-500",
    []
  );

  const saveMtpToProfile = useCallback(async () => {
    if (!uid) return;
    setSavingMtp(true);
    const domElement = document.getElementById("mtp_profile");
    if (!domElement) return;

    try {
      const canvas = await safeHtml2Canvas(domElement, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob(async (blob) => {
        if (blob === null) {
          console.error("Canvas is empty or not properly initialized");
          setSavingMtp(false);
          return;
        }

        try {
          const fileRef = ref(
            storage,
            `generated/${uid}/${new Date().toISOString()}.png`
          );
          await uploadBytes(fileRef, blob);

          const downloadUrl = await getDownloadURL(fileRef);

          await updatePurpose({ mtpCoverImage: downloadUrl });
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setSavingMtp(false);
        }
      });
    } catch (error) {
      console.error("Error capturing image:", error);
      setSavingMtp(false);
    }
  }, [uid, updatePurpose]);

  const saveMoonshotToProfile = useCallback(async () => {
    if (!uid) return;
    setSavingMoonshot(true);
    const domElement = document.getElementById("moonshot_profile");
    if (!domElement) return;

    try {
      const canvas = await safeHtml2Canvas(domElement, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob(async (blob) => {
        if (blob === null) {
          console.error("Canvas is empty or not properly initialized");
          setSavingMoonshot(false);
          return;
        }

        try {
          const fileRef = ref(
            storage,
            `generated/${uid}/${new Date().toISOString()}.png`
          );
          await uploadBytes(fileRef, blob);

          const downloadUrl = await getDownloadURL(fileRef);

          await updateMoonshot({ moonshotCoverImage: downloadUrl });
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setSavingMoonshot(false);
        }
      });
    } catch (error) {
      console.error("Error capturing image:", error);
      setSavingMoonshot(false);
    }
  }, [uid, updateMoonshot]);

  const handleSubmit = useCallback(async () => {
    if (newMtpFinal !== purposeData.mtpFinal) {
      updatePurpose({ mtpFinal: newMtpFinal });
      await saveMtpToProfile();
    }
    if (newMoonshotFinal !== moonshotData.moonshotFinal) {
      updateMoonshot({ moonshotFinal: newMoonshotFinal });
      await saveMoonshotToProfile();
    }
  }, [newMtpFinal, purposeData.mtpFinal, newMoonshotFinal, moonshotData.moonshotFinal, updatePurpose, updateMoonshot, saveMtpToProfile, saveMoonshotToProfile]);

  // Memoized input change handlers
  const handleMtpChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMtpFinal(e.target.value);
  }, []);

  const handleMoonshotChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMoonshotFinal(e.target.value);
  }, []);

  // Memoized formatted date
  const formattedMtpDate = useMemo(() => 
    purposeData.updatedAt
      ? purposeData.updatedAt.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })
      : "No date",
    [purposeData.updatedAt]
  );

  const formattedMoonshotDate = useMemo(() => 
    moonshotData.updatedAt
      ? moonshotData.updatedAt.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })
      : "No date",
    [moonshotData.updatedAt]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col h-full justify-center items-center gap-4">
        <Link
          href={purposeData.mtpCoverImage ? `/purposepage/${uid}` : "/purpose/"}
          className={imageContainerStyle}
        >
          <div className="relative w-full aspect-square">
            {purposeData.mtpCoverImage ? (
              <img
                src={purposeData.mtpCoverImage}
                alt="MTP"
                className="w-full h-auto aspect-square"
              />
            ) : (
              <ImageIcon size={64} />
            )}
            {savingMtp && (
              <div className="absolute inset-0 flex justify-center items-center bg-black/50">
                <FadeLoader color="#FFFFFF" />
              </div>
            )}

            <div className="absolute top-0 -z-10 flex flex-col items-center justify-center w-full h-full">
              <div className="relative w-full aspect-square" id="mtp_profile">
                {purposeData.mtpImage && (
                  <img
                    className="object-cover w-full h-full"
                    src={purposeData.mtpImage}
                    alt="mtp visualization"
                  />
                )}
                <div className="absolute top-0 z-40 flex flex-col items-center justify-center w-full h-full text-white">
                  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <foreignObject x="0" y="0" width="100%" height="100%">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            width: "75%",
                            justifyContent: "start",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            padding: "12px 14px",
                            borderRadius: "6px",
                          }}
                        >
                          <div
                            style={{
                              alignSelf: "flex-start",
                              fontSize: "18px",
                            }}
                          >
                            {profile.firstName}&apos;s MTP:
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              height: "100%",
                              width: "100%",
                              fontSize: "24px",
                              lineHeight: "28px",
                              fontWeight: "600",
                            }}
                          >
                            {newMtpFinal}
                          </div>
                          <div
                            style={{
                              alignSelf: "flex-end",
                              fontSize: "12px",
                            }}
                          >
                            {formattedMtpDate}
                          </div>
                        </div>
                      </div>
                    </foreignObject>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex flex-col w-full">
          <div className="text-sm">{"Edit Your MTP"}</div>
          <TextareaAutosize
            className="px-3 py-2 text-black border border-gray-700 rounded-md"
            value={newMtpFinal}
            onChange={handleMtpChange}
          />
        </div>

        <Link
          href={moonshotData.moonshotCoverImage ? `/moonshotpage/${uid}` : "/moonshot"}
          className={imageContainerStyle}
        >
          <div className="relative w-full aspect-square">
            {moonshotData.moonshotCoverImage ? (
              <img
                src={moonshotData.moonshotCoverImage}
                alt="Moonshot"
                className="w-full h-auto aspect-square"
              />
            ) : (
              <ImageIcon size={64} />
            )}
            {savingMoonshot && (
              <div className="absolute inset-0 flex justify-center items-center bg-black/50">
                <FadeLoader color="#FFFFFF" />
              </div>
            )}

            <div className="absolute top-0 -z-10 flex flex-col items-center justify-center w-full h-full">
              <div
                className="relative w-full aspect-square"
                id="moonshot_profile"
              >
                {moonshotData.moonshotImage && (
                  <img
                    className="object-cover w-full h-full"
                    src={moonshotData.moonshotImage}
                    alt="moonshot visualization"
                  />
                )}
                <div className="absolute top-0 z-40 flex flex-col items-center justify-center w-full h-full text-white">
                  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <foreignObject x="0" y="0" width="100%" height="100%">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            width: "75%",
                            justifyContent: "start",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            padding: "12px 14px",
                            borderRadius: "6px",
                          }}
                        >
                          <div
                            style={{
                              alignSelf: "flex-start",
                              fontSize: "18px",
                            }}
                          >
                            {profile.firstName}&apos;s MOONSHOT:
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              height: "100%",
                              width: "100%",
                              fontSize: "24px",
                              lineHeight: "28px",
                              fontWeight: "600",
                            }}
                          >
                            {newMoonshotFinal}
                          </div>
                          <div
                            style={{
                              alignSelf: "flex-end",
                              fontSize: "12px",
                            }}
                          >
                            {formattedMoonshotDate}
                          </div>
                        </div>
                      </div>
                    </foreignObject>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
        <div className="flex flex-col w-full">
          <div className="text-sm">{"Edit Your Moonshot"}</div>
          <TextareaAutosize
            className="px-3 py-2 text-black border border-gray-700 rounded-md"
            value={newMoonshotFinal}
            onChange={handleMoonshotChange}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-blue flex-1"
          type="button"
          disabled={!hasChanges}
          onClick={handleSubmit}
        >
          {savingMoonshot || savingMtp ? (
            <PulseLoader color="#ffffff" />
          ) : (
            "Save & Regenerate Images"
          )}
        </button>
      </div>
    </div>
  );
});

export default SavedStatementUpdate;
