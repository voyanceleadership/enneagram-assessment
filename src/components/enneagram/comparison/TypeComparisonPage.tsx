'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { theme, styleUtils } from '@/styles/theme';
import { TypeData } from '@/lib/enneagram/content';
import ComparisonRowLabel from './ComparisonRowLabel';
import ComparisonColumnLabel from './ComparisonColumnLabel';
import { useRouter } from 'next/navigation';

const COMPARISON_ROWS = [
  { label: 'Brief Description', field: 'briefDescription', type: 'text' },
  { label: 'Top Priority', field: 'topPriority', type: 'text' },
  { label: 'Secondary Desires', field: 'secondaryDesires', type: 'list' },
  { label: 'Biggest Fear', field: 'biggestFear', type: 'text' },
  { label: 'Secondary Fears', field: 'secondaryFears', type: 'list' },
  { label: 'At Their Best', field: 'atTheirBest', type: 'text' },
  { label: 'Under Stress', field: 'underStress', type: 'text' },
  { label: 'Wake-Up Call', field: 'wakeUpCall', type: 'text' },
  { label: 'Mental Habit', field: 'mentalHabit', type: 'text' },
  { label: 'Fundamental Flaw', field: 'fundamentalFlaw', type: 'text' },
  { label: 'False Narrative', field: 'falseNarrative', type: 'text' },
  { label: 'Key to Growth', field: 'keyToGrowth', type: 'text' },
  { label: 'Learn More', field: 'learnMore', type: 'link' }
];

interface TypeButtonProps {
  type: string;
  data: TypeData;
  isSelected: boolean;
  onSelect: () => void;
  isDisabled: boolean;
  onHover: (type: string | null) => void;
}

const TypeButton: React.FC<TypeButtonProps> = ({ 
  type, 
  data, 
  isSelected, 
  onSelect, 
  isDisabled, 
  onHover,
}) => (
  <Button
    onClick={onSelect}
    onMouseEnter={() => onHover(type)}
    onMouseLeave={() => onHover(null)}
    disabled={isDisabled}
    className="w-full h-12 shadow-sm hover:shadow-md transition-all duration-200 text-base"
    style={{
      backgroundColor: isSelected 
        ? theme.colors.primary
        : `${theme.colors.primary}15`,
      color: isSelected ? 'white' : theme.colors.primary,
      border: 'none',
      opacity: isDisabled ? 0.5 : 1
    }}
  >
    <div className="flex justify-center items-center">
      <div style={styleUtils.headingStyles}>
        Type {type}: {data.typeName}
      </div>
    </div>
  </Button>
);

interface TypeComparisonPageProps {
  typesData: Record<string, TypeData>;
  preSelectedTypes: string[];
}

const TypeComparisonPage: React.FC<TypeComparisonPageProps> = ({ typesData, preSelectedTypes = [] }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(preSelectedTypes);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const router = useRouter();

  // Calculate grid layout based on number of selected types
  const gridLayout = () => {
    // Label column is always 25% width
    const labelWidth = '25%';
    
    if (selectedTypes.length === 1) {
      // One type: Label 25%, content 75%
      return `${labelWidth} 75%`;
    } else if (selectedTypes.length === 2) {
      // Two types: Label 25%, each type 37.5%
      return `${labelWidth} 37.5% 37.5%`;
    } else {
      // Three types: Label 25%, each type 25%
      return `${labelWidth} 25% 25% 25%`;
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedTypes(current => {
      if (current.includes(type)) {
        return current.filter(t => t !== type);
      }
      if (current.length >= 3) {
        return current;
      }
      return [...current, type];
    });
  };

  const renderCellContent = (typeData: TypeData, field: string, type: string) => {
    if (field === 'learnMore') {
      return (
        <p 
          style={{ 
            ...styleUtils.bodyStyles,
            color: theme.colors.text
          }}
        >
          Click this card to view the detailed description of Type {typeData.typeDigit}: {typeData.typeName}
        </p>
      );
    }

    const content = typeData[field as keyof TypeData];
    if (type === 'list' && Array.isArray(content)) {
      return (
        <ul className="list-disc pl-6 space-y-2">
          {content.map((item, idx) => (
            <li key={idx} className="text-base" style={{ color: theme.colors.text }}>
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p className="text-base" style={{ color: theme.colors.text }}>
        {content as string}
      </p>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      {/* Main Grid Container */}
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: '1fr min(1200px, 90%) 1fr',
          columnGap: '0'
        }}
      >
        {/* Content Grid Column */}
        <div className="col-start-2">
          {/* Page Header */}
          <div className="py-8 text-center">
            <h1 
              className="text-4xl mb-4" 
              style={{
                ...styleUtils.headingStyles,
                color: theme.colors.text
              }}
            >
              Compare Enneagram Types
            </h1>
            <p 
              className="text-xl" 
              style={{
                ...styleUtils.bodyStyles,
                color: theme.colors.text
              }}
            >
              Select up to three types to compare
            </p>
          </div>

          {/* Type Selection Grid */}
          <div className="mb-16">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(typesData).map(([type, data]) => (
                <div key={type} className="relative">
                  <TypeButton
                    type={type}
                    data={data}
                    isSelected={selectedTypes.includes(type)}
                    onSelect={() => handleTypeSelect(type)}
                    isDisabled={selectedTypes.length >= 3 && !selectedTypes.includes(type)}
                    onHover={setHoveredType}
                  />
                  {hoveredType === type && !selectedTypes.includes(type) && (
                    <div 
                      className="absolute z-20 w-64 p-4 rounded-lg shadow-xl mt-2 left-1/2 transform -translate-x-1/2 bg-white"
                      style={{ 
                        border: `1px solid ${theme.colors.primary}30`,
                      }}
                    >
                      <p 
                        className="text-sm"
                        style={{
                          ...styleUtils.bodyStyles,
                          color: theme.colors.text
                        }}
                      >
                        {data.briefDescription}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Matrix */}
          {selectedTypes.length > 0 && (
            <div 
              className="flex justify-center items-center w-full"
              style={{ minHeight: '50vh' }} // Adjust the height as needed for visual balance
            >
              <div className="relative pb-8 w-full max-w-screen-lg">
                {/* Sticky Header Container */}
                <div 
                  className="sticky top-0 z-10"
                  style={{ 
                    backgroundColor: theme.colors.background,
                    margin: '0 -100vw',
                    padding: '0 100vw'
                  }}
                >
                  <div className="mb-6">
                    <div
                      style={{ 
                        display: 'grid',
                        gridTemplateColumns: gridLayout(),
                        gap: '1.5rem'
                      }}
                    >
                      <div></div>
                      {selectedTypes.map((type) => (
                        <ComparisonColumnLabel
                          key={type}
                          type={type}
                          data={typesData[type]}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comparison Rows */}
                {COMPARISON_ROWS.map((row) => (
                  <div 
                    key={row.field}
                    className="mb-6"
                    style={{ 
                      display: 'grid',
                      gridTemplateColumns: gridLayout(),
                      gap: '1.5rem'
                    }}
                  >
                    <ComparisonRowLabel field={row.field} />
                    {selectedTypes.map((type) => (
                      row.field === 'learnMore' ? (
                        <Card
                          key={type}
                          onClick={() => router.push(`/enneagram/types/type${type}`)}
                          className="bg-white shadow-md border-0 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                        >
                          <CardContent className="p-6">
                            <div className="pt-4 pb-4 w-full" style={styleUtils.bodyStyles}>
                              {renderCellContent(typesData[type], row.field, row.type)}
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card
                          key={type}
                          className="bg-white shadow-md border-0"
                        >
                          <CardContent className="p-6">
                            <div className="pt-4 pb-4 w-full" style={styleUtils.bodyStyles}>
                              {renderCellContent(typesData[type], row.field, row.type)}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypeComparisonPage;