import GenericMultiselect from "./GenericMultiselect";

import { MOONSHOT_SURVEY } from "@/constants/moonshotSurvey";

type Props = { nextPath: string; prevPath?: string };
export default function Moonshot04Form({ nextPath }: Props) {
  const beforeElement = (
    <div className="flex flex-col gap-3 text-xl">
      <div>
        Moonshots can take many forms: Projects, Competitions, Companies,
        Products. Which of these inspire you as a way to demonstrate and
        actualize your MTP?
      </div>
      <div className="flex flex-col gap-3">
        <div>
          Choose <span className="underline">ONE OR TWO</span>
        </div>
      </div>
    </div>
  );
  return (
    <GenericMultiselect
      questionIndex={1}
      title="The Form of your Moonshot"
      beforeElement={beforeElement}
      nextPath={nextPath}
      buttonText="Continue"
      version="moonshot"
      questions={MOONSHOT_SURVEY}
    />
  );
}
