'use client';

/**
 * @file OuterRing.tsx
 * @description SVG elements for the outer ring of the Enneagram symbol
 * 
 * Enhanced version with improved rendering for crisp, clear SVG display.
 */

import React from 'react';
import { StyledElementProps } from '@/lib/enneagram';

// Extended props interface with crisp rendering options
interface OuterRingProps extends StyledElementProps {
  crisp?: boolean;
  pixelPerfect?: boolean;
}

/**
 * Renders the outer ring structure of the Enneagram symbol with optimal quality
 */
export const OuterRing: React.FC<OuterRingProps> = ({ 
  styleUtils,
  crisp = false,
  pixelPerfect = false 
}) => {
  // Base SVG attributes for ring elements
  const ringAttributes = crisp ? {
    shapeRendering: pixelPerfect ? "crispEdges" : "geometricPrecision",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke"
  } : {};

  // Enhanced style with optimizations for ring elements
  const getEnhancedStyle = (baseStyle: React.CSSProperties): React.CSSProperties => {
    if (!crisp) return baseStyle;
    
    return {
      ...baseStyle,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      vectorEffect: 'non-scaling-stroke',
      shapeRendering: pixelPerfect ? 'crispEdges' : 'geometricPrecision',
    };
  };

  return (
    <g id="Outer_Ring" {...ringAttributes}>
      {/* Grey decorative ring - enhanced for quality */}
      <path 
        id="Grey_Ring" 
        style={getEnhancedStyle(styleUtils.getGreyRingStyle())}
        d="M1705.77,1024c0,376.84-304.93,681.77-681.77,681.77s-681.77-304.93-681.77-681.77,304.93-681.77,681.77-681.77,681.77,304.93,681.77,681.77ZM1024,185c-463.74,0-839,375.26-839,839s375.26,839,839,839,839-375.26,839-839S1487.74,185,1024,185Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        shapeRendering={pixelPerfect ? "crispEdges" : "geometricPrecision"}
      />
      {/* Base circle - enhanced for quality */}
      <circle 
        style={getEnhancedStyle(styleUtils.getOuterRingStyle())}
        cx="1024" 
        cy="1024" 
        r="839"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        shapeRendering="geometricPrecision"
      />
    </g>
  );
};

export default OuterRing;