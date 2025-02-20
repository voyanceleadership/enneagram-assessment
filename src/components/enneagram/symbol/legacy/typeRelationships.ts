// data/constants/symbol/typeRelationships.ts

export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface TypeInfo {
  name: string;
  fullName: string;  // For dropdown display
  angle: number;     // For symbol display
}

export interface TypeRelationships {
  leftWing: EnneagramType;
  rightWing: EnneagramType;
  stress: EnneagramType;
  growth: EnneagramType;
  related: EnneagramType[];
}

export const typeInfo: Record<EnneagramType, TypeInfo> = {
  1: { name: 'Reformer', fullName: 'The Reformer', angle: 20 },
  2: { name: 'Helper', fullName: 'The Helper', angle: 40 },
  3: { name: 'Achiever', fullName: 'The Achiever', angle: 60 },
  4: { name: 'Individualist', fullName: 'The Individualist', angle: 80 },
  5: { name: 'Investigator', fullName: 'The Investigator', angle: 100 },
  6: { name: 'Loyalist', fullName: 'The Loyalist', angle: 120 },
  7: { name: 'Enthusiast', fullName: 'The Enthusiast', angle: 140 },
  8: { name: 'Challenger', fullName: 'The Challenger', angle: 160 },
  9: { name: 'Peacemaker', fullName: 'The Peacemaker', angle: 0 }
};

export const typeRelationships: Record<EnneagramType, TypeRelationships> = {
  1: {
    leftWing: 9,
    rightWing: 2,
    stress: 4,
    growth: 7,
    related: [9, 2, 4, 7]
  },
  2: {
    leftWing: 1,
    rightWing: 3,
    stress: 8,
    growth: 4,
    related: [1, 3, 8, 4]
  },
  3: {
    leftWing: 2,
    rightWing: 4,
    stress: 9,
    growth: 6,
    related: [2, 4, 9, 6]
  },
  4: {
    leftWing: 3,
    rightWing: 5,
    stress: 2,
    growth: 1,
    related: [3, 5, 2, 1]
  },
  5: {
    leftWing: 4,
    rightWing: 6,
    stress: 7,
    growth: 8,
    related: [4, 6, 7, 8]
  },
  6: {
    leftWing: 5,
    rightWing: 7,
    stress: 3,
    growth: 9,
    related: [5, 7, 3, 9]
  },
  7: {
    leftWing: 6,
    rightWing: 8,
    stress: 1,
    growth: 5,
    related: [6, 8, 1, 5]
  },
  8: {
    leftWing: 7,
    rightWing: 9,
    stress: 5,
    growth: 2,
    related: [7, 9, 5, 2]
  },
  9: {
    leftWing: 8,
    rightWing: 1,
    stress: 6,
    growth: 3,
    related: [8, 1, 6, 3]
  }
};
