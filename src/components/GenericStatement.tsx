"use client";

import { useRouter } from "next/navigation";

type Props = {
  nextPath: string;
  title: string;
  beforeElement?: JSX.Element;
  buttonText: string;
};
export default function GenericStatement({
  nextPath,
  title,
  beforeElement,
  buttonText,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full justify-center gap-5 p-4">
      <div className="text-3xl md:text-4xl font-semibold">{title}</div>
      {beforeElement && (
        <div className="text-xl md:text-2xl">{beforeElement}</div>
      )}

      <button
        autoFocus
        onClick={() => setTimeout(() => router.push(nextPath), 100)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setTimeout(() => router.push(nextPath), 100);
        }}
        className="btn btn-blue mr-auto"
      >
        {buttonText}
      </button>
    </div>
  );
}
