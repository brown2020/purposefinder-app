"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Purpose01Intro from "@/components/Purpose01Intro";
import Purpose02Attributes from "@/components/Purpose02Attributes";
import Purpose03Billion from "@/components/Purpose03Billion";
import Purpose04Seminar from "@/components/Purpose04Seminar";
import Purpose05Legacy from "@/components/Purpose05Legacy";
import Purpose06Hero from "@/components/Purpose06Hero";
import Purpose07Verbs from "@/components/Purpose07Verbs";
import Purpose08Generate from "@/components/Purpose08Generate";
import Purpose09Tuning from "@/components/Purpose09Tuning";
import Purpose10Beautify from "@/components/Purpose10Beautify";
import ProgressBar from "@/components/ProgressBar";

const routes = [
  {
    id: "intro",
    Component: Purpose01Intro,
    nextPath: "/purposerouter/attributes",
    prevPath: "/purposerouter/intro",
    showImage: true,
    showProgress: true,
    version: "purpose",
  },
  {
    id: "attributes",
    Component: Purpose02Attributes,
    nextPath: "/purposerouter/billion",
    prevPath: "/purposerouter/intro",
    showImage: true,
    showProgress: true,
    version: "purpose",
  },
  {
    id: "billion",
    Component: Purpose03Billion,
    nextPath: "/purposerouter/seminar",
    prevPath: "/purposerouter/attributes",
    showImage: true,
    showProgress: true,
    version: "purpose",
  },
  {
    id: "seminar",
    Component: Purpose04Seminar,
    nextPath: "/purposerouter/legacy",
    prevPath: "/purposerouter/billion",
    showImage: true,
    showProgress: true,
    version: "purpose",
  },
  {
    id: "legacy",
    Component: Purpose05Legacy,
    nextPath: "/purposerouter/hero",
    prevPath: "/purposerouter/seminar",
    showImage: true,
    showProgress: true,
    version: "purpose",
  },
  {
    id: "hero",
    Component: Purpose06Hero,
    nextPath: "/purposerouter/verbs",
    prevPath: "/purposerouter/legacy",
    showImage: true,
    showProgress: true,
    version: "purpose",
  },
  {
    id: "verbs",
    Component: Purpose07Verbs,
    nextPath: "/purposerouter/generate",
    prevPath: "/purposerouter/hero",
    showImage: true,
    showProgress: true,
    version: "purpose",
  },
  {
    id: "generate",
    Component: Purpose08Generate,
    nextPath: "/purposerouter/tuning",
    prevPath: "/purposerouter/verbs",
    showImage: false,
    showProgress: false,
    version: "purpose",
  },
  {
    id: "tuning",
    Component: Purpose09Tuning,
    nextPath: "/purposerouter/beautify",
    prevPath: "/purposerouter/generate",
    showImage: true,
    showProgress: true,
    version: "purpose",
  },
  {
    id: "beautify",
    Component: Purpose10Beautify,
    nextPath: "/purposerouter/intro",
    prevPath: "/purposerouter/tuning",
    showImage: false,
    showProgress: false,
    version: "purpose",
  },
];

type Props = { params: { id: string } };
export default function PurposeRouter({ params: { id } }: Props) {
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

  if (routes[currentIndex]?.id === "beautify")
    return (
      <CurrentComponent
        nextPath={nextPath}
        prevPath={prevPath}
        version={version}
      />
    );

  if (routes[currentIndex]?.id === "generate")
    return (
      <CurrentComponent
        nextPath={nextPath}
        prevPath={prevPath}
        version={version}
      />
    );

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex flex-col md:h-full min-h-64">
          {CurrentComponent && (
            <CurrentComponent
              nextPath={nextPath}
              prevPath={prevPath}
              version={version}
            />
          )}

          <div className="h-14">
            <ProgressBar
              currentStep={currentIndex}
              totalSteps={routes.length}
              onNext={() => router.push(nextPath)}
              onBack={() => router.push(prevPath)}
            />
          </div>
        </div>
      </div>

      <div
        className="md:flex-1 flex flex-col md:h-full min-h-64"
        style={{
          backgroundImage: "url(/assets/bg_sidebar_purpose.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
