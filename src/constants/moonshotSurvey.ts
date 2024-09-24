import { QuestionType } from "@/types/QuestionAnswerType";


export const MOONSHOT_JSON: QuestionType[] = [
  {
    id: "intro",
    title: "Welcome to your Moonshot Planner!",
    question: "Welcome to your Moonshot Planner!",
    type: "statement",
    guidance: [
      "Now that you have your Massive Transformative Purpose (MTP), let’s find a Moonshot that inspires you and lay out a plan for achieving it.",
      "You can think of your MTP as a canvas upon which your Moonshot is painted.",
      "A Moonshot is where you go 10X bigger, while the rest of the world is striving for 10% better.",
      "When you are working on a Moonshot, it distinguishes you from everyone else. When you attack a problem as though it were solvable (even if you don’t know how to solve it) you’ll be amazed at what you come up with.",
    ],
    button: "Get Started",
  },
  {
    id: "attributes",
    title: "Here are the key attributes of a Moonshot:",
    question: "Here are the key attributes of a Moonshot:",
    type: "statement",
    guidance: [
      "Doing anything big and bold in life is hard. Because most Moonshots are 10+ year endeavors, it’s important that your Moonshot be driven by the emotional energy that will keep you going when the odds are against you.",
    ],
    attribute: [
      "It’s related to your MTP",
      "It’s big & bold, both scary & exciting",
      "It’s 10X bigger than your competition",
      "You don’t know how to solve it... yet",
      "It will transform your life or business",
      "It is clearly defined & measurable",
      "Everyone knows when it’s achieved",
      "Assume a 10-year timeframe",
    ],
  },
  {
    id: "driver_mtp",
    title: "Mapping your Moonshot onto your MTP.",
    question: "Mapping your Moonshot onto your MTP.",
    guidance: [
      "Here is your MTP that you recently created using Purpose Finder. Our AI model will now use this as the foundation for your Moonshot. If you want to change your MTP, click on the “Back to Purpose Finder” button.",
    ],
    type: "statement",
    button: "Create Moonshot",
  },

  {
    id: "driver_form1",
    title: "The Form of your Moonshot",
    question: "The Form of your Moonshot",
    type: "multiselect",
    options: [
      "Launch a global competition (XPRIZE)",
      "Start a Company",
      "Create a Breakthrough Product",
      "Launch a Transformative Service",
      "Start a Non-Profit",
      "Launch a Project",
      "Launch a Research Program",
    ],
    guidance: [
      "Moonshots can take many forms: Projects, Competitions, Companies, Products. Which of these inspire you as a way to demonstrate and actualize your MTP?",
      "Choose ONE OR TWO",
    ],
    maxAnswers: 2,
  },

  {
    id: "driver_measure1",
    title: "Making your Moonshot measurable",
    question: "Making your Moonshot measurable",
    type: "multiselect",
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
    guidance: [
      "Moonshots are highly objective and measurable. Which attributes will you measure when pursuing your Moonshot?",
      "Choose up to 3 metrics.",
    ],
    maxAnswers: 3,
  },

  {
    id: "driver_moonshot1",
    title: "Your rough ideas for a Moonshot",
    question: "Your rough ideas for a Moonshot",
    type: "text-area",
    guidance: [
      "If you already have any ideas for your Moonshot, you can enter them here. If not, you can leave this blank.",
    ],
  },

  {
    id: "moonshot_generate",
    title: "Let's generate some Moonshot ideas",
    question: "Let's generate some Moonshot ideas",
    type: "generate",
    guidance: [
      'Click "Generate Ideas" to see suggestions from our Al model. To add more options, click again',
      "When you find one you like, click on it to select it as your draft Moonshot. During the next step you can edit and fine tune your Moonshot further.",
      "If the AI-generated options are missing key ideas you'd like incorporated, add your guidance below.",
    ],
  },

  {
    id: "moonshot_tuning",
    title: "This is your opportunity to Edit and Fine-Tune your Moonshot.",
    question: "This is your opportunity to Edit and Fine-Tune your Moonshot.",
    type: "tuning",
    guidance: [
      "Keep it short and easy to remember. When it feels authentic and something you are proud of, click save.",
    ],
    button: "Save my Moonshot",
  },

  {
    id: "mtp_beautify",
    type: "beautify",
    title: "Now let's make your Moonshot beautiful.",
    question: "Now let's make your Moonshot beautiful.",
    guidance: [
      "Type a description of the background image you desire for your Moonshot in this text box, or let the AI create an image based on your Moonshot alone.",
    ],

    fields: [
      {
        id: "imagePrompt",
        type: "text-area",
        label: "Describe an image",
        placeholder: "Describe an image that represents your Moonshot",
        required: true,
      },
      {
        id: "imageStyle",
        type: "select",
        label: "Artistic Style (optional)",
        options: [
          {
            value: "Prehistoric Art",
            label: "Prehistoric Art",
          },
          {
            value: "Ancient Egyptian Art",
            label: "Ancient Egyptian Art",
          },
          {
            value: "Ancient Greek Art",
            label: "Ancient Greek Art",
          },
          {
            value: "Renaissance Art",
            label: "Renaissance Art",
          },
          {
            value: "Haida Art",
            label: "Haida Art",
          },
          {
            value: "Ukiyo-e Art",
            label: "Ukiyo-e Art",
          },
          {
            value: "Impressionism",
            label: "Impressionism",
          },
          {
            value: "Cubism",
            label: "Cubism",
          },
          {
            value: "Surrealism",
            label: "Surrealism",
          },
          {
            value: "Abstract Expressionism",
            label: "Abstract Expressionism",
          },
          {
            value: "Minimalism",
            label: "Minimalism",
          },
          {
            value: "Street Art",
            label: "Street Art",
          },
          {
            value: "Contemporary Art",
            label: "Contemporary Art",
          },
          {
            value: "Documentary Photography",
            label: "Documentary Photography",
          },
          {
            value: "Art Nouveau",
            label: "Art Nouveau",
          },
          {
            value: "Neo-Pop Art",
            label: "Neo-Pop Art",
          },
          {
            value: "Contemporary Architecture",
            label: "Contemporary Architecture",
          },
          {
            value: "Installation Art",
            label: "Installation Art",
          },
          {
            value: "Aboriginal Australian Art",
            label: "Aboriginal Australian Art",
          },
          {
            value: "Traditional Chinese Painting",
            label: "Traditional Chinese Painting",
          },
        ],
      },
    ],
  },
];
