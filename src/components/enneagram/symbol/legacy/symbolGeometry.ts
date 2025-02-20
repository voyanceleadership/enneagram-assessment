// data/constants/symbol/symbolGeometry.ts

import { EnneagramType } from './typeRelationships';

export interface Point {
  x: number;
  y: number;
}

export enum ConnectionType {
  Arc = 'arc',
  Line = 'line'
}

export interface Connection {
  type: ConnectionType;
  category: 'leftWing' | 'rightWing' | 'stress' | 'growth';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  path?: string; // For arc paths
}

// Each type's direct connections, explicitly categorized
export const typeConnections: Record<EnneagramType, Connection[]> = {
  1: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 1417.71, y1: 554.79, x2: 1024, y2: 411.5, path: "M1417.72,554.79c-106.46-89.43-243.8-143.29-393.72-143.29" },
    { type: ConnectionType.Arc, category: "rightWing", x1: 1417.71, y1: 554.79, x2: 1627.38, y2: 917.62, path: "M1417.72,554.79c108,90.71,184.22,218.02,209.58,362.84" },
    { type: ConnectionType.Line, category: "stress", x1: 1417.5, y1: 554.5, x2: 1233.5, y2: 1599.5 },
    { type: ConnectionType.Line, category: "growth", x1: 1417.5, y1: 554.5, x2: 420.5, y2: 917.5 }
  ],
  2: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 1627.38, y1: 917.62, x2: 1417.71, y2: 554.79 },
    { type: ConnectionType.Arc, category: "rightWing", x1: 1627.38, y1: 917.62, x2: 1554.52, y2: 1330.3 },
    { type: ConnectionType.Line, category: "stress", x1: 1627.5, y1: 917.5, x2: 1233.5, y2: 1599.5 },
    { type: ConnectionType.Line, category: "growth", x1: 1627.5, y1: 917.5, x2: 814.5, y2: 1599.5 }
  ],
  3: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 1554.52, y1: 1330.3, x2: 1627.38, y2: 917.62 },
    { type: ConnectionType.Arc, category: "rightWing", x1: 1554.52, y1: 1330.3, x2: 1233.5, y2: 1599.5 },
    { type: ConnectionType.Line, category: "stress", x1: 1554.5, y1: 1330.5, x2: 1023.5, y2: 411.5 },
    { type: ConnectionType.Line, category: "growth", x1: 1554.5, y1: 1330.5, x2: 493.5, y2: 1330.5 }
  ],
  4: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 1233.54, y1: 1599.71, x2: 1554.52, y2: 1330.3 },
    { type: ConnectionType.Arc, category: "rightWing", x1: 1233.54, y1: 1599.71, x2: 814.46, y2: 1599.71 },
    { type: ConnectionType.Line, category: "stress", x1: 1233.5, y1: 1599.5, x2: 1417.5, y2: 554.5 },
    { type: ConnectionType.Line, category: "growth", x1: 1233.5, y1: 1599.5, x2: 1627.5, y2: 917.5 }
  ],
  5: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 814.46, y1: 1599.71, x2: 1233.54, y2: 1599.71 },
    { type: ConnectionType.Arc, category: "rightWing", x1: 814.46, y1: 1599.71, x2: 493.48, y2: 1330.3 },
    { type: ConnectionType.Line, category: "stress", x1: 814.5, y1: 1599.5, x2: 420.5, y2: 917.5 },
    { type: ConnectionType.Line, category: "growth", x1: 814.5, y1: 1599.5, x2: 1627.5, y2: 917.5 }
  ],
  6: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 493.48, y1: 1330.3, x2: 814.46, y2: 1599.71 },
    { type: ConnectionType.Arc, category: "rightWing", x1: 493.48, y1: 1330.3, x2: 420.71, y2: 917.62 },
    { type: ConnectionType.Line, category: "stress", x1: 493.5, y1: 1330.5, x2: 1554.5, y2: 1330.5 },
    { type: ConnectionType.Line, category: "growth", x1: 493.5, y1: 1330.5, x2: 1023.5, y2: 411.5 }
  ],
  7: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 420.71, y1: 917.62, x2: 493.48, y2: 1330.3 },
    { type: ConnectionType.Arc, category: "rightWing", x1: 420.71, y1: 917.62, x2: 630.29, y2: 554.79 },
    { type: ConnectionType.Line, category: "stress", x1: 420.5, y1: 917.5, x2: 1417.5, y2: 554.5 },
    { type: ConnectionType.Line, category: "growth", x1: 420.5, y1: 917.5, x2: 814.5, y2: 1599.5 }
  ],
  8: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 630.29, y1: 554.79, x2: 420.71, y2: 917.62 },
    { type: ConnectionType.Arc, category: "rightWing", x1: 630.29, y1: 554.79, x2: 1024, y2: 411.5 },
    { type: ConnectionType.Line, category: "stress", x1: 814.5, y1: 1599.5, x2: 1627.5, y2: 917.5 },
    { type: ConnectionType.Line, category: "growth", x1: 814.5, y1: 1599.5, x2: 493.5, y2: 1330.5 }
  ],
  9: [
    { type: ConnectionType.Arc, category: "leftWing", x1: 1024, y1: 411.5, x2: 630.29, y2: 554.79 },
    { type: ConnectionType.Arc, category: "rightWing", x1: 1024, y1: 411.5, x2: 1417.71, y2: 554.79 },
    { type: ConnectionType.Line, category: "stress", x1: 1023.5, y1: 411.5, x2: 1554.5, y2: 1330.5 },
    { type: ConnectionType.Line, category: "growth", x1: 1023.5, y1: 411.5, x2: 493.5, y2: 1330.5 }
  ]
};

// SVG viewBox and center point
export const symbolDimensions = {
  viewBox: "0 0 2048 2048",
  center: { x: 1024, y: 1024 },
  numberCircleRadius: 42.5,
  selectedNumberCircleRadius: 50,
  defaultStrokeWidth: 3,
  selectedStrokeWidth: 5
};

// Outer ring paths
export const outerRing = {
  radius: 839,
  greyRingPath: "M1705.77,1024c0,376.84-304.93,681.77-681.77,681.77s-681.77-304.93-681.77-681.77,304.93-681.77,681.77-681.77,681.77,304.93,681.77,681.77ZM1024,185c-463.74,0-839,375.26-839,839s375.26,839,839,839,839-375.26,839-839S1487.74,185,1024,185Z"
};

// Circle paths for type labels
export const circularTextPaths = [
  { id: "path", d: "M1784.5,1024.27c-.15,420.35-340.41,760.38-760.76,760.23-420.35-.15-760.38-340.41-760.23-760.76.15-420.35,340.41-760.38,760.76-760.23,420.35.15,760.38,340.41,760.23,760.76Z" },
  { id: "path1", d: "M1784.49,1020.28c2.05,420.35-336.43,762.15-756.78,764.21-420.35,2.05-762.15-336.43-764.21-756.78-2.05-420.35,336.43-762.15,756.78-764.21,420.35-2.05,762.15,336.43,764.21,756.78Z" },
  { id: "path2", d: "M1784.46,1016.3c4.26,420.33-332.43,763.9-752.76,768.16-420.33,4.26-763.9-332.43-768.16-752.76-4.26-420.33,332.43-763.9,752.76-768.16,420.33-4.26,763.9,332.43,768.16,752.76Z" },
  { id: "path3", d: "M1784.49,1019.49c-2.49-420.35-344.65-758.47-765-755.97-420.35,2.49-758.47,344.65-755.97,765,2.49,420.35,344.65,758.47,765,755.97,420.35-2.49,758.47-344.65,755.97-765Z" },
  { id: "path4", d: "M1784.5,1022.21c-.99-420.35-341.94-759.7-762.29-758.71-420.35.99-759.7,341.94-758.71,762.29.99,420.35,341.94,759.7,762.29,758.71,420.35-.99,759.7-341.94,758.71-762.29Z" },
  { id: "path5", d: "M1784.5,1025.86c1.03-420.35-338.29-761.33-758.64-762.36-420.35-1.03-761.33,338.29-762.36,758.64-1.03,420.35,338.29,761.33,758.64,762.36,420.35,1.03,761.33-338.29,762.36-758.64Z" },
  { id: "path6", d: "M1784.49,1028.65c2.57-420.35-335.49-762.56-755.84-765.13-420.35-2.57-762.56,335.49-765.13,755.84-2.57,420.35,335.49,762.56,755.84,765.13,420.35,2.57,762.56-335.49,765.13-755.84Z" },
  { id: "path7", d: "M1784.47,1030.37c-3.52,420.34-346.5,757.62-766.84,754.1-420.34-3.52-757.62-346.5-754.1-766.84,3.52-420.34,346.5-757.62,766.84-754.1,420.34,3.52,757.62,346.5,754.1,766.84Z" },
  { id: "path8", d: "M1784.48,1029.11c-2.82,420.34-345.25,758.2-765.59,755.37-420.34-2.82-758.2-345.25-755.37-765.59,2.82-420.34,345.25-758.2,765.59-755.37,420.34,2.82,758.2,345.25,755.37,765.59Z" }
];

// Main text circle path
export const mainTextPath = {
  id: "textCirclePath",
  d: "M 1024,263.5 A 760.5,760.5 0 1 1 1023.9,263.5 A 760.5,760.5 0 1 1 1024,263.5"
};

// Inner circle center point and radius
export const innerCircle = {
  center: { x: 1024, y: 1024 },
  radius: 612.5
};

// Type numbers and circle coordinates
export const typeCoordinates = {
  circles: [
    { type: 9, cx: 1024, cy: 411.5 },
    { type: 8, cx: 630.29, cy: 554.79 },
    { type: 7, cx: 420.71, cy: 917.62 },
    { type: 6, cx: 493.48, cy: 1330.3 },
    { type: 5, cx: 814.46, cy: 1599.71 },
    { type: 4, cx: 1233.54, cy: 1599.71 },
    { type: 3, cx: 1554.52, cy: 1330.3 },
    { type: 2, cx: 1627.38, cy: 917.62 },
    { type: 1, cx: 1417.71, cy: 554.79 }
  ],
  numbers: [
    { type: 9, x: 1007.56, y: 430.25 },
    { type: 8, x: 614.45, y: 573.54 },
    { type: 7, x: 408.68, y: 936.37 },
    { type: 6, x: 477.04, y: 1349.05 },
    { type: 5, x: 799.73, y: 1618.46 },
    { type: 4, x: 1217.49, y: 1618.46 },
    { type: 3, x: 1540.57, y: 1349.05 },
    { type: 2, x: 1613.67, y: 936.37 },
    { type: 1, x: 1404.27, y: 573.54 }
  ]
};

// Type labels with their angles
export const typeLabels = [
  { text: 'Peacemaker', angle: 0 },
  { text: 'Reformer', angle: 20 },
  { text: 'Helper', angle: 40 },
  { text: 'Achiever', angle: 60 },
  { text: 'Individualist', angle: 80 },
  { text: 'Investigator', angle: 100 },
  { text: 'Loyalist', angle: 120 },
  { text: 'Enthusiast', angle: 140 },
  { text: 'Challenger', angle: 160 }
];

// Style constants
export const styleConstants = {
  defaultFontSize: 60,
  selectedFontSize: 72,
  defaultFontFamily: "'niveau-grotesk', sans-serif",
  defaultFontWeight: 300,
  selectedFontWeight: 400,
  activeColor: '#000',
  inactiveColor: '#e6e6e6',
  styles: {
    st0: { fill: 'none' },
    st1: { fill: 'none', stroke: 'aqua', strokeWidth: '2px', strokeMiterlimit: 10 },
    st2: { 
      fill: 'none', 
      stroke: 'aqua', 
      strokeMiterlimit: 10,
      strokeDasharray: '12 6 12 6 12 6'
    },
    st3: { 
      display: 'none',
      stroke: '#000',
      strokeWidth: '3px',
      strokeMiterlimit: 10,
      fill: 'none'
    },
    st4: { 
      fill: 'none',
      stroke: '#000',
      strokeWidth: '3px',
      strokeMiterlimit: 10
    },
    st5: { fill: '#e6e6e6' },
    st6: { 
      fill: '#fff',
      stroke: '#000',
      strokeWidth: '3px',
      strokeMiterlimit: 10
    },
    st7: {
      fontFamily: "'niveau-grotesk', sans-serif",
      fontSize: '60px',
      fontWeight: 300
    },
    st8: { display: 'none' }
  }
};