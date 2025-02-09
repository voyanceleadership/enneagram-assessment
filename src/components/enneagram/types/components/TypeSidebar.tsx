// src/components/enneagram/types/components/TypeSidebar.tsx
import React, { useState, useEffect } from 'react';
import { theme } from '@/styles/theme';
import { ChevronRight } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  subsections?: {
    id: string;
    title: string;
  }[];
}

interface TypeSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (sectionId: string, subsectionId?: string) => void;
}

export default function TypeSidebar({ 
  sections, 
  activeSection,
  onSectionClick 
}: TypeSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Ensure active section's parent is expanded
  useEffect(() => {
    const activeSectionData = sections.find(section => 
      section.id === activeSection || 
      section.subsections?.some(sub => sub.id === activeSection)
    );
    
    if (activeSectionData && activeSectionData.subsections) {
      setExpandedSections(prev => new Set([...prev, activeSectionData.id]));
    }
  }, [activeSection, sections]);

  return (
    <div className="w-64 fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200">
      <nav className="h-full overflow-y-auto p-4">
        <div className="space-y-1">
          {sections.map(section => {
            const isActive = section.id === activeSection;
            const hasSubsections = section.subsections && section.subsections.length > 0;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <div key={section.id}>
                <button
                  onClick={() => {
                    if (hasSubsections) {
                      toggleSection(section.id);
                    } else {
                      onSectionClick(section.id);
                    }
                  }}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                    transition-colors duration-200
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  {hasSubsections && (
                    <ChevronRight 
                      className={`mr-2 h-4 w-4 transition-transform duration-200
                        ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  )}
                  <span>{section.title}</span>
                </button>

                {/* Subsections */}
                {hasSubsections && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {section.subsections.map(subsection => {
                      const isSubActive = subsection.id === activeSection;
                      
                      return (
                        <button
                          key={subsection.id}
                          onClick={() => onSectionClick(section.id, subsection.id)}
                          className={`
                            w-full text-left px-3 py-2 text-sm rounded-md
                            transition-colors duration-200
                            ${isSubActive
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                          `}
                        >
                          {subsection.title}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}