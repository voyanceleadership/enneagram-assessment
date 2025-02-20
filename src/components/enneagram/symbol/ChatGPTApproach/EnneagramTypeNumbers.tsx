import React from 'react';
import { EnneagramType } from '@/types';

interface EnneagramTypeNumbersProps {
  selectedType: EnneagramType | null;
}

const EnneagramTypeNumbers: React.FC<EnneagramTypeNumbersProps> = ({ selectedType }) => {
  return <g id="Numbers"> {/* Render SVG text numbers */} </g>;
};

export default EnneagramTypeNumbers;
