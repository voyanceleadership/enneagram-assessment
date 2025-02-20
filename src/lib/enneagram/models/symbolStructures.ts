// src/lib/enneagram/models/index.ts

// This file defines the core structures and rules for the Enneagram symbol system.
// It contains TypeScript types and interfaces that ensure data consistency throughout
// the application. These models define what types are valid (e.g., numbers 1-9),
// how types can relate to each other (e.g., wings, stress/growth points), and
// what properties our components expect to receive. This acts as a central source
// of truth for data structures in the Enneagram visualization system.

// Defines valid Enneagram type numbers (1-9)
// This ensures that whenever we refer to an Enneagram type in our code,
// it can only be one of these nine numbers - nothing else is allowed
export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Defines all possible ways the symbol can be displayed
// Used to control what parts of the symbol are highlighted
// This ensures we only use valid display modes throughout the application
export type SymbolVariation = 
  | 'all'              // Show everything
  | 'type-only'        // Show just the selected type
  | 'related-types'    // Show types connected to the selected type
  | 'left-wing'        // Show left wing connection
  | 'right-wing'       // Show right wing connection
  | 'both-wings'       // Show both wing connections
  | 'both-lines'       // Show both stress and growth lines
  | 'stress-line'      // Show just stress line
  | 'growth-line';     // Show just growth line

// Defines how each type relates to other types
// This structure ensures all relationship data includes the required connections
export interface TypeRelationships {
  left: EnneagramType;    // Left wing neighbor
  right: EnneagramType;   // Right wing neighbor
  stress: EnneagramType;  // Stress/Disintegration point
  growth: EnneagramType;  // Growth/Integration point
  related: EnneagramType[]; // All related types (wings, stress, growth)
}

// Defines the required and optional properties for the Enneagram symbol component
// This ensures the component receives the correct props when it's used
export interface EnneagramSymbolProps {
  defaultType?: EnneagramType;      // Starting type (optional)
  defaultVariation?: SymbolVariation; // Starting display mode (optional)
  interactive?: boolean;            // Whether controls should be shown (optional)
}

// Defines the required properties for the symbol's control panel
// This ensures the controls component receives all necessary functions and data
export interface SymbolControlsProps {
  selectedType: EnneagramType | null;  // Currently selected type
  setSelectedType: (type: EnneagramType | null) => void;  // Function to change selected type
  variation: SymbolVariation;          // Current display mode
  setVariation: (variation: SymbolVariation) => void;     // Function to change display mode
  variations: Array<{ value: string; label: string }>;    // Available display options
}