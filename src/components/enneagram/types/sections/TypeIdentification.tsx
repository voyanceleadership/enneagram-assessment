// src/components/enneagram/types/sections/TypeIdentification.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import BulletList from '../components/BulletList';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/types/types';
import type { SubSection } from '../components/SubSectionTabs';

interface TypeIdentificationProps {
  typeData: TypeData;
}

export default function TypeIdentification({ typeData }: TypeIdentificationProps) {
  const sectionColor = theme.colors.text; // Dark Grey-Blue
  // Use the section color for both tabs
  const sections = [
    {
      id: 'mightBe',
      title: `You Might Be a ${typeData.typeNumber} If...`,
      color: sectionColor,
      content: typeData.sections.mightBeType
    } as SubSection,
    {
      id: 'probablyNot',
      title: `You're Probably Not a ${typeData.typeNumber} If...`,
      color: sectionColor,
      content: typeData.sections.probablyNotType
    }
  ];

  const { activeTab, handleTabChange, contentRefs, tabsContainerRef } = useSubSectionTabs({
    sections,
    sectionId: 'identification'
  });

  return (
    <div className="mb-12">
      {/* Tabs */}
      <div 
        ref={tabsContainerRef}
        className="sticky bg-white z-10"
        style={{ top: '168px' }}
      >
        <SubSectionTabs
          sections={sections}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          equalWidth={true}
        />
      </div>

      {/* Content sections */}
      <div className="space-y-6 mt-6">
        {sections.map((section, idx) => (
          <div 
            key={idx}
            ref={el => contentRefs.current[idx] = el}
          >
            <Card className="bg-white shadow-md border-0">
              <div className="p-6">
                <h3 
                  className="text-xl mb-4"
                  style={{ ...styleUtils.headingStyles, color: section.color }}
                >
                  {section.title}
                </h3>
                <BulletList items={section.content} />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}