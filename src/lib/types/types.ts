import { z } from 'zod';

const SummaryExplanationSchema = z.object({
  summary: z.string(),
  explanation: z.string()
});

export interface MisidentificationType {
  type: string;
  sharedTraits: string[];
  differences: {
    coreMotivation: string;
    behavioral: string;
    stress: string;
  };
}

export const TypeDataSchema = z.object({
  typeDigit: z.string(),
  typeNumber: z.string(),
  typeName: z.string(),
  essenceQuality: SummaryExplanationSchema,
  briefDescription: SummaryExplanationSchema,
  topPriority: SummaryExplanationSchema,
  secondaryDesires: z.array(SummaryExplanationSchema),
  biggestFear: SummaryExplanationSchema,
  secondaryFears: z.array(SummaryExplanationSchema),
  atTheirBest: SummaryExplanationSchema,
  underStress: SummaryExplanationSchema,
  wakeUpCall: SummaryExplanationSchema,
  mentalHabit: SummaryExplanationSchema,
  characteristicVice: SummaryExplanationSchema,
  innerStory: SummaryExplanationSchema,
  keyToGrowth: SummaryExplanationSchema,
  sections: z.object({
    typeSummary: z.string(),
    longDescription: z.string(),
    mightBeType: z.array(z.string()),
    probablyNotType: z.array(z.string()),
    healthyLevel: z.string(),
    averageLevel: z.string(),
    unhealthyLevel: z.string(),
    misconceptions: z.array(z.string()),
    typesMisidentifyingAsThis: z.array(z.object({
      type: z.string(),
      sharedTraits: z.array(z.string()),
      differences: z.object({
        coreMotivation: z.string(),
        behavioral: z.string(),
        stress: z.string()
      })
    })),
    thisTypeMayMisidentifyAs: z.array(z.object({
      type: z.string(),
      sharedTraits: z.array(z.string()),
      differences: z.object({
        coreMotivation: z.string(),
        behavioral: z.string(),
        stress: z.string()
      })
    })),
    wingTypes: z.record(z.string()),
    lineTypes: z.record(z.string()),
    growthPractices: z.array(z.string()),
    famousExamples: z.array(z.string())
  })
});

// Update TypeData interface to match schema
export interface TypeData {
  typeDigit: string;
  typeNumber: string;
  typeName: string;
  essenceQuality: {
    summary: string;
    explanation: string;
  };
  briefDescription: {
    summary: string;
    explanation: string;
  };
  topPriority: {
    summary: string;
    explanation: string;
  };
  secondaryDesires: Array<{
    summary: string;
    explanation: string;
  }>;
  biggestFear: {
    summary: string;
    explanation: string;
  };
  secondaryFears: Array<{
    summary: string;
    explanation: string;
  }>;
  atTheirBest: {
    summary: string;
    explanation: string;
  };
  underStress: {
    summary: string;
    explanation: string;
  };
  wakeUpCall: {
    summary: string;
    explanation: string;
  };
  mentalHabit: {
    summary: string;
    explanation: string;
  };
  characteristicVice: {
    summary: string;
    explanation: string;
  };
  innerStory: {
    summary: string;
    explanation: string;
  };
  keyToGrowth: {
    summary: string;
    explanation: string;
  };
  sections: {
    typeSummary: string;
    longDescription: string;
    mightBeType: string[];
    probablyNotType: string[];
    healthyLevel: string;
    averageLevel: string;
    unhealthyLevel: string;
    misconceptions: string[];
    typesMisidentifyingAsThis: MisidentificationType[];
    thisTypeMayMisidentifyAs: MisidentificationType[];
    wingTypes: Record<string, string>;
    lineTypes: Record<string, string>;
    growthPractices: string[];
    famousExamples: string[];
  };
}

export type TypeDataMap = Record<string, TypeData>;

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

export class ValidationError extends Error {
  constructor(
    public typeDigit: string,
    public error: any
  ) {
    super(`Validation error for type ${typeDigit}: ${error}`);
    this.name = 'ValidationError';
  }
}

export function getDisplayTypeName(type: TypeData): string {
  return `Type ${type.typeDigit}: ${type.typeName}`;
}

export function getComparisonFields(type: TypeData) {
  return {
    typeName: getDisplayTypeName(type),
    topPriority: type.topPriority.summary,
    secondaryDesires: type.secondaryDesires.map(d => d.summary),
    biggestFear: type.biggestFear.summary,
    secondaryFears: type.secondaryFears.map(f => f.summary),
    atTheirBest: type.atTheirBest.summary,
    underStress: type.underStress.summary,
    wakeUpCall: type.wakeUpCall.summary,
    mentalHabit: type.mentalHabit.summary,
    characteristicVice: type.characteristicVice.summary,
    innerStory: type.innerStory.summary,
    keyToGrowth: type.keyToGrowth.summary
  };
}