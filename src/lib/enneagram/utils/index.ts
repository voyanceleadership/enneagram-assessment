// Highlighting logic helper function

import { EnneagramType, SymbolVariation } from '../types';
import { ENNEAGRAM_RELATIONSHIPS } from '../constants/relationships';

// Helper function to determine if wings should be swapped
export const usesReversedWingLogic = (type: number): boolean => {
  return type >= 3 && type <= 6;
};

// Helper function to get wing type numbers for a given type
export const getWingTypes = (typeNumber: string | number): { 
  lowerWing: number; 
  higherWing: number 
} => {
  const type = typeof typeNumber === 'string' ? parseInt(typeNumber) : typeNumber;
  
  if (type === 1) {
    return { lowerWing: 9, higherWing: 2 };
  } 
  if (type === 9) {
    return { lowerWing: 8, higherWing: 1 };
  }
  
  return { 
    lowerWing: type - 1, 
    higherWing: type + 1 
  };
};

// Helper function to get the wing variation based on the type
export const getWingVariation = (
  selectedType: number, 
  wingType: number
): 'left-wing' | 'right-wing' => {
  const { lowerWing } = getWingTypes(selectedType);
  const shouldReverse = usesReversedWingLogic(selectedType);
  
  if (wingType === lowerWing) {
    return shouldReverse ? 'right-wing' : 'left-wing';
  } else {
    return shouldReverse ? 'left-wing' : 'right-wing';
  }
};

// Helper function to determine which types and connections should be highlighted
export const getHighlightStates = (
  selectedType: EnneagramType | null,
  variation: SymbolVariation
) => {
  if (!selectedType) {
    return {
      isTypeHighlighted: () => true,
      isConnectionHighlighted: () => true
    };
  }

  const relationships = ENNEAGRAM_RELATIONSHIPS[selectedType];

  const isTypeHighlighted = (type: EnneagramType): boolean => {
    if (variation === 'all') return true;
    if (type === selectedType) return true;
    
    switch (variation) {
      case 'type-only':
        return type === selectedType;
      case 'related-types':
        return relationships.related.includes(type);
      case 'left-wing':
        return type === relationships.left;
      case 'right-wing':
        return type === relationships.right;
      case 'both-wings':
        return type === relationships.left || type === relationships.right;
      case 'both-lines':
        return type === relationships.stress || type === relationships.growth;
      case 'stress-line':
        return type === relationships.stress;
      case 'growth-line':
        return type === relationships.growth;
      default:
        return false;
    }
  };

  const isConnectionHighlighted = (from: EnneagramType, to: EnneagramType): boolean => {
    if (variation === 'all') return true;
    
    switch (variation) {
      case 'type-only':
        return false;
      case 'related-types':
        return (selectedType === from && relationships.related.includes(to)) ||
               (selectedType === to && relationships.related.includes(from));
      case 'left-wing':
        return (selectedType === from && to === relationships.left) ||
               (selectedType === to && from === relationships.left);
      case 'right-wing':
        return (selectedType === from && to === relationships.right) ||
               (selectedType === to && from === relationships.right);
      case 'both-wings':
        return (selectedType === from && (to === relationships.left || to === relationships.right)) ||
               (selectedType === to && (from === relationships.left || from === relationships.right));
      case 'both-lines':
        return (selectedType === from && (to === relationships.stress || to === relationships.growth)) ||
               (selectedType === to && (from === relationships.stress || from === relationships.growth));
      case 'stress-line':
        return (selectedType === from && to === relationships.stress) ||
               (selectedType === to && from === relationships.stress);
      case 'growth-line':
        return (selectedType === from && to === relationships.growth) ||
               (selectedType === to && from === relationships.growth);
      default:
        return false;
    }
  };

  return { isTypeHighlighted, isConnectionHighlighted };
};