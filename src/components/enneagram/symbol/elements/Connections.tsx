/**
 * @file Connections.tsx
 * @description SVG Path elements for the Enneagram connection lines
 * 
 * This component handles rendering all connecting lines between Enneagram types:
 * - Wing connections (outer circle connections between adjacent types)
 * - Stress/Growth lines (inner lines connecting related types)
 * 
 * Lines are rendered in two layers:
 * 1. Background layer for non-highlighted lines
 * 2. Foreground layer for highlighted lines
 * This ensures proper visual layering when lines intersect.
 * 
 * Related files:
 * - DynamicEnneagramSymbol.tsx (parent component)
 * - Arrowheads.tsx (renders arrowheads on these lines)
 * - ../../../lib/enneagram/constants (connection paths)
 * - ../../../lib/enneagram/styles (styling utilities)
 */

import React from 'react';
import { EnneagramType, StyledElementProps } from '@/lib/enneagram';
import { CONNECTIONS, TYPE_COORDINATES } from '@/lib/enneagram';

interface ConnectionsProps extends StyledElementProps {}

/**
 * Renders all connection lines in the Enneagram symbol
 */
export const Connections: React.FC<ConnectionsProps> = ({ selectedType, variation, styleUtils }) => {
  /**
   * Helper function to render wing connections
   * @param highlighted - Whether to render highlighted or non-highlighted connections
   */
  const renderWingConnections = (highlighted: boolean) => (
    Object.entries(CONNECTIONS.wings).map(([key, path]) => {
      const [from, to] = key.split('-').map(Number) as [EnneagramType, EnneagramType];
      const isHighlighted = styleUtils.getLineStyle(from, to).stroke !== '#e6e6e6';
      
      // Only render if highlighted status matches what we want for this layer
      if (isHighlighted !== highlighted) return null;

      return (
        <path
          key={key}
          d={path}
          style={styleUtils.getLineStyle(from, to)}
        />
      );
    })
  );

  /**
   * Helper function to render stress/growth lines
   * @param highlighted - Whether to render highlighted or non-highlighted connections
   */
  const renderInnerLines = (highlighted: boolean) => {
    // Define all possible inner line connections
    const innerConnections: Array<[EnneagramType, EnneagramType]> = [
      [1, 4], [1, 7],
      [2, 4], [2, 8],
      [3, 6], [3, 9],
      [4, 1], [4, 2],
      [5, 7], [5, 8],
      [6, 3], [6, 9],
      [7, 1], [7, 5],
      [8, 2], [8, 5],
      [9, 3], [9, 6]
    ];

    return innerConnections.map(([from, to]) => {
      const isHighlighted = styleUtils.getLineStyle(from, to).stroke !== '#e6e6e6';
      
      // Only render if highlighted status matches what we want for this layer
      if (isHighlighted !== highlighted) return null;

      return (
        <line
          key={`${from}-${to}`}
          x1={TYPE_COORDINATES[from].x}
          y1={TYPE_COORDINATES[from].y}
          x2={TYPE_COORDINATES[to].x}
          y2={TYPE_COORDINATES[to].y}
          style={styleUtils.getLineStyle(from, to)}
        />
      );
    });
  };

  return (
    <>
      {/* Background layer - non-highlighted connections */}
      <g id="Background_Connections">
        {renderWingConnections(false)}
        {renderInnerLines(false)}
      </g>

      {/* Foreground layer - highlighted connections */}
      <g id="Highlighted_Connections">
        {renderWingConnections(true)}
        {renderInnerLines(true)}
      </g>
    </>
  );
};

export default Connections;