import React, { useState, useEffect } from 'react';
import EnneagramControls from './EnneagramControls';
import EnneagramDiagram from './EnneagramDiagram';
import { EnneagramType, SymbolVariation } from '@/types';

const InteractiveEnneagramDiagram: React.FC = () => {
  const [selectedType, setSelectedType] = useState<EnneagramType | null>(null);
  const [variation, setVariation] = useState<SymbolVariation>('all');

  return (
    <div className="flex flex-col w-full">
      <EnneagramControls 
        selectedType={selectedType} 
        setSelectedType={setSelectedType} 
        variation={variation} 
        setVariation={setVariation} 
      />
      <EnneagramDiagram selectedType={selectedType} variation={variation} />
    </div>
  );
};

export default InteractiveEnneagramDiagram;
