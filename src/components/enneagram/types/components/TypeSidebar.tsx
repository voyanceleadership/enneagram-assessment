/**
 * TypeSidebar Component
 * 
 * A navigation component providing hierarchical section navigation for Enneagram type pages.
 * This component manages both the display of navigation items and the scroll positioning
 * logic when users navigate between sections and subsections.
 * 
 * Key Features:
 * - Hierarchical navigation structure with expandable sections
 * - Dynamic scroll positioning that adapts to page layout
 * - Collapsible sidebar for space efficiency
 * - Visual feedback for active and hover states
 * - Automatic expansion of parent sections when subsections are active
 * 
 * Component Integration:
 * - Used by: EnneagramTypePage
 * - Coordinates with: TypeSnapshot, RelatedTypes, and other content sections
 * - Element Requirements: Content sections must have matching IDs and data attributes
 *   - Section elements need: id="section-{sectionId}"
 *   - Subsections need: data-subsection-id="{subsectionId}"
 * 
 * Scroll Position Calculation:
 * Takes into account:
 * - Main navbar height (fixed at 64px)
 * - Section header heights (measured dynamically)
 * - Subsection header heights where applicable
 * - Additional padding and spacing
 * 
 * Usage:
 * ```tsx
 * <TypeSidebar
 *   sections={sections}
 *   activeSection={activeSection}
 *   onSectionClick={handleSectionClick}
 *   typeNumber="1"
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';
import { theme } from '@/styles/theme';
import { ChevronRight, Menu, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useWindowSize } from '@/hooks/useWindowSize';
import { TypeSection } from '@/lib/enneagram/content';

interface TypeSidebarProps {
  /** Array of all sections and their subsections */
  sections: TypeSection[];
  /** ID of currently active section/subsection */
  activeSection: string;
  /** Callback function for section/subsection selection */
  onSectionClick: (sectionId: string, subsectionId?: string) => void;
  /** Current Enneagram type number being displayed */
  typeNumber: string;
}

export default function TypeSidebar({ 
  sections, 
  activeSection,
  onSectionClick,
  typeNumber
}: TypeSidebarProps) {
  // Local state management
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { height: windowHeight } = useWindowSize();

  /**
   * Resolves section titles that might be either static strings or
   * functions that generate titles based on the type number
   * @param title - Either a string or a function that returns a string
   * @returns The resolved title string
   */
  const resolveTitle = (title: string | ((typeNumber: string) => string)) => {
    return typeof title === 'function' ? title(typeNumber) : title;
  };
  
  /**
   * Handles clicking on main section buttons
   * Either expands/collapses the section if it has subsections,
   * or scrolls to the section content if it doesn't
   * 
   * @param sectionId - ID of the clicked section
   */
  const handleSectionClick = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    
    if (section?.subsections) {
      // Toggle expansion for sections with subsections
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
      // Calculate scroll position for sections without subsections
      const element = document.getElementById(`section-${sectionId}`);
      if (!element) return;

      const navbarHeight = 64;
      const sectionHeader = element.querySelector('[data-section-header]');
      if (!sectionHeader) return;

      const elementPosition = element.getBoundingClientRect().top;
      const headerHeight = sectionHeader.getBoundingClientRect().height;
      const scrollOffset = navbarHeight + headerHeight;
      const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      onSectionClick(sectionId);
    }
  };

  /**
   * Handles clicking on subsection buttons
   * Calculates correct scroll position considering all sticky elements
   * 
   * @param e - Click event
   * @param sectionId - Parent section ID
   * @param subsectionId - Clicked subsection ID
   */
  const handleSubsectionClick = (e: React.MouseEvent, sectionId: string, subsectionId: string) => {
    e.stopPropagation();
    
    // Find subsection element
    const subsectionElement = document.querySelector(`[data-subsection-id="${subsectionId}"]`);
    if (!subsectionElement) return;

    // Get parent section and its header
    const sectionElement = document.getElementById(`section-${sectionId}`);
    if (!sectionElement) return;
    
    const sectionHeader = sectionElement.querySelector('[data-section-header]');
    if (!sectionHeader) return;

    // Calculate offsets
    const navbarHeight = 64;
    const headerHeight = sectionHeader.getBoundingClientRect().height;
    const padding = 24;
    
    // Calculate final scroll position
    const elementPosition = subsectionElement.getBoundingClientRect().top;
    const totalOffset = navbarHeight + headerHeight + padding;
    const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

    // Perform scroll
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    onSectionClick(sectionId, subsectionId);
  };

  /**
   * Expands all sections that have subsections
   */
  const handleExpandAll = () => {
    const sectionsWithSubsections = sections
      .filter(section => section.subsections?.length)
      .map(section => section.id);
    setExpandedSections(new Set(sectionsWithSubsections));
  };

  /**
   * Collapses all expanded sections
   */
  const handleCollapseAll = () => {
    setExpandedSections(new Set());
  };

  /**
   * Adjusts sidebar height based on window size
   */
  useEffect(() => {
    if (navRef.current) {
      const headerHeight = 64;
      const topSpacing = 96;
      const bottomSpacing = 96;
      const availableHeight = windowHeight - headerHeight - topSpacing - bottomSpacing;
      navRef.current.style.maxHeight = `${availableHeight}px`;
    }
  }, [windowHeight]);

  /**
   * Manages active section tracking and auto-expansion
   * Ensures parent sections are expanded when their subsections are active
   */
  useEffect(() => {
    const activeParentSection = sections.find(section => 
      section.id === activeSection || 
      section.subsections?.some(sub => sub.id === activeSection)
    );
    
    if (activeParentSection) {
      setExpandedSections(prev => new Set([...prev, activeParentSection.id]));
    }
  }, [activeSection, sections]);

  // Render collapsed version
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

  // Render full sidebar
  return (
    <div 
      className="fixed left-4 w-64 z-40 flex flex-col bg-white rounded-lg shadow-md border border-gray-200"
      style={{ 
        top: '96px',
        maxHeight: `calc(100vh - 192px)`
      }}
    >
      {/* Header with collapse controls */}
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

      {/* Main navigation section */}
      <nav 
        ref={navRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        <div className="space-y-1 pb-8">
          {sections.map(section => {
            // Compute section states for rendering
            const isActive = section.id === activeSection;
            const hasSubsections = section.subsections && section.subsections.length > 0;
            const isExpanded = expandedSections.has(section.id);
            const isHovered = hoveredSection === section.id;
            const hasActiveSubsection = section.subsections?.some(sub => sub.id === activeSection);
            
            return (
              <div key={section.id} className="w-full">
                {/* Section button */}
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

                {/* Subsections container with animation */}
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