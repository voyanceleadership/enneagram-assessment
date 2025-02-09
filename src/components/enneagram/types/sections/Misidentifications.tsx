// src/components/enneagram/types/sections/Misidentifications.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/types/types';

export default function Misidentifications({ typeData }: { typeData: TypeData }) {
  const sectionColor = theme.colors.text; // Dark Grey-Blue
  const sections = [
    {
      id: 'otherTypes',
      title: `Types That May Misidentify as ${typeData.typeNumber}s`,
      color: sectionColor,
      content: typeData.sections.typesMisidentifyingAsThis
    } as SubSection,
    {
      id: 'thisType',
      title: `${typeData.typeNumber}s May Misidentify As...`,
      color: sectionColor,
      content: typeData.sections.thisTypeMayMisidentifyAs
    }
  ];

  const { activeTab, handleTabChange, contentRefs, tabsContainerRef } = useSubSectionTabs({
    sections,
    sectionId: 'misidentifications'
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
                {section.content.map((type, typeIdx) => (
                  <div key={typeIdx} className="mb-6 last:mb-0">
                    <h4 
                      className="text-xl mb-2"
                      style={{ ...styleUtils.headingStyles, color: section.color }}
                    >
                      {type.type}
                    </h4>
                    <div className="space-y-4">
                      {type.explanation && (
                        <p style={{ color: theme.colors.text }}>
                          {type.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}