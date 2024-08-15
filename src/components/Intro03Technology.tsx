import { INTRO_SURVEY } from "@/constants/introSurvey";
import GenericMultiselect from "./GenericMultiselect";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Intro03Technology({ nextPath }: Props) {
  const beforeElement = (
    <div className="flex flex-col gap-3">
      <div>
        Choose <span className="underline">UP TO THREE</span>
      </div>
    </div>
  );
  return (
    <GenericMultiselect
      questionIndex={2}
      title="Which Exponential Technologies are of most interest to you in pursuing your purpose?"
      beforeElement={beforeElement}
      nextPath={nextPath}
      buttonText="Continue"
      version="intro"
      questions={INTRO_SURVEY}
    />
  );
}
