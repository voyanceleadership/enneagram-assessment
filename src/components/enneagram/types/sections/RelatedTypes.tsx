import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { theme, styleUtils } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../symbol/DynamicEnneagramSymbol';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/enneagram/content/types';
import { TYPE_NAMES } from '@/lib/enneagram/constants/sections';
import { ENNEAGRAM_RELATIONSHIPS } from '@/lib/enneagram/constants/relationships';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ExplanationPanel } from '../components/ExplanationPanel';

// Valid symbol variations
type SymbolVariation = 'type-only' | 'left-wing' | 'right-wing' | 'stress-line' | 'growth-line' | 'related-types' | 'both-wings' | 'both-lines';

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

const getVariationOptions = (wingTypes: any, lineTypes: any): VariationOption[] => {
  return [
    {
      value: 'related-types',
      label: 'All Related Types',
      description: 'See how your type connects to all related types'
    },
    {
      value: 'both-wings',
      label: 'Both Wings',
      description: 'View both wing connections'
    },
    {
      value: 'left-wing',
      label: `${wingTypes.left.number} Wing`,
      description: `Focus on Type ${wingTypes.left.number} wing connection`
    },
    {
      value: 'right-wing',
      label: `${wingTypes.right.number} Wing`,
      description: `Focus on Type ${wingTypes.right.number} wing connection`
    },
    {
      value: 'both-lines',
      label: 'Both Lines',
      description: 'View both line connections'
    },
    {
      value: 'stress-line',
      label: `Stress Line (${lineTypes.stress.number})`,
      description: `View stress direction to Type ${lineTypes.stress.number}`
    },
    {
      value: 'growth-line',
      label: `Growth Line (${lineTypes.growth.number})`,
      description: `View growth direction to Type ${lineTypes.growth.number}`
    }
  ];
};

export default function RelatedTypes({ typeData }: RelatedTypesProps) {
  const [selectedVariation, setSelectedVariation] = useState<SymbolVariation>('related-types');
  const [showExplanation, setShowExplanation] = useState(false);
  const sectionColor = theme.colors.text;
  
  // Refs for scrolling to sections
  const wingsTabRef = useRef<HTMLDivElement>(null);
  const linesTabRef = useRef<HTMLDivElement>(null);
  const leftWingRef = useRef<HTMLDivElement>(null);
  const rightWingRef = useRef<HTMLDivElement>(null);
  const stressLineRef = useRef<HTMLDivElement>(null);
  const growthLineRef = useRef<HTMLDivElement>(null);
  const categoryIntroRef = useRef<HTMLDivElement>(null);

  // Helper functions
  
  // Format type names with "The"
  const formatTypeNameWithThe = (name: string): string => {
    // Check if the name already starts with "The"
    if (name.startsWith('The ')) {
      return name;
    }
    return `The ${name}`;
  };
  
  // Scroll to section with offset
  const scrollToSection = (sectionId: string) => {
    let targetElement: HTMLElement | null = null;
    let offset = 120; // Default offset to account for header and tabs
    
    switch (sectionId) {
      case 'category-intro':
        if (categoryIntroRef.current) {
          targetElement = categoryIntroRef.current;
        }
        break;
      case 'wings-section':
        if (wingsTabRef.current) {
          targetElement = wingsTabRef.current;
          // First switch to the wings tab
          handleTabChange('wings');
        }
        break;
      case 'lines-section':
        if (linesTabRef.current) {
          targetElement = linesTabRef.current;
          // First switch to the lines tab
          handleTabChange('lines');
        }
        break;
      case 'left-wing':
        if (leftWingRef.current) {
          targetElement = leftWingRef.current;
          handleTabChange('wings');
        }
        break;
      case 'right-wing':
        if (rightWingRef.current) {
          targetElement = rightWingRef.current;
          handleTabChange('wings');
        }
        break;
      case 'stress-line':
        if (stressLineRef.current) {
          targetElement = stressLineRef.current;
          handleTabChange('lines');
        }
        break;
      case 'growth-line':
        if (growthLineRef.current) {
          targetElement = growthLineRef.current;
          handleTabChange('lines');
        }
        break;
      default:
        const element = document.getElementById(sectionId);
        if (element) {
          targetElement = element;
        }
    }
    
    if (targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

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
      name: formatTypeNameWithThe(TYPE_NAMES[wingNumbers.left.toString()]),
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.left}:`))?.[1] as WingData
    },
    right: {
      number: wingNumbers.right.toString(),
      name: formatTypeNameWithThe(TYPE_NAMES[wingNumbers.right.toString()]),
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.right}:`))?.[1] as WingData
    }
  };

  // Get line type numbers from relationships
  const getLineNumbers = () => {
    const coreType = parseInt(typeData.typeDigit);
    return {
      stress: ENNEAGRAM_RELATIONSHIPS[coreType as 1|2|3|4|5|6|7|8|9].stress,
      growth: ENNEAGRAM_RELATIONSHIPS[coreType as 1|2|3|4|5|6|7|8|9].growth
    };
  };

  const lineNumbers = getLineNumbers();

  // Extract line type data with consistent structure to wings
  const lineTypes = {
    stress: {
      number: lineNumbers.stress.toString(),
      name: formatTypeNameWithThe(TYPE_NAMES[lineNumbers.stress.toString()]),
      description: Object.entries(typeData.sections.lineTypes)
        .find(([key]) => key.includes(`Type ${lineNumbers.stress}:`))?.[1]?.description || '',
      dynamics: Object.entries(typeData.sections.lineTypes)
        .find(([key]) => key.includes(`Type ${lineNumbers.stress}:`))?.[1]?.dynamics || {}
    },
    growth: {
      number: lineNumbers.growth.toString(),
      name: formatTypeNameWithThe(TYPE_NAMES[lineNumbers.growth.toString()]),
      description: Object.entries(typeData.sections.lineTypes)
        .find(([key]) => key.includes(`Type ${lineNumbers.growth}:`))?.[1]?.description || '',
      dynamics: Object.entries(typeData.sections.lineTypes)
        .find(([key]) => key.includes(`Type ${lineNumbers.growth}:`))?.[1]?.dynamics || {}
    }
  };

  // Generate explanation text based on selected variation
  const getExplanationContent = () => {
    const coreTypeName = `Type ${typeData.typeDigit}: ${formatTypeNameWithThe(typeData.typeName)}`;
    
    switch (selectedVariation) {
      case 'related-types':
        return (
          <>
            <h4 className="text-lg font-medium mb-3">Related Types Overview</h4>
            <p className="mb-3">
              {coreTypeName} connects to four other types in the Enneagram symbol:
            </p>
            <p className="mb-3">
              <strong>Wing Types:</strong> Type {wingTypes.left.number} ({wingTypes.left.name}) on the left and Type {wingTypes.right.number} ({wingTypes.right.name}) on the right.
            </p>
            <p className="mb-3">
              <strong>Line Types:</strong> Type {lineTypes.stress.number} ({lineTypes.stress.name}) for stress and Type {lineTypes.growth.number} ({lineTypes.growth.name}) for growth.
            </p>
            <p className="mb-3">
              These connections form a unique pattern that influences how {coreTypeName} manifests and evolves.
            </p>
            <button 
              onClick={() => scrollToSection('explorer')} 
              className="text-primary hover:underline inline-flex items-center"
            >
              Explore all sections <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        );
      case 'both-wings':
        return (
          <>
            <h4 className="text-lg font-medium mb-3">Wing Types</h4>
            <p className="mb-3">
              The wing types for {coreTypeName} are Type {wingTypes.left.number} ({wingTypes.left.name}) and Type {wingTypes.right.number} ({wingTypes.right.name}).
            </p>
            <p className="mb-3">
              While most people have one dominant wing type, it's also possible to relate to both wing types - or neither. When a person relates to both wing types, it's highly individual which specific aspects of each type they resonate with.
            </p>
            <p className="mb-3">
              Having influence from both wings creates a more nuanced personality blend, incorporating elements from three Enneagram types.
            </p>
            <button 
              onClick={() => scrollToSection('wings')} 
              className="text-primary hover:underline inline-flex items-center"
            >
              Learn more about wing types <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        );
      case 'left-wing':
        return (
          <>
            <h4 className="text-lg font-medium mb-3">Left Wing: Type {wingTypes.left.number}</h4>
            <p className="mb-3">
              {wingTypes.left.name} wing ({wingTypes.left.data?.alias})
            </p>
            <p className="mb-3">
              {wingTypes.left.data?.description.slice(0, 150)}...
            </p>
            <p className="mb-3">
              This wing type brings {typeData.typeDigit}s qualities of {wingTypes.left.data?.combination.strengths[0].toLowerCase()}.
            </p>
            <button 
              onClick={() => scrollToSection('left-wing')} 
              className="text-primary hover:underline inline-flex items-center"
            >
              See full left wing details <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        );
      case 'right-wing':
        return (
          <>
            <h4 className="text-lg font-medium mb-3">Right Wing: Type {wingTypes.right.number}</h4>
            <p className="mb-3">
              {wingTypes.right.name} wing ({wingTypes.right.data?.alias})
            </p>
            <p className="mb-3">
              {wingTypes.right.data?.description.slice(0, 150)}...
            </p>
            <p className="mb-3">
              This wing type brings {typeData.typeDigit}s qualities of {wingTypes.right.data?.combination.strengths[0].toLowerCase()}.
            </p>
            <button 
              onClick={() => scrollToSection('right-wing')} 
              className="text-primary hover:underline inline-flex items-center"
            >
              See full right wing details <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        );
      case 'both-lines':
        return (
          <>
            <h4 className="text-lg font-medium mb-3">Line Connections</h4>
            <p className="mb-3">
              {coreTypeName} has two important line connections:
            </p>
            <p className="mb-3">
              <strong>Stress Line:</strong> Type {lineTypes.stress.number} ({lineTypes.stress.name})
            </p>
            <p className="mb-3">
              <strong>Growth Line:</strong> Type {lineTypes.growth.number} ({lineTypes.growth.name})
            </p>
            <p className="mb-3">
              These connections show how your personality may shift under different conditions.
            </p>
            <button 
              onClick={() => scrollToSection('lines')} 
              className="text-primary hover:underline inline-flex items-center"
            >
              Learn more about line types <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        );
      case 'stress-line':
        return (
          <>
            <h4 className="text-lg font-medium mb-3">Stress Line: Type {lineTypes.stress.number}</h4>
            <p className="mb-3">
              {lineTypes.stress.name}
            </p>
            <p className="mb-3">
              {lineTypes.stress.description.slice(0, 150)}...
            </p>
            <p className="mb-3">
              Under stress, Type {typeData.typeDigit}s may display characteristics of Type {lineTypes.stress.number}.
            </p>
            <button 
              onClick={() => scrollToSection('stress-line')} 
              className="text-primary hover:underline inline-flex items-center"
            >
              See full stress line details <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        );
      case 'growth-line':
        return (
          <>
            <h4 className="text-lg font-medium mb-3">Growth Line: Type {lineTypes.growth.number}</h4>
            <p className="mb-3">
              {lineTypes.growth.name}
            </p>
            <p className="mb-3">
              {lineTypes.growth.description.slice(0, 150)}...
            </p>
            <p className="mb-3">
              At their best, Type {typeData.typeDigit}s may integrate positive aspects of Type {lineTypes.growth.number}.
            </p>
            <button 
              onClick={() => scrollToSection('growth-line')} 
              className="text-primary hover:underline inline-flex items-center"
            >
              See full growth line details <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        );
      default:
        return (
          <p>
            Select a variation to see how your type connects with others in the Enneagram system.
          </p>
        );
    }
  };

  const variationOptions = getVariationOptions(wingTypes, lineTypes);

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

  // Helper for styled button links
  const StyledButtonLink = ({ typeNumber, typeName }: { typeNumber: string, typeName: string }) => (
    <Link
      href={`/enneagram/types/type${typeNumber}`}
      className="inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-colors"
      style={{ 
        backgroundColor: theme.colors.primary,
        color: 'white',
        fontFamily: theme.fonts.heading,
        fontWeight: theme.fontWeights.medium,
        textDecoration: 'none' // Remove underline
      }}
    >
      Learn more about Type {typeNumber}: {typeName}
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div 
        ref={tabsContainerRef}
        className="sticky top-[116px] bg-white z-10"
        data-tabs-container
      >
        <SubSectionTabs
          sections={sections}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          equalWidth={true}
        />
      </div>

      {/* Introduction Card */}
      <Card className="bg-white shadow-md border-0">
        <div className="p-6 prose prose-gray max-w-none">
          <p>
            Almost everyone will say that their personality has changed over the course of their life, or can
            change even in the course of a single day. We know from experience that personality is complex and
            dynamic. For example, we can be one way at work and another way at home, or different around
            different people. This doesn't mean that we have "multiple personalities," and it makes perfect sense
            in the context of the Enneagram. It also explains how there might be aspects to your personality that
            aren't described by your dominant Enneagram type. That's where personality dynamics come in.
          </p>
          <p>
            As you look at the Enneagram symbol, you'll notice that every Enneagram type is located
            such that it's connected (either by an arc or a line) to four other types. These types are called
            the related types.
          </p>
        </div>
      </Card>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Symbol Explorer Section */}
        <div 
          ref={el => contentRefs.current[0] = el}
          data-subsection-id="explorer"
          id="explorer-section"
        >
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
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
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
                      typeData={typeData}
                      wingTypes={wingTypes}
                      lineTypes={lineTypes}
                      onScrollToSection={scrollToSection}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Categories Introduction */}
        <Card className="bg-white shadow-md border-0">
          <div 
            ref={categoryIntroRef}
            id="category-intro" 
            className="p-6 prose prose-gray max-w-none"
          >
            <p className="text-lg font-medium">
              The related types fall into two categories: wing types and line types.
            </p>
          </div>
        </Card>

        {/* Wing Types Section */}
        <div 
          ref={(el) => {
            contentRefs.current[1] = el;
            wingsTabRef.current = el;
          }}
          data-subsection-id="wings"
          id="wings-section"
        >
          <Card className="bg-white shadow-md border-0">
            <div className="p-6 prose prose-gray max-w-none">
              <h3 className="text-xl font-medium mb-4" style={{ color: sectionColor }}>
                Wing Types
              </h3>
              <p>
                The types adjacent to your type on the circle (its "next-door neighbors") are referred to as your
                potential wing types. A wing type can be thought of as a secondary personality type. While your dominant Enneagram
                type drives most of your behavior, you might also relate strongly to many of the aspects of one (or
                both) of these neighboring types.
              </p>
              <p className="mb-8">
                Most people have one wing type, but it's also possible to have both wing types or no wing type.
                Your wing type may show up as one of your top two scores on the assessment, but it doesn't always.
                We encourage you to evaluate how much you resonate with each of your potential wing types
                subjectively.
              </p>

              {/* Wing Types Container */}
              <div className="space-y-12">
                {/* Left Wing */}
                <div 
                  id="left-wing" 
                  ref={leftWingRef}
                  className="text-center"
                >
                  <h5 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                    Type {wingTypes.left.number}: {wingTypes.left.name}
                  </h5>
                  <p className="text-sm text-gray-600 mb-4">
                    {wingTypes.left.data?.alias}
                  </p>
                  <div className="w-2/3 mx-auto mb-6">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="left-wing"
                      interactive={false}
                    />
                  </div>
                  <div className="text-left mb-8">
                    <p className="text-base" style={{ color: theme.colors.text }}>
                      {wingTypes.left.data?.description}
                    </p>
                  </div>
                  <div className="text-left mb-8">
                    <h5 className="text-lg font-medium mb-3">Personality Blend</h5>
                    <p className="text-base" style={{ color: theme.colors.text }}>
                      {wingTypes.left.data?.combination.personality}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-left mb-8">
                    <div>
                      <h5 className="text-lg font-medium mb-3">Strengths</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        {wingTypes.left.data?.combination.strengths.map((strength, idx) => (
                          <li key={idx} className="text-base text-gray-700">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-3">Challenges</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        {wingTypes.left.data?.combination.challenges.map((challenge, idx) => (
                          <li key={idx} className="text-base text-gray-700">{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mb-3">
                    <StyledButtonLink
                      typeNumber={wingTypes.left.number}
                      typeName={wingTypes.left.name}
                    />
                  </div>
                </div>

                {/* Visual Separator */}
                <hr className="my-12 border-gray-200" />

                {/* Right Wing */}
                <div 
                  id="right-wing" 
                  ref={rightWingRef}
                  className="text-center"
                >
                  <h5 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                    Type {wingTypes.right.number}: {wingTypes.right.name}
                  </h5>
                  <p className="text-sm text-gray-600 mb-4">
                    {wingTypes.right.data?.alias}
                  </p>
                  <div className="w-2/3 mx-auto mb-6">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="right-wing"
                      interactive={false}
                    />
                  </div>
                  <div className="text-left mb-8">
                    <p className="text-base" style={{ color: theme.colors.text }}>
                      {wingTypes.right.data?.description}
                    </p>
                  </div>
                  <div className="text-left mb-8">
                    <h5 className="text-lg font-medium mb-3">Personality Blend</h5>
                    <p className="text-base" style={{ color: theme.colors.text }}>
                      {wingTypes.right.data?.combination.personality}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-left mb-8">
                    <div>
                      <h5 className="text-lg font-medium mb-3">Strengths</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        {wingTypes.right.data?.combination.strengths.map((strength, idx) => (
                          <li key={idx} className="text-base text-gray-700">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-3">Challenges</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        {wingTypes.right.data?.combination.challenges.map((challenge, idx) => (
                          <li key={idx} className="text-base text-gray-700">{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mb-3">
                    <StyledButtonLink
                      typeNumber={wingTypes.right.number}
                      typeName={wingTypes.right.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Line Types Section */}
        <div 
          ref={(el) => {
            contentRefs.current[2] = el;
            linesTabRef.current = el;
          }}
          data-subsection-id="lines"
          id="lines-section"
        >
          <Card className="bg-white shadow-md border-0">
            <div className="p-6 prose prose-gray max-w-none">
              <h3 className="text-xl font-medium mb-4" style={{ color: sectionColor }}>
                Line Types
              </h3>
              <p>
                The types connected to your type by a line across the circle are referred to as your line types. The
                characteristics of these two types may tend to show up in your personality in certain situations. Most
                commonly, the traits of these related types will show up when you're at your very best or under
                significant stress.
              </p>
              <p className="mb-8">
                When you display traits, behaviors, or thought patterns of your line types, it's called "going along your
                line." When you go along one of your lines, you demonstrate the behavior of your line type that aligns 
                with your current level of functioning.
              </p>

              {/* Line Types Container */}
              <div className="space-y-12">
                {/* Stress Line */}
                <div 
                  id="stress-line" 
                  ref={stressLineRef}
                  className="text-center"
                >
                  <h5 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                    Line to Type {lineTypes.stress.number}: {lineTypes.stress.name}
                  </h5>
                  <div className="w-2/3 mx-auto mb-6">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="stress-line"
                      interactive={false}
                    />
                  </div>
                  <div className="text-left mb-8">
                    <p className="text-base" style={{ color: theme.colors.text }}>
                      {lineTypes.stress.description}
                    </p>
                  </div>
                  
                  {/* Formatted exactly like Development Levels */}
                  <div className="text-left space-y-6 mb-8">
                    <div>
                      <h5 className="text-xl mb-4" style={{ color: theme.colors.accent1, fontWeight: theme.fontWeights.medium }}>
                        Healthy Level
                      </h5>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-white">
                          <p className="text-gray-700">{lineTypes.stress.dynamics.healthy}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl mb-4" style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.medium }}>
                        Average Level
                      </h5>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-white">
                          <p className="text-gray-700">{lineTypes.stress.dynamics.average}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl mb-4" style={{ color: theme.colors.accent2, fontWeight: theme.fontWeights.medium }}>
                        Unhealthy Level
                      </h5>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-white">
                          <p className="text-gray-700">{lineTypes.stress.dynamics.unhealthy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <StyledButtonLink
                      typeNumber={lineTypes.stress.number}
                      typeName={lineTypes.stress.name}
                    />
                  </div>
                </div>

                {/* Visual Separator */}
                <hr className="my-12 border-gray-200" />

                {/* Growth Line */}
                <div 
                  id="growth-line" 
                  ref={growthLineRef}
                  className="text-center"
                >
                  <h5 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                    Line to Type {lineTypes.growth.number}: {lineTypes.growth.name}
                  </h5>
                  <div className="w-2/3 mx-auto mb-6">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="growth-line"
                      interactive={false}
                    />
                  </div>
                  <div className="text-left mb-8">
                    <p className="text-base" style={{ color: theme.colors.text }}>
                      {lineTypes.growth.description}
                    </p>
                  </div>
                  
                  {/* Formatted exactly like Development Levels */}
                  <div className="text-left space-y-6 mb-8">
                    <div>
                      <h5 className="text-xl mb-4" style={{ color: theme.colors.accent1, fontWeight: theme.fontWeights.medium }}>
                        Healthy Level
                      </h5>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-white">
                          <p className="text-gray-700">{lineTypes.growth.dynamics.healthy}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl mb-4" style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.medium }}>
                        Average Level
                      </h5>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-white">
                          <p className="text-gray-700">{lineTypes.growth.dynamics.average}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl mb-4" style={{ color: theme.colors.accent2, fontWeight: theme.fontWeights.medium }}>
                        Unhealthy Level
                      </h5>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-white">
                          <p className="text-gray-700">{lineTypes.growth.dynamics.unhealthy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <StyledButtonLink
                      typeNumber={lineTypes.growth.number}
                      typeName={lineTypes.growth.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Card */}
        <Card className="bg-white shadow-md border-0">
          <div className="p-6 prose prose-gray max-w-none">
            <p>
              The concept of related types is advanced and complex; the first step is simply to understand your
              dominant type. But as you learn more about the system and each of your related Enneagram types,
              you'll begin to appreciate how each of the related types offers us a completely different way of
              thinking and operating. Human personality is complicated, so an accurate model of personality must
              be as well.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}