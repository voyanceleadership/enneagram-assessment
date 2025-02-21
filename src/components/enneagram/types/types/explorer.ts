// src/components/enneagram/types/types/explorer.ts

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
  
  export type SymbolVariation = 
    | 'related-types' 
    | 'both-wings' 
    | 'left-wing' 
    | 'right-wing' 
    | 'both-lines' 
    | 'stress-line' 
    | 'growth-line';