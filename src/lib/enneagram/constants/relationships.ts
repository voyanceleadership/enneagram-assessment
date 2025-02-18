// Wing/stress/growth relationships

import { EnneagramType, TypeRelationships } from '../types';

export const ENNEAGRAM_RELATIONSHIPS: Record<EnneagramType, TypeRelationships> = {
  1: { left: 9, right: 2, stress: 4, growth: 7, related: [9, 2, 4, 7] },
  2: { left: 1, right: 3, stress: 8, growth: 4, related: [1, 3, 8, 4] },
  3: { left: 2, right: 4, stress: 9, growth: 6, related: [2, 4, 9, 6] },
  4: { left: 3, right: 5, stress: 2, growth: 1, related: [3, 5, 2, 1] },
  5: { left: 4, right: 6, stress: 7, growth: 8, related: [4, 6, 7, 8] },
  6: { left: 5, right: 7, stress: 3, growth: 9, related: [5, 7, 3, 9] },
  7: { left: 6, right: 8, stress: 1, growth: 5, related: [6, 8, 1, 5] },
  8: { left: 7, right: 9, stress: 5, growth: 2, related: [7, 9, 5, 2] },
  9: { left: 8, right: 1, stress: 6, growth: 3, related: [8, 1, 6, 3] }
};