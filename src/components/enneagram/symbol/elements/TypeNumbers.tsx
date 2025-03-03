'use client';

/**
 * @file TypeNumbers.tsx
 * @description SVG Text elements for the Enneagram type numbers
 * 
 * This component handles rendering the numbers 1-9 within their respective
 * circles. Numbers are positioned and styled based on the selection state
 * and current variation. Selected numbers are larger and bolder.
 * 
 * Related files:
 * - DynamicEnneagramSymbol.tsx (parent component)
 * - Circles.tsx (renders the circles these numbers appear in)
 * - ../../../lib/enneagram/constants (type coordinates)
 * - ../../../lib/enneagram/styles (styling utilities)
 */

import React from 'react';
import { EnneagramType, StyledElementProps } from '@/lib/enneagram';
import { TYPE_COORDINATES } from '@/lib/enneagram';

interface TypeNumbersProps extends StyledElementProps {}

/**
 * Renders the type numbers (1-9) within their circles
 */
export const TypeNumbers: React.FC<TypeNumbersProps> = ({ selectedType, variation, styleUtils }) => {
  // Array of number positions with their default text positions
  const numberConfigs = [
    { num: 9, defaultPos: "1007.56 430.25" },
    { num: 8, defaultPos: "614.45 573.54" },
    { num: 7, defaultPos: "408.68 936.37" },
    { num: 6, defaultPos: "477.04 1349.05" },
    { num: 5, defaultPos: "799.73 1618.46" },
    { num: 4, defaultPos: "1217.49 1618.46" },
    { num: 3, defaultPos: "1540.57 1349.05" },
    { num: 2, defaultPos: "1613.67 936.37" },
    { num: 1, defaultPos: "1404.27 573.54" }
  ];

  return (
    <g id="Numbers">
      {numberConfigs.map(({ num, defaultPos }) => {
        const coords = TYPE_COORDINATES[num as EnneagramType];
        
        return (
          <text 
            key={num}
            style={styleUtils.getTypeNumberStyle(num)}
            transform={
              // Center in circle when selected, use default position otherwise
              num === selectedType
                ? `translate(${coords.x} ${coords.y})`
                : `translate(${defaultPos})`
            }
            textAnchor={num === selectedType ? "middle" : "start"}
            dominantBaseline={num === selectedType ? "central" : "auto"}
            dy={num === selectedType ? "-0.025em" : "0"}  // Fine-tune vertical centering
          >
            {num}
          </text>
        );
      })}
    </g>
  );
};

export default TypeNumbers;