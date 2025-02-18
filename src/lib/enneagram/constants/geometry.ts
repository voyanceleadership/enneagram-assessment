// Symbol layout/coordinates

import { EnneagramType } from '../types';

interface Point {
  x: number;
  y: number;
}

interface TypeCoordinate {
  type: EnneagramType;
  cx: number;
  cy: number;
}

interface TypeNumberPosition {
  type: EnneagramType;
  x: number;
  y: number;
}

// SVG viewBox and dimensions
export const SYMBOL_DIMENSIONS = {
  viewBox: "0 0 2048 2048",
  center: { x: 1024, y: 1024 },
  numberCircleRadius: 42.5,
  selectedNumberCircleRadius: 50,
  defaultStrokeWidth: 3,
  selectedStrokeWidth: 5
};

// Circle coordinates for each type
export const TYPE_COORDINATES: TypeCoordinate[] = [
  { type: 9, cx: 1024, cy: 411.5 },
  { type: 8, cx: 630.29, cy: 554.79 },
  { type: 7, cx: 420.71, cy: 917.62 },
  { type: 6, cx: 493.48, cy: 1330.3 },
  { type: 5, cx: 814.46, cy: 1599.71 },
  { type: 4, cx: 1233.54, cy: 1599.71 },
  { type: 3, cx: 1554.52, cy: 1330.3 },
  { type: 2, cx: 1627.38, cy: 917.62 },
  { type: 1, cx: 1417.71, cy: 554.79 }
];

// Number positions for each type
export const NUMBER_POSITIONS: TypeNumberPosition[] = [
  { type: 9, x: 1007.56, y: 430.25 },
  { type: 8, x: 614.45, y: 573.54 },
  { type: 7, x: 408.68, y: 936.37 },
  { type: 6, x: 477.04, y: 1349.05 },
  { type: 5, x: 799.73, y: 1618.46 },
  { type: 4, x: 1217.49, y: 1618.46 },
  { type: 3, x: 1540.57, y: 1349.05 },
  { type: 2, x: 1613.67, y: 936.37 },
  { type: 1, x: 1404.27, y: 573.54 }
];

// Main text circle path for type names
export const TEXT_PATH = {
  id: "textCirclePath",
  d: "M 1024,263.5 A 760.5,760.5 0 1 1 1023.9,263.5 A 760.5,760.5 0 1 1 1024,263.5"
};

// Type labels with their angles
export const TYPE_LABELS = [
  { text: 'Peacemaker', angle: 0, needsFlip: false },
  { text: 'Reformer', angle: 20, needsFlip: false },
  { text: 'Helper', angle: 40, needsFlip: false },
  { text: 'Achiever', angle: 60, needsFlip: true },
  { text: 'Individualist', angle: 80, needsFlip: true },
  { text: 'Investigator', angle: 100, needsFlip: true },
  { text: 'Loyalist', angle: 120, needsFlip: true },
  { text: 'Enthusiast', angle: 140, needsFlip: false },
  { text: 'Challenger', angle: 160, needsFlip: false }
];