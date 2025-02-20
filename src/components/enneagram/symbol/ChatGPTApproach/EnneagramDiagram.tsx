import React from 'react';
import EnneagramConnections from './EnneagramConnections';
import EnneagramCircles from './EnneagramCircles';
import EnneagramTypeNumbers from './EnneagramTypeNumbers';
import EnneagramLabels from './EnneagramLabels';
import { EnneagramType, SymbolVariation } from '@/types';

interface EnneagramDiagramProps {
  selectedType: EnneagramType | null;
  variation: SymbolVariation;
}

const EnneagramDiagram: React.FC<EnneagramDiagramProps> = ({ selectedType, variation }) => {
  return (
    <svg viewBox="0 0 2048 2048" className="w-full h-full enneagram-diagram">
      <EnneagramConnections selectedType={selectedType} variation={variation} />
      <EnneagramCircles selectedType={selectedType} />
      <EnneagramTypeNumbers selectedType={selectedType} />
      <EnneagramLabels selectedType={selectedType} />
    </svg>
  );
};

export default EnneagramDiagram;
