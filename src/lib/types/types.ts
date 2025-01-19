import { z } from 'zod';

// Interface defining the structure of type data
export interface TypeData {
  typeDigit: string;
  typeNumber: string;
  typeName: string;
  essenceQuality: string;
  briefDescription: string;
  // Comparison fields
  topPriority: string;
  secondaryDesires: string[];
  biggestFear: string;
  secondaryFears: string[];
  atTheirBest: string;
  underStress: string;
  wakeUpCall: string;
  mentalHabit: string;
  fundamentalFlaw: string;
  falseNarrative: string;
  keyToGrowth: string;
  // Detailed section content
  sections: {
    typeSummary: string;
    longDescription: string;
    mightBeType: string[];
    probablyNotType: string[];
    healthyLevel: string;
    averageLevel: string;
    unhealthyLevel: string;
    misconceptions: string[];
    typesMisidentifyingAsThis: string;
    thisTypeMayMisidentifyAs: string;
    wingTypes: Record<string, string>;
    lineTypes: Record<string, string>;
    growthPractices: string[];
    famousExamples: string[];
  };
}

// Type alias for a map of type numbers to type data
export type TypeDataMap = Record<string, TypeData>;

// Error class for type data related errors
export class TypeDataError extends Error {
  constructor(
    message: string,
    public typeDigit: string,
    public section?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'TypeDataError';
  }
}

// Validation error class
export class ValidationError extends Error {
  constructor(
    public typeDigit: string,
    public error: any
  ) {
    super(`Validation error for type ${typeDigit}: ${error}`);
    this.name = 'ValidationError';
  }
}

// Zod schema for validating type data
export const TypeDataSchema = z.object({
  typeDigit: z.string(),
  typeNumber: z.string(),
  typeName: z.string(),
  essenceQuality: z.string(),
  briefDescription: z.string(),
  // Comparison fields validation
  topPriority: z.string(),
  secondaryDesires: z.array(z.string()),
  biggestFear: z.string(),
  secondaryFears: z.array(z.string()),
  atTheirBest: z.string(),
  underStress: z.string(),
  wakeUpCall: z.string(),
  mentalHabit: z.string(),
  fundamentalFlaw: z.string(),
  falseNarrative: z.string(),
  keyToGrowth: z.string(),
  // Sections validation
  sections: z.object({
    typeSummary: z.string(),
    longDescription: z.string(),
    mightBeType: z.array(z.string()),
    probablyNotType: z.array(z.string()),
    healthyLevel: z.string(),
    averageLevel: z.string(),
    unhealthyLevel: z.string(),
    misconceptions: z.array(z.string()),
    typesMisidentifyingAsThis: z.string(),
    thisTypeMayMisidentifyAs: z.string(),
    wingTypes: z.record(z.string()),
    lineTypes: z.record(z.string()),
    growthPractices: z.array(z.string()),
    famousExamples: z.array(z.string())
  })
});

// Helper function to get displayable type name
export function getDisplayTypeName(type: TypeData): string {
  return `Type ${type.typeDigit}: ${type.typeName}`;
}

// Helper function to get comparison fields
export function getComparisonFields(type: TypeData) {
  return {
    typeName: getDisplayTypeName(type),
    topPriority: type.topPriority,
    secondaryDesires: type.secondaryDesires,
    biggestFear: type.biggestFear,
    secondaryFears: type.secondaryFears,
    atTheirBest: type.atTheirBest,
    underStress: type.underStress,
    wakeUpCall: type.wakeUpCall,
    mentalHabit: type.mentalHabit,
    fundamentalFlaw: type.fundamentalFlaw,
    falseNarrative: type.falseNarrative,
    keyToGrowth: type.keyToGrowth
  };
}