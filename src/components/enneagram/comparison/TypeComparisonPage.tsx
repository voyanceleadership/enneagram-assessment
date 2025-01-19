//src/components/enneagram/comparison/TypeComparisonPage.tsx
//Actual comparison UI component

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { theme, styleUtils } from '@/styles/theme';
import { TypeData } from '@/lib/types';

interface TypeComparisonPageProps {
  typesData: Record<string, TypeData>;
  preSelectedTypes: string[];
}

const COMPARISON_ROWS = [
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
];

const TypeComparisonPage: React.FC<TypeComparisonPageProps> = ({ typesData, preSelectedTypes = [] }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(preSelectedTypes);

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
    const content = typeData[field as keyof TypeData];
    if (type === 'list' && Array.isArray(content)) {
      return (
        <ul className="list-disc pl-6 space-y-2">
          {content.map((item, idx) => (
            <li key={idx} className="text-gray-700">{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-gray-700">{content as string}</p>;
  };

  return (
    <div className="max-w-[90%] mx-auto px-4 py-8">
      {/* Type Selection Buttons */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold mb-4">Compare Enneagram Types</h1>
          <p className="text-gray-600 mb-6">Select up to three types to compare</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(typesData).map(([type, data]) => (
              <Button
                key={type}
                onClick={() => handleTypeSelect(type)}
                disabled={selectedTypes.length >= 3 && !selectedTypes.includes(type)}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                className="h-auto p-4 text-left flex flex-col items-start"
              >
                <span className="font-bold mb-2">Type {type}: {data.typeName}</span>
                <span className="text-sm opacity-80">{data.briefDescription}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Matrix */}
      {selectedTypes.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                {/* Header Row */}
                <thead>
                  <tr>
                    <th className="border border-gray-200 bg-gray-50 p-4 w-48"></th>
                    {selectedTypes.map(type => (
                      <th 
                        key={type}
                        className="border border-gray-200 bg-gray-50 p-4 font-semibold text-left"
                        style={{ minWidth: '300px' }}
                      >
                        Type {type}: {typesData[type].typeName}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Data Rows */}
                <tbody>
                  {COMPARISON_ROWS.map(row => (
                    <tr key={row.field}>
                      <td className="border border-gray-200 bg-gray-50 p-4 font-medium">
                        {row.label}
                      </td>
                      {selectedTypes.map(type => (
                        <td key={type} className="border border-gray-200 p-4">
                          {renderCellContent(typesData[type], row.field, row.type)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TypeComparisonPage;