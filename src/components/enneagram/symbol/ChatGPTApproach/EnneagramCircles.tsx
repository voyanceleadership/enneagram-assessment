import React from 'react';
import { EnneagramType } from '@/types';

interface EnneagramCirclesProps {
  selectedType: EnneagramType | null;
}

const EnneagramCircles: React.FC<EnneagramCirclesProps> = ({ selectedType }) => {
  return <g id="Circles"> {/* Render SVG circles */} </g>;
};

export default EnneagramCircles;
