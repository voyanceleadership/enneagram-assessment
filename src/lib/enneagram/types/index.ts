/**
 * @file index.ts
 * @description Core type definitions for the Enneagram symbol and its interactive features
 * 
 * This file serves as the central type definition hub for the Enneagram symbol components.
 * It contains all TypeScript types and interfaces used across the symbol-related components
 * and utilities. These types ensure consistency in data structures and provide strong
 * typing for the component's props and state.
 * 
 * Related files:
 * - src/lib/enneagram/constants/index.ts (uses these types for type-safe constants)
 * - src/components/enneagram/symbol/DynamicEnneagramSymbol.tsx (main component using these types)
 * - All sub-components and utilities in the symbol directory
 */

/**
 * Valid Enneagram type numbers (1-9)
 */
export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Available symbol variations that control which elements are highlighted
 */
export type SymbolVariation = 
  | 'all'               // Shows all connections and types
  | 'type-only'         // Shows only the selected type
  | 'related-types'     // Shows types directly connected to the selected type
  | 'left-wing'         // Shows the connection to the type to the left
  | 'right-wing'        // Shows the connection to the type to the right
  | 'both-wings'        // Shows connections to both adjacent types
  | 'both-lines'        // Shows both growth and stress lines
  | 'stress-line'       // Shows only the stress line
  | 'growth-line';      // Shows only the growth line

/**
 * Defines the relationships between Enneagram types
 */
export interface TypeRelationships {
  left: EnneagramType;     // Type to the left (counter-clockwise)
  right: EnneagramType;    // Type to the right (clockwise)
  stress: EnneagramType;   // Type connected via stress line
  growth: EnneagramType;   // Type connected via growth line
  related: EnneagramType[]; // All related types (wings, stress, and growth)
}

/**
 * Props for the main DynamicEnneagramSymbol component
 */
export interface DynamicEnneagramSymbolProps {
  defaultType?: EnneagramType;          // Initially selected type
  defaultVariation?: SymbolVariation;   // Initial variation to display
  interactive?: boolean;                // Whether to show controls
}

/**
 * Props for the controls component
 */
export interface EnneagramControlsProps {
  selectedType: EnneagramType | null;
  setSelectedType: (type: EnneagramType | null) => void;
  variation: SymbolVariation;
  setVariation: (variation: SymbolVariation) => void;
  variations: Array<{ value: string; label: string }>;
}

/**
 * Common props shared by all SVG element components
 */
export interface BaseElementProps {
  selectedType: EnneagramType | null;
  variation: SymbolVariation;
}

/**
 * Props for styled SVG elements
 */
export interface StyledElementProps extends BaseElementProps {
  styleUtils: import('../styles').StyleUtilities;
}

/**
 * SVG point coordinates used in the diagram
 */
export interface EnneagramCoordinates {
  [key: number]: {
    x: number;
    y: number;
  };
}