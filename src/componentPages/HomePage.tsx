"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import AuthComponent from "@/components/AuthComponent";

export default function HomePage() {
  const uid = useAuthStore((s) => s.uid);
  const [nextPath, setNextPath] = useState<string>("");
  const profile = useProfileStore((s) => s.profile);
  const router = useRouter();

  useEffect(() => {
    if (uid) {
      if (profile.firstName) {
        setNextPath("/introrouter/identify");
      }
    } else {
      setNextPath("/introrouter/identify");
    }
  }, [profile, uid]);

  return (
    <div className="flex flex-col h-full w-full justify-center items-center text-white">
      <div
        style={{
          backgroundImage: `url("/assets/bg_sidebar_intro.jpg")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
        }}
      />

      <div className="flex flex-col z-10 gap-5 px-4 py-4 md:px-9 md:py-9 text-center max-w-4xl bg-black/60 rounded-lg">
        <h2 className="text-3xl md:text-5xl font-semibold">
          The most successful people are driven by a Massive Transformative
          Purpose (MTP)
        </h2>

        <h2 className="text-xl md:text-2xl md:px-9">
          Welcome to Purpose Finder, where together, we’ll craft your MTP and
          put you on a path to your Moonshot.
        </h2>

        {uid ? (
          <button
            autoFocus
            onClick={() => setTimeout(() => router.push(nextPath), 100)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setTimeout(() => router.push(nextPath), 100);
            }}
            className="btn-white mx-auto"
          >
            Get Started
          </button>
        ) : (
          <AuthComponent />
        )}
      </div>
    </div>
  );
}
