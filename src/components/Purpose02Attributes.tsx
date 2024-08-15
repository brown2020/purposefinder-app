"use client";

import { useRouter } from "next/navigation";
import GenericStatement from "./GenericStatement";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Purpose02Attributes({ nextPath }: Props) {
  const router = useRouter();
  const items: string[] = [
    `It's "Massive" - inspires you.`,
    `It's driven by emotional energy.`,
    `You would commit 10 years to it.`,
    `It gives you a mission, a focus.`,
    `It feels "true & authentic" for you.`,
    `It is brief; easy to remember and say.`,
  ];

  const beforeElement = (
    <div className="flex flex-col">
      {items.map((bullet, index) => (
        <div key={index} className="flex items-center gap-2">
          • {bullet}
        </div>
      ))}
    </div>
  );

  return (
    <GenericStatement
      nextPath={nextPath}
      title={`Here are the key attributes of an MTP:`}
      beforeElement={beforeElement}
      buttonText="Continue"
    />
  );
}
