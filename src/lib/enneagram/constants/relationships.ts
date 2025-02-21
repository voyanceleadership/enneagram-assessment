/**
 * @file index.ts
 * @description Core constants for the Enneagram symbol
 * 
 * This file contains all constant values needed for rendering and interacting
 * with the Enneagram symbol. It includes type relationships, coordinates,
 * variation options, and SVG path data.
 * 
 * Related files:
 * - ../types/index.ts (provides type definitions)
 * - ../components/symbol/DynamicEnneagramSymbol.tsx (main consumer)
 */

import { EnneagramType, TypeRelationships, SymbolVariation } from '../types';

/**
 * Core relationships between Enneagram types
 * Each type has:
 * - left/right wing connections (adjacent numbers)
 * - stress/growth connections (inner lines)
 * - array of all related types
 */
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

/**
 * Names and descriptions for each Enneagram type
 */
export const TYPE_NAMES = {
  1: 'Reformer',
  2: 'Helper',
  3: 'Achiever',
  4: 'Individualist',
  5: 'Investigator',
  6: 'Loyalist',
  7: 'Enthusiast',
  8: 'Challenger',
  9: 'Peacemaker'
} as const;

/**
 * Base variations for symbol display
 * These are transformed into dynamic variations with context-aware labels
 * @see getDynamicVariations in symbolUtils.ts
 */
export const BASE_VARIATIONS: Array<{ value: SymbolVariation; label: string }> = [
  { value: 'all', label: 'All Types' },
  { value: 'type-only', label: 'Core Type Only' },
  { value: 'related-types', label: 'All Related Types' },
  { value: 'both-wings', label: 'Both Wings' },
  { value: 'left-wing', label: 'Left Wing' },
  { value: 'right-wing', label: 'Right Wing' },
  { value: 'both-lines', label: 'Both Lines' },
  { value: 'stress-line', label: 'Stress Line' },
  { value: 'growth-line', label: 'Growth Line' }
];

/**
 * SVG coordinate positions for each type number
 * Based on a 2048x2048 viewBox
 */
export const TYPE_COORDINATES = {
  1: { x: 1417.71, y: 554.79 },
  2: { x: 1627.38, y: 917.62 },
  3: { x: 1554.52, y: 1330.3 },
  4: { x: 1233.54, y: 1599.71 },
  5: { x: 814.46, y: 1599.71 },
  6: { x: 493.48, y: 1330.3 },
  7: { x: 420.71, y: 917.62 },
  8: { x: 630.29, y: 554.79 },
  9: { x: 1024, y: 411.5 }
} as const;

/**
 * SVG path data for arrowheads on connection lines
 * Each entry corresponds to a specific type connection
 */
export const ARROWHEADS = {
  stress: {
    "2-8": "670.5,569.5 702.72,568.22 691.9,577.27 694.39,591.15 670.5,569.5",
    "8-5": "807.5,1557.5 790.31,1530.22 803.55,1535.08 814.33,1525.99 807.5,1557.5",
    "5-7": "441.5,954.5 467.01,974.22 452.91,974.2 445.9,986.44 441.5,954.5",
    "7-1": "1377.5,569.5 1353.61,591.15 1356.1,577.27 1345.28,568.23 1377.5,569.5",
    "1-4": "1240.5,1557.5 1233.69,1525.98 1244.47,1535.08 1257.71,1530.23 1240.5,1557.5",
    "4-2": "1606.5,954.5 1602.1,986.44 1595.09,974.2 1580.99,974.22 1606.5,954.5",
    "3-9": "1044.5,448.5 1048.89,480.44 1055.9,468.2 1070,468.23 1044.5,448.5",
    "9-6": "514.5,1293.5 518.87,1261.55 525.89,1273.79 539.99,1273.75 514.5,1293.5",
    "6-3": "1513,1330.5 1483.15,1342.7 1490.23,1330.5 1483.15,1318.31 1513,1330.5"
  },
  growth: {
    "8-2": "1587.5,902.5 1563.61,880.85 1566.1,894.73 1555.28,903.77 1587.5,902.5",
    "2-4": "1254.5,1562.5 1280.01,1542.78 1265.91,1542.8 1258.9,1530.56 1254.5,1562.5",
    "4-1": "1410.5,596.5 1393.29,623.77 1406.53,618.92 1417.31,628.02 1410.5,596.5",
    "1-7": "460.5,902.5 492.72,903.78 481.9,894.73 484.39,880.85 460.5,902.5",
    "7-5": "793.5,1562.5 789.1,1530.56 782.09,1542.8 767.99,1542.78 793.5,1562.5",
    "5-8": "638.5,597.5 631.66,629.01 642.45,619.92 655.68,624.78 638.5,597.5",
    "3-6": "536,1330.5 565.85,1342.7 558.77,1330.5 565.85,1318.31 536,1330.5",
    "6-9": "1002.5,448.5 977.01,468.25 991.11,468.21 998.13,480.44 1002.5,448.5",
    "9-3": "1533.5,1293.5 1507.99,1273.78 1522.1,1273.8 1529.1,1261.56 1533.5,1293.5"
  }
} as const;

/**
 * SVG path data for connection lines between types
 */
export const CONNECTIONS = {
  wings: {
    "1-2": "M1417.71,554.79 A612.5,612.5 0 0,1 1627.38,917.62",
    "2-3": "M1627.38,917.62 A612.5,612.5 0 0,1 1554.52,1330.3",
    "3-4": "M1554.52,1330.3 A612.5,612.5 0 0,1 1233.54,1599.71",
    "4-5": "M1233.54,1599.71 A612.5,612.5 0 0,1 814.46,1599.71",
    "5-6": "M814.46,1599.71 A612.5,612.5 0 0,1 493.48,1330.3",
    "6-7": "M493.48,1330.3 A612.5,612.5 0 0,1 420.71,917.62",
    "7-8": "M420.71,917.62 A612.5,612.5 0 0,1 630.29,554.79",
    "8-9": "M630.29,554.79 A612.5,612.5 0 0,1 1024,411.5",
    "9-1": "M1024,411.5 A612.5,612.5 0 0,1 1417.71,554.79"
  }
} as const;