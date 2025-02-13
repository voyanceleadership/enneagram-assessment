// src/components/enneagram/types/components/TypeSidebar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { theme } from '@/styles/theme';
import { ChevronRight, Menu, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useWindowSize } from '@/hooks/useWindowSize';
import { TypeSection } from '@/lib/types';

interface TypeSidebarProps {
  sections: TypeSection[];
  activeSection: string;
  onSectionClick: (sectionId: string, subsectionId?: string) => void;
  typeNumber: string;
}

export default function TypeSidebar({ 
  sections, 
  activeSection,
  onSectionClick,
  typeNumber
}: TypeSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { height: windowHeight } = useWindowSize();

  const resolveTitle = (title: string | ((typeNumber: string) => string)) => {
    return typeof title === 'function' ? title(typeNumber) : title;
  };
  
  const handleSectionClick = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.subsections) {
      // For sections with subsections, just toggle expansion
      setExpandedSections(prev => {
        const next = new Set(prev);
        if (next.has(sectionId)) {
          next.delete(sectionId);
        } else {
          next.add(sectionId);
        }
        return next;
      });
    } else {
      // For sections without subsections, trigger navigation and ensure content is visible
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        const headerHeight = 64; // Navbar height
        const sectionHeader = element.querySelector('[data-section-header]');
        const headerOffset = sectionHeader?.getBoundingClientRect().height || 0;
        const padding = 24;
        const scrollOffset = headerHeight + headerOffset + padding;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      onSectionClick(sectionId);
    }
  };

  const handleSubsectionClick = (e: React.MouseEvent, sectionId: string, subsectionId: string) => {
    e.stopPropagation();
    onSectionClick(sectionId, subsectionId);
  };

  const handleExpandAll = () => {
    const sectionsWithSubsections = sections
      .filter(section => section.subsections?.length)
      .map(section => section.id);
    setExpandedSections(new Set(sectionsWithSubsections));
  };

  const handleCollapseAll = () => {
    setExpandedSections(new Set());
  };

  useEffect(() => {
    if (navRef.current) {
      const headerHeight = 64;
      const topSpacing = 96;
      const bottomSpacing = 96;
      const sidebarHeaderHeight = 56;
      const availableHeight = windowHeight - headerHeight - topSpacing - bottomSpacing;
      navRef.current.style.maxHeight = `${availableHeight}px`;
    }
  }, [windowHeight]);

  // Track active section and subsection
  useEffect(() => {
    const activeParentSection = sections.find(section => 
      section.id === activeSection || 
      section.subsections?.some(sub => sub.id === activeSection)
    );
    
    if (activeParentSection) {
      setExpandedSections(prev => new Set([...prev, activeParentSection.id]));
    }
  }, [activeSection, sections]);

  if (isCollapsed) {
    return (
      <div className="fixed left-4 top-24 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="rounded-full shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 w-64 z-40 flex flex-col bg-white rounded-lg shadow-md border border-gray-200"
         style={{ 
           top: '96px',
           maxHeight: `calc(100vh - 192px)`
         }}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Navigation</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExpandAll}
            title="Expand All"
            className="h-8 w-8"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapseAll}
            title="Collapse All"
            className="h-8 w-8"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation items */}
      <nav 
        ref={navRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <div className="space-y-1 pb-8">
          {sections.map(section => {
            const isActive = section.id === activeSection;
            const hasSubsections = section.subsections && section.subsections.length > 0;
            const isExpanded = expandedSections.has(section.id);
            const isHovered = hoveredSection === section.id;
            const hasActiveSubsection = section.subsections?.some(sub => sub.id === activeSection);
            
            return (
              <div key={section.id} className="w-full">
                <button
                  onClick={() => handleSectionClick(section.id)}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className={`
                    w-full flex items-start justify-between px-3 py-2 text-sm font-medium rounded-md
                    transition-all duration-300 min-h-[40px]
                    ${(isActive || hasActiveSubsection)
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <span className="flex-1 text-left leading-5 pr-2 whitespace-normal">
                    {resolveTitle(section.title)}
                  </span>
                  {hasSubsections && (isHovered || isExpanded || isActive || hasActiveSubsection) && (
                    <ChevronRight 
                      className={`flex-shrink-0 h-4 w-4 mt-0.5 transition-transform duration-300
                        ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  )}
                </button>

                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                  style={{
                    transitionProperty: 'max-height, opacity',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {hasSubsections && (
                    <div className="ml-4 mt-1 space-y-1">
                      {section.subsections.map(subsection => {
                        const isSubActive = subsection.id === activeSection;
                        
                        return (
                          <button
                            key={subsection.id}
                            onClick={(e) => handleSubsectionClick(e, section.id, subsection.id)}
                            className={`
                              w-full text-left px-3 py-2 text-sm rounded-md min-h-[40px]
                              transition-colors duration-300
                              ${isSubActive
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                            `}
                          >
                            <span className="block leading-5 whitespace-normal">
                              {resolveTitle(subsection.title)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}