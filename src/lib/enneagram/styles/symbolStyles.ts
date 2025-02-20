/**
 * @file symbolStyles.ts
 * @description Style definitions and utilities for the Enneagram symbol
 * 
 * This file contains both the base styles for the Enneagram symbol and the utility
 * functions that apply these styles based on the current state (selected type,
 * variation, etc.). It works in conjunction with types.ts to provide a type-safe
 * styling system.
 * 
 * Related files:
 * - types.ts (style-related type definitions)
 * - highlight.ts (highlight state calculations)
 * - ../types/index.ts (core type definitions)
 */

import { EnneagramType, SymbolVariation } from '../types';
import type { StyleUtilities, CircleStyle, TypeNumberStyle, TypeLabelStyle, LineStyle, OuterRingStyle } from './types';
import { isTypeHighlighted, isConnectionHighlighted } from './highlight';

/**
 * Base styles for the Enneagram symbol
 * These values can be customized to change the overall appearance
 */
export const baseStyles = {
  // Typography configuration
  font: {
    family: "'niveau-grotesk', sans-serif",
    default: {
      size: '60px',
      weight: '300',  // Light
      lineHeight: '1'
    },
    selected: {
      size: '72px',
      weight: '400'  // Regular
    }
  },

  // Color palette
  colors: {
    primary: '#000000',    // Default black
    deemphasized: {
      grey: '#e6e6e6',     // For inactive numbers and lines
      white: '#ffffff'      // For inactive type labels
    }
  },

  // Circle configuration
  circle: {
    default: {
      radius: '42.5',
      strokeWidth: '3px',
      fill: '#ffffff',
      stroke: '#000000'
    },
    selected: {
      radius: '50',
      strokeWidth: '5px'
    },
    deemphasized: {
      stroke: '#e6e6e6'
    }
  },

  // Connection line configuration
  connectionLine: {
    default: {
      fill: 'none',
      stroke: '#000000',
      strokeWidth: '3px',
      strokeMiterlimit: 10
    },
    deemphasized: {
      stroke: '#e6e6e6'
    }
  },

  // Outer ring configuration
  outerRing: {
    base: {
      stroke: 'none',
      strokeWidth: '0',
      strokeMiterlimit: 10,
      fill: 'none'
    },
    grey: {
      stroke: 'none',
      strokeWidth: '0',
      strokeMiterlimit: 10,
      fill: '#e6e6e6'
    }
  },

  // Animation configuration
  transition: {
    default: 'fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease, font-size 0.3s ease, font-weight 0.3s ease, transform 0.3s ease'
  }
};

/**
 * Creates style utility functions based on the current state
 */
export const createStyleUtils = (
  selectedType: EnneagramType | null,
  variation: SymbolVariation
): StyleUtilities => ({
  getCircleStyle: (typeNumber: number): CircleStyle => ({
    fill: baseStyles.circle.default.fill,
    stroke: isTypeHighlighted(typeNumber as EnneagramType, selectedType, variation)
      ? baseStyles.circle.default.stroke
      : baseStyles.circle.deemphasized.stroke,
    strokeWidth: typeNumber === selectedType
      ? baseStyles.circle.selected.strokeWidth
      : baseStyles.circle.default.strokeWidth,
    strokeMiterlimit: 10,
    r: typeNumber === selectedType
      ? baseStyles.circle.selected.radius
      : baseStyles.circle.default.radius,
    transition: baseStyles.transition.default
  }),

  getTypeNumberStyle: (typeNumber: number): TypeNumberStyle => ({
    fontFamily: baseStyles.font.family,
    fontSize: typeNumber === selectedType
      ? baseStyles.font.selected.size
      : baseStyles.font.default.size,
    fontWeight: typeNumber === selectedType
      ? baseStyles.font.selected.weight
      : baseStyles.font.default.weight,
    fill: isTypeHighlighted(typeNumber as EnneagramType, selectedType, variation)
      ? baseStyles.colors.primary
      : baseStyles.colors.deemphasized.grey,
    transition: baseStyles.transition.default
  }),

  getTypeLabelStyle: (typeNumber: number): TypeLabelStyle => ({
    fontFamily: baseStyles.font.family,
    fontSize: typeNumber === selectedType
      ? baseStyles.font.selected.size
      : baseStyles.font.default.size,
    fontWeight: typeNumber === selectedType
      ? baseStyles.font.selected.weight
      : baseStyles.font.default.weight,
    fill: isTypeHighlighted(typeNumber as EnneagramType, selectedType, variation)
      ? baseStyles.colors.primary
      : baseStyles.colors.deemphasized.white,
    transition: baseStyles.transition.default
  }),

  getLineStyle: (from: EnneagramType, to: EnneagramType): LineStyle => ({
    ...baseStyles.connectionLine.default,
    stroke: isConnectionHighlighted(from, to, selectedType, variation)
      ? baseStyles.connectionLine.default.stroke
      : baseStyles.connectionLine.deemphasized.stroke
  }),

  getOuterRingStyle: (): OuterRingStyle => ({
    ...baseStyles.outerRing.base
  }),

  getGreyRingStyle: (): OuterRingStyle => ({
    ...baseStyles.outerRing.grey
  })
});