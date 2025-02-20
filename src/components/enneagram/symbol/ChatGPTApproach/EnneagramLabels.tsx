import React from 'react';
import { EnneagramType } from '@/types';

interface EnneagramLabelsProps {
  selectedType: EnneagramType | null;
}

const EnneagramLabels: React.FC<EnneagramLabelsProps> = ({ selectedType }) => {
  return <g id="Labels"> {/* Render SVG text labels */} </g>;
};

export default EnneagramLabels;
