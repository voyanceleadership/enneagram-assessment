import React from 'react';
import type { EnneagramType, SymbolVariation } from '@/lib/enneagram/models/symbolStructures';

interface EnneagramSymbolRendererProps {
  selectedType: EnneagramType | null;
  variation: SymbolVariation;
  typeNames: Record<string, string>;
  onTypeClick: (type: EnneagramType) => void;
}

const EnneagramSymbolRenderer: React.FC<EnneagramSymbolRendererProps> = ({
  selectedType,
  variation,
  typeNames,
  onTypeClick
}) => {
  console.log('Rendering symbol with props:', {
    selectedType,
    variation,
    typeNames
  });

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 2048 2048"
      className="w-full h-full"
      style={{ border: '1px solid red' }} // Debug border
    >
      {/* Debug rectangle to show SVG bounds */}
      <rect x="0" y="0" width="2048" height="2048" fill="none" stroke="blue" strokeWidth="1" />
      
      {/* Debug circle in center */}
      <circle cx="1024" cy="1024" r="100" fill="lightgray" stroke="black" />
      
      {/* Debug text to show content is loading */}
      <text x="1024" y="1024" textAnchor="middle" fontSize="20">
        SVG is rendering
      </text>
      <text x="1024" y="1050" textAnchor="middle" fontSize="16">
        Types available: {Object.keys(typeNames || {}).join(', ')}
      </text>
    </svg>
  );
};

export default EnneagramSymbolRenderer;