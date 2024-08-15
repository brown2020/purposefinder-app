"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProgressBar from "@/components/ProgressBar";
import Moonshot01Intro from "@/components/Moonshot01Intro";
import Moonshot02Attributes from "@/components/Moonshot02Attributes";
import Moonshot03Mapping from "@/components/Moonshot03Mapping";
import Moonshot04Form from "@/components/Moonshot04Form";
import Moonshot05Measure from "@/components/Moonshot05Measure";
import Moonshot06Rough from "@/components/Moonshot06Rough";
import Moonshot07Generate from "@/components/Moonshot07Generate";
import Moonshot08Tuning from "@/components/Moonshot08Tuning";
import Moonshot09Beautify from "@/components/Moonshot09Beautify";

const routes = [
  {
    id: "intro",
    Component: Moonshot01Intro,
    nextPath: "/moonshotrouter/attributes",
    prevPath: "/moonshotrouter/intro",
    showImage: true,
    showProgress: true,
    version: "moonshot",
  },
  {
    id: "attributes",
    Component: Moonshot02Attributes,
    nextPath: "/moonshotrouter/mapping",
    prevPath: "/moonshotrouter/intro",
    showImage: true,
    showProgress: true,
    version: "moonshot",
  },
  {
    id: "mapping",
    Component: Moonshot03Mapping,
    nextPath: "/moonshotrouter/form",
    prevPath: "/moonshotrouter/attributes",
    showImage: false,
    showProgress: false,
    version: "moonshot",
  },
  {
    id: "form",
    Component: Moonshot04Form,
    nextPath: "/moonshotrouter/measure",
    prevPath: "/moonshotrouter/mapping",
    showImage: true,
    showProgress: true,
    version: "moonshot",
  },
  {
    id: "measure",
    Component: Moonshot05Measure,
    nextPath: "/moonshotrouter/rough",
    prevPath: "/moonshotrouter/form",
    showImage: true,
    showProgress: true,
    version: "moonshot",
  },
  {
    id: "rough",
    Component: Moonshot06Rough,
    nextPath: "/moonshotrouter/generate",
    prevPath: "/moonshotrouter/measure",
    showImage: true,
    showProgress: true,
    version: "moonshot",
  },

  {
    id: "generate",
    Component: Moonshot07Generate,
    nextPath: "/moonshotrouter/tuning",
    prevPath: "/moonshotrouter/rough",
    showImage: false,
    showProgress: false,
    version: "moonshot",
  },

  {
    id: "tuning",
    Component: Moonshot08Tuning,
    nextPath: "/moonshotrouter/beautify",
    prevPath: "/moonshotrouter/generate",
    showImage: true,
    showProgress: true,
    version: "moonshot",
  },
  {
    id: "beautify",
    Component: Moonshot09Beautify,
    nextPath: "/moonshotrouter/intro",
    prevPath: "/moonshotrouter/tuning",
    showImage: false,
    showProgress: false,
    version: "moonshot",
  },
];

type Props = { params: { id: string } };
export default function MoonshotRouter({ params: { id } }: Props) {
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
            backgroundImage: "url(/assets/bg_sidebar_moonrise.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      )}
    </div>
  );
}
