import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { theme, styleUtils } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../symbol/DynamicEnneagramSymbol';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/enneagram/content/types';
import { TYPE_NAMES } from '@/lib/enneagram/constants/sections';

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
  const [showExplanation, setShowExplanation] = React.useState(false);
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

  // Extract wing type data
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

  // Extract line type data
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

  // Get descriptive content based on selected variation
  const getVariationContent = () => {
    const coreTypeName = `Type ${typeData.typeDigit}: ${typeData.typeName}`;
    const leftWingName = `Type ${wingTypes.left.number}: ${TYPE_NAMES[wingTypes.left.number]}`;
    const rightWingName = `Type ${wingTypes.right.number}: ${TYPE_NAMES[wingTypes.right.number]}`;

    switch (selectedVariation) {
      case 'related-types':
        return {
          title: 'Understanding Type Connections',
          description: `Every Enneagram type has direct connections to four other types. For ${coreTypeName}, 
            the wing types are ${leftWingName} and ${rightWingName}, and the line types are 
            Type ${lineTypes.growth.number} (growth) and Type ${lineTypes.stress.number} (stress).`
        };
      case 'left-wing':
        return {
          title: leftWingName,
          description: wingTypes.left.data?.description || ''
        };
      case 'right-wing':
        return {
          title: rightWingName,
          description: wingTypes.right.data?.description || ''
        };
      case 'both-wings':
        return {
          title: 'Wing Influences',
          description: `${coreTypeName}s can be influenced by both ${leftWingName} and ${rightWingName}, 
            creating distinct variations in how their core type manifests.`
        };
      case 'stress-line':
        return {
          title: 'Stress Direction',
          description: `Under stress, ${coreTypeName}s may take on characteristics of Type ${lineTypes.stress.number}. 
            ${lineTypes.stress.description}`
        };
      case 'growth-line':
        return {
          title: 'Growth Direction',
          description: `In growth, ${coreTypeName}s may integrate positive qualities of Type ${lineTypes.growth.number}. 
            ${lineTypes.growth.description}`
        };
      default:
        return {
          title: '',
          description: ''
        };
    }
  };

  // Define sections
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
    sectionId: 'related-types'
  });

  return (
    <div className="mb-12">
      {/* Tabs Navigation */}
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

      {/* Space between tabs and content */}
      <div className="h-6" />

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div 
            key={section.id}
            ref={el => contentRefs.current[idx] = el}
            data-subsection-id={section.id}
          >
            <Card className="bg-white shadow-md border-0">
              <div className="p-6">
                {section.id === 'explorer' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 
                        className="text-xl"
                        style={{ ...styleUtils.headingStyles, color: sectionColor }}
                      >
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

                    <div className="relative">
                      {/* Symbol container */}
                      <div className={`
                        transition-all duration-300 ease-in-out
                        ${showExplanation ? 'w-2/3' : 'w-full'}
                      `}>
                        <DynamicEnneagramSymbol 
                          defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                          defaultVariation={selectedVariation}
                          interactive={false}
                        />
                        
                        {/* Show explanation button when panel is hidden */}
                        {!showExplanation && (
                          <button
                            onClick={() => setShowExplanation(true)}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 
                              bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3
                              hover:bg-white transition-colors"
                          >
                            <span className="sr-only">Show explanation</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-600"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4" />
                              <path d="M12 8h.01" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Animated explanation panel */}
                      <div className={`
                        absolute top-0 right-0 w-1/3 bg-gray-50 rounded-lg p-6
                        transform transition-all duration-300 ease-in-out
                        ${showExplanation 
                          ? 'translate-x-0 opacity-100' 
                          : 'translate-x-full opacity-0'
                        }
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
                          <h4 className="text-lg font-medium mb-3">
                            {getVariationContent().title}
                          </h4>
                          <p className="text-gray-600">
                            {getVariationContent().description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {section.id === 'wings' && (
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
                )}

                {section.id === 'lines' && (
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
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}