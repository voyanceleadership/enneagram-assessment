/**
 * @file Arrowheads.tsx
 * @description SVG Polygon elements for stress and growth line arrowheads
 * 
 * This component renders the arrowheads that indicate the direction of
 * stress and growth connections. Arrowheads are only shown when:
 * 1. A type is selected
 * 2. The appropriate variation is active (stress-line, growth-line, etc.)
 * 3. The connection originates from the selected type
 * 
 * Related files:
 * - DynamicEnneagramSymbol.tsx (parent component)
 * - Connections.tsx (renders the lines these arrowheads attach to)
 * - ../../../lib/enneagram/utils/symbolUtils (shouldShowArrowhead logic)
 * - ../../../lib/enneagram/constants (arrowhead path data)
 */

import React from 'react';
import { EnneagramType, StyledElementProps } from '@/lib/enneagram';
import { ARROWHEADS } from '@/lib/enneagram';
import { shouldShowArrowhead } from '@/lib/enneagram';

interface ArrowheadsProps extends StyledElementProps {}

/**
 * Renders arrowheads for stress and growth lines
 */
export const Arrowheads: React.FC<ArrowheadsProps> = ({ selectedType, variation, styleUtils }) => {
  return (
    <g id="Arrowheads">
      {/* Render stress line arrowheads */}
      {Object.entries(ARROWHEADS.stress).map(([connection, points]) => {
        const [from, to] = connection.split('-').map(Number) as [EnneagramType, EnneagramType];
        
        if (!shouldShowArrowhead(from, to, 'stress', selectedType, variation)) {
          return null;
        }

        return (
          <polygon
            key={`stress-${connection}`}
            points={points}
            style={{
              fill: styleUtils.getLineStyle(from, to).stroke,
              transition: 'fill 0.3s ease'
            }}
          />
        );
      })}

      {/* Render growth line arrowheads */}
      {Object.entries(ARROWHEADS.growth).map(([connection, points]) => {
        const [from, to] = connection.split('-').map(Number) as [EnneagramType, EnneagramType];
        
        if (!shouldShowArrowhead(from, to, 'growth', selectedType, variation)) {
          return null;
        }

        return (
          <polygon
            key={`growth-${connection}`}
            points={points}
            style={{
              fill: styleUtils.getLineStyle(from, to).stroke,
              transition: 'fill 0.3s ease'
            }}
          />
        );
      })}
    </g>
  );
};

export default Arrowheads;