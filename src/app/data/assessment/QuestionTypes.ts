// src/app/data/assessment/QuestionTypes.ts
import { EnneagramType } from '@/app/data/constants/EnneagramData';

export const likertOptions = [
  { text: "Strongly Agree", value: 100 },
  { text: "Agree", value: 83.33 },
  { text: "Slightly Agree", value: 66.67 },
  { text: "Neutral", value: 50 },
  { text: "Slightly Disagree", value: 33.33 },
  { text: "Disagree", value: 16.67 },
  { text: "Strongly Disagree", value: 0 }
] as const;

export type TriadGroupType = 
  | "Centers of Intelligence"
  | "Harmonics"
  | "Object Relations"
  | "Hornevian";

export type LikertQuestion = {
  id: string;
  text: string;
  type: "likert";
  triadGroup: TriadGroupType;
  options: typeof likertOptions;
};

export type RankingQuestion = {
  likertId: string;
  setNumber: 1 | 2 | 3;
  text: string;
  triadGroup: TriadGroupType;
  options: {
    text: string;
    type: EnneagramType;
  }[];
};