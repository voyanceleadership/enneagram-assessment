import { z } from 'zod';

// Basic schemas for common structures
const SummaryExplanationSchema = z.object({
  summary: z.string(),
  explanation: z.string()
});

const LevelTraitSchema = z.object({
  trait: z.string(),
  explanation: z.string()
});

// Enhanced schemas for wing and line type relationships
const WingTypeSchema = z.object({
  description: z.string(),
  alias: z.string(),
  combination: z.object({
    personality: z.string(),
    strengths: z.array(z.string()),
    challenges: z.array(z.string())
  })
});

const LineTypeSchema = z.object({
  description: z.string(),
  dynamics: z.object({
    healthy: z.string(),
    average: z.string(),
    unhealthy: z.string()
  })
});

const MisidentificationSchema = z.object({
  type: z.string(),
  sharedTraits: z.array(z.string()),
  differences: z.object({
    coreMotivation: z.string(),
    behavioral: z.string(),
    stress: z.string()
  })
});

// Main TypeData schema
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
    healthyLevel: z.array(LevelTraitSchema),
    averageLevel: z.array(LevelTraitSchema),
    unhealthyLevel: z.array(LevelTraitSchema),
    misconceptions: z.array(z.string()),
    typesMisidentifyingAsThis: z.array(MisidentificationSchema),
    thisTypeMayMisidentifyAs: z.array(MisidentificationSchema),
    wingTypes: z.record(WingTypeSchema),
    lineTypes: z.record(LineTypeSchema),
    growthPractices: z.array(z.string()),
    famousExamples: z.array(z.string())
  })
});

// TypeData interface matching the schema
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
    healthyLevel: Array<{
      trait: string;
      explanation: string;
    }>;
    averageLevel: Array<{
      trait: string;
      explanation: string;
    }>;
    unhealthyLevel: Array<{
      trait: string;
      explanation: string;
    }>;
    misconceptions: string[];
    typesMisidentifyingAsThis: Array<{
      type: string;
      sharedTraits: string[];
      differences: {
        coreMotivation: string;
        behavioral: string;
        stress: string;
      };
    }>;
    thisTypeMayMisidentifyAs: Array<{
      type: string;
      sharedTraits: string[];
      differences: {
        coreMotivation: string;
        behavioral: string;
        stress: string;
      };
    }>;
    wingTypes: Record<string, {
      description: string;
      alias: string;
      combination: {
        personality: string;
        strengths: string[];
        challenges: string[];
      };
    }>;
    lineTypes: Record<string, {
      description: string;
      dynamics: {
        healthy: string;
        average: string;
        unhealthy: string;
      };
    }>;
    growthPractices: string[];
    famousExamples: string[];
  };
}

export interface TypeSection {
  id: string;
  title: string | ((typeNumber: string) => string);
  subsections?: TypeSubsection[];
}

export interface TypeSubsection {
  id: string;
  title: string | ((typeNumber: string) => string);
  key?: keyof TypeData['sections'] | keyof TypeData;
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

// Utility functions
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