import { QuestionType } from "@/types/QuestionAnswerType";

export const MOONSHOT_SURVEY: QuestionType[] = [
  {
    id: "driver_mtp",
    title: "Introduction",
    type: "textarea-fixed",
    question: "STEP 1: MAPPING YOUR MOONSHOT ONTO YOUR MTP",
    guidance: `Here is your MTP that we created in your Purpose Finder. We’ll now use this as the foundation for your Moonshot.
      
If you want to change your MTP, click on the BACK TO PURPOSE FINDER button.`,
    fields: [],
  },

  {
    id: "driver_form",
    title: "Introduction",
    type: "multiselect",
    question: `STEP 2: THE FORM OF YOUR MOONSHOT`,
    options: [
      "Launch a global competition (XPRIZE)",
      "Start a Company",
      "Create a Breakthrough Product",
      "Launch a Transformative Service",
      "Start a Non-Profit",
      "Launch a Project",
      "Launch a Research Program",
    ],
    guidance: `Moonshots can take many forms: Projects, Competitions, Companies, Products. Which of these inspire you as a way to demonstrate and actualize your MTP?
    
CHOOSE one or more.`,
    maxAnswers: 2,
    fields: [],
  },

  {
    id: "driver_measure",
    title: "Introduction",
    type: "multiselect",
    question: "STEP 3: MAKING YOUR MOONSHOT MEASURABLE",
    options: [
      "Financial Metrics Achieved",
      "Performance Metrics Achieved",
      "Milestone Achieved",
      "Timeframe for Completion",
      "People Impacted",
      "Product Performance Breakthrough",
      "Price Performance",
      "Market Penetration/Speed of Growth",
      "Public/Media Engagement",
      "Regulatory Reform",
    ],
    guidance: `Moonshots are highly objective and measurable. Which attributes will you measure when pursuing your Moonshot?

CHOOSE the type of metrics that are most applicable to yours.`,
    maxAnswers: 3,
    fields: [],
  },

  {
    id: "driver_moonshot",
    title: "Introduction",
    type: "text-area",
    question: "STEP 4: MOONSHOT ROUGH IDEAS",
    guidance: `If you already have any ideas for your Moonshot, you can enter them here. If not, you can leave this blank.`,
    fields: [],
  },
];

export const MOONSHOT_SURVEY_FORM: QuestionType[] = [
  {
    id: "driver_form",
    title: "Introduction",
    type: "multiselect",
    question: `STEP 2: THE FORM OF YOUR MOONSHOT`,
    options: [
      "Launch a global competition (XPRIZE)",
      "Start a Company",
      "Create a Breakthrough Product",
      "Launch a Transformative Service",
      "Start a Non-Profit",
      "Launch a Project",
      "Launch a Research Program",
    ],
    guidance: `Moonshots can take many forms: Projects, Competitions, Companies, Products. Which of these inspire you as a way to demonstrate and actualize your MTP?
    
CHOOSE one or more.`,
    maxAnswers: 3,
    fields: [],
  },
];

export const MOONSHOT_SURVEY_MEASURE: QuestionType[] = [
  {
    id: "driver_measure",
    title: "Introduction",
    type: "multiselect",
    question: "STEP 3: MAKING YOUR MOONSHOT MEASURABLE",
    options: [
      "Financial Metrics Achieved",
      "Performance Metrics Achieved",
      "Milestone Achieved",
      "Timeframe for Completion",
      "People Impacted",
      "Product Performance Breakthrough",
      "Price Performance",
      "Market Penetration/Speed of Growth",
      "Public/Media Engagement",
      "Regulatory Reform",
    ],
    guidance: `Moonshots are highly objective and measurable. Which attributes will you measure when pursuing your Moonshot?

  CHOOSE the type of metrics that are most applicable to yours.`,
    fields: [],
  },
];

export const MOONSHOT_SURVEY_ROUGH: QuestionType[] = [
  {
    id: "driver_moonshot",
    title: "Introduction",
    type: "text-area",
    question: "STEP 4: MOONSHOT ROUGH IDEAS",
    guidance: `If you already have any ideas for your Moonshot, you can enter them here. If not, you can leave this blank.`,
    fields: [],
  },
];
