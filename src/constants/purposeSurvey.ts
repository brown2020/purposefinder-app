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

export const PURPOSE_JSON: QuestionType[] = [
  {
    id: "welcome-purpose",
    title: "Let's find your purpose",
    question: "Let's find your purpose",
    type: "statement",
    guidance: [
      "The pace of exponential tech is accelerating. The number of opportunities is exploding. How do you choose what to focus on and what to ignore?",
      "The answer is clarity on your Massive Transformative Purpose (MTP).",
    ],
    button: "Get Started",
  },
  {
    id: "attributes-purpose",
    title: "Here are the key attributes of an MTP:",
    question: "Here are the key attributes of an MTP:",
    type: "statement",
    attribute: [
      `It's "Massive" - inspires you.`,
      `It's driven by emotional energy.`,
      `You would commit 10 years to it.`,
      `It gives you a mission, a focus.`,
      `It feels "true & authentic" for you.`,
      `It is brief; easy to remember and say.`,
    ],
    button: "Get Started",
  },
  {
    id: "driver_billion",
    title:
      "If you were given $1 billion with which to make a positive impact on the world, what would you do?",
    question:
      "If you were given $1 billion with which to make a positive impact on the world, what would you do?",
    type: "text-area",
    guidance: [
      "Please describe in brief your idea. What wrong would you right? What opportunity would you pursue?",
    ],
  },
  {
    id: "driver_passion",
    title:
      "Imagine a day-long seminar so intriguing that you would clear your schedule to attend. What is the theme of that seminar?",
    question:
      "Imagine a day-long seminar so intriguing that you would clear your schedule to attend. What is the theme of that seminar?",
    type: "text-area",
  },
  {
    id: "driver_legacy",
    title:
      "What legacy do want to leave? In a few decades time, how do you want to be remembered by humanity?",
    question:
      "What legacy do want to leave? In a few decades time, how do you want to be remembered by humanity?",
    type: "text-area",
  },

  {
    id: "beneficiary_groups",
    title:
      "Who do you want to be a HERO to? Which individuals or communities do you desire to impact most? Who should be the focus of your MTP?",
    question:
      "Who do you want to be a HERO to? Which individuals or communities do you desire to impact most? Who should be the focus of your MTP?",
    type: "text-area",
    guidance: ["Be as specific as possible. Here are some examples:"],
    attribute: [
      "Renewable energy pioneers",
      "Trailblazing female entrepreneurs",
      "Underserved youth",
      "Small-scale farmers",
      "Longevity researchers",
    ],
  },

  {
    id: "verb_select",
    title: "Your Action Verbs",
    type: "select-tags",
    question: "Your Action Verbs",
    guidance: [
      "Your MTP is about action. Choose UP TO THREE high-impact verbs that describe the impact you wish to create in the world.",
    ],
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

  {
    id: "mtp_generate",
    type: "generate",
    question: "Let's generate some MTP ideas.",
    title: "Let's generate some MTP ideas.",
    guidance: [
      `Click "Generate Ideas" to see suggestions from our Al model. To add more options, click again`,
      `When you find one you like, click to select it as your draft MTP. During the next step you can edit and fine tune your MTP further.`,
      `If the AI-generated options are missing key ideas you'd like incorporated, add your guidance below.`,
    ],
  },

  {
    id: "mtp_tuning",
    title: "This is your opportunity to Edit and Fine-Tune your MTP.",
    question: "This is your opportunity to Edit and Fine-Tune your MTP.",
    type: "tuning",
    guidance: [
      "Keep it short and easy to remember. When it feels authentic and something you are proud of, click save.",
    ],
    button: "Save my MTP",
  },

  {
    id: "mtp_beautify",
    type: "beautify",
    title: "Now let's make your MTP beautiful.",
    question: "Now let's make your MTP beautiful.",
    guidance: [
      "Create a background image that embodies your vision. Once you're done, you can save it, download it, or share your MTP on social media.",
      "Type a description of the background image you desire for your MTP in this text box, or let the AI create an image based on your MTP alone.",
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