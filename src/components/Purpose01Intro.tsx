"use client";

import GenericStatement from "./GenericStatement";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose01Intro({ nextPath }: Props) {
  const items = [
    "The pace of exponential tech is accelerating. The number of opportunities is exploding. How do you choose what to focus on and what to ignore?",
    "The answer is clarity on your Massive Transformative Purpose (MTP).",
  ];

  const beforeElement = (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );

  return (
    <GenericStatement
      nextPath={nextPath}
      title={`Let's find your purpose`}
      beforeElement={beforeElement}
      buttonText="Get Started"
    />
  );
}
