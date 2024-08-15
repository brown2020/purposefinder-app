/* eslint-disable @next/next/no-img-element */
"use client";

import useProfileStore from "@/zustand/useProfileStore";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import defaultImage from "@/app/assets/falcon.jpeg";
import { useAuthStore } from "@/zustand/useAuthStore";
import { usePurposeStore } from "@/zustand/usePurposeStore";
import { useMoonshotStore } from "@/zustand/useMoonshotStore";

type Props = {
  nextPath: string;
  prevPath?: string;
};
export default function GenericBeautify({ nextPath }: Props) {
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  const purposeData = usePurposeStore((s) => s.purposeData);
  const moonshotData = useMoonshotStore((s) => s.moonshotData);
  const updatePurpose = usePurposeStore((s) => s.updatePurpose);
  const updateMoonshot = useMoonshotStore((s) => s.updateMoonshot);

  const title = "Mapping your Moonshot onto your MTP.";
  const description =
    "Here is your MTP that you recently created using Purpose Finder. Our AI model will now use this as the foundation for your Moonshot. If you want to change your MTP, click on the “Back to Purpose Finder” button.";

  const imageToShow = purposeData?.mtpCoverImage || defaultImage.src;

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="flex flex-col flex-1 h-full">
        <div className="flex flex-col h-full justify-center gap-5 flex-1 p-4">
          <div className="text-4xl md:text-4xl font-semibold">{title}</div>
          <div className="flex flex-col gap-3 text-lg">{description}</div>

          <div className="flex flex-col space-y-3">
            <button
              className="btn bg-[#F1F5F9] h-10 flex flex-1 items-center justify-center disabled:opacity-50"
              onClick={(e) => {
                router.push("/purposerouter/intro");
              }}
            >
              Back to Purpose Finder
            </button>
            <button
              className="btn btn-blue h-10 flex flex-1 items-center justify-center disabled:opacity-50"
              onClick={(e) => {
                router.push(nextPath);
              }}
            >
              Create Moonshot
            </button>
          </div>
        </div>
        <ProgressBar
          currentStep={2}
          totalSteps={9}
          onNext={() => router.push(nextPath)}
          onBack={() => router.push("/moonshotrouter/attributes")}
        />
      </div>
      <div className="bg-white flex flex-col h-full items-center justify-center flex-1 ">
        <img src={imageToShow} alt="MTP" className="h-auto aspect-square" />
      </div>
    </div>
  );
}
