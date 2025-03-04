// src/components/enneagram/types/sections/DevelopmentLevels.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { theme } from '@/styles/theme';
import ExpandableContent from '../components/ExpandableContent';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import type { TypeData } from '@/lib/enneagram/content/types';

interface DevelopmentLevelsProps {
  typeData: TypeData;
}

/**
 * DevelopmentLevels Component - Updated for proper tab highlighting
 * 
 * Displays the three levels of development (Healthy, Average, Unhealthy)
 * for an Enneagram type using a tabbed interface.
 */
export default function DevelopmentLevels({ typeData }: DevelopmentLevelsProps) {
  const sections = [
    {
      id: 'healthy',
      title: 'Healthy Level',
      color: theme.colors.accent1,
      content: typeData.sections.healthyLevel
    },
    {
      id: 'average',
      title: 'Average Level',
      color: theme.colors.primary,
      content: typeData.sections.averageLevel
    },
    {
      id: 'unhealthy',
      title: 'Unhealthy Level',
      color: theme.colors.accent2,
      content: typeData.sections.unhealthyLevel
    }
  ];

  // Initialize with activeTabId instead of index for better identification
  const { activeTab, handleTabChange, contentRefs, tabsContainerRef, setActiveTabById } = useSubSectionTabs({
    sections,
    sectionId: 'levels'
  });

  // This useEffect will run when the component mounts and when the URL fragment changes
  React.useEffect(() => {
    // Check if there's a hash in the URL that matches one of our subsections
    const hash = window.location.hash;
    if (hash) {
      const subsectionId = hash.replace('#', '');
      
      // Find the section index that matches this ID
      const sectionIndex = sections.findIndex(section => 
        `anchor-levels-${section.id}` === subsectionId);
      
      if (sectionIndex !== -1) {
        // Set the active tab to this section
        handleTabChange(sectionIndex);
      }
    }
    
    // Set up listener for sidebar navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const subsectionId = hash.replace('#', '');
        
        // Check if this is one of our subsections
        sections.forEach((section, index) => {
          if (`anchor-levels-${section.id}` === subsectionId) {
            handleTabChange(index);
          }
        });
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [sections, handleTabChange]);

  return (
    <div className="mb-12">
      {/* Section anchors for direct navigation */}
      <div id="anchor-levels-healthy"></div>
      <div id="anchor-levels-average"></div>
      <div id="anchor-levels-unhealthy"></div>
      
      {/* Tabs container with correct sticky positioning - should be under the main header */}
      <div 
        ref={tabsContainerRef}
        className="sticky bg-white z-20"
        style={{ top: '64px' }}
        data-tabs-container
      >
        <SubSectionTabs
          sections={sections}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          equalWidth={true}
          parentSectionId="levels"
        />
      </div>

      {/* Original spacing between tabs and content */}
      <div className="h-8"></div>

      {/* Content sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div 
            key={idx}
            ref={el => contentRefs.current[idx] = el}
            data-section-id={section.id}
          >
            {/* Each section has its own anchor for direct navigation */}
            <Card 
              className="bg-white shadow-md border-0"
              id={`section-levels-${section.id}`}
              data-subsection-id={section.id}
            >
              <div className="p-6">
                <h3 
                  className="text-xl mb-4"
                  style={{ color: section.color }}
                >
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.content.map((trait, traitIndex) => (
                    <ExpandableContent
                      key={traitIndex}
                      summary={trait.trait}
                      explanation={trait.explanation}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}