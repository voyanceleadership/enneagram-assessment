/**
 * EnneagramSymbolControls.tsx
 * 
 * This component provides the user interface controls for interacting with 
 * the Enneagram symbol. It manages two primary controls:
 * 1. Type selection dropdown
 * 2. Variation selection dropdown (for different display modes)
 * 
 * Key Responsibilities:
 * 1. Rendering dropdown controls for type and variation selection
 * 2. Handling user selection events
 * 3. Providing an accessible interface for symbol interaction
 * 4. Displaying proper labels for types and variations
 * 
 * Related Components:
 * - DynamicEnneagramSymbol: Parent component that manages state
 * - EnneagramSymbolRenderer: Sibling component that renders based on these controls
 * 
 * Data Dependencies:
 * - Type definitions from symbolStructures.ts
 * - SYMBOL_VARIATIONS from relationships.ts
 */

import React from 'react';
import type { EnneagramType, SymbolVariation } from '@/lib/enneagram/models/symbolStructures';
import type { SymbolVariationOption } from '@/lib/enneagram/data/constants/relationships';
import { SYMBOL_VARIATIONS } from '@/lib/enneagram/data/constants/relationships';

/**
 * Props interface for the EnneagramControls component
 */
interface EnneagramControlsProps {
  /** Currently selected type (null if none selected) */
  selectedType: EnneagramType | null;
  /** Function to update the selected type */
  setSelectedType: (type: EnneagramType | null) => void;
  /** Current display variation */
  variation: SymbolVariation;
  /** Function to update the display variation */
  setVariation: (variation: SymbolVariation) => void;
  /** Map of type numbers to their display names */
  typeNames: Record<string, string>;
}

/**
 * Control panel component for the Enneagram symbol.
 * Provides type selection and variation controls.
 */
const EnneagramControls: React.FC<EnneagramControlsProps> = ({
  selectedType,
  setSelectedType,
  variation,
  setVariation,
  typeNames
}) => {
  /**
   * Handles type selection change
   * Converts string value from select to EnneagramType or null
   */
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value ? Number(value) as EnneagramType : null);
  };

  /**
   * Handles variation selection change
   * Ensures type safety when setting new variation
   */
  const handleVariationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVariation(event.target.value as SymbolVariation);
  };

  return (
    <div className="flex gap-4 mb-4">
      {/* Type selection dropdown */}
      <div className="flex-1">
        <select
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={selectedType?.toString() || ''}
          onChange={handleTypeChange}
          aria-label="Select Enneagram Type"
        >
          <option value="">Select Type</option>
          {Object.entries(typeNames).map(([type, name]) => (
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
          onChange={handleVariationChange}
          disabled={!selectedType}
          aria-label="Select Display Variation"
        >
          {(SYMBOL_VARIATIONS as SymbolVariationOption[]).map(({ value, label }) => (
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