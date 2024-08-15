import { QuestionType } from "@/types/QuestionAnswerType";

export const PURPOSE_SURVEY: QuestionType[] = [
  {
    id: "driver_statement",
    title: "Introduction",
    type: "statement",
    question:
      "The next 5 pages will ask you a sequence of questions to understand what drives you.",
    guidance: " ",
  },

  {
    id: "driver_billion",
    title: "Introduction",
    type: "text-area",
    question:
      "If you were granted $1 billion to make a positive impact on the world, what would you do?",
    guidance:
      "Please describe in brief your idea. What wrong would you right? What opportunity would you pursue?",
  },

  {
    id: "driver_passion",
    title: "Introduction",
    type: "text-area",
    question:
      "Imagine a seminar so intriguing you'd clear your day for it. What is the theme?",
    guidance: " ",
  },

  // {
  //   id: "driver_impact",
  //   type: "text-area",
  //   question:
  //     "What hardship or grand challenge do you feel driven to help address?",
  // },

  // {
  //   id: "driver_admire",
  //   type: "text-area",
  //   question:
  //     "Who do you admire most and what actions did they take to earn your respect?",
  // },

  // {
  //   id: "driver_admire",
  //   type: "input",
  //   question: "Who do you admire most for their Purpose-Driven impact?",
  // },

  // {
  //   id: "driver_admirereason",
  //   type: "text-area",
  //   question: "What action did they take that earned your respect?",
  // },

  {
    id: "driver_legacy",
    title: "Introduction",
    type: "text-area",
    question: "How do you want to be remembered in decades to come?",
    guidance: " ",
  },

  {
    id: "beneficiary_groups",
    title: "Introduction",
    type: "text-area",
    question:
      "Think about the individuals or communities whose lives you wish to transform through your efforts.",
    guidance: `Be as specific as possible to illustrate the direct impact of your actions. Here are some examples:
• Renewable energy pioneers
• Trailblazing female entrepreneurs
• Underserved youth innovators
• Small-scale farmers
• Longevity researchers`,
  },

  {
    id: "verb_select",
    title: "Introduction",
    type: "multiselect-wrap",
    question: "Your Action Verbs",
    guidance:
      "Your MTP is about action. CHOOSE UP TO THREE high-impact verbs to propel the change you wish to create in the world.",
    options: [
      "Solve",
      "Engineer",
      "Create",
      "Empower",
      "Invent",
      "Enable",
      "Inspire",
      "Innovate",
      "Guide",
      "Educate",
      "Finance",
      "Advocate",
      "Teach",
      "Disrupt",
      "Reinvent",
      "Transform",
      "Mentor",
      "Build",
      "Collaborate",
      "Facilitate",
      "Heal",
      "Organize",
      "Develop",
      "Motivate",
      "Enhance",
      "Lead",
      "Design",
      "Pioneer",
      "Champion",
      "Cultivate",
      "Illuminate",
      "Revolutionize",
      "Advise",
      "Connect",
      "Elevate",
      "Explore",
      "Harmonize",
      "Ignite",
      "Nurture",
      "Optimize",
      "Revitalize",
    ],
    maxAnswers: 3,
  },
];
