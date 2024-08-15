import { INTRO_SURVEY } from "@/constants/introSurvey";
import GenericMultiselect from "./GenericMultiselect";

type Props = { nextPath: string; prevPath?: string; version?: string };
export default function Intro01Identify({ nextPath }: Props) {
  const beforeElement = (
    <div className="flex flex-col gap-3">
      <div>
        Choose <span className="underline">UP TO THREE</span>
      </div>
    </div>
  );
  return (
    <GenericMultiselect
      questionIndex={0}
      title="What do you most identify with today?"
      beforeElement={beforeElement}
      nextPath={nextPath}
      buttonText="Continue"
      version="intro"
      questions={INTRO_SURVEY}
    />
  );
}
