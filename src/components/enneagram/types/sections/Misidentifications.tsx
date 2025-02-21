// src/components/enneagram/types/sections/Misidentifications.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/enneagram/content/types';

interface MisidentificationType {
  type: string;
  explanation?: string;
  sharedTraits?: string[];
  keyDifferences?: string[];
}

export default function Misidentifications({ typeData }: { typeData: TypeData }) {
  const sections = [
    {
      id: 'others-as-type',  // Match the ID used in EnneagramTypePage
      title: `Types That May Misidentify as ${typeData.typeNumber}s`,
      color: theme.colors.text,
      content: typeData.sections.typesMisidentifyingAsThis
    },
    {
      id: 'type-as-others',  // Match the ID used in EnneagramTypePage
      title: `${typeData.typeNumber}s May Misidentify As...`,
      color: theme.colors.text,
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

      {/* Add space-y-6 equivalent spacing */}
      <div className="h-6" />

      {/* Content sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div 
            key={idx}
            ref={el => contentRefs.current[idx] = el}
            data-subsection-id={section.id}
            id={`section-${section.id}`}  // Add ID for scroll targeting
          >
            <Card className="bg-white shadow-md border-0">
              <div className="p-6">
                <h3 
                  className="text-xl mb-6"
                  style={{ ...styleUtils.headingStyles, color: section.color }}
                >
                  {section.title}
                </h3>
                <div className="space-y-6">
                  {(section.content as MisidentificationType[]).map((type, typeIdx) => (
                    <div key={typeIdx} className="last:mb-0">
                      <h4 
                        className="text-lg mb-3"
                        style={{ ...styleUtils.headingStyles, color: section.color }}
                      >
                        {type.type}
                      </h4>
                      {type.explanation && (
                        <div className="prose max-w-none">
                          <p className="text-gray-700">
                            {type.explanation}
                          </p>
                        </div>
                      )}
                    </div>
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