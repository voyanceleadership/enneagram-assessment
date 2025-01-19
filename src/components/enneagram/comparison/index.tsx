"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CompareArrows } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { theme, styleUtils } from '@/styles/theme';

// Type Selection component for the Results Page
export const TypeSelectionFooter = ({ selectedTypes, onTypeSelect }) => {
  const router = useRouter();
  
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p 
              className="text-sm mb-1"
              style={styleUtils.bodyStyles}
            >
              {selectedTypes.length === 0 
                ? "Check the box for up to 3 types to compare them side-by-side"
                : `${selectedTypes.length} ${selectedTypes.length === 1 ? 'type' : 'types'} selected`
              }
            </p>
            <div className="flex gap-2">
              {selectedTypes.map(type => (
                <span
                  key={type}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${theme.colors.primary}10`,
                    color: theme.colors.primary
                  }}
                >
                  Type {type}
                </span>
              ))}
            </div>
          </div>
          <Button
            onClick={() => router.push(`/enneagram/compare?types=${selectedTypes.join(',')}`)}
            disabled={selectedTypes.length === 0}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <CompareArrows className="h-4 w-4 mr-2" />
            Compare Types
          </Button>
        </div>
      </div>
    </div>
  );
};

// Modified ExpandableTypeCard with checkbox
export const ExpandableTypeCard = ({ 
  type, 
  score, 
  typeData, 
  isSelected, 
  onSelect, 
  disabled 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
 
  return (
    <div 
      className={`bg-white rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-50
        ${isExpanded ? 'shadow-md' : 'shadow-sm'}`}
      style={{ 
        borderLeft: `4px solid ${theme.colors.accent3}`,
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled || isSelected) {
                  onSelect(type);
                }
              }}
              disabled={disabled && !isSelected}
            />
            <span 
              className="text-lg cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
              style={styleUtils.bodyStyles}
            >
              Type {type}: {typeData?.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span 
              className="text-lg font-medium"
              style={styleUtils.headingStyles}
            >
              {Math.round(score)}
            </span>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p 
              className="text-gray-600 mb-3"
              style={styleUtils.bodyStyles}
            >
              {typeData?.briefDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Type Comparison Page
export const TypeComparisonPage = ({ typesData }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const router = useRouter();

  const handleTypeSelect = (type) => {
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

  const characteristicRows = [
    { label: 'Type Name', key: 'name' },
    { label: 'Top Priority', key: 'priority' },
    { label: 'Secondary Desires', key: 'secondaryDesires' },
    { label: 'Biggest Fear', key: 'biggestFear' },
    { label: 'Secondary Fears', key: 'secondaryFears' },
    { label: 'At Their Best', key: 'atTheirBest' },
    { label: 'Under Stress', key: 'underStress' },
    { label: 'Wake-Up Call', key: 'wakeUpCall' },
    { label: 'Mental Habit', key: 'mentalHabit' },
    { label: 'Fundamental Flaw', key: 'fundamentalFlaw' },
    { label: 'False Narrative', key: 'falseNarrative' },
    { label: 'Key to Growth', key: 'keyToGrowth' }
  ];

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-4 space-y-1">
          {value.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return value;
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-6xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <h1 
              className="text-3xl"
              style={{ ...styleUtils.headingStyles, color: theme.colors.text }}
            >
              Compare Enneagram Types
            </h1>
            <p
              className="text-lg mt-2"
              style={{ ...styleUtils.bodyStyles, color: theme.colors.text }}
            >
              Select up to three types to compare their characteristics
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(typeNum => (
                <Button
                  key={typeNum}
                  onClick={() => handleTypeSelect(typeNum.toString())}
                  variant={selectedTypes.includes(typeNum.toString()) ? "default" : "outline"}
                  className={`h-auto py-3 ${
                    selectedTypes.includes(typeNum.toString()) 
                      ? "bg-primary text-white hover:bg-primary/90" 
                      : "hover:bg-primary/5"
                  }`}
                  disabled={selectedTypes.length >= 3 && !selectedTypes.includes(typeNum.toString())}
                >
                  <div className="text-left">
                    <div className="font-medium">Type {typeNum}</div>
                    <div className="text-sm opacity-90">{typesData[typeNum.toString()]?.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedTypes.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(0,1fr))] gap-6">
                <div className="space-y-8">
                  {characteristicRows.map(row => (
                    <div
                      key={row.key}
                      className="h-full flex items-center"
                    >
                      <span 
                        className="font-medium"
                        style={styleUtils.headingStyles}
                      >
                        {row.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                {selectedTypes.map(typeNum => {
                  const typeData = typesData[typeNum];
                  return (
                    <div key={typeNum} className="space-y-8">
                      {characteristicRows.map(row => (
                        <div
                          key={row.key}
                          className="p-4 rounded bg-gray-50"
                        >
                          <div style={styleUtils.bodyStyles}>
                            {formatValue(typeData[row.key])}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};