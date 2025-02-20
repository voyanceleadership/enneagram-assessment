/**
 * @file EnneagramControls.tsx
 * @description Control panel for the Enneagram symbol
 * 
 * This component provides the user interface for interacting with the Enneagram symbol.
 * It includes:
 * - Type selection dropdown
 * - Variation selection dropdown (customized based on selected type)
 * 
 * The controls adapt their behavior based on the current selection state.
 * For example, wing variations update their labels based on the selected type.
 * 
 * Related files:
 * - DynamicEnneagramSymbol.tsx (parent component)
 * - ../../lib/enneagram/utils/symbolUtils (getDynamicVariations)
 * - ../../lib/enneagram/constants (TYPE_NAMES)
 */

import React from 'react';
import { EnneagramControlsProps, TYPE_NAMES, EnneagramType } from '@/lib/enneagram';

/**
 * Helper function to convert a string to an EnneagramType
 * Returns null if the conversion is invalid
 */
const toEnneagramType = (value: string): EnneagramType | null => {
  const num = Number(value);
  return num >= 1 && num <= 9 ? (num as EnneagramType) : null;
};

/**
 * Control panel component for the Enneagram symbol
 */
export const EnneagramControls: React.FC<EnneagramControlsProps> = ({
  selectedType,
  setSelectedType,
  variation,
  setVariation,
  variations
}) => {
  return (
    <div className="flex gap-4 mb-4">
      {/* Type selection dropdown */}
      <div className="flex-1">
        <select
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={selectedType?.toString() || ''}
          onChange={(e) => setSelectedType(toEnneagramType(e.target.value))}
        >
          <option value="">Select Type</option>
          {Object.entries(TYPE_NAMES).map(([type, name]) => (
            <option key={type} value={type}>
              Type {type}: {name}
            </option>
          ))}
        </select>
      </div>

      {/* Variation selection dropdown */}
      <div className="flex-1">
        <select
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={variation}
          onChange={(e) => setVariation(e.target.value as any)}
          disabled={!selectedType} // Disable if no type is selected
        >
          {variations.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EnneagramControls;