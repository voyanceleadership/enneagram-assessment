'use client';

/**
 * @file Circles.tsx
 * @description SVG Circle elements for the Enneagram type points
 * 
 * This component renders the circular nodes that represent each Enneagram type.
 * Circles are positioned according to the symbol geometry and styled based on
 * the current selection state and variation.
 * 
 * Related files:
 * - DynamicEnneagramSymbol.tsx (parent component)
 * - ../../../lib/enneagram/constants (type coordinates)
 * - ../../../lib/enneagram/styles (styling utilities)
 */

import React from 'react';
import { EnneagramType, StyledElementProps } from '@/lib/enneagram';
import { TYPE_COORDINATES } from '@/lib/enneagram';

interface CirclesProps extends StyledElementProps {}

/**
 * Renders the circular nodes for each Enneagram type
 */
export const Circles: React.FC<CirclesProps> = ({ selectedType, variation, styleUtils }) => {
  // Array of type numbers for rendering circles
  const typeNumbers: EnneagramType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <g id="Circles">
      {typeNumbers.map(typeNumber => {
        const coords = TYPE_COORDINATES[typeNumber];
        return (
          <circle
            key={typeNumber}
            style={styleUtils.getCircleStyle(typeNumber)}
            cx={coords.x}
            cy={coords.y}
            // r is set in the style object since it changes based on selection
          />
        );
      })}
    </g>
  );
};

export default Circles;