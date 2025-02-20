// symbolStyles.ts

import React from 'react';
import { EnneagramType } from '@/lib/enneagram/models/symbolStructures';

// SVG-specific style types
interface SVGCircleStyle extends React.CSSProperties {
  r?: string;
  cx?: string;
  cy?: string;
  strokeMiterlimit?: number;
}

interface SVGTextStyle extends React.CSSProperties {
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?: 'auto' | 'middle' | 'central';
}

interface SVGPathStyle extends React.CSSProperties {
  strokeMiterlimit?: number;
  fill?: string;
  stroke?: string;
}

// Base style definitions
export const SYMBOL_STYLES = {
  // Typography
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

  // Colors
  colors: {
    primary: '#000000',    // Default black
    deemphasized: {
      grey: '#e6e6e6',     // For inactive numbers and lines
      white: '#ffffff'      // For inactive type labels
    }
  },

  // Circles
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

  // Connection Lines
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

  // Outer Ring
  outerRing: {
    base: {
      display: 'block', // Changed from 'none' to 'block'
      stroke: '#000000',
      strokeWidth: '3px',
      strokeMiterlimit: 10,
      fill: 'none'
    },
    grey: {
      fill: '#e6e6e6'
    }
  },

  // Transitions
  transition: {
    default: 'fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease, font-size 0.3s ease, font-weight 0.3s ease'
  }
} as const;

export function getCircleStyle(
  typeNumber: number,
  selectedType: EnneagramType | null,
  isHighlighted: boolean
): SVGCircleStyle {
  return {
    fill: SYMBOL_STYLES.circle.default.fill,
    stroke: isHighlighted 
      ? SYMBOL_STYLES.circle.default.stroke 
      : SYMBOL_STYLES.circle.deemphasized.stroke,
    strokeWidth: typeNumber === selectedType 
      ? SYMBOL_STYLES.circle.selected.strokeWidth 
      : SYMBOL_STYLES.circle.default.strokeWidth,
    strokeMiterlimit: 10,
    r: typeNumber === selectedType 
      ? SYMBOL_STYLES.circle.selected.radius 
      : SYMBOL_STYLES.circle.default.radius,
    transition: SYMBOL_STYLES.transition.default
  };
}

export function getTypeNumberStyle(
  typeNumber: number,
  selectedType: EnneagramType | null,
  isHighlighted: boolean
): SVGTextStyle {
  return {
    fontFamily: SYMBOL_STYLES.font.family,
    fontSize: typeNumber === selectedType 
      ? SYMBOL_STYLES.font.selected.size 
      : SYMBOL_STYLES.font.default.size,
    fontWeight: typeNumber === selectedType 
      ? SYMBOL_STYLES.font.selected.weight 
      : SYMBOL_STYLES.font.default.weight,
    fill: isHighlighted 
      ? SYMBOL_STYLES.colors.primary 
      : SYMBOL_STYLES.colors.deemphasized.grey,
    transition: SYMBOL_STYLES.transition.default
  };
}

export function getTypeLabelStyle(
  typeNumber: number,
  selectedType: EnneagramType | null,
  isHighlighted: boolean
): SVGTextStyle {
  return {
    fontFamily: SYMBOL_STYLES.font.family,
    fontSize: typeNumber === selectedType 
      ? SYMBOL_STYLES.font.selected.size 
      : SYMBOL_STYLES.font.default.size,
    fontWeight: typeNumber === selectedType 
      ? SYMBOL_STYLES.font.selected.weight 
      : SYMBOL_STYLES.font.default.weight,
    fill: isHighlighted 
      ? SYMBOL_STYLES.colors.primary 
      : SYMBOL_STYLES.colors.deemphasized.white,
    transition: SYMBOL_STYLES.transition.default
  };
}

export function getLineStyle(
  isHighlighted: boolean
): SVGPathStyle {
  return {
    ...SYMBOL_STYLES.connectionLine.default,
    stroke: isHighlighted 
      ? SYMBOL_STYLES.connectionLine.default.stroke 
      : SYMBOL_STYLES.connectionLine.deemphasized.stroke
  };
}

export function getArrowheadStyle(): SVGPathStyle {
  return {
    fill: SYMBOL_STYLES.colors.primary,
    transition: SYMBOL_STYLES.transition.default
  };
}

export function getOuterRingStyle(): SVGPathStyle {
  return {
    ...SYMBOL_STYLES.outerRing.base,
    ...SYMBOL_STYLES.outerRing.grey
  };
}