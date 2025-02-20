/**
 * @file highlight.ts
 * @description Logic for determining which elements should be highlighted
 * 
 * This file contains the core logic for determining the highlight state
 * of various symbol elements (types, connections) based on the current
 * selection and variation.
 * 
 * Related files:
 * - symbolStyles.ts (uses these functions for style calculations)
 * - ../types/index.ts (type definitions)
 * - ../constants/index.ts (relationships data)
 */

import { EnneagramType, SymbolVariation } from '../types';
import { ENNEAGRAM_RELATIONSHIPS } from '../constants';

/**
 * Determines if a type should be highlighted based on the current variation and selection
 */
export const isTypeHighlighted = (
  type: EnneagramType,
  selectedType: EnneagramType | null,
  variation: SymbolVariation
): boolean => {
  if (!selectedType) return true;
  if (variation === 'all') return true;
  if (type === selectedType) return true;
  
  const relationships = ENNEAGRAM_RELATIONSHIPS[selectedType];
  
  switch (variation) {
    case 'type-only':
      return type === selectedType;
    case 'related-types':
      return relationships.related.includes(type);
    case 'left-wing':
      return type === relationships.left;
    case 'right-wing':
      return type === relationships.right;
    case 'both-wings':
      return type === relationships.left || type === relationships.right;
    case 'both-lines':
      return type === relationships.stress || type === relationships.growth;
    case 'stress-line':
      return type === relationships.stress;
    case 'growth-line':
      return type === relationships.growth;
    default:
      return false;
  }
};

/**
 * Determines if a connection between types should be highlighted
 */
export const isConnectionHighlighted = (
  from: EnneagramType,
  to: EnneagramType,
  selectedType: EnneagramType | null,
  variation: SymbolVariation
): boolean => {
  if (!selectedType) return true;
  if (variation === 'all') return true;
  
  const relationships = ENNEAGRAM_RELATIONSHIPS[selectedType];
  
  switch (variation) {
    case 'type-only':
      return false;
    case 'related-types':
      return (selectedType === from && relationships.related.includes(to)) ||
             (selectedType === to && relationships.related.includes(from));
    case 'left-wing':
      return (selectedType === from && to === relationships.left) ||
             (selectedType === to && from === relationships.left);
    case 'right-wing':
      return (selectedType === from && to === relationships.right) ||
             (selectedType === to && from === relationships.right);
    case 'both-wings':
      return (selectedType === from && (to === relationships.left || to === relationships.right)) ||
             (selectedType === to && (from === relationships.left || from === relationships.right));
    case 'both-lines':
      return (selectedType === from && (to === relationships.stress || to === relationships.growth)) ||
             (selectedType === to && (from === relationships.stress || from === relationships.growth));
    case 'stress-line':
      return (selectedType === from && to === relationships.stress) ||
             (selectedType === to && from === relationships.stress);
    case 'growth-line':
      return (selectedType === from && to === relationships.growth) ||
             (selectedType === to && from === relationships.growth);
    default:
      return false;
  }
};