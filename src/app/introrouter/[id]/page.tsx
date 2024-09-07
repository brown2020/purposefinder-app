"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProgressBar from "@/components/ProgressBar";
import Intro01Identify from "@/components/Intro01Identify";
import Intro02Challenge from "@/components/Intro02Challenge";
import Intro03Technology from "@/components/Intro03Technology";

const routes = [
  {
    id: "identify",
    Component: Intro01Identify,
    nextPath: "/introrouter/challenge",
    prevPath: "/introrouter/identify",
    showImage: true,
    showProgress: true,
    version: "intro",
  },
  {
    id: "challenge",
    Component: Intro02Challenge,
    nextPath: "/introrouter/technology",
    prevPath: "/introrouter/identify",
    showImage: true,
    showProgress: true,
    version: "intro",
  },
  {
    id: "technology",
    Component: Intro03Technology,
    nextPath: "/purposerouter/intro",
    prevPath: "/introrouter/challenge",
    showImage: true,
    showProgress: true,
    version: "intro",
  },
];

type Props = { params: { id: string } };
export default function IntroRouter({ params: { id } }: Props) {
  const router = useRouter();
  // Initialize currentIndex based on the initial route id
  const initialIndex = routes.findIndex((route) => route.id === id);
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  useEffect(() => {
    // When id changes, update currentIndex accordingly
    const newIndex = routes.findIndex((route) => route.id === id);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }
  }, [id]);

  const CurrentComponent = routes[currentIndex]?.Component;
  const nextPath = routes[currentIndex]?.nextPath;
  const prevPath = routes[currentIndex]?.prevPath;
  const version = routes[currentIndex]?.version;
  const showImage = routes[currentIndex]?.showImage;
  const showProgress = routes[currentIndex]?.showProgress;

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="md:flex-1 flex flex-col md:h-full min-h-64">
        <div className="flex-1 ">
          {CurrentComponent && (
            <CurrentComponent
              nextPath={nextPath}
              prevPath={prevPath}
              version={version}
            />
          )}
        </div>
        {showProgress && (
          <div className="h-14">
            <ProgressBar
              currentStep={currentIndex}
              totalSteps={routes.length}
              onNext={() => router.push(nextPath)}
              onBack={() => router.push(prevPath)}
            />
          </div>
        )}
      </div>
      {showImage && (
        <div
          className="flex-1 flex flex-col md:h-full  min-h-64"
          style={{
            backgroundImage: "url(/assets/bg_sidebar_intro.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      )}
    </div>
  );
}
