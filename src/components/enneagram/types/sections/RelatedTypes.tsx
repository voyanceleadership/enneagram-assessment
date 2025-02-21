import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { theme, styleUtils } from '@/styles/theme';
import DynamicEnneagramSymbol from '../../symbol/DynamicEnneagramSymbol';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/enneagram/content/types';
import { TYPE_NAMES } from '@/lib/enneagram/constants/sections';
import Link from 'next/link';

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

const VARIATION_OPTIONS: VariationOption[] = [
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
    label: 'Left Wing',
    description: 'Focus on left wing connection'
  },
  {
    value: 'right-wing',
    label: 'Right Wing',
    description: 'Focus on right wing connection'
  },
  {
    value: 'both-lines',
    label: 'Both Lines',
    description: 'View both line connections'
  },
  {
    value: 'stress-line',
    label: 'Stress Line',
    description: 'View stress direction'
  },
  {
    value: 'growth-line',
    label: 'Growth Line',
    description: 'View growth direction'
  }
];

export default function RelatedTypes({ typeData }: RelatedTypesProps) {
  const [selectedVariation, setSelectedVariation] = useState<SymbolVariation>('related-types');
  const [showExplanation, setShowExplanation] = useState(false);
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
      name: TYPE_NAMES[wingNumbers.left.toString()],
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.left}:`))?.[1] as WingData
    },
    right: {
      number: wingNumbers.right.toString(),
      name: TYPE_NAMES[wingNumbers.right.toString()],
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.right}:`))?.[1] as WingData
    }
  };

  // Extract line type data
  const lineTypes = {
    stress: {
      number: Object.keys(typeData.sections.lineTypes || {})[0] || '',
      name: TYPE_NAMES[Object.keys(typeData.sections.lineTypes || {})[0] || ''],
      description: Object.values(typeData.sections.lineTypes || {})[0]?.description || '',
      dynamics: Object.values(typeData.sections.lineTypes || {})[0]?.dynamics || {}
    },
    growth: {
      number: Object.keys(typeData.sections.lineTypes || {})[1] || '',
      name: TYPE_NAMES[Object.keys(typeData.sections.lineTypes || {})[1] || ''],
      description: Object.values(typeData.sections.lineTypes || {})[1]?.description || '',
      dynamics: Object.values(typeData.sections.lineTypes || {})[1]?.dynamics || {}
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
    <div className="space-y-8">
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
                    {VARIATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <div className={`
                  transition-all duration-300 ease-in-out
                  ${showExplanation ? 'w-2/3' : 'w-full'}
                `}>
                  <DynamicEnneagramSymbol 
                    defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                    defaultVariation={selectedVariation}
                    interactive={false}
                  />
                </div>

                {/* Explanation Panel */}
                <div className={`
                  absolute top-0 right-0 w-1/3 bg-gray-50 rounded-lg p-6
                  transform transition-all duration-300 ease-in-out
                  ${showExplanation ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
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
                    <p className="text-gray-600">
                      Use this interactive diagram to explore how your type connects with others.
                      Select different views to understand wing relationships and growth/stress patterns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Categories Introduction */}
        <Card className="bg-white shadow-md border-0">
          <div className="p-6 prose prose-gray max-w-none">
            <p className="text-lg font-medium">
              The related types fall into two categories: wing types and line types.
            </p>
          </div>
        </Card>

        {/* Wing Types Section */}
        <div 
          ref={el => contentRefs.current[1] = el}
          data-subsection-id="wings"
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

              {/* Wing Types Container - Now vertical */}
              <div className="space-y-12">
                {/* Left Wing */}
                <div className="text-center">
                  <h5 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                    Left Wing
                  </h5>
                  <div className="w-2/3 mx-auto mb-6">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="left-wing"
                      interactive={false}
                    />
                  </div>
                  <h4 className="text-xl mb-2" style={{ ...styleUtils.headingStyles, color: sectionColor }}>
                    Type {wingTypes.left.number}: {wingTypes.left.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    {wingTypes.left.data?.alias}
                  </p>
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
                  <Link
                    href={`/enneagram/types/${wingTypes.left.number}`}
                    className="inline-flex items-center justify-center px-6 py-3 
                      text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 
                      transition-colors rounded-md border border-blue-200 
                      hover:border-blue-300 font-medium"
                  >
                    Learn more about Type {wingTypes.left.number}: {wingTypes.left.name}
                  </Link>
                </div>

                {/* Visual Separator */}
                <hr className="my-12 border-gray-200" />

                {/* Right Wing */}
                <div className="text-center">
                  <h5 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                    Right Wing
                  </h5>
                  <div className="w-2/3 mx-auto mb-6">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="right-wing"
                      interactive={false}
                    />
                  </div>
                  <h4 className="text-xl mb-2" style={{ ...styleUtils.headingStyles, color: sectionColor }}>
                    Type {wingTypes.right.number}: {wingTypes.right.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    {wingTypes.right.data?.alias}
                  </p>
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
                  <Link
                    href={`/enneagram/types/${wingTypes.right.number}`}
                    className="inline-flex items-center justify-center px-6 py-3 
                      text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 
                      transition-colors rounded-md border border-blue-200 
                      hover:border-blue-300 font-medium"
                  >
                    Learn more about Type {wingTypes.right.number}: {wingTypes.right.name}
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Line Types Section */}
        <div 
          ref={el => contentRefs.current[2] = el}
          data-subsection-id="lines"
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

              {/* Line Types Container - Vertical Layout */}
              <div className="space-y-12">
                {/* Stress Line */}
                <div className="text-center">
                  <h5 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                    Stress Line
                  </h5>
                  <div className="w-2/3 mx-auto mb-6">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="stress-line"
                      interactive={false}
                    />
                  </div>
                  <h4 className="text-xl mb-6" style={{ ...styleUtils.headingStyles, color: sectionColor }}>
                    Type {lineTypes.stress.number}: {lineTypes.stress.name}
                  </h4>
                  <div className="text-left mb-8">
                    <p className="text-base" style={{ color: theme.colors.text }}>
                      {lineTypes.stress.description}
                    </p>
                  </div>
                  <div className="text-left space-y-6 mb-8">
                    <div>
                      <h5 className="text-lg font-medium mb-3">At Their Best</h5>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-base" style={{ color: theme.colors.text }}>
                          {lineTypes.stress.dynamics.healthy}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-3">Average State</h5>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base" style={{ color: theme.colors.text }}>
                          {lineTypes.stress.dynamics.average}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-3">Under Stress</h5>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-base" style={{ color: theme.colors.text }}>
                          {lineTypes.stress.dynamics.unhealthy}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/enneagram/types/${lineTypes.stress.number}`}
                    className="inline-flex items-center justify-center px-6 py-3 
                      text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 
                      transition-colors rounded-md border border-blue-200 
                      hover:border-blue-300 font-medium"
                  >
                    Learn more about Type {lineTypes.stress.number}: {lineTypes.stress.name}
                  </Link>
                </div>

                {/* Visual Separator */}
                <hr className="my-12 border-gray-200" />

                {/* Growth Line */}
                <div className="text-center">
                  <h5 className="text-lg font-medium mb-4" style={{ color: sectionColor }}>
                    Growth Line
                  </h5>
                  <div className="w-2/3 mx-auto mb-6">
                    <DynamicEnneagramSymbol 
                      defaultType={parseInt(typeData.typeDigit) as 1|2|3|4|5|6|7|8|9}
                      defaultVariation="growth-line"
                      interactive={false}
                    />
                  </div>
                  <h4 className="text-xl mb-6" style={{ ...styleUtils.headingStyles, color: sectionColor }}>
                    Type {lineTypes.growth.number}: {lineTypes.growth.name}
                  </h4>
                  <div className="text-left mb-8">
                    <p className="text-base" style={{ color: theme.colors.text }}>
                      {lineTypes.growth.description}
                    </p>
                  </div>
                  <div className="text-left space-y-6 mb-8">
                    <div>
                      <h5 className="text-lg font-medium mb-3">At Their Best</h5>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-base" style={{ color: theme.colors.text }}>
                          {lineTypes.growth.dynamics.healthy}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-3">Average State</h5>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base" style={{ color: theme.colors.text }}>
                          {lineTypes.growth.dynamics.average}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-3">Under Stress</h5>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-base" style={{ color: theme.colors.text }}>
                          {lineTypes.growth.dynamics.unhealthy}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/enneagram/types/${lineTypes.growth.number}`}
                    className="inline-flex items-center justify-center px-6 py-3 
                      text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 
                      transition-colors rounded-md border border-blue-200 
                      hover:border-blue-300 font-medium"
                  >
                    Learn more about Type {lineTypes.growth.number}: {lineTypes.growth.name}
                  </Link>
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