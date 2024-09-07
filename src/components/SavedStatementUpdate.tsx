/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useAuthStore } from "@/zustand/useAuthStore";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { useMoonshotStore } from "@/zustand/useMoonshotStore";
import TextareaAutosize from "react-textarea-autosize";
import useProfileStore from "@/zustand/useProfileStore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import html2canvas from "html2canvas";
import { storage } from "@/firebase/firebaseConfig";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { FadeLoader, PulseLoader } from "react-spinners";

export default function SavedStatementUpdate() {
  const uid = useAuthStore((s) => s.uid);
  const [savingMtp, setSavingMtp] = useState(false);
  const [savingMoonshot, setSavingMoonshot] = useState(false);
  const mtpFinal = usePurposeStore((s) => s.purposeData.mtpFinal);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);
  const [newMtpFinal, setNewMtpFinal] = useState(mtpFinal);
  const moonshotFinal = useMoonshotStore((s) => s.moonshotData.moonshotFinal);
  const moonshotImage = useMoonshotStore((s) => s.moonshotData.moonshotImage);
  const moonshotUpdated = useMoonshotStore((s) => s.moonshotData.updatedAt);
  const mtpUpdated = usePurposeStore((s) => s.purposeData.updatedAt);
  const purposeImage = usePurposeStore((s) => s.purposeData.mtpImage);
  const profile = useProfileStore((s) => s.profile);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);
  const [newMoonshotFinal, setNewMoonshotFinal] = useState(moonshotFinal);

  const moonshotCoverImage = useMoonshotStore(
    (s) => s.moonshotData.moonshotCoverImage
  );
  const mtpCoverImage = usePurposeStore((s) => s.purposeData.mtpCoverImage);

  const hasChanges =
    newMtpFinal !== mtpFinal || newMoonshotFinal !== moonshotFinal;

  const imageContainerStyle =
    "w-full h-auto aspect-square bg-gray-100 flex justify-center items-center bg-gray-500";

  async function saveMtpToProfile() {
    if (!uid) return;
    setSavingMtp(true);
    const domElement = document.getElementById("mtp_profile");
    if (!domElement) return;

    const canvas = await html2canvas(domElement, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
    });

    canvas.toBlob(async (blob) => {
      if (blob === null) {
        console.error("Canvas is empty or not properly initialized");
        return;
      }

      const fileRef = ref(
        storage,
        `generated/${uid}/${new Date().toISOString()}.png`
      );
      await uploadBytes(fileRef, blob);

      const downloadUrl = await getDownloadURL(fileRef);

      await updatePurpose({ mtpCoverImage: downloadUrl });
      setSavingMtp(false);
    });
  }

  async function saveMoonshotToProfile() {
    if (!uid) return;
    setSavingMoonshot(true);
    const domElement = document.getElementById("moonshot_profile");
    if (!domElement) return;

    const canvas = await html2canvas(domElement, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null,
    });

    canvas.toBlob(async (blob) => {
      if (blob === null) {
        console.error("Canvas is empty or not properly initialized");
        return;
      }

      const fileRef = ref(
        storage,
        `generated/${uid}/${new Date().toISOString()}.png`
      );
      await uploadBytes(fileRef, blob);

      const downloadUrl = await getDownloadURL(fileRef);

      await updateMoonshot({ moonshotCoverImage: downloadUrl });
      setSavingMoonshot(false);
    });
  }

  const handleSubmit = async () => {
    if (newMtpFinal !== mtpFinal) {
      updatePurpose({ mtpFinal: newMtpFinal });
      await saveMtpToProfile();
    }
    if (newMoonshotFinal !== moonshotFinal) {
      updateMoonshot({ moonshotFinal: newMoonshotFinal });
      await saveMoonshotToProfile();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col h-full justify-center items-center gap-4">
        <Link
          href={mtpCoverImage ? `/purposepage/${uid}` : "/purpose/intro"}
          className={imageContainerStyle}
        >
          <div className="relative w-full aspect-square">
            {mtpCoverImage ? (
              <img
                src={mtpCoverImage}
                alt="MTP"
                className="w-full h-auto aspect-square"
              />
            ) : (
              <ImageIcon size={64} />
            )}
            {savingMtp && (
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <FadeLoader color="#FFFFFF" />
              </div>
            )}

            <div className="absolute top-0 -z-10 flex flex-col items-center justify-center w-full h-full">
              <div className="relative w-full aspect-square" id="mtp_profile">
                <img
                  className="object-cover w-full h-full"
                  src={purposeImage}
                  alt="mtp visualization"
                />

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
                            {mtpUpdated
                              ? mtpUpdated
                                  .toDate()
                                  .toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                  })
                              : "No date"}
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
            onChange={(e) => setNewMtpFinal(e.target.value)}
          />
        </div>

        <Link
          href={moonshotCoverImage ? `/moonshotpage/${uid}` : "/moonshot/intro"}
          className={imageContainerStyle}
        >
          <div className="relative w-full aspect-square">
            {moonshotCoverImage ? (
              <img
                src={moonshotCoverImage}
                alt="Moonshot"
                className="w-full h-auto aspect-square"
              />
            ) : (
              <ImageIcon size={64} />
            )}
            {savingMoonshot && (
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <FadeLoader color="#FFFFFF" />
              </div>
            )}

            <div className="absolute top-0 -z-10 flex flex-col items-center justify-center w-full h-full">
              <div
                className="relative w-full aspect-square"
                id="moonshot_profile"
              >
                <img
                  className="object-cover w-full h-full"
                  src={moonshotImage}
                  alt="moonshot visualization"
                />

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
                            {moonshotUpdated
                              ? moonshotUpdated
                                  .toDate()
                                  .toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                  })
                              : "No date"}
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
            onChange={(e) => setNewMoonshotFinal(e.target.value)}
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
}
