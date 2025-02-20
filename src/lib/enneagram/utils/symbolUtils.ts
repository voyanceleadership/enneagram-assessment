/**
 * @file symbolUtils.ts
 * @description Utility functions for the Enneagram symbol
 * 
 * This file contains helper functions that handle the logic for:
 * - Computing special states (e.g., wing swapping)
 * - Arrow visibility
 * - Generating dynamic variations
 * 
 * Related files:
 * - ../types/index.ts (core type definitions)
 * - ../constants/index.ts (symbol data and base variations)
 * - ../styles/highlight.ts (highlight state calculations)
 */

import { EnneagramType, SymbolVariation } from '../types';
import { ENNEAGRAM_RELATIONSHIPS, BASE_VARIATIONS } from '../constants';

/**
 * Determines if an arrowhead should be shown for a connection
 */
export const shouldShowArrowhead = (
  from: EnneagramType,
  to: EnneagramType,
  type: 'stress' | 'growth',
  selectedType: EnneagramType | null,
  variation: SymbolVariation
): boolean => {
  if (!selectedType) return false;
  const relationships = ENNEAGRAM_RELATIONSHIPS[selectedType];
  
  // Only show arrowheads when originating from the selected type
  if (selectedType !== from) return false;

  switch (variation) {
    case 'related-types':
    case 'both-lines':
      return type === 'stress' ? to === relationships.stress : to === relationships.growth;
    case 'stress-line':
      return type === 'stress' && to === relationships.stress;
    case 'growth-line':
      return type === 'growth' && to === relationships.growth;
    default:
      return false;
  }
};

/**
 * Determines if wings should be swapped for a given type
 * Types 3, 4, 5, and 6 have their wings swapped in the visual layout
 */
export const shouldSwapWings = (type: EnneagramType | null): boolean => {
  return type ? [3, 4, 5, 6].includes(type) : false;
};

/**
 * Gets the correct wing label based on type and position
 */
export const getWingLabel = (
  type: EnneagramType | null,
  isLeftWing: boolean
): string => {
  if (!type) return isLeftWing ? 'Left Wing' : 'Right Wing';
  return shouldSwapWings(type)
    ? isLeftWing ? 'Right Wing' : 'Left Wing'
    : isLeftWing ? 'Left Wing' : 'Right Wing';
};

/**
 * Gets dynamic variations array that updates based on selected type
 * Uses BASE_VARIATIONS as the source and updates wing labels based on context
 */
export const getDynamicVariations = (selectedType: EnneagramType | null) => 
  BASE_VARIATIONS.map(variation => {
    switch (variation.value) {
      case 'left-wing':
        return { ...variation, label: getWingLabel(selectedType, true) };
      case 'right-wing':
        return { ...variation, label: getWingLabel(selectedType, false) };
      default:
        return variation;
    }
  });