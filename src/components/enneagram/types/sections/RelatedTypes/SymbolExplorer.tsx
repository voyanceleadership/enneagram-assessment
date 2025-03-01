// src/components/enneagram/types/sections/RelatedTypes/SymbolExplorer.tsx
/**
 * SymbolExplorer Component
 * 
 * This component provides an interactive way to explore relationships between Enneagram types
 * using a visual symbol and detailed explanations. It serves as the main interface for users
 * to understand wing types and line connections in the Enneagram system.
 * 
 * Key Features:
 * - Interactive symbol display that adapts based on the selected variation
 * - Dropdown selector for different relationship views (wings, lines, etc.)
 * - Detailed explanation panel that updates with contextual information
 * - Color-coded elements for easier visual recognition of relationship types
 * 
 * The layout is responsive, with the symbol and explanation panel adapting to different screen sizes.
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { theme, styleUtils } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../../symbol/DynamicEnneagramSymbol';
import { ExplanationPanel } from './ExplanationPanel';
import { SymbolVariation } from './explorer';
import { 
  ChevronDown, 
  Filter, 
  ChevronFirst,
  ChevronLast,
  Component,
  ChevronsRightLeft,
  Share2,
  MoveDownRight,
  MoveUpRight 
} from 'lucide-react';

// Props definition for the component
interface SymbolExplorerProps {
  typeDigit: string;
  typeName: string;
  wingTypes: {
    left: {
      number: string;
      name: string;
      data: any;
    };
    right: {
      number: string;
      name: string;
      data: any;
    };
  };
  lineTypes: {
    stress: {
      number: string;
      name: string;
      description: string;
      dynamics: any;
    };
    growth: {
      number: string;
      name: string;
      description: string;
      dynamics: any;
    };
  };
  variationOptions: Array<{
    value: SymbolVariation;
    label: string;
    description: string;
  }>;
  onScrollToSection: (sectionId: string, subsectionId?: string) => void;
}

export default function SymbolExplorer({
  typeDigit,
  typeName,
  wingTypes,
  lineTypes,
  variationOptions,
  onScrollToSection
}: SymbolExplorerProps) {
  // State to track the currently selected symbol variation
  const [selectedVariation, setSelectedVariation] = useState<SymbolVariation>('related-types');
  
  // State to control the visibility of the explanation panel (default to visible)
  const [showExplanation, setShowExplanation] = useState(true);
  
  // Section color for consistent styling
  const sectionColor = theme.colors.text;

  /**
   * Get accent color based on the selected variation
   * This provides visual consistency with the color scheme used throughout the app
   */
  const getAccentColor = () => {
    switch(selectedVariation) {
      case 'left-wing':
      case 'right-wing':
      case 'both-wings':
        return theme.colors.accent3; // Purple for wings
      case 'stress-line':
        return theme.colors.accent2; // Red for stress
      case 'growth-line':
        return theme.colors.accent1; // Green for growth
      default:
        return theme.colors.primary; // Default blue
    }
  };

  /**
   * Get icon based on selected variation
   * Each relationship type has a distinctive icon for visual recognition
   */
  const getVariationIcon = () => {
    // Determine if we need to visually flip the wing icons for types 3-6
    // For these types, what's "left" in the data is visually on the right side of the symbol
    const typeNumber = parseInt(typeDigit);
    const shouldFlipWingIcons = typeNumber >= 3 && typeNumber <= 6;
    
    switch(selectedVariation) {
      case 'left-wing':
        // For types 3-6, flip the icon direction to match visual position
        return shouldFlipWingIcons 
          ? <ChevronFirst className="h-5 w-5" style={{ color: getAccentColor() }} />
          : <ChevronLast className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'right-wing':
        // For types 3-6, flip the icon direction to match visual position
        return shouldFlipWingIcons
          ? <ChevronLast className="h-5 w-5" style={{ color: getAccentColor() }} />
          : <ChevronFirst className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'both-wings':
        return <ChevronsRightLeft className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'stress-line':
        return <MoveDownRight className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'growth-line':
        return <MoveUpRight className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'both-lines':
        return <Share2 className="h-5 w-5" style={{ color: getAccentColor() }} />;
      case 'related-types':
        return <Component className="h-5 w-5" style={{ color: getAccentColor() }} />;
      default:
        return <Component className="h-5 w-5" style={{ color: getAccentColor() }} />;
    }
  };

  return (
    <Card className="bg-white shadow-md border-0 overflow-hidden">
      <div className="p-6">
        {/* Header section with title and variation selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <div className="rounded-full p-3 mr-4" style={{ backgroundColor: `${getAccentColor()}15` }}>
              {getVariationIcon()}
            </div>
            <h3 className="text-xl" style={{ ...styleUtils.headingStyles, color: sectionColor }}>
              Explore Type Relationships
            </h3>
          </div>
          
          {/* Variation selector dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium hidden md:inline-block">
              View:
            </span>
            <Select
              value={selectedVariation}
              onValueChange={(value: SymbolVariation) => {
                setSelectedVariation(value);
                setShowExplanation(true);
              }}
            >
              <SelectTrigger 
                className="w-[200px] border-2 focus:ring-2" 
                style={{ 
                  borderColor: `${getAccentColor()}30`,
                  backgroundColor: `${getAccentColor()}05`
                }}
              >
                <SelectValue placeholder="Select variation" />
              </SelectTrigger>
              <SelectContent>
                {variationOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="focus:bg-blue-50 focus:text-blue-600"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main content area with symbol and explanation panel */}
        <div className="flex flex-col md:flex-row gap-6 relative min-h-[400px]">
          {/* Symbol container - takes up half the width on medium+ screens */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="w-full">
              <DynamicEnneagramSymbol 
                defaultType={parseInt(typeDigit) as 1|2|3|4|5|6|7|8|9}
                defaultVariation={selectedVariation}
                interactive={false}
              />
            </div>
          </div>

          {/* Explanation Panel - takes up half the width on medium+ screens */}
          <div 
            className={`
              w-full md:w-1/2 border rounded-lg p-6 flex-shrink-0
              transform transition-all duration-300 ease-in-out
              ${showExplanation ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 md:absolute right-0'}
            `}
            style={{ 
              backgroundColor: `${getAccentColor()}05`,
              borderColor: `${getAccentColor()}30`
            }}
          >
            {/* Only render ExplanationPanel when showExplanation is true */}
            {showExplanation && (
              <ExplanationPanel
                selectedVariation={selectedVariation}
                typeData={{ typeDigit, typeName }}
                wingTypes={wingTypes}
                lineTypes={lineTypes}
                onScrollToSection={onScrollToSection}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}