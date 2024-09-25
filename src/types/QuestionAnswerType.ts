import { Timestamp } from "firebase/firestore";

export type QuestionType = {
  id: string;
  title?: string;
  type:
    | "multiple-choice"
    | "text-area"
    | "textarea-fixed"
    | "statement"
    | "input"
    | "multiselect"
    | "multiselect-wrap"
    | "form"
    | "select-tags"
    | "generate"
    | "tuning"
    | "beautify"
    | "select";

  question: string;
  options?: string[];
  guidance?: string[] | string;
  required?: boolean;
  maxAnswers?: number;
  fields?: Field[];
  button?: string;
  attribute?: string[];
  answer?: string[];
  placeholder?: string
};

export type Field = {
  id: string;
  title?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type:
    | "multiple-choice"
    | "text-area"
    | "textarea-fixed"
    | "statement"
    | "input"
    | "multiselect"
    | "multiselect-wrap"
    | "form"
    | "select-tags"
    | "generate"
    | "tuning"
    | "beautify"
    | "select";

  question?: string;
  options?: options[];
  guidance?: string;
  maxAnswers?: number;
};

type options = {
  value: string;
  label: string;
};

export type AnswerType = {
  id: string;
  type:
    | "multiple-choice"
    | "text-area"
    | "textarea-fixed"
    | "statement"
    | "input"
    | "multiselect"
    | "multiselect-wrap"
    | "form";
  question: string;
  options: string[];
  answer: string[];
};


export type initDataType = {
  id: string;
  answers: QuestionType[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;

  // Purpose-specific properties
  mtpGuidance?: string;
  mtpOptions?: string[];
  mtpSelected?: string;
  mtpPrior?: string;
  mtpFinal?: string;
  visualIdeas?: string;
  visualStyle?: string;
  visualInspiration?: string;
  mtpImage?: string;
  mtpCoverImage?: string;

  // Moonshot-specific properties
  moonshotGuidance?: string;
  moonshotOptions?: string[];
  moonshotSelected?: string;
  moonshotPrior?: string;
  moonshotFinal?: string;
  moonshotImage?: string;
  moonshotCoverImage?: string;
};