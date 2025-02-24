// src/components/enneagram/types/sections/RelatedTypes/RelatedTypesMain.tsx

import React from 'react';
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

interface RelatedTypesProps {
  typeData: TypeData;
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

export default function RelatedTypesMain({ typeData }: RelatedTypesProps) {
  const sectionColor = theme.colors.text;
  
  // Helper functions
  // Format type names with "The"
  const formatTypeNameWithThe = (name: string): string => {
    // Check if the name already starts with "The"
    if (name.startsWith('The ')) {
      return name;
    }
    return `The ${name}`;
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
        .find(([key]) => key.includes(`Type ${wingNumbers.left}:`))?.[1]
    },
    right: {
      number: wingNumbers.right.toString(),
      name: formatTypeNameWithThe(TYPE_NAMES[wingNumbers.right.toString()]),
      data: Object.entries(typeData.sections.wingTypes)
        .find(([key]) => key.includes(`Type ${wingNumbers.right}:`))?.[1]
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

  // Extract line type data
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

  // Create variation options
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

  const variationOptions = getVariationOptions();
  
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

  // Handle scrolling to sections and subsections using the exact approach from TypeSidebar
  const handleScrollToSection = (sectionId: string, subsectionId?: string) => {
    if (subsectionId) {
      // First switch to the correct tab
      handleTabChange(sections.findIndex(section => section.id === subsectionId));
      
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
    } else if (sectionId === 'category-intro') {
      // Handle the category intro section scroll
      const categoryIntroElement = document.getElementById('category-intro');
      if (!categoryIntroElement) return;
      
      const navbarHeight = 64;
      const padding = 24;
      
      const elementPosition = categoryIntroElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - (navbarHeight + padding);
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth' 
      });
    }
  };

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

        {/* Categories Introduction */}
        <Card className="bg-white shadow-md border-0">
          <div 
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
          ref={el => contentRefs.current[1] = el}
          data-subsection-id="wings"
        >
          <WingTypesSection
            typeDigit={typeData.typeDigit}
            sectionColor={sectionColor}
            wingTypes={wingTypes}
          />
        </div>

        {/* Line Types Section */}
        <div 
          ref={el => contentRefs.current[2] = el}
          data-subsection-id="lines"
        >
          <LineTypesSection 
            typeDigit={typeData.typeDigit}
            sectionColor={sectionColor}
            lineTypes={lineTypes}
          />
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