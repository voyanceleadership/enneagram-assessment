// src/components/enneagram/types/sections/RelatedTypes/RelatedTypesMain.tsx
'use client';

/**
 * RelatedTypesMain Component - Improved for correct tab highlighting
 * 
 * This component serves as the main container for all related types content in the Enneagram type page.
 * Updated to properly handle tab activation from sidebar navigation.
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { theme } from '@/styles/theme';
import SubSectionTabs from '../../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/enneagram/content/types';
import { TYPE_NAMES } from '@/lib/enneagram/constants/sections';
import { ENNEAGRAM_RELATIONSHIPS } from '@/lib/enneagram/constants/relationships';
import SymbolExplorer from './SymbolExplorer';
import WingTypesSection from './WingTypesSection';
import LineTypesSection from './LineTypesSection';
import { SymbolVariation } from './explorer';
import { 
  ChevronDown, 
  Info, 
  Component,
  ChevronsRightLeft,
  Share2
} from 'lucide-react';

// Props for the component
interface RelatedTypesProps {
  typeData: TypeData;
}

// Section definition for the tabs
interface SubSection {
  id: string;
  title: string;
  color: string;
  content: Record<string, any>;
}

// Definition for variation options in the explorer
interface VariationOption {
  value: SymbolVariation;
  label: string;
  description: string;
}

export default function RelatedTypesMain({ typeData }: RelatedTypesProps) {
  // Section color for consistent styling
  const sectionColor = theme.colors.text;
  
  // State for expandable sections
  const [introExpanded, setIntroExpanded] = useState(false);
  const [wingIntroExpanded, setWingIntroExpanded] = useState(false);
  const [lineIntroExpanded, setLineIntroExpanded] = useState(false);
  
  /**
   * Helper function to format type names with "The" prefix
   */
  const formatTypeNameWithThe = (name: string): string => {
    // Check if the name already starts with "The"
    if (name.startsWith('The ')) {
      return name;
    }
    return `The ${name}`;
  };
  
  /**
   * Determine wing numbers based on the core type
   */
  const getWingNumbers = () => {
    const coreType = parseInt(typeData.typeDigit);
    return {
      left: coreType === 1 ? 9 : coreType - 1,
      right: coreType === 9 ? 1 : coreType + 1
    };
  };

  const wingNumbers = getWingNumbers();

  /**
   * Extract wing type data from the typeData object
   */
  const wingTypes = {
    left: {
      number: wingNumbers.left.toString(),
      name: formatTypeNameWithThe(TYPE_NAMES[wingNumbers.left.toString()]),
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.left}:`))?.[1]
    },
    right: {
      number: wingNumbers.right.toString(),
      name: formatTypeNameWithThe(TYPE_NAMES[wingNumbers.right.toString()]),
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.right}:`))?.[1]
    }
  };

  /**
   * Determine line connection numbers based on the core type
   */
  const getLineNumbers = () => {
    const coreType = parseInt(typeData.typeDigit);
    return {
      stress: ENNEAGRAM_RELATIONSHIPS[coreType as 1|2|3|4|5|6|7|8|9].stress,
      growth: ENNEAGRAM_RELATIONSHIPS[coreType as 1|2|3|4|5|6|7|8|9].growth
    };
  };

  const lineNumbers = getLineNumbers();

  /**
   * Extract line type data from the typeData object
   */
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

  /**
   * Create variation options for the symbol explorer dropdown
   */
  const getVariationOptions = (): VariationOption[] => {
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
        label: `${TYPE_NAMES[wingTypes.left.number]} Wing`,
        description: `Focus on Type ${wingTypes.left.number} wing connection`
      },
      {
        value: 'right-wing',
        label: `${TYPE_NAMES[wingTypes.right.number]} Wing`,
        description: `Focus on Type ${wingTypes.right.number} wing connection`
      },
      {
        value: 'both-lines',
        label: 'Both Lines',
        description: 'View both line connections'
      },
      {
        value: 'stress-line',
        label: `Stress Line`,
        description: `View stress direction to Type ${lineTypes.stress.number}`
      },
      {
        value: 'growth-line',
        label: `Growth Line`,
        description: `View growth direction to Type ${lineTypes.growth.number}`
      }
    ];
  };

  const variationOptions = getVariationOptions();
  
  /**
   * Define section tabs for the component
   */
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

  /**
   * Use the SubSectionTabs hook to manage tab state and references
   */
  const { activeTab, handleTabChange, contentRefs, tabsContainerRef, setActiveTabById } = useSubSectionTabs({
    sections,
    sectionId: 'related-types'
  });
  
  /**
   * Check URL hash on mount and when it changes to update active tab
   */
  useEffect(() => {
    const checkUrlHash = () => {
      // Get the current hash
      const hash = window.location.hash;
      if (!hash) return;
      
      // Check if this hash targets one of our tabs
      const segments = hash.substring(1).split('-');
      if (segments.length >= 3 && segments[0] === 'anchor' && segments[1] === 'related-types') {
        const targetId = segments[2];
        
        // Find the tab index for this target
        const tabIndex = sections.findIndex(section => section.id === targetId);
        if (tabIndex !== -1 && tabIndex !== activeTab) {
          handleTabChange(tabIndex);
        }
      }
    };
    
    // Check on mount
    checkUrlHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', checkUrlHash);
    return () => {
      window.removeEventListener('hashchange', checkUrlHash);
    };
  }, [sections, activeTab, handleTabChange]);
  
  /**
   * Simple scroll handler for section links
   */
  const handleScrollToSection = (sectionId: string, subsectionId?: string) => {
    let hash: string;
    
    if (sectionId === 'wings') {
      // Switch to Wings tab
      handleTabChange(1);
      hash = `#anchor-related-types-wings`;
    } else if (sectionId === 'lines') {
      // Switch to Lines tab
      handleTabChange(2);
      hash = `#anchor-related-types-lines`;
    } else if (subsectionId) {
      hash = `#anchor-related-types-${sectionId}-${subsectionId}`;
    } else {
      hash = `#anchor-related-types-${sectionId}`;
    }
    
    // Update URL hash
    if (window.history.pushState) {
      window.history.pushState(null, '', hash);
    } else {
      window.location.hash = hash;
    }
  };

  return (
    <div className="space-y-6">
      {/* Set up anchors for each section and subsection */}
      <div id="anchor-related-types-explorer"></div>
      <div id="anchor-related-types-wings"></div>
      <div id="anchor-related-types-lines"></div>
      
      {/* Tabs Navigation - Sticky positioned for easier access */}
      <div 
        ref={tabsContainerRef}
        className="sticky top-[64px] bg-white z-10"
        style={{ top: '64px' }}
        data-tabs-container
      >
        <SubSectionTabs
          sections={sections}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          equalWidth={true}
          parentSectionId="related-types"
        />
      </div>

      {/* Introduction Card - Expandable for more detailed information */}
      <Card className="bg-white shadow-md border-0 overflow-hidden">
        <div id="anchor-related-types-intro"></div>
        <div 
          className="p-6 flex items-start justify-between cursor-pointer"
          onClick={() => setIntroExpanded(!introExpanded)}
        >
          <div className="flex items-start space-x-4">
            <div className="rounded-full p-3 bg-blue-50 mt-1 flex-shrink-0">
              <Info className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-1">About Related Types</h3>
              <p className="text-gray-600">Understand how your type connects to others in the Enneagram system</p>
            </div>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${introExpanded ? 'rotate-180' : ''}`} 
          />
        </div>
        
        <div 
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: introExpanded ? '800px' : '0px' }}
        >
          <div className="px-6 pb-6 prose prose-gray max-w-none border-t border-gray-100 pt-4">
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
        </div>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Symbol Explorer Section - For interactive exploration */}
        <div ref={el => contentRefs.current[0] = el}>
          <SymbolExplorer 
            typeDigit={typeData.typeDigit}
            typeName={typeData.typeName}
            wingTypes={wingTypes}
            lineTypes={lineTypes}
            variationOptions={variationOptions}
            onScrollToSection={handleScrollToSection}
          />
        </div>

        {/* Categories Introduction - Overview of related types categories */}
        <Card className="bg-white shadow-md border-0">
          <div id="anchor-related-types-category-intro"></div>
          <div 
            id="category-intro" 
            className="p-6"
            data-subsection-id="category-intro"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full p-3 bg-purple-50 flex-shrink-0">
                <Component className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-800">
                Related Types Categories
              </h3>
            </div>
            <p className="text-gray-700 ml-16">
              The related types fall into two categories: wing types and line types.
            </p>
          </div>
        </Card>

        {/* Wing Types Introduction - Expandable explanation of wing types */}
        <Card className="bg-white shadow-md border-0 overflow-hidden">
          <div id="anchor-related-types-wings-intro"></div>
          <div 
            id="wing-intro"
            ref={el => contentRefs.current[1] = el} // Associate tab with this element
            className="p-6 flex items-start justify-between cursor-pointer"
            onClick={() => setWingIntroExpanded(!wingIntroExpanded)}
          >
            <div className="flex items-start space-x-4">
              <div className="rounded-full p-3 bg-green-50 mt-1 flex-shrink-0">
                <ChevronsRightLeft className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-1">Wing Types Explained</h3>
                <p className="text-gray-600">How wings influence and enhance your core type</p>
              </div>
            </div>
            <ChevronDown 
              className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${wingIntroExpanded ? 'rotate-180' : ''}`} 
            />
          </div>
          
          <div 
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: wingIntroExpanded ? '800px' : '0px' }}
          >
            <div className="px-6 pb-6 prose prose-gray max-w-none border-t border-gray-100 pt-4">
              <p>
                The types adjacent to your type on the circle (its "next-door neighbors") are referred to as your
                potential wing types. A wing type can be thought of as a secondary personality type. While your dominant Enneagram
                type drives most of your behavior, you might also relate strongly to many of the aspects of one (or
                both) of these neighboring types.
              </p>
              <p>
                Most people have one wing type, but it's also possible to have both wing types or no wing type.
                Your wing type may show up as one of your top two scores on the assessment, but it doesn't always.
                We encourage you to evaluate how much you resonate with each of your potential wing types
                subjectively.
              </p>
            </div>
          </div>
        </Card>

        {/* Wing Types Section - Tab content for wing types */}
        <div>
          <div id="anchor-related-types-wings-content"></div>
          <WingTypesSection
            typeDigit={typeData.typeDigit}
            sectionColor={sectionColor}
            wingTypes={wingTypes}
          />
        </div>

        {/* Line Types Introduction - Expandable explanation of line types */}
        <Card className="bg-white shadow-md border-0 overflow-hidden">
          <div id="anchor-related-types-lines-intro"></div>
          <div 
            id="line-intro"
            ref={el => contentRefs.current[2] = el} // Associate tab with this element
            className="p-6 flex items-start justify-between cursor-pointer"
            onClick={() => setLineIntroExpanded(!lineIntroExpanded)}
          >
            <div className="flex items-start space-x-4">
              <div className="rounded-full p-3 bg-blue-50 mt-1 flex-shrink-0">
                <Share2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-1">Line Types Explained</h3>
                <p className="text-gray-600">How stress and growth lines affect your personality</p>
              </div>
            </div>
            <ChevronDown 
              className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${lineIntroExpanded ? 'rotate-180' : ''}`} 
            />
          </div>
          
          <div 
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: lineIntroExpanded ? '800px' : '0px' }}
          >
            <div className="px-6 pb-6 prose prose-gray max-w-none border-t border-gray-100 pt-4">
              <p>
                In addition to wing connections, each Enneagram type is connected to two other types by lines in the symbol.
                These connections represent how your personality tends to shift under different conditions.
              </p>
              <p>
                Your stress line indicates how you might behave when you're under pressure, facing challenges, or feeling insecure.
                While these behaviors are often less healthy versions of another type, understanding this pattern can help you
                recognize when you're reacting to stress and find more balanced responses.
              </p>
              <p>
                Your growth line reveals how your personality might express itself when you're functioning at your best,
                feeling secure, and growing as a person. By consciously integrating the positive qualities of your growth line type,
                you can enhance your development and well-being.
              </p>
            </div>
          </div>
        </Card>

        {/* Line Types Section - Tab content for line types */}
        <div>
          <div id="anchor-related-types-lines-content"></div>
          <LineTypesSection 
            typeDigit={typeData.typeDigit}
            sectionColor={sectionColor}
            lineTypes={lineTypes}
          />
        </div>

        {/* Summary Card - Closing thoughts on related types */}
        <Card className="bg-white shadow-md border-0">
          <div id="anchor-related-types-summary"></div>
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