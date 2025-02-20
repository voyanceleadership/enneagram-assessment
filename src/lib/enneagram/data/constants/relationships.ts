/**
 * relationships.ts
 * 
 * This file defines the core relationships and display variations for the Enneagram symbol system.
 * It provides type-safe definitions for:
 * 1. Enneagram type numbers (1-9)
 * 2. Relationships between types (wings, stress/growth points)
 * 3. Display variations for the interactive symbol
 * 
 * Key Responsibilities:
 * 1. Defining type-safe Enneagram type numbers
 * 2. Defining relationship structures between types
 * 3. Providing display variation options for the interactive symbol
 * 4. Ensuring type safety across the symbol system
 * 
 * Used By:
 * - EnneagramSymbolRenderer: For determining connections between types
 * - EnneagramSymbolControls: For variation selection options
 * - DynamicEnneagramSymbol: For type validation
 */

/** Valid Enneagram type numbers (1-9) */
export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Defines the relationships between Enneagram types
 * This includes wings, stress/growth points, and related types
 */
export interface TypeRelationships {
  /** Left wing neighbor (visually left on the symbol) */
  left: EnneagramType;
  /** Right wing neighbor (visually right on the symbol) */
  right: EnneagramType;
  /** Stress/disintegration point */
  stress: EnneagramType;
  /** Growth/integration point */
  growth: EnneagramType;
  /** All types directly connected to this type */
  related: EnneagramType[];
}

/**
 * Complete relationship mapping for all Enneagram types
 * Note: Wing directions are set for visual correctness in the symbol
 */
export const ENNEAGRAM_RELATIONSHIPS: Record<EnneagramType, TypeRelationships> = {
  1: { left: 9, right: 2, stress: 4, growth: 7, related: [9, 2, 4, 7] },
  2: { left: 1, right: 3, stress: 8, growth: 4, related: [1, 3, 8, 4] },
  3: { left: 4, right: 2, stress: 9, growth: 6, related: [2, 4, 9, 6] }, // Wings swapped
  4: { left: 5, right: 3, stress: 2, growth: 1, related: [3, 5, 2, 1] }, // Wings swapped
  5: { left: 6, right: 4, stress: 7, growth: 8, related: [4, 6, 7, 8] }, // Wings swapped
  6: { left: 7, right: 5, stress: 3, growth: 9, related: [5, 7, 3, 9] }, // Wings swapped
  7: { left: 6, right: 8, stress: 1, growth: 5, related: [6, 8, 1, 5] },
  8: { left: 7, right: 9, stress: 5, growth: 2, related: [7, 9, 5, 2] },
  9: { left: 8, right: 1, stress: 6, growth: 3, related: [8, 1, 6, 3] }
} as const;

/**
 * All possible symbol display variations
 * Used to control what parts of the symbol are highlighted
 */
export type SymbolVariation = 
  | 'all'           // Show all types and connections
  | 'type-only'     // Show just the selected type
  | 'related-types' // Show types connected to the selected type
  | 'left-wing'     // Show left wing connection
  | 'right-wing'    // Show right wing connection
  | 'both-wings'    // Show both wing connections
  | 'both-lines'    // Show both stress and growth lines
  | 'stress-line'   // Show just stress line
  | 'growth-line';  // Show just growth line

/**
 * Interface for variation options used in the controls
 * Provides type safety for the variation selector
 */
export interface SymbolVariationOption {
  /** The variation identifier */
  value: SymbolVariation;
  /** Display label for the variation */
  label: string;
}

/**
 * Available display variations for the interactive symbol
 * Used to populate the variation selector dropdown
 */
export const SYMBOL_VARIATIONS: readonly SymbolVariationOption[] = [
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