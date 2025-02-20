// src/components/enneagram/symbol/symbolBehavior.ts

/**
 * This file contains utility functions for the Enneagram symbol's behavior.
 * It handles highlighting logic, connection visibility, and other symbol-specific
 * operations that aren't related to styling.
 * 
 * Key responsibilities:
 * - Determine type highlighting states
 * - Manage connection visibility
 * - Handle wing relationships
 * - Manage symbol variations
 * - Calculate geometry-based behaviors
 */

import { EnneagramType, SymbolVariation } from '@/lib/enneagram/models/symbolStructures';
import { SYMBOL_GEOMETRY } from '@/lib/enneagram/data/constants/geometry';
import { ENNEAGRAM_RELATIONSHIPS } from '@/lib/enneagram/data/constants/relationships';

interface LineConnection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Variations for symbol display
 * These define how the symbol can be displayed/highlighted
 */
export const SYMBOL_VARIATIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'type-only', label: 'Core Type Only' },
  { value: 'related-types', label: 'All Related Types' },
  { value: 'both-wings', label: 'Both Wings' },
  { value: 'left-wing', label: 'Left Wing' },
  { value: 'right-wing', label: 'Right Wing' },
  { value: 'both-lines', label: 'Both Lines' },
  { value: 'stress-line', label: 'Stress Line' },
  { value: 'growth-line', label: 'Growth Line' }
] as const;

/**
 * Wing-related utility functions
 */

export function shouldSwapWings(type: EnneagramType | null): boolean {
  return type ? [3, 4, 5, 6].includes(type) : false;
}

export function getWingLabel(
  isLeftWing: boolean,
  selectedType: EnneagramType | null
): string {
  if (!selectedType) {
    return isLeftWing ? 'Left Wing' : 'Right Wing';
  }
  return shouldSwapWings(selectedType)
    ? isLeftWing ? 'Right Wing' : 'Left Wing'
    : isLeftWing ? 'Left Wing' : 'Right Wing';
}

/**
 * Type highlighting functions
 */

export function isTypeHighlighted(
  type: EnneagramType,
  selectedType: EnneagramType | null,
  variation: SymbolVariation
): boolean {
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
}

/**
 * Connection highlighting functions
 */

export function isConnectionHighlighted(
  from: EnneagramType,
  to: EnneagramType,
  selectedType: EnneagramType | null,
  variation: SymbolVariation
): boolean {
  if (!selectedType) return true;
  if (variation === 'all') return true;
  if (variation === 'type-only') return false;
  
  const relationships = ENNEAGRAM_RELATIONSHIPS[selectedType];
  
  // Check if either type is the selected type
  const isFromSelected = selectedType === from;
  const isToSelected = selectedType === to;
  
  if (!isFromSelected && !isToSelected) return false;

  switch (variation) {
    case 'related-types':
      return relationships.related.includes(isFromSelected ? to : from);
    case 'left-wing':
      return isFromSelected ? to === relationships.left : from === relationships.left;
    case 'right-wing':
      return isFromSelected ? to === relationships.right : from === relationships.right;
    case 'both-wings':
      const otherType = isFromSelected ? to : from;
      return otherType === relationships.left || otherType === relationships.right;
    case 'both-lines':
      const target = isFromSelected ? to : from;
      return target === relationships.stress || target === relationships.growth;
    case 'stress-line':
      return isFromSelected ? to === relationships.stress : from === relationships.stress;
    case 'growth-line':
      return isFromSelected ? to === relationships.growth : from === relationships.growth;
    default:
      return false;
  }
}

export function shouldShowArrowhead(
  from: EnneagramType,
  to: EnneagramType,
  type: 'stress' | 'growth',
  selectedType: EnneagramType | null,
  variation: SymbolVariation
): boolean {
  if (!selectedType) return false;
  if (selectedType !== from) return false;

  const relationships = ENNEAGRAM_RELATIONSHIPS[selectedType];
  
  switch (variation) {
    case 'related-types':
    case 'both-lines':
      return type === 'stress' 
        ? to === relationships.stress 
        : to === relationships.growth;
    case 'stress-line':
      return type === 'stress' && to === relationships.stress;
    case 'growth-line':
      return type === 'growth' && to === relationships.growth;
    default:
      return false;
  }
}

/**
 * Geometry utility functions
 */

// Get the line path between two types
export function getLinePath(from: EnneagramType, to: EnneagramType): string {
  const [lower, higher] = [from, to].sort((a, b) => a - b);
  const key = `${lower}-${higher}` as keyof typeof SYMBOL_GEOMETRY['lineConnections'];
  const connection = SYMBOL_GEOMETRY.lineConnections[key];
  if (!connection) return '';
  return `M${connection.x1},${connection.y1} L${connection.x2},${connection.y2}`;
}

export function getTypeNumberPosition(
  type: EnneagramType,
  isSelected: boolean
): { x: number; y: number } {
  if (isSelected) {
    return SYMBOL_GEOMETRY.typePositions[type];
  }
  return SYMBOL_GEOMETRY.numberPositions[type];
}

export function getTypeNameAngle(
  type: EnneagramType,
  isSelected: boolean
): number {
  const baseAngle = SYMBOL_GEOMETRY.typeNames.angles[type];
  if (type === 9 && isSelected) {
    return SYMBOL_GEOMETRY.typeNames.peaceLabel.selectedAngle;
  }
  return baseAngle;
}

export function needsTextFlip(angle: number): boolean {
  const { start, end } = SYMBOL_GEOMETRY.typeNames.flipRange;
  return angle >= start && angle <= end;
}