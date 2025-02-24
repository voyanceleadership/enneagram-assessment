// src/components/enneagram/types/sections/DevelopmentLevels.tsx
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

  const { activeTab, handleTabChange, contentRefs, tabsContainerRef } = useSubSectionTabs({
    sections,
    sectionId: 'levels'
  });

  return (
    <div className="mb-12">
      {/* Tabs */}
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

      {/* Add space-y-6 equivalent spacing */}
      <div className="h-6" />

      {/* Content sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div 
            key={idx}
            ref={el => contentRefs.current[idx] = el}
            data-subsection-id={section.id}
          >
            <Card className="bg-white shadow-md border-0">
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