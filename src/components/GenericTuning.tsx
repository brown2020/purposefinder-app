"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import { MoonshotType, useMoonshotStore } from "@/zustand/useMoonshotStore";
import { PurposeType, usePurposeStore } from "@/zustand/usePurposeStore";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

type Props = { nextPath: string; buttonText: string; version?: string };
export default function GenericTuning({
  nextPath,
  buttonText,
  version,
}: Props) {
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);
  const purposeData = usePurposeStore((s) => s.purposeData);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);

  const [answer, setAnswer] = useState<string>(
    version === "moonshot"
      ? moonshotData?.moonshotFinal || ""
      : purposeData?.mtpFinal || ""
  );
  const versionLabel = version === "moonshot" ? "Moonshot" : "MTP";

  async function handleSave(newData: MoonshotType | PurposeType) {
    try {
      if (!uid) throw new Error("Missing user ID");

      const current = Timestamp.now();

      if (version === "moonshot") {
        const updatedData = {
          ...newData,
          updatedAt: current,
          moonshotFinal: answer,
        };
        await updateMoonshot(updatedData);
      } else {
        const updatedData = {
          ...newData,
          updatedAt: current,
          mtpFinal: answer,
        };
        await updatePurpose(updatedData);
      }
      toast.success(`${versionLabel} saved successfully!`);
      setTimeout(() => router.push(nextPath), 100);
    } catch (error: any) {
      console.error("Error in handleSave:", error);
      toast.error(`Error saving ${versionLabel}: ${error?.message}`);
    }
  }

  return (
    <div className="flex flex-col h-full justify-center gap-5 p-4">
      <div className="text-3xl md:text-4xl font-semibold">
        {`This is your opportunity to Edit and Fine-Tune your ${versionLabel}.`}
      </div>

      <div className="text-xl md:text-2xl">
        Keep it short and easy to remember. When it feels authentic and
        something you are proud of, click save.
      </div>

      <TextareaAutosize
        autoFocus
        minRows={2}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border-2 text-xl border-blue-500 bg-blue-100 rounded-md px-3 py-2 w-full flex-shrink-0"
      />

      <button
        autoFocus
        onClick={() =>
          handleSave(version === "moonshot" ? moonshotData : purposeData)
        }
        className="btn btn-blue"
      >
        {buttonText}
      </button>
    </div>
  );
}
