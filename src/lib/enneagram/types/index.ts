// Shared type definitions

export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type SymbolVariation = 
  | 'all' 
  | 'type-only'
  | 'related-types'
  | 'left-wing'
  | 'right-wing'
  | 'both-wings'
  | 'both-lines'
  | 'stress-line'
  | 'growth-line';

export interface TypeInfo {
  name: string;
  fullName: string;
  angle: number;
  basicFear: string;
  basicDesire: string;
  keyMotivation: string;
}

export interface TypeRelationships {
  leftWing: EnneagramType;
  rightWing: EnneagramType;
  stress: EnneagramType;
  growth: EnneagramType;
  related: EnneagramType[];
}

export interface WingInfo {
  description: string;
  traits: string[];
}