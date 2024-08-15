import { MOONSHOT_SURVEY } from "@/constants/moonshotSurvey";
import GenericMultiselect from "./GenericMultiselect";

type Props = { nextPath: string; prevPath?: string };
export default function Moonshot05Measure({ nextPath }: Props) {
  const beforeElement = (
    <div className="flex flex-col gap-3 text-xl">
      <div>
        Moonshots are highly objective and measurable. Which attributes will you
        measure when pursuing your Moonshot?
      </div>
      <div>Choose up to 3 metrics.</div>
    </div>
  );
  return (
    <GenericMultiselect
      questionIndex={2}
      title="Making your Moonshot measurable"
      beforeElement={beforeElement}
      nextPath={nextPath}
      buttonText="Continue"
      version="moonshot"
      questions={MOONSHOT_SURVEY}
    />
  );
}
