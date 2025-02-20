/**
 * RelatedTypes Component
 * 
 * An interactive component for exploring and understanding related Enneagram types.
 * Features a symbol explorer and detailed sections for wings and lines.
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { theme, styleUtils } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../symbol/DynamicEnneagramSymbol';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/types/types';

// Valid symbol variations
type SymbolVariation = 'type-only' | 'left-wing' | 'right-wing' | 'stress-line' | 'growth-line' | 'related-types' | 'both-wings';

interface RelatedTypesProps {
  typeData: TypeData;
}

interface WingData {
  description: string;
  alias: string;
}

interface SubSection {
  id: string;
  title: string;
  color: string;
  content: Record<string, any>;
}

interface VariationOption {
  value: SymbolVariation;
  label: string;
  description: string;
}

const VARIATION_OPTIONS: VariationOption[] = [
  {
    value: 'related-types',
    label: 'All Related Types',
    description: 'See how your type connects to all related types'
  },
  {
    value: 'both-wings',
    label: 'Both Wings',
    description: 'View your connection to both wing types'
  },
  {
    value: 'left-wing',
    label: 'Left Wing',
    description: 'Focus on your connection to your left wing type'
  },
  {
    value: 'right-wing',
    label: 'Right Wing',
    description: 'Focus on your connection to your right wing type'
  },
  {
    value: 'stress-line',
    label: 'Stress Line',
    description: 'View your stress direction connection'
  },
  {
    value: 'growth-line',
    label: 'Growth Line',
    description: 'View your growth direction connection'
  }
];

export default function RelatedTypes({ typeData }: RelatedTypesProps) {
  const [selectedVariation, setSelectedVariation] = React.useState<SymbolVariation>('related-types');
  const sectionColor = theme.colors.text;

  // Process wing types
  const getWingNumbers = () => {
    const coreType = parseInt(typeData.typeDigit);
    return {
      left: coreType === 1 ? 9 : coreType - 1,
      right: coreType === 9 ? 1 : coreType + 1
    };
  };

  const wingNumbers = getWingNumbers();

  // Safely extract wing type data
  const wingTypes = {
    left: {
      number: wingNumbers.left.toString(),
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.left}:`))?.[1] as WingData
    },
    right: {
      number: wingNumbers.right.toString(),
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.right}:`))?.[1] as WingData
    }
  };

  // Safely extract line type data
  const getTypeNumber = (text: string): string => {
    return text?.match(/Type (\d+)/)?.[1] || '';
  };

  const lineTypes = {
    stress: {
      number: getTypeNumber(typeData.sections.lineTypes?.['Stress Line'] || ''),
      description: typeData.sections.lineTypes?.['Stress Line'] || ''
    },
    growth: {
      number: getTypeNumber(typeData.sections.lineTypes?.['Growth Line'] || ''),
      description: typeData.sections.lineTypes?.['Growth Line'] || ''
    }
  };

  // Define sections with required content property
  const sections: SubSection[] = [
    {
      id: 'explorer',
      title: 'Symbol Explorer',
      color: sectionColor,
      content: {}
    },
    {
      id: 'wings',
      title: 'Wing Types',
      color: sectionColor,
      content: typeData.sections.wingTypes
    },
    {
      id: 'lines',
      title: 'Line Types',
      color: sectionColor,
      content: typeData.sections.lineTypes
    }
  ];

  const { activeTab, handleTabChange, contentRefs, tabsContainerRef } = useSubSectionTabs({
    sections,
    sectionId: 'relatedTypes'
  });

  return (
    <div className="mb-12">
      {/* Tabs for Navigation */}
      <div 
        ref={tabsContainerRef}
        className="sticky top-[168px] bg-white z-10"
        data-tabs-container
      >
        <SubSectionTabs
          sections={sections}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          equalWidth={true}
        />
      </div>

      <div className="h-6" />

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Symbol Explorer Section */}
        <div 
          ref={(el: HTMLDivElement | null) => void(contentRefs.current[0] = el)}
          data-subsection-id="explorer"
          className={activeTab === 0 ? '' : 'hidden'}
        >
          <Card className="bg-white shadow-md border-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-xl"
                  style={{ ...styleUtils.headingStyles, color: sectionColor }}
                >
                  Explore Type Relationships
                </h3>
                <Select
                  value={selectedVariation}
                  onValueChange={(value: SymbolVariation) => setSelectedVariation(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select variation" />
                  </SelectTrigger>
                  <SelectContent>
                    {VARIATION_OPTIONS.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2/3 mx-auto mb-6">
                  <DynamicEnneagramSymbol 
                    defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                    defaultVariation={selectedVariation}
                    interactive={false}
                  />
                </div>
                <p className="text-sm text-center text-gray-600 max-w-lg">
                  {VARIATION_OPTIONS.find(opt => opt.value === selectedVariation)?.description}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Wing Types Section */}
        <div 
          ref={(el: HTMLDivElement | null) => void(contentRefs.current[1] = el)}
          data-subsection-id="wings"
          className={activeTab === 1 ? '' : 'hidden'}
        >
          <Card className="bg-white shadow-md border-0">
            <div className="p-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Wing */}
                <div className="text-center">
                  <div className="w-1/2 mx-auto mb-4">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="left-wing"
                      interactive={false}
                    />
                  </div>
                  <h4 
                    className="text-xl mb-2"
                    style={{ ...styleUtils.headingStyles, color: sectionColor }}
                  >
                    Type {wingTypes.left.number}: {wingTypes.left.data?.alias || ''}
                  </h4>
                  <p className="text-base" style={{ color: theme.colors.text }}>
                    {wingTypes.left.data?.description || ''}
                  </p>
                </div>
                {/* Right Wing */}
                <div className="text-center">
                  <div className="w-1/2 mx-auto mb-4">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="right-wing"
                      interactive={false}
                    />
                  </div>
                  <h4 
                    className="text-xl mb-2"
                    style={{ ...styleUtils.headingStyles, color: sectionColor }}
                  >
                    Type {wingTypes.right.number}: {wingTypes.right.data?.alias || ''}
                  </h4>
                  <p className="text-base" style={{ color: theme.colors.text }}>
                    {wingTypes.right.data?.description || ''}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Line Types Section */}
        <div 
          ref={(el: HTMLDivElement | null) => void(contentRefs.current[2] = el)}
          data-subsection-id="lines"
          className={activeTab === 2 ? '' : 'hidden'}
        >
          <Card className="bg-white shadow-md border-0">
            <div className="p-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Stress Line */}
                <div className="text-center">
                  <div className="w-1/2 mx-auto mb-4">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="stress-line"
                      interactive={false}
                    />
                  </div>
                  <h4 
                    className="text-xl mb-2"
                    style={{ ...styleUtils.headingStyles, color: sectionColor }}
                  >
                    Stress Line: Type {lineTypes.stress.number}
                  </h4>
                  <p className="text-base" style={{ color: theme.colors.text }}>
                    {lineTypes.stress.description}
                  </p>
                </div>
                {/* Growth Line */}
                <div className="text-center">
                  <div className="w-1/2 mx-auto mb-4">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="growth-line"
                      interactive={false}
                    />
                  </div>
                  <h4 
                    className="text-xl mb-2"
                    style={{ ...styleUtils.headingStyles, color: sectionColor }}
                  >
                    Growth Line: Type {lineTypes.growth.number}
                  </h4>
                  <p className="text-base" style={{ color: theme.colors.text }}>
                    {lineTypes.growth.description}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}