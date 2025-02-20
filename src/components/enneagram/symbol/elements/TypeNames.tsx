/**
 * @file TypeNames.tsx
 * @description SVG Text elements for rendering the Enneagram type names
 * 
 * This component handles the rendering of type names around the Enneagram symbol.
 * It places names in a circular arrangement, handling text rotation and positioning
 * to ensure readability. Names are styled based on the current selection state
 * and variation.
 * 
 * Related files:
 * - DynamicEnneagramSymbol.tsx (parent component)
 * - ../../../lib/enneagram/constants (type names and coordinates)
 * - ../../../lib/enneagram/styles (styling utilities)
 */

import React from 'react';
import { EnneagramType, StyledElementProps } from '@/lib/enneagram';
import { TYPE_NAMES } from '@/lib/enneagram';

interface TypeNamesProps extends StyledElementProps {}

/**
 * Renders type names in a circular arrangement around the Enneagram symbol
 */
export const TypeNames: React.FC<TypeNamesProps> = ({ selectedType, variation, styleUtils }) => {
  /**
   * Array of type name configurations with their rotation angles
   * Angles are positioned to create an evenly-distributed circular arrangement
   */
  const typeConfigs = [
    { text: 'Peacemaker', angle: 0, type: 9 },
    { text: 'Reformer', angle: 20, type: 1 },
    { text: 'Helper', angle: 40, type: 2 },
    { text: 'Achiever', angle: 60, type: 3 },
    { text: 'Individualist', angle: 80, type: 4 },
    { text: 'Investigator', angle: 100, type: 5 },
    { text: 'Loyalist', angle: 120, type: 6 },
    { text: 'Enthusiast', angle: 140, type: 7 },
    { text: 'Challenger', angle: 160, type: 8 },
    // Special case for type 9's "Peace" text
    { text: 'Peace', angle: selectedType === 9 ? 176.4 : 177, type: 9 }
  ];

  return (
    <g id="Type_Names">
      {/* Define the circular path that text will follow */}
      <defs>
        <path 
          id="textCirclePath" 
          d="M 1024,263.5 A 760.5,760.5 0 1 1 1023.9,263.5 A 760.5,760.5 0 1 1 1024,263.5"
        />
      </defs>

      {/* Render each type name along the circular path */}
      {typeConfigs.map(({ text, angle, type }) => {
        // Determine if text needs to be flipped based on its position
        const needsFlip = angle >= 60 && angle <= 120;
        
        return (
          <text key={text}>
            <textPath 
              xlinkHref="#textCirclePath"
              startOffset={`${((angle % 360) / 360) * 100}%`}
              style={{
                ...styleUtils.getTypeLabelStyle(type),
                textAnchor: 'middle',
                dominantBaseline: 'central'
              }}
            >
              {needsFlip ? (
                <tspan rotate="180">
                  {text.split('').reverse().join('')}
                </tspan>
              ) : text}
            </textPath>
          </text>
        );
      })}
    </g>
  );
};

export default TypeNames;