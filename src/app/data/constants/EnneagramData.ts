// src/app/data/constants/EnneagramData.ts
import { TriadGroupType } from '@/app/data/assessment/QuestionTypes';

export type EnneagramType = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export const TYPE_NAMES: Record<EnneagramType, string> = {
  "1": "The Reformer",
  "2": "The Helper",
  "3": "The Achiever",
  "4": "The Individualist",
  "5": "The Investigator",
  "6": "The Loyalist",
  "7": "The Enthusiast",
  "8": "The Challenger",
  "9": "The Peacemaker"
} as const;

export const TRIAD_DESCRIPTIONS: Record<TriadGroupType, string> = {
  "Centers of Intelligence": "How we process information and make decisions",
  "Harmonics": "How we cope with difficulty",
  "Object Relations": "How we maintain relationships and boundaries",
  "Hornevian": "How we engage with the world and meet our needs"
} as const;

// Added type safety with interfaces
export interface EnneagramTypeDetail {
  name: string;
  basicFear: string;
  basicDesire: string;
  keyMotivation: string;
}

export interface WingInfo {
  description: string;
  traits: string[];
}

export interface GrowthPath {
  stressPoint: EnneagramType;
  growthPoint: EnneagramType;
  stressDescription: string;
  growthDescription: string;
}

// You can expand these later
export const TYPE_DETAILS: Record<EnneagramType, EnneagramTypeDetail> = {
  // Add type details here
} as const;

export const WING_INFO: Record<EnneagramType, Record<EnneagramType, WingInfo>> = {
  // Add wing information here
} as const;

export const GROWTH_PATHS: Record<EnneagramType, GrowthPath> = {
  // Add growth paths here
} as const;