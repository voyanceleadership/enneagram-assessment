// constants.ts
import { TypeSection } from '../content/types';

export const SECTION_NAMES = {
  summary: 'Type Summary',
  longDescription: 'Long Description',
  mightBeType: 'You Might Be This Type If...',
  probablyNotType: "You're Probably Not This Type If...",
  healthyLevel: 'Healthy Level of Development',
  averageLevel: 'Average Level of Development',
  unhealthyLevel: 'Unhealthy Level of Development',
  misconceptions: 'Common Misconceptions About This Type',
  typesMisidentifyingAsThis: 'Types That May Misidentify as This Type',
  thisTypeMayMisidentifyAs: 'This Type May Misidentify as...',
  wingTypes: 'Wing Types',
  lineTypes: 'Line Types',
  growthPractices: 'Growth Practices',
  famousExamples: 'Famous Examples'
} as const;

export const TYPE_NAMES = {
  '1': 'Reformer',
  '2': 'Helper',
  '3': 'Achiever',
  '4': 'Individualist',
  '5': 'Investigator',
  '6': 'Loyalist',
  '7': 'Enthusiast',
  '8': 'Challenger',
  '9': 'Peacemaker'
} as const;

export const TYPE_NUMBERS = {
  '1': 'One',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine'
} as const;

export const TYPE_SECTIONS: TypeSection[] = [
  // 1. Type Snapshot - Quick digestible overview
  {
    id: 'snapshot',
    title: 'Type Snapshot',
    subsections: [
      { id: 'brief-description', title: 'Brief Description', key: 'briefDescription' },
      { id: 'top-priority', title: 'Top Priority', key: 'topPriority' },
      { id: 'secondary-desires', title: 'Secondary Desires', key: 'secondaryDesires' },
      { id: 'biggest-fear', title: 'Biggest Fear', key: 'biggestFear' },
      { id: 'secondary-fears', title: 'Secondary Fears', key: 'secondaryFears' },
      { id: 'at-their-best', title: 'At Their Best', key: 'atTheirBest' },
      { id: 'under-stress', title: 'Under Stress', key: 'underStress' },
      { id: 'wake-up-call', title: 'Wake-Up Call', key: 'wakeUpCall' },
      { id: 'mental-habit', title: 'Mental Habit', key: 'mentalHabit' },
      { id: 'characteristic-vice', title: 'Characteristic Vice', key: 'characteristicVice' },
      { id: 'inner-story', title: 'Inner Story', key: 'innerStory' },
      { id: 'key-to-growth', title: 'Key to Growth', key: 'keyToGrowth' }
    ]
  },
  
  // 2. Type Description - Narrative explanation
  {
    id: 'description',
    title: 'Type Description'
  },
  
  // 3. Levels of Development - Health spectrum
  {
    id: 'levels',
    title: 'Levels of Development',
    subsections: [
      { id: 'healthy', title: 'Healthy Level', key: 'healthyLevel' },
      { id: 'average', title: 'Average Level', key: 'averageLevel' },
      { id: 'unhealthy', title: 'Unhealthy Level', key: 'unhealthyLevel' }
    ]
  },
  
  // 4. Related Types - Connections and relationships
  {
    id: 'related-types',
    title: 'Related Types',
    subsections: [
      { id: 'explorer', title: 'Symbol Explorer' },
      { id: 'wing-intro', title: 'Wing Types' },
      { id: 'line-intro', title: 'Line Types' }
    ]
  },
  
  // 5. Growth Practices - Development strategies
  {
    id: 'growth',
    title: SECTION_NAMES.growthPractices
  },
  
  // 6. Famous Examples - Real-world illustrations
  {
    id: 'examples',
    title: SECTION_NAMES.famousExamples
  }
] as const;