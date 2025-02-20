/**
 * @file types.ts
 * @description Type definitions for Enneagram symbol styles
 * 
 * Contains all TypeScript interfaces and types related to styling of the
 * Enneagram symbol. These types work in conjunction with symbolStyles.ts
 * to provide type safety for all styling operations.
 */

import { EnneagramType } from '../types';

/**
 * Base font metrics
 */
export interface FontMetrics {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight?: string;
}

/**
 * Style properties with transitions
 */
export interface TransitionStyles {
  transition: string;
}

/**
 * SVG shape properties
 */
export interface ShapeStyles {
  fill: string;
  stroke: string;
  strokeWidth: string;
  strokeMiterlimit: number;
}

/**
 * Style properties for type number circles
 */
export interface CircleStyle extends ShapeStyles, TransitionStyles {
  r: string;
}

/**
 * Style properties for type numbers and labels
 */
export interface TextStyle extends Pick<FontMetrics, 'fontFamily' | 'fontSize' | 'fontWeight'>, TransitionStyles {
  fill: string;
}

/**
 * Style properties for the outer ring
 */
export interface OuterRingStyle extends ShapeStyles {
  // No additional properties needed beyond ShapeStyles
}

/**
 * Style utility functions used across SVG elements
 */
export interface StyleUtilities {
  getCircleStyle: (typeNumber: number) => CircleStyle;
  getTypeNumberStyle: (typeNumber: number) => TypeNumberStyle;
  getTypeLabelStyle: (typeNumber: number) => TypeLabelStyle;
  getLineStyle: (from: EnneagramType, to: EnneagramType) => LineStyle;
  getOuterRingStyle: () => OuterRingStyle;
  getGreyRingStyle: () => OuterRingStyle;
}

// Convenience type aliases for specific use cases
export type TypeNumberStyle = TextStyle;
export type TypeLabelStyle = TextStyle;
export type LineStyle = ShapeStyles;