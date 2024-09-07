"use client";

import GenericStatement from "./GenericStatement";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose01Intro({ nextPath }: Props) {
  const items = [
    "It’s related to your MTP",
    "It’s big & bold, both scary & exciting",
    "It’s 10X bigger than your competition",
    "You don’t know how to solve it... yet",
    "It will transform your life or business",
    "It is clearly defined & measurable",
    "Everyone knows when it’s achieved",
    "Assume a 10-year timeframe",
  ];

  const beforeElement = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        {items.map((bullet, index) => (
          <div key={index} className="flex items-center gap-2">
            • {bullet}
          </div>
        ))}
      </div>
      <div>
        Doing anything big and bold in life is hard. Because most Moonshots are
        10+ year endeavors, it’s important that your Moonshot be driven by the
        emotional energy that will keep you going when the odds are against you.
      </div>
    </div>
  );

  return (
    <GenericStatement
      nextPath={nextPath}
      title="Here are the key attributes of a Moonshot:"
      beforeElement={beforeElement}
      buttonText="Continue"
    />
  );
}
