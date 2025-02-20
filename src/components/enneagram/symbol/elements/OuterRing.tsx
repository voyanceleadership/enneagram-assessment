/**
 * @file OuterRing.tsx
 * @description SVG elements for the outer ring of the Enneagram symbol
 * 
 * This component renders the outer ring structure of the Enneagram symbol,
 * including both the base circle and the grey decorative ring. The styling
 * is controlled through the style utilities.
 * 
 * Related files:
 * - DynamicEnneagramSymbol.tsx (parent component)
 * - ../../lib/enneagram/styles/symbolStyles.ts (styling utilities)
 */

import React from 'react';
import { StyledElementProps } from '@/lib/enneagram';

interface OuterRingProps extends StyledElementProps {}

/**
 * Renders the outer ring structure of the Enneagram symbol
 */
export const OuterRing: React.FC<OuterRingProps> = ({ styleUtils }) => {
  return (
    <g id="Outer_Ring">
      {/* Grey decorative ring */}
      <path 
        id="Grey_Ring" 
        style={styleUtils.getGreyRingStyle()}
        d="M1705.77,1024c0,376.84-304.93,681.77-681.77,681.77s-681.77-304.93-681.77-681.77,304.93-681.77,681.77-681.77,681.77,304.93,681.77,681.77ZM1024,185c-463.74,0-839,375.26-839,839s375.26,839,839,839,839-375.26,839-839S1487.74,185,1024,185Z"
      />
      {/* Base circle */}
      <circle 
        style={styleUtils.getOuterRingStyle()}
        cx="1024" 
        cy="1024" 
        r="839"
      />
    </g>
  );
};

export default OuterRing;