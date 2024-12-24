// src/app/data/assessment/AssessmentQuestions.ts
import { LikertQuestion, RankingQuestion, likertOptions } from './QuestionTypes';
import { EnneagramType } from '../constants/EnneagramData';

// All types and constants related to the assessment structure
export const likertOptions = [
  { text: "Strongly Agree", value: 100 },
  { text: "Agree", value: 83.33 },
  { text: "Slightly Agree", value: 66.67 },
  { text: "Neutral", value: 50 },
  { text: "Slightly Disagree", value: 33.33 },
  { text: "Disagree", value: 16.67 },
  { text: "Strongly Disagree", value: 0 }
] as const;

export type LikertQuestion = {
  id: string;
  text: string;
  type: "likert";
  triadGroup: string;
  options: typeof likertOptions;
};

export type RankingQuestion = {
  likertId: string;
  setNumber: 1 | 2 | 3;
  text: string;
  triadGroup: string;
  options: {
    text: string;
    type: EnneagramType;
  }[];
};