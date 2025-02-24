// src/components/enneagram/types/sections/RelatedTypes/explorer.ts

/**
 * Types related to the Enneagram symbol explorer functionality
 */

/**
 * Content for the explorer panel that appears when exploring the symbol
 */
export interface ExplorerContent {
  title: string;
  mainDescription: string;
  typeSpecificContent?: {
    description: string;
    details?: {
      personality?: string;
      strengths?: string[];
      challenges?: string[];
      dynamics?: {
        healthy: string;
        average: string;
        unhealthy: string;
      }
    }
  }
}

/**
 * Valid variation options for the Enneagram symbol display
 */
export type SymbolVariation = 
  | 'type-only'      // Just the core type highlighted
  | 'related-types'  // All connected types highlighted
  | 'both-wings'     // Both wing types highlighted
  | 'left-wing'      // Left wing type highlighted 
  | 'right-wing'     // Right wing type highlighted
  | 'both-lines'     // Both line connections highlighted
  | 'stress-line'    // Stress line highlighted
  | 'growth-line';   // Growth line highlighted