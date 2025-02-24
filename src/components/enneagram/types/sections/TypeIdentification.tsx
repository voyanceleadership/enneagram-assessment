// TypeIdentification.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import BulletList from '../components/BulletList';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/enneagram/content/types';

interface TypeIdentificationProps {
  typeData: TypeData;
}

export default function TypeIdentification({ typeData }: TypeIdentificationProps) {
  const sections = [
    {
      id: 'might-be',
      title: `You Might Be a ${typeData.typeNumber} If...`,
      color: theme.colors.text,
      content: typeData.sections.mightBeType
    },
    {
      id: 'probably-not',
      title: `You're Probably Not a ${typeData.typeNumber} If...`,
      color: theme.colors.text,
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
        className="sticky top-[116px] bg-white z-10" // Adjusted from 168px to 104px
        data-tabs-container
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
            data-subsection-id={section.id}
            id={`section-${section.id}`}
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