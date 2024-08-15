"use client";

import GenericStatement from "./GenericStatement";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Moonshot01Intro({ nextPath }: Props) {
  const items = [
    "Now that you have your Massive Transformative Purpose (MTP), let’s find a Moonshot that inspires you and lay out a plan for achieving it.",
    "You can think of your MTP as a canvas upon which your Moonshot is painted.",
    "A Moonshot is where you go 10X bigger, while the rest of the world is striving for 10% better.",
    "When you are working on a Moonshot, it distinguishes you from everyone else. When you attack a problem as though it were solvable (even if you don’t know how to solve it) you’ll be amazed at what you come up with.",
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
      title={`Welcome to your Moonshot Planner!`}
      beforeElement={beforeElement}
      buttonText="Get Started"
    />
  );
}
