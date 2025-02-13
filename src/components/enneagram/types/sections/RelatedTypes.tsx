// src/components/enneagram/types/sections/RelatedTypes.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import TypeSymbol from '../components/TypeSymbol';
import SubSectionTabs from '../components/SubSectionTabs';
import { useSubSectionTabs } from '@/hooks/useSubSectionTabs';
import { TypeData } from '@/lib/types/types';

interface RelatedTypesProps {
  typeData: TypeData;
}

interface WingData {
  description: string;
  alias: string;
}

export default function RelatedTypes({ typeData }: RelatedTypesProps) {
  const sectionColor = theme.colors.text; // Dark Grey-Blue
  const sections = [
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
    sectionId: 'relatedTypes'
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
          >
            <Card className="bg-white shadow-md border-0">
              <div className="p-6">
                <h3 
                  className="text-xl mb-6"
                  style={{ ...styleUtils.headingStyles, color: section.color }}
                >
                  {section.title}
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  {Object.entries(section.content || {}).map(([typeString, data]) => {
                    const typeNumber = typeString.match(/Type (\d+)/)?.[1];
                    const typeName = typeString.replace(/Type \d+: /, '');
                    const wingData = section.id === 'wings' ? data as WingData : null;
                    
                    return typeNumber ? (
                      <div key={typeString} className="flex flex-col items-center text-center">
                        <TypeSymbol type={typeNumber} size={100} />
                        <h4 
                          className="text-xl mt-4 mb-2"
                          style={{ 
                            ...styleUtils.headingStyles,
                            color: section.color
                          }}
                        >
                          Type {typeNumber}: {typeName}
                        </h4>
                        {wingData && (
                          <div 
                            className="text-sm mb-4"
                            style={{ color: section.color }}
                          >
                            {wingData.alias}
                          </div>
                        )}
                        <p 
                          className="text-base"
                          style={{ color: theme.colors.text }}
                        >
                          {wingData ? wingData.description : data}
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}