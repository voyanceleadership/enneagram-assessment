'use client';

// src/components/enneagram/symbol/DynamicEnneagramSymbol.tsx
import React, { useState } from 'react';
import type { EnneagramType, SymbolVariation } from '@/lib/enneagram/models/symbolStructures';
import type { DisplayContent } from '@/lib/enneagram/data/utils/parser';
import EnneagramControls from './EnneagramSymbolControls';
import EnneagramSymbolRenderer from './EnneagramSymbolRenderer';

interface DynamicEnneagramSymbolProps {
  displayContent: DisplayContent;
  defaultType?: EnneagramType | null;
  defaultVariation?: SymbolVariation;
  interactive?: boolean;
}

const DynamicEnneagramSymbol: React.FC<DynamicEnneagramSymbolProps> = ({
  displayContent,
  defaultType = null,
  defaultVariation = 'all',
  interactive = true
}) => {
  const [selectedType, setSelectedType] = useState<EnneagramType | null>(defaultType);
  const [variation, setVariation] = useState<SymbolVariation>(defaultVariation);

  return (
    <div className="flex flex-col w-full">
      {interactive && (
        <EnneagramControls
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          variation={variation}
          setVariation={setVariation}
          typeNames={displayContent.typeNames}
        />
      )}
      <div className="w-full aspect-square">
        <EnneagramSymbolRenderer
          selectedType={selectedType}
          variation={variation}
          typeNames={displayContent.typeNames}
          onTypeClick={(type) => setSelectedType(type === selectedType ? null : type)}
        />
      </div>
    </div>
  );
};

export default DynamicEnneagramSymbol;