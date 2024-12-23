// assessmentData.ts

// Following lines moved to EnneagramData.ts

// export type TriadType = 
//   | "Centers of Intelligence" 
//   | "Harmonics" 
//   | "Object Relations" 
//   | "Hornevian";

// export type EnneagramType = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

// Following lines moved to QuestionTypes.ts

// export const likertOptions = [
//   { text: "Strongly Agree", value: 100 },
//   { text: "Agree", value: 83.33 },
//   { text: "Slightly Agree", value: 66.67 },
//   { text: "Neutral", value: 50 },
//   { text: "Slightly Disagree", value: 33.33 },
//   { text: "Disagree", value: 16.67 },
//   { text: "Strongly Disagree", value: 0 }
// ];

// export type LikertQuestion = {
//   id: string;
//   text: string;
//   type: "likert";
//   triadGroup: string;
//   options: typeof likertOptions;
// };

// export type RankingQuestion = {
//   likertId: string;
//   setNumber: 1 | 2 | 3;
//   text: string;
//   triadGroup: string;
//   options: {
//     text: string;
//     type: EnneagramType;
//   }[];
// };

export const assessmentQuestions = {
  likertQuestions: [
    {
      id: "head",
      text: "I spend a lot of time anticipating the future.",
      type: "likert" as const,
      triadGroup: "Centers of Intelligence",
      options: likertOptions
    },
    {
      id: "heart",
      text: "I see myself through the eyes of others.",
      type: "likert" as const,
      triadGroup: "Centers of Intelligence",
      options: likertOptions
    },
    {
      id: "gut",
      text: "When I'm making a decision, I usually go with my gut.",
      type: "likert" as const,
      triadGroup: "Centers of Intelligence",
      options: likertOptions
    },
    {
      id: "positive_outlook",
      text: "I consider myself an optimistic person.",
      type: "likert" as const,
      triadGroup: "Harmonics",
      options: likertOptions
    },
    {
      id: "logic",
      text: "I prefer to look at things rationally.",
      type: "likert" as const,
      triadGroup: "Harmonics",
      options: likertOptions
    },
    {
      id: "emotional_realness",
      text: "It's easy for me to know how I'm really feeling.",
      type: "likert" as const,
      triadGroup: "Harmonics",
      options: likertOptions
    },
    {
      id: "attachment",
      text: "When I'm making a decision, I often want to know what other people think.",
      type: "likert" as const,
      triadGroup: "Object Relations",
      options: likertOptions
    },
    {
      id: "frustration",
      text: "I'm good at re-thinking how things are done.",
      type: "likert" as const,
      triadGroup: "Object Relations",
      options: likertOptions
    },
    {
      id: "rejection",
      text: "I try to protect myself from being rejected.",
      type: "likert" as const,
      triadGroup: "Object Relations",
      options: likertOptions
    },
    {
      id: "withdrawn",
      text: "I like to spend time alone when I'm feeling stressed.",
      type: "likert" as const,
      triadGroup: "Hornevian",
      options: likertOptions
    },
    {
      id: "assertive",
      text: "I like moving quickly to get a lot of things done.",
      type: "likert" as const,
      triadGroup: "Hornevian",
      options: likertOptions
    },
    {
      id: "dutiful",
      text: "I often feel a sense of responsibility and obligation to others.",
      type: "likert" as const,
      triadGroup: "Hornevian",
      options: likertOptions
    }
  ]
};

export const rankingQuestions: RankingQuestion[] = [
  // Head Triad Questions
  {
    likertId: "head",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Head Triad",
    options: [
      { text: "I tend to think optimistically about the future.", type: "7" },
      { text: "I tend to think about what could go wrong in the future.", type: "6" },
      { text: "I tend to think objectively about the future.", type: "5" }
    ]
  },
  {
    likertId: "head",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Head Triad",
    options: [
      { text: "I place a high value on knowledge.", type: "5" },
      { text: "I place a high value on experiences.", type: "7" },
      { text: "I place a high value on loyalty.", type: "6" }
    ]
  },
  {
    likertId: "head",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Head Triad",
    options: [
      { text: "I often think about what I might be missing out on.", type: "7" },
      { text: "I often think about worst-case scenarios.", type: "6" },
      { text: "I often think about things analytically.", type: "5" }
    ]
  },

  // Heart Triad Questions
  {
    likertId: "heart",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Heart Triad",
    options: [
      { text: "I want to be seen as a helpful person.", type: "2" },
      { text: "I want to be seen as a successful person.", type: "3" },
      { text: "I want to be seen as a deep person.", type: "4" }
    ]
  },
  {
    likertId: "heart",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Heart Triad",
    options: [
      { text: "I spend a lot of time doing things for other people.", type: "2" },
      { text: "I spend a lot of time working toward my goals.", type: "3" },
      { text: "I spend a lot of time on creative endeavors.", type: "4" }
    ]
  },
  {
    likertId: "heart",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Heart Triad",
    options: [
      { text: "I have a hard time asking other people for help.", type: "2" },
      { text: "I have a hard time taking a break - winners never quit!", type: "3" },
      { text: "I have a hard time letting go of my feelings.", type: "4" }
    ]
  },

  // Gut Triad Questions
  {
    likertId: "gut",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Gut Triad",
    options: [
      { text: "I'm good at seeing things from other people's point of view.", type: "9" },
      { text: "I'm good at overcoming challenges to make things happen.", type: "8" },
      { text: "I'm good at identifying how things could be improved.", type: "1" }
    ]
  },
  {
    likertId: "gut",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Gut Triad",
    options: [
      { text: "I tend to be agreeable and indirect.", type: "9" },
      { text: "I tend to say whatever's on my mind.", type: "8" },
      { text: "I tend to be logical and precise.", type: "1" }
    ]
  },
  {
    likertId: "gut",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Gut Triad",
    options: [
      { text: "I like to challenge other people on their perspectives.", type: "8" },
      { text: "I'm highly receptive to other people's perspectives.", type: "9" },
      { text: "I tend to think my perspectives are objectively correct.", type: "1" }
    ]
  },

  // Positive Outlook Triad Questions
  {
    likertId: "positive_outlook",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Positive Outlook Triad",
    options: [
      { text: "I think it's calming to believe all will be well.", type: "9" },
      { text: "I think life is more enjoyable when you look on the bright side.", type: "7" },
      { text: "I think it's helpful to have a positive attitude.", type: "2" }
    ]
  },
  {
    likertId: "positive_outlook",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Positive Outlook Triad",
    options: [
      { text: "Others would describe me as a generous person.", type: "2" },
      { text: "Others would describe me as an energetic person.", type: "7" },
      { text: "Others would describe me as an easygoing person.", type: "9" }
    ]
  },
  {
    likertId: "positive_outlook",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Positive Outlook Triad",
    options: [
      { text: "I want people to like me.", type: "2" },
      { text: "I want people to get along.", type: "9" },
      { text: "I want people to have fun.", type: "7" }
    ]
  },

  // Logic Triad Questions
  {
    likertId: "logic",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Logic Triad",
    options: [
      { text: "It's important to me to be principled.", type: "1" },
      { text: "It's important to me to be admirable.", type: "3" },
      { text: "It's important to me to be well-informed.", type: "5" }
    ]
  },
  {
    likertId: "logic",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Logic Triad",
    options: [
      { text: "I focus on living up to my standards for myself.", type: "1" },
      { text: "I focus on presenting myself well.", type: "3" },
      { text: "I focus on exploring my curiosities.", type: "5" }
    ]
  },
  {
    likertId: "logic",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Logic Triad",
    options: [
      { text: "I'm inspired by the idea of being the best.", type: "3" },
      { text: "I'm inspired by the idea of perfection.", type: "1" },
      { text: "I'm inspired by the idea of deep understanding.", type: "5" }
    ]
  },

  // Emotional Realness Triad Questions
  {
    likertId: "emotional_realness",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Emotional Realness Triad",
    options: [
      { text: "I tend to rely on intuition.", type: "4" },
      { text: "I tend to rely on input from others.", type: "6" },
      { text: "I tend to rely on gut instinct.", type: "8" }
    ]
  },
  {
    likertId: "emotional_realness",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Emotional Realness Triad",
    options: [
      { text: "I'm a supportive person.", type: "6" },
      { text: "I'm an expressive person.", type: "4" },
      { text: "I'm an assertive person.", type: "8" }
    ]
  },
  {
    likertId: "emotional_realness",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Emotional Realness Triad",
    options: [
      { text: "I want to be understood.", type: "4" },
      { text: "I want to have people I can count on.", type: "6" },
      { text: "I want to be in control.", type: "8" }
    ]
  },

  // Attachment Triad Questions
  {
    likertId: "attachment",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Attachment Triad",
    options: [
      { text: "I often consider what people think of me.", type: "3" },
      { text: "I often consider whether I can trust people.", type: "6" },
      { text: "I often consider how people are feeling.", type: "9" }
    ]
  },
  {
    likertId: "attachment",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Attachment Triad",
    options: [
      { text: "I like to have a sense of security.", type: "6" },
      { text: "I like to feel comfortable.", type: "9" },
      { text: "I like to be recognized for my accomplishments.", type: "3" }
    ]
  },
  {
    likertId: "attachment",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Attachment Triad",
    options: [
      { text: "It's important to me to accomplish my goals.", type: "3" },
      { text: "It's important to me to feel prepared for the future.", type: "6" },
      { text: "It's important to me to get along with other people.", type: "9" }
    ]
  },

  // Frustration Triad Questions
  {
    likertId: "frustration",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Frustration Triad",
    options: [
      { text: "I have a natural drive to make things as good as they can be.", type: "1" },
      { text: "I have a natural ability to think differently than other people.", type: "4" },
      { text: "I have a natural inclination to brainstorm about future possibilities.", type: "7" }
    ]
  },
  {
    likertId: "frustration",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Frustration Triad",
    options: [
      { text: "I care about doing the right thing.", type: "1" },
      { text: "I care about being true to myself.", type: "4" },
      { text: "I care about making the most of life.", type: "7"}
    ]
  },
  {
    likertId: "frustration",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Frustration Triad",
    options: [
      { text: "I have meticulous attention to detail.", type: "1" },
      { text: "I have a strong aesthetic sense.", type: "4" },
      { text: "I have lots of enthusiasm about new ideas.", type: "7" }
    ]
  },

  // Rejection Triad Questions
  {
    likertId: "rejection",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Rejection Triad",
    options: [
      { text: "Relationships are important to me.", type: "2" },
      { text: "Objectivity is important to me.", type: "5" },
      { text: "Action is important to me.", type: "8" }
    ]
  },
  {
    likertId: "rejection",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Rejection Triad",
    options: [
      { text: "I use eye contact to feel connected with other people.", type: "2" },
      { text: "I'm uncomfortable with eye contact.", type: "5" },
      { text: "I use eye contact to discern whether people are being straight with me.", type: "8" }
    ]
  },
  {
    likertId: "rejection",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Rejection Triad",
    options: [
      { text: "Other people would describe me as a likeable person.", type: "2" },
      { text: "Other people would describe me as a private person.", type: "5" },
      { text: "Other people would describe me as an intense person.", type: "8" }
    ]
  },

  // Withdrawn Triad Questions
  {
    likertId: "withdrawn",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Withdrawn Triad",
    options: [
      { text: "I like to spend my time alone relaxing.", type: "9" },
      { text: "I like to spend my time alone thinking.", type: "5" },
      { text: "I like to spend my time alone introspecting.", type: "4" }
    ]
  },
  {
    likertId: "withdrawn",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Withdrawn Triad",
    options: [
      { text: "I'm an accommodating person.", type: "9" },
      { text: "I'm an individualistic person.", type: "4" },
      { text: "I'm a knowledgeable person.", type: "5" }
    ]
  },
  {
    likertId: "withdrawn",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Withdrawn Triad",
    options: [
      { text: "I find it stressful when people around me aren't getting along.", type: "9" },
      { text: "I find it stressful when people place demands on my time.", type: "5" },
      { text: "I find it stressful when people dismiss me.", type: "4" }
    ]
  },

  // Assertive Triad Questions
  {
    likertId: "assertive",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Assertive Triad",
    options: [
      { text: "Success is important to me.", type: "3" },
      { text: "Independence is important to me.", type: "8" },
      { text: "Freedom is important to me.", type: "7" }
    ]
  },
  {
    likertId: "assertive",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Assertive Triad",
    options: [
      { text: "I approach problems optimistically.", type: "7" },
      { text: "I approach problems forcefully.", type: "8" },
      { text: "I approach problems logically.", type: "3" }
    ]
  },
  {
    likertId: "assertive",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Assertive Triad",
    options: [
      { text: "I don't like feeling trapped or bored.", type: "7" },
      { text: "I don't like feeling weak or vulnerable.", type: "8" },
      { text: "I don't like feeling embarrassed or exposed.", type: "3" }
    ]
  },

  // Dutiful Triad Questions
  {
    likertId: "dutiful",
    setNumber: 1,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Dutiful Triad",
    options: [
      { text: "I'm good at reading people.", type: "2" },
      { text: "I'm good at planning for future scenarios.", type: "6" },
      { text: "I'm good at catching errors.", type: "1" }
    ]
  },
  {
    likertId: "dutiful",
    setNumber: 2,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Dutiful Triad",
    options: [
      { text: "I think a lot about ethics.", type: "1" },
      { text: "I think a lot about what other people need.", type: "2" },
      { text: "I think a lot about risks and how to mitigate them.", type: "6" }
    ]
  },
  {
    likertId: "dutiful",
    setNumber: 3,
    text: "Rank these statements from most to least like you:",
    triadGroup: "Dutiful Triad",
    options: [
      { text: "I like to be real about how I'm feeling.", type: "6" },
      { text: "I like to be encouraging to others.", type: "2" },
      { text: "I like to be rational in my thought process.", type: "1" }
    ]
  }
];

// Following lines moved to EnneagramData.ts

// export const typeNames: { [key: string]: string } = {
//   "1": "The Reformer",
//   "2": "The Helper",
//   "3": "The Achiever",
//   "4": "The Individualist",
//   "5": "The Investigator",
//   "6": "The Loyalist",
//   "7": "The Enthusiast",
//   "8": "The Challenger",
//   "9": "The Peacemaker"
// };

// export const triadDescriptions: { [key: string]: string } = {
//   "Centers of Intelligence": "How we process information and make decisions",
//   "Harmonics": "How we cope with difficulty",
//   "Object Relations": "How we maintain relationships and boundaries",
//   "Hornevian": "How we engage with the world and meet our needs"
// };