// src/components/enneagram/types/sections/RelatedTypes/SymbolExplorer.tsx

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { theme, styleUtils } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../../symbol/DynamicEnneagramSymbol';
import { ExplanationPanel } from './ExplanationPanel';
import { SymbolVariation } from './explorer';

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
  const [selectedVariation, setSelectedVariation] = useState<SymbolVariation>('related-types');
  const [showExplanation, setShowExplanation] = useState(false);
  const sectionColor = theme.colors.text;

  return (
    <Card className="bg-white shadow-md border-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl" style={{ ...styleUtils.headingStyles, color: sectionColor }}>
            Explore Type Relationships
          </h3>
          <Select
            value={selectedVariation}
            onValueChange={(value: SymbolVariation) => {
              setSelectedVariation(value);
              setShowExplanation(true);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select variation" />
            </SelectTrigger>
            <SelectContent>
              {variationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex">
          {/* Symbol container with transition */}
          <div className={`
            transition-all duration-300 ease-in-out flex-shrink-0
            ${showExplanation ? 'w-2/3' : 'w-full'}
          `}>
            <div className={`
              transition-all duration-300 ease-in-out
              ${showExplanation ? 'max-w-sm' : 'max-w-md'} 
              mx-auto
            `}>
              <DynamicEnneagramSymbol 
                defaultType={parseInt(typeDigit) as 1|2|3|4|5|6|7|8|9}
                defaultVariation={selectedVariation}
                interactive={false}
              />
            </div>
          </div>

          {/* Explanation Panel */}
          <div className={`
            w-1/3 bg-gray-50 rounded-lg p-6 flex-shrink-0
            transform transition-all duration-300 ease-in-out
            ${showExplanation ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'}
          `}>
            <button
              onClick={() => setShowExplanation(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close explanation</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
            <div className="prose prose-sm">
              <ExplanationPanel
                selectedVariation={selectedVariation}
                typeData={{ typeDigit, typeName }}
                wingTypes={wingTypes}
                lineTypes={lineTypes}
                onScrollToSection={onScrollToSection}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}