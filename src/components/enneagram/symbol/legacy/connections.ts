// File: src/components/enneagram/symbol/connections.ts

import { EnneagramType } from './typeRelationships';

export interface Connection {
  from: EnneagramType;
  to: EnneagramType;
}

export interface ArcConnection extends Connection {
  path: string;
}

export interface LineConnection extends Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const connections = {
  arcs: [
    { from: 9, to: 8, path: "M1024,411.5c-149.92,0-287.25,53.86-393.71,143.29" },
    { from: 8, to: 7, path: "M630.28,554.79c-108,90.71-184.22,218.02-209.58,362.84" },
    { from: 7, to: 6, path: "M420.7,917.62c-6.05,34.55-9.2,70.09-9.2,106.38,0,111.58,29.84,216.2,81.97,306.3" },
    { from: 6, to: 5, path: "M493.47,1330.3c71.52,123.62,185.01,219.92,320.98,269.42" },
    { from: 5, to: 4, path: "M814.46,1599.72c65.37,23.8,135.94,36.78,209.54,36.78s144.17-12.98,209.54-36.78" },
    { from: 4, to: 3, path: "M1233.54,1599.72c135.97-49.5,249.46-145.8,320.98-269.42" },
    { from: 3, to: 2, path: "M1554.53,1330.3c52.13-90.1,81.97-194.72,81.97-306.3,0-36.28-3.15-71.83-9.2-106.38" },
    { from: 2, to: 1, path: "M1627.3,917.62c-25.36-144.81-101.58-272.12-209.58-362.84" },
    { from: 1, to: 9, path: "M1417.72,554.79c-106.46-89.43-243.8-143.29-393.72-143.29" }
  ] as ArcConnection[],
  lines: [
    { from: 1, to: 7, x1: 420.5, y1: 917.5, x2: 1417.5, y2: 554.5 },
    { from: 8, to: 5, x1: 814.5, y1: 1599.5, x2: 420.5, y2: 917.5 },
    { from: 8, to: 2, x1: 630.5, y1: 554.5, x2: 814.5, y2: 1599.5 },
    { from: 2, to: 4, x1: 1627.5, y1: 917.5, x2: 630.5, y2: 554.5 },
    { from: 4, to: 1, x1: 1233.5, y1: 1599.5, x2: 1627.5, y2: 917.5 },
    { from: 9, to: 3, x1: 1023.5, y1: 411.5, x2: 1554.5, y2: 1330.5 },
    { from: 3, to: 6, x1: 493.5, y1: 1330.5, x2: 1554.5, y2: 1330.5 },
    { from: 9, to: 6, x1: 1023.5, y1: 411.5, x2: 493.5, y2: 1330.5 }
  ] as LineConnection[]
};