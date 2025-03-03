'use client';

/**
 * @file DynamicEnneagramSymbol.tsx
 * @description Main component for the interactive Enneagram symbol
 * 
 * This component serves as the orchestrator for the entire Enneagram symbol.
 * It manages state, composes the SVG elements, and handles user interactions.
 * The symbol can be used in either interactive mode (with controls) or
 * static mode (displaying a specific configuration).
 * 
 * FIXED: Added consistent hydration handling
 */

import React, { useState, useEffect, CSSProperties } from 'react';
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
 * CSS to improve SVG quality - with proper TypeScript types
 */
const svgQualityStyles: {
  svg: React.CSSProperties;
  svgWebkit: React.CSSProperties;
} = {
  svg: {
    // Ensure crisp rendering of SVG elements
    shapeRendering: 'geometricPrecision' as 'geometricPrecision',
    textRendering: 'optimizeLegibility' as 'optimizeLegibility',
    transform: 'translateZ(0)',
    // Use properly typed values for browser compatibility
    transformBox: 'fill-box' as 'fill-box',
  },
  svgWebkit: {
    WebkitFontSmoothing: 'antialiased',
    WebkitTransform: 'translateZ(0)',
  }
};

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
  // Add state to track if component is mounted (for hydration fix)
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after initial render to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update state when props change
  useEffect(() => {
    if (isMounted) {
      setSelectedType(defaultType);
    }
  }, [defaultType, isMounted]);

  useEffect(() => {
    if (isMounted) {
      setVariation(defaultVariation);
    }
  }, [defaultVariation, isMounted]);

  // Create style utilities for the current state
  const styleUtils = createStyleUtils(selectedType, variation);

  // Get dynamic variations based on the selected type
  const variations = getDynamicVariations(selectedType);

  // SVG props for crisp line rendering - consistent between server and client
  const svgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    version: "1.1",
    viewBox: "0 0 2048 2048",
    width: "100%",
    height: "100%",
    className: "w-full h-full enneagram-diagram",
    style: { ...svgQualityStyles.svg, ...svgQualityStyles.svgWebkit },
    preserveAspectRatio: "xMidYMid meet",
  };

  // =========================================================================
  // Consistent rendering structure for both server and client
  // =========================================================================
  return (
    <div className="flex flex-col w-full">
      {/* Optional controls for interactive mode - only render on client */}
      {interactive && isMounted && (
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
        <svg {...svgProps}>
          {/* Always render the outer ring for consistency */}
          <circle 
            cx="1024" 
            cy="1024" 
            r="839"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="2"
          />
          
          {/* Only render additional elements on the client */}
          {isMounted && (
            <>
              <OuterRing
                selectedType={selectedType}
                variation={variation}
                styleUtils={styleUtils}
              />
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
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default DynamicEnneagramSymbol;