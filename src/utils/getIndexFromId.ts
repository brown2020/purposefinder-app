import { PURPOSE_SURVEY } from "@/constants/purposeSurvey";

export default function getIndexFromId(str: string) {
  var num = Number(str);
  if (Number.isInteger(num) && num >= 0 && num < PURPOSE_SURVEY.length) {
    return num;
  }
  return 0;
}
