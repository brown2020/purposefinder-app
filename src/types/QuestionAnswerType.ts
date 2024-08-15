export type QuestionType = {
  id: string;
  title: string;
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
  options?: string[];
  guidance?: string;
  required?: boolean;
  maxAnswers?: number;
  fields?: Field[];
};

export type Field = {
  id: string;
  title: string;
  type:
    | "multiple-choice"
    | "text-area"
    | "textarea-fixed"
    | "statement"
    | "input"
    | "multiselect"
    | "multiselect-wrap"
    | "password"
    | "checkbox"
    | "button";

  question: string;
  options?: string[];
  guidance?: string;
  required?: boolean;
  maxAnswers?: number;
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
