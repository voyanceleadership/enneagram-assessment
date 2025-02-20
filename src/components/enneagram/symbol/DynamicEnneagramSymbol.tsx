/**
 * @file DynamicEnneagramSymbol.tsx
 * @description Main component for the interactive Enneagram symbol
 * 
 * This component serves as the orchestrator for the entire Enneagram symbol.
 * It manages state, composes the SVG elements, and handles user interactions.
 * The symbol can be used in either interactive mode (with controls) or
 * static mode (displaying a specific configuration).
 * 
 * Component hierarchy:
 * - DynamicEnneagramSymbol
 *   ├── EnneagramControls (optional)
 *   └── SVG
 *       ├── OuterRing
 *       ├── TypeNames
 *       ├── Connections
 *       ├── Arrowheads
 *       ├── Circles
 *       └── TypeNumbers
 * 
 * Related files:
 * - elements/* (SVG element components)
 * - EnneagramControls.tsx (control panel)
 * - ../../../lib/enneagram/* (types, utilities, styles)
 */

import React, { useState, useEffect } from 'react';
import { 
  DynamicEnneagramSymbolProps, 
  EnneagramType, 
  SymbolVariation 
} from '@/lib/enneagram';
import { createStyleUtils } from '@/lib/enneagram';
import { getDynamicVariations } from '@/lib/enneagram';
import { 
  TypeNames, 
  Circles, 
  Connections, 
  Arrowheads, 
  TypeNumbers,
  OuterRing 
} from './elements';
import EnneagramControls from './EnneagramControls';

/**
 * Interactive Enneagram symbol component
 */
export const DynamicEnneagramSymbol: React.FC<DynamicEnneagramSymbolProps> = ({
  defaultType = null,
  defaultVariation = 'all',
  interactive = true
}) => {
  // State for the selected type and variation
  const [selectedType, setSelectedType] = useState<EnneagramType | null>(defaultType);
  const [variation, setVariation] = useState<SymbolVariation>(defaultVariation);

  // Update state when props change
  useEffect(() => {
    setSelectedType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    setVariation(defaultVariation);
  }, [defaultVariation]);

  // Create style utilities for the current state
  const styleUtils = createStyleUtils(selectedType, variation);

  // Get dynamic variations based on the selected type
  const variations = getDynamicVariations(selectedType);

  return (
    <div className="flex flex-col w-full">
      {/* Optional controls for interactive mode */}
      {interactive && (
        <EnneagramControls
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          variation={variation}
          setVariation={setVariation}
          variations={variations}
        />
      )}

      {/* SVG container with fixed aspect ratio */}
      <div className="w-full aspect-square">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink" 
          version="1.1" 
          viewBox="0 0 2048 2048"
          className="w-full h-full enneagram-diagram"
        >
          {/* Outer ring must be first for proper layering */}
          <OuterRing
            selectedType={selectedType}
            variation={variation}
            styleUtils={styleUtils}
          />
          
          {/* SVG element components */}
          <TypeNames
            selectedType={selectedType}
            variation={variation}
            styleUtils={styleUtils}
          />
          <Connections
            selectedType={selectedType}
            variation={variation}
            styleUtils={styleUtils}
          />
          <Arrowheads
            selectedType={selectedType}
            variation={variation}
            styleUtils={styleUtils}
          />
          <Circles
            selectedType={selectedType}
            variation={variation}
            styleUtils={styleUtils}
          />
          <TypeNumbers
            selectedType={selectedType}
            variation={variation}
            styleUtils={styleUtils}
          />
        </svg>
      </div>
    </div>
  );
};

export default DynamicEnneagramSymbol;