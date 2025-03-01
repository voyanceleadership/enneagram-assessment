// src/components/enneagram/types/sections/RelatedTypes/RelatedTypesMain.tsx
/**
 * RelatedTypesMain Component
 * 
 * This component serves as the main container for all related types content in the Enneagram type page.
 * It organizes the information about wing types and line connections into a tabbed interface,
 * allowing users to explore different aspects of type relationships in the Enneagram system.
 * 
 * Key Features:
 * - Tabbed navigation between different sections (Explorer, Wings, Lines)
 * - Expandable information cards with detailed explanations
 * - Interactive elements for exploring type relationships
 * - Consistent styling and visual hierarchy
 * 
 * The component handles the logic for extracting and formatting type relationship data,
 * managing section navigation, and orchestrating the overall user experience.
 */

import React, { useState } from 'react';
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
  ChevronFirst,
  ChevronLast,
  Component,
  ChevronsRightLeft,
  Share2,
  MoveDownRight,
  MoveUpRight,
  ArrowRight,
  ArrowLeft 
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
   * Ensures consistent type name formatting throughout the component
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
   * Wing types are adjacent to the core type on the Enneagram circle
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
   * Includes type number, name, and detail information
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
   * Uses the ENNEAGRAM_RELATIONSHIPS constant to look up connections
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
   * Includes type number, name, description, and dynamics information
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
   * Each option represents a different view of the Enneagram symbol
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
   * Each section has an id, title, color, and associated content
   */
  const sections: SubSection[] = [
    {
      id: 'explorer',
      title: 'Symbol Explorer',
      color: sectionColor,
      content: {}
    },
    {
      id: 'wing-intro',  // Changed from 'wings' to 'wing-intro'
      title: 'Wing Types',
      color: sectionColor,
      content: typeData.sections.wingTypes
    },
    {
      id: 'line-intro',  // Changed from 'lines' to 'line-intro'
      title: 'Line Types',
      color: sectionColor,
      content: typeData.sections.lineTypes
    }
  ];

  /**
   * Use the SubSectionTabs hook to manage tab state and references
   * Handles tab selection, scroll behavior, and content display
   */
  const { activeTab, handleTabChange, contentRefs, tabsContainerRef } = useSubSectionTabs({
    sections,
    sectionId: 'related-types'
  });

  /**
   * Handle scrolling to sections and subsections
   * Provides smooth navigation between different parts of the content
   */
  const handleScrollToSection = (sectionId: string, subsectionId?: string) => {
    if (subsectionId) {
      // For specific subsections within wing types or line types
      if (sectionId === 'wings') {
        // First switch to the Wings tab
        handleTabChange(1);
        
        // After a short delay to let the tab change take effect
        setTimeout(() => {
          // Find subsection element
          const subsectionElement = document.querySelector(`[data-subsection-id="${subsectionId}"]`);
          if (!subsectionElement) return;
          
          // Find the section-related-types element to act as the parent section
          const sectionElement = document.getElementById('section-related-types');
          if (!sectionElement) return;
          
          // Find section header
          const sectionHeader = sectionElement.querySelector('[data-section-header]');
          if (!sectionHeader) return;
          
          // Find the tabs container
          const tabsContainer = tabsContainerRef.current;
          if (!tabsContainer) return;
          
          // Calculate offsets exactly as done in TypeSidebar
          const navbarHeight = 64; // Main navigation bar height
          const headerHeight = sectionHeader.getBoundingClientRect().height;
          const tabsHeight = tabsContainer.getBoundingClientRect().height;
          const padding = 24; // Additional padding for visual comfort
          
          // Calculate final scroll position
          const elementPosition = subsectionElement.getBoundingClientRect().top;
          const totalOffset = navbarHeight + headerHeight + tabsHeight + padding;
          const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
          
          // Perform the scroll
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      } else if (sectionId === 'lines') {
        // First switch to the Lines tab
        handleTabChange(2);
        
        // Same scrolling logic as for wings
        setTimeout(() => {
          const subsectionElement = document.querySelector(`[data-subsection-id="${subsectionId}"]`);
          if (!subsectionElement) return;
          
          const sectionElement = document.getElementById('section-related-types');
          if (!sectionElement) return;
          
          const sectionHeader = sectionElement.querySelector('[data-section-header]');
          if (!sectionHeader) return;
          
          const tabsContainer = tabsContainerRef.current;
          if (!tabsContainer) return;
          
          const navbarHeight = 64;
          const headerHeight = sectionHeader.getBoundingClientRect().height;
          const tabsHeight = tabsContainer.getBoundingClientRect().height;
          const padding = 24;
          
          const elementPosition = subsectionElement.getBoundingClientRect().top;
          const totalOffset = navbarHeight + headerHeight + tabsHeight + padding;
          const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else if (sectionId === 'category-intro') {
      // Scroll to the category intro section
      const introElement = document.getElementById('category-intro');
      if (!introElement) return;
      
      const sectionElement = document.getElementById('section-related-types');
      if (!sectionElement) return;
      
      const sectionHeader = sectionElement.querySelector('[data-section-header]');
      if (!sectionHeader) return;
      
      const tabsContainer = tabsContainerRef.current;
      if (!tabsContainer) return;
      
      const navbarHeight = 64;
      const headerHeight = sectionHeader.getBoundingClientRect().height;
      const tabsHeight = tabsContainer.getBoundingClientRect().height;
      const padding = 24;
      
      const elementPosition = introElement.getBoundingClientRect().top;
      const totalOffset = navbarHeight + headerHeight + tabsHeight + padding;
      const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else if (sectionId === 'wing-intro') {
      // Switch to Wing Types tab and scroll to it
      handleTabChange(1);
      
      setTimeout(() => {
        const introElement = document.getElementById('wing-intro');
        if (!introElement) return;
        
        const sectionElement = document.getElementById('section-related-types');
        if (!sectionElement) return;
        
        const sectionHeader = sectionElement.querySelector('[data-section-header]');
        if (!sectionHeader) return;
        
        const tabsContainer = tabsContainerRef.current;
        if (!tabsContainer) return;
        
        const navbarHeight = 64;
        const headerHeight = sectionHeader.getBoundingClientRect().height;
        const tabsHeight = tabsContainer.getBoundingClientRect().height;
        const padding = 24;
        
        const elementPosition = introElement.getBoundingClientRect().top;
        const totalOffset = navbarHeight + headerHeight + tabsHeight + padding;
        const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    } else if (sectionId === 'line-intro') {
      // Switch to Line Types tab and scroll to it
      handleTabChange(2);
      
      setTimeout(() => {
        const introElement = document.getElementById('line-intro');
        if (!introElement) return;
        
        const sectionElement = document.getElementById('section-related-types');
        if (!sectionElement) return;
        
        const sectionHeader = sectionElement.querySelector('[data-section-header]');
        if (!sectionHeader) return;
        
        const tabsContainer = tabsContainerRef.current;
        if (!tabsContainer) return;
        
        const navbarHeight = 64;
        const headerHeight = sectionHeader.getBoundingClientRect().height;
        const tabsHeight = tabsContainer.getBoundingClientRect().height;
        const padding = 24;
        
        const elementPosition = introElement.getBoundingClientRect().top;
        const totalOffset = navbarHeight + headerHeight + tabsHeight + padding;
        const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation - Sticky positioned for easier access */}
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

      {/* Introduction Card - Expandable for more detailed information */}
      <Card className="bg-white shadow-md border-0 overflow-hidden">
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
        <div 
          ref={el => contentRefs.current[0] = el}
          data-subsection-id="explorer"
        >
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
          <div 
            id="wing-intro"
            data-subsection-id="wing-intro"
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
        <div data-subsection-id="wings">
          <WingTypesSection
            typeDigit={typeData.typeDigit}
            sectionColor={sectionColor}
            wingTypes={wingTypes}
          />
        </div>

        {/* Line Types Introduction - Expandable explanation of line types */}
        <Card className="bg-white shadow-md border-0 overflow-hidden">
          <div 
            id="line-intro"
            data-subsection-id="line-intro"
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
        <div data-subsection-id="lines">
          <LineTypesSection 
            typeDigit={typeData.typeDigit}
            sectionColor={sectionColor}
            lineTypes={lineTypes}
          />
        </div>

        {/* Summary Card - Closing thoughts on related types */}
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