import React from 'react';
import { EnneagramType, SymbolVariation } from '@/types';

interface EnneagramControlsProps {
  selectedType: EnneagramType | null;
  setSelectedType: (type: EnneagramType | null) => void;
  variation: SymbolVariation;
  setVariation: (variation: SymbolVariation) => void;
}

const TYPE_NAMES = {
  1: 'Reformer',
  2: 'Helper',
  3: 'Achiever',
  4: 'Individualist',
  5: 'Investigator',
  6: 'Loyalist',
  7: 'Enthusiast',
  8: 'Challenger',
  9: 'Peacemaker'
};

const VARIATIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'type-only', label: 'Core Type Only' },
  { value: 'related-types', label: 'All Related Types' },
  { value: 'both-wings', label: 'Both Wings' },
  { value: 'left-wing', label: 'Left Wing' },
  { value: 'right-wing', label: 'Right Wing' },
  { value: 'both-lines', label: 'Both Lines' },
  { value: 'stress-line', label: 'Stress Line' },
  { value: 'growth-line', label: 'Growth Line' }
];

const EnneagramControls: React.FC<EnneagramControlsProps> = ({ 
  selectedType, setSelectedType, variation, setVariation 
}) => {
  return (
    <div className="flex gap-4 mb-4">
      <select
        className="w-full p-2 border border-gray-300 rounded-md bg-white"
        value={selectedType?.toString() || ''}
        onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) as EnneagramType : null)}
      >
        <option value="">Select Type</option>
        {Object.entries(TYPE_NAMES).map(([type, name]) => (
          <option key={type} value={type}>Type {type}: {name}</option>
        ))}
      </select>

      <select
        className="w-full p-2 border border-gray-300 rounded-md bg-white"
        value={variation}
        onChange={(e) => setVariation(e.target.value as SymbolVariation)}
        disabled={!selectedType}
      >
        {VARIATIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
};

export default EnneagramControls;
