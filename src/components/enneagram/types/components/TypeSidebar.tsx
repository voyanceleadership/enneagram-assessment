'use client';

/**
 * TypeSidebar Component
 * 
 * An enhanced navigation sidebar for Enneagram type pages with:
 * - Smooth animations with spring physics
 * - Top-to-bottom wave animation for all subsections
 * - Auto-highlighting of subsections during scroll
 * - Modern expand/collapse controls
 * - Better visual presentation of subsections
 * - Consistent styling for subsection lists
 * - Repositioned navigation toggle button
 * - Automatic scrolling to sections when clicked (even with subsections)
 * - FIXED: Added proper hydration safety to prevent client/server mismatches
 */

import React, { useState, useEffect, useRef } from 'react';
import { theme } from '@/styles/theme';
import { ChevronRight, Menu, Plus, Minus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useWindowSize } from '@/hooks/useWindowSize';
import { TypeSection } from '@/lib/enneagram/content';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicEnneagramSymbol from '../../symbol/DynamicEnneagramSymbol'; // Adjust the path as needed

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

/**
 * Helper function to conditionally join class names
 */
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default function TypeSidebar({ 
  sections, 
  activeSection,
  onSectionClick,
  typeNumber
}: TypeSidebarProps) {
  // Client-side hydration safety
  const [isMounted, setIsMounted] = useState(false);

  // Local state with persistence
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed for SSR
  const [activeSubsections, setActiveSubsections] = useState<Set<string>>(new Set());
  const [isMobileView, setIsMobileView] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // Used to track the order of sections for wave animation
  const [sectionIndices, setSectionIndices] = useState<Record<string, number>>({});

  // Handle hydration - this must run before any other effects
  useEffect(() => {
    setIsMounted(true);
    
    // Now that we're on the client, we can safely initialize from localStorage
    try {
      // Load expanded sections from localStorage
      const saved = localStorage.getItem('enneagram-sidebar-expanded');
      if (saved) {
        setExpandedSections(new Set(JSON.parse(saved)));
      }
      
      // Load sidebar collapsed state
      const collapsedState = localStorage.getItem('enneagram-sidebar-collapsed');
      if (collapsedState !== null) {
        setIsCollapsed(collapsedState === 'true');
      } else {
        // Default to collapsed on mobile, expanded on desktop
        setIsCollapsed(window.innerWidth < 768);
      }
    } catch (e) {
      console.error('Failed to load sidebar state', e);
    }
  }, []);

  // Set up section indices for consistent animation ordering
  useEffect(() => {
    if (!isMounted) return;
    
    const indices: Record<string, number> = {};
    let globalIndex = 0;
    
    sections.forEach((section, sectionIndex) => {
      // Assign indices to sections
      indices[section.id] = sectionIndex;
      
      // Assign indices to subsections if they exist
      if (section.subsections && section.subsections.length > 0) {
        section.subsections.forEach((subsection, subIndex) => {
          indices[subsection.id] = globalIndex;
          globalIndex++;
        });
      }
    });
    
    setSectionIndices(indices);
  }, [sections, isMounted]);

  // Detect mobile view
  useEffect(() => {
    if (!isMounted) return;
    
    setIsMobileView(windowWidth < 768);
    // Auto-collapse sidebar on mobile
    if (windowWidth < 768 && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [windowWidth, isCollapsed, isMounted]);

  // Persist expanded sections to localStorage
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      localStorage.setItem('enneagram-sidebar-expanded', 
        JSON.stringify(Array.from(expandedSections)));
    } catch (e) {
      console.error('Failed to save sidebar state', e);
    }
  }, [expandedSections, isMounted]);

  // Persist sidebar collapsed state
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      localStorage.setItem('enneagram-sidebar-collapsed', 
        isCollapsed.toString());
    } catch (e) {
      console.error('Failed to save sidebar collapsed state', e);
    }
  }, [isCollapsed, isMounted]);

  /**
   * Track which subsections are in view for highlighting
   */
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      const offset = 150; // Adjust the offset as needed
      const newActiveSubsections = new Set<string>();
      
      // Find all subsection elements
      sections.forEach(section => {
        if (!section.subsections) return;
        
        section.subsections.forEach(subsection => {
          // For each subsection, check if it's in view
          const subsectionElement = document.querySelector(`[data-subsection-id="${subsection.id}"]`);
          if (!subsectionElement) return;
          
          const rect = subsectionElement.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom > offset) {
            newActiveSubsections.add(subsection.id);
          }
        });
      });
      
      // Update state only if the active subsections have changed
      if (JSON.stringify(Array.from(newActiveSubsections)) !== 
          JSON.stringify(Array.from(activeSubsections))) {
        setActiveSubsections(newActiveSubsections);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, activeSubsections, isMounted]);

  /**
   * Resolves section titles that might be either static strings or
   * functions that generate titles based on the type number
   */
  const resolveTitle = (title: string | ((typeNumber: string) => string)) => {
    return typeof title === 'function' ? title(typeNumber) : title;
  };
  
  /**
   * Handles clicking on main section buttons
   * Always scrolls to the section header when clicked, 
   * regardless of whether it has subsections
   */
  const handleSectionClick = (sectionId: string) => {
    if (!isMounted) return;
    
    const section = sections.find(s => s.id === sectionId);
    
    // Always scroll to the section header first
    scrollToSection(sectionId);
    
    // Update active section in parent component
    onSectionClick(sectionId);
    
    // Toggle expansion state only if it has subsections
    // This is separated from the scrolling behavior
    if (section?.subsections?.length) {
      setExpandedSections(prev => {
        const next = new Set(prev);
        // Only add to expanded sections, don't collapse when clicking section
        if (!next.has(sectionId)) {
          next.add(sectionId);
        }
        return next;
      });
    }
    
    // Auto-collapse sidebar on mobile after selection
    if (isMobileView) {
      setIsCollapsed(true);
    }
  };

  /**
   * Handles clicking on subsection buttons
   */
  const handleSubsectionClick = (e: React.MouseEvent, sectionId: string, subsectionId: string) => {
    if (!isMounted) return;
    
    e.stopPropagation();
    
    // Special handling for related-types subsections
    if (sectionId === 'related-types') {
      if (subsectionId === 'wings') {
        const introElement = document.getElementById('wing-intro');
        if (introElement) {
          scrollToElement(sectionId, introElement);
          onSectionClick(sectionId, subsectionId);
          return;
        }
      } else if (subsectionId === 'lines') {
        const introElement = document.getElementById('line-intro');
        if (introElement) {
          scrollToElement(sectionId, introElement);
          onSectionClick(sectionId, subsectionId);
          return;
        }
      }
    }
    
    // Default behavior for other subsections
    const subsectionElement = document.querySelector(`[data-subsection-id="${subsectionId}"]`);
    if (subsectionElement) {
      scrollToElement(sectionId, subsectionElement);
    }
    
    onSectionClick(sectionId, subsectionId);
    
    // Auto-collapse on mobile after selection
    if (isMobileView) {
      setIsCollapsed(true);
    }
  };
  
  /**
   * Toggles the expansion state of a section WITHOUT scrolling
   * This is now separated from the main section click handler
   */
  const toggleSectionExpansion = (e: React.MouseEvent, sectionId: string) => {
    if (!isMounted) return;
    
    e.stopPropagation(); // Don't trigger the section click
    
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
  
  /**
   * Scrolls to a main section
   * This is the key function that ensures clicking a section scrolls to it
   */
  const scrollToSection = (sectionId: string) => {
    if (!isMounted) return;
    
    // Find the section element by its ID
    const element = document.getElementById(`section-${sectionId}`);
    if (!element) {
      console.warn(`Section element with ID section-${sectionId} not found`);
      return;
    }

    // Calculate necessary offsets
    const navbarHeight = 64; // Height of the fixed navbar
    const sectionHeader = element.querySelector('[data-section-header]');
    if (!sectionHeader) {
      console.warn(`Section header not found in section-${sectionId}`);
      return;
    }

    // Calculate position for scrolling
    const elementPosition = element.getBoundingClientRect().top;
    const headerHeight = sectionHeader.getBoundingClientRect().height;
    const scrollOffset = navbarHeight + 16; // Adding some padding
    const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;

    // Force scrolling to the section
    console.log(`Scrolling to section ${sectionId} at position ${offsetPosition}`);
    
    // Use setTimeout to ensure this happens after React rendering
    setTimeout(() => {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 10);
  };
  
  /**
   * Helper function to scroll to an element with proper offsets
   * FIXED: Simplified scroll calculation with fixed offset
   */
  const scrollToElement = (sectionId: string, element: Element) => {
    if (!isMounted) return;
    
    // Get the section element for reference
    const sectionElement = document.getElementById(`section-${sectionId}`);
    if (!sectionElement) return;
    
    // Fixed navbar height
    const navbarHeight = 64;
    
    // Check if this is a tabbed section that needs extra offset
    const tabsContainer = sectionElement.querySelector('[data-tabs-container]');
    const tabsHeight = tabsContainer ? tabsContainer.getBoundingClientRect().height : 0;
    
    // Use a large fixed buffer to ensure clear separation
    const fixedBuffer = 100;
    
    // Simple position calculation
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - tabsHeight - fixedBuffer;

    // Log for debugging (can remove in production)
    console.log(`Scrolling to element in section ${sectionId} at position ${offsetPosition}`);

    // Perform scroll with a slight delay to ensure DOM has updated
    setTimeout(() => {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 10);
  }

  /**
   * Expands all sections that have subsections
   */
  const handleExpandAll = () => {
    if (!isMounted) return;
    
    const sectionsWithSubsections = sections
      .filter(section => section.subsections?.length)
      .map(section => section.id);
    setExpandedSections(new Set(sectionsWithSubsections));
  };

  /**
   * Collapses all expanded sections
   */
  const handleCollapseAll = () => {
    if (!isMounted) return;
    
    setExpandedSections(new Set());
  };

  /**
   * Adjusts sidebar height based on window size
   */
  useEffect(() => {
    if (!isMounted || !navRef.current) return;
    
    const headerHeight = 64;
    const topSpacing = 96;
    const bottomSpacing = 32;
    const availableHeight = windowHeight - headerHeight - topSpacing - bottomSpacing;
    navRef.current.style.maxHeight = `${availableHeight}px`;
  }, [windowHeight, isMounted]);

  /**
   * Manages active section tracking and auto-expansion
   */
  useEffect(() => {
    if (!isMounted) return;
    
    const activeParentSection = sections.find(section => 
      section.id === activeSection || 
      section.subsections?.some(sub => sub.id === activeSection)
    );
    
    if (activeParentSection) {
      setExpandedSections(prev => new Set([...prev, activeParentSection.id]));
    }
  }, [activeSection, sections, isMounted]);

  /**
   * Keyboard event handler for accessibility
   */
  const handleKeyDown = (
    e: React.KeyboardEvent, 
    sectionId: string, 
    subsectionId?: string
  ) => {
    if (!isMounted) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (subsectionId) {
        handleSubsectionClick(e as unknown as React.MouseEvent, sectionId, subsectionId);
      } else {
        // Force scroll to section on keyboard navigation
        scrollToSection(sectionId);
        // Then call the normal handler
        handleSectionClick(sectionId);
      }
    }
  };
  
  /**
   * Event hook to ensure sections scroll into view when clicked
   * This runs once on component mount
   */
  useEffect(() => {
    if (!isMounted) return;
    
    // Direct DOM event handler as a fallback
    const handleDirectSectionClick = (e: Event) => {
      const button = e.target as HTMLElement;
      const sectionButton = button.closest('[data-section-button]');
      
      if (sectionButton) {
        const sectionId = sectionButton.getAttribute('data-section-button');
        if (sectionId) {
          // Force scroll to the section
          setTimeout(() => {
            scrollToSection(sectionId);
          }, 50);
        }
      }
    };
    
    // Add a global click handler as backup
    document.addEventListener('click', handleDirectSectionClick);
    
    return () => {
      document.removeEventListener('click', handleDirectSectionClick);
    };
  }, [isMounted]);

  // SSR safe rendering - render a minimal structure for server rendering
  if (!isMounted) {
    return (
      <div className="fixed left-8 top-24 z-40">
        <Button
          variant="secondary"
          size="default"
          className="rounded-md shadow-md flex items-center gap-2 pr-3 pl-2.5 py-2"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
          <span className="text-sm font-medium hidden md:inline">Navigation</span>
        </Button>
      </div>
    );
  }

  // Client-side rendering with full interactivity
  return (
    <AnimatePresence mode="wait">
      {!isCollapsed ? (
        <motion.div
          key="sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          className={cn(
            "fixed z-40 flex flex-col bg-white rounded-lg shadow-lg border border-gray-200",
            isMobileView ? "left-4 right-4 top-24" : "left-4 w-64 top-24"
          )}
          style={{ 
            maxHeight: isMobileView 
              ? `calc(80vh - 96px)` 
              : `calc(100vh - 128px)` 
          }}
        >
          {/* Header with controls */}
          <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Navigation</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpandAll}
                className="h-7 px-2 text-xs flex items-center gap-1 text-gray-600"
                aria-label="Expand all sections"
                title="Expand all sections"
              >
                <Plus className="h-3 w-3" />
                <span>All</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCollapseAll}
                className="h-7 px-2 text-xs flex items-center gap-1 text-gray-600"
                aria-label="Collapse all sections"
                title="Collapse all sections"
              >
                <Minus className="h-3 w-3" />
                <span>All</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="h-7 w-7 ml-1"
                aria-label="Close navigation"
                title="Close navigation"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation content */}
          <nav 
            ref={navRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            aria-label="Page navigation"
          >
            <div className="space-y-1 p-3">
              {sections.map(section => {
                // Compute section states
                const isActive = section.id === activeSection;
                const hasSubsections = section.subsections && section.subsections.length > 0;
                const isExpanded = expandedSections.has(section.id);
                const isHovered = hoveredSection === section.id;
                
                // Check if any subsections are active
                const hasVisibleSubsection = section.subsections?.some(sub => 
                  activeSubsections.has(sub.id) || sub.id === activeSection
                );
                
                return (
                  <div key={section.id} className="w-full">
                    {/* Section button with separate toggle control */}
                    <div className="flex items-center">
                      <button
                        onClick={() => handleSectionClick(section.id)}
                        onKeyDown={(e) => handleKeyDown(e, section.id)}
                        onMouseEnter={() => setHoveredSection(section.id)}
                        onMouseLeave={() => setHoveredSection(null)}
                        className={cn(
                          "flex-1 flex items-center justify-between px-3 py-2 text-sm font-medium",
                          "rounded-l-md transition-all duration-200 min-h-[40px] focus:outline-none",
                          "focus-visible:ring-2 focus-visible:ring-blue-500",
                          (isActive || hasVisibleSubsection)
                            ? "text-blue-600 bg-blue-50" 
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        )}
                        aria-controls={hasSubsections ? `subsection-${section.id}` : undefined}
                        data-section-button={section.id}
                      >
                        <span className="flex-1 text-left leading-5 pr-2 whitespace-normal">
                          {resolveTitle(section.title)}
                        </span>
                        
                        {hasSubsections && (
                          <span className="text-xs text-gray-400 mr-1">
                            {section.subsections.length}
                          </span>
                        )}
                      </button>
                      
                      {/* Separate toggle button for sections with subsections */}
                      {hasSubsections && (
                        <button
                          onClick={(e) => toggleSectionExpansion(e, section.id)}
                          className={cn(
                            "h-[40px] w-7 flex items-center justify-center",
                            "transition-colors duration-200 focus:outline-none",
                            "focus-visible:ring-2 focus-visible:ring-blue-500 rounded-r-md",
                            (isActive || hasVisibleSubsection)
                              ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
                              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                          )}
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? "Collapse section" : "Expand section"}
                          title={isExpanded ? "Collapse section" : "Expand section"}
                        >
                          {isExpanded ? (
                            <Minus className="h-3.5 w-3.5" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subsections with smooth animation using spring physics */}
                    {hasSubsections && (
                      <motion.div
                        id={`subsection-${section.id}`}
                        initial={false}
                        animate={{
                          height: isExpanded ? "auto" : 0,
                          opacity: isExpanded ? 1 : 0
                        }}
                        transition={{ 
                          type: "spring",
                          stiffness: 400,
                          damping: 40,
                          opacity: { duration: 0.2 }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-0.5 space-y-0.5 pb-1 border-l border-gray-200 pl-2">
                          {section.subsections.map((subsection, index) => {
                            const isSubActive = subsection.id === activeSection;
                            const isSubInView = activeSubsections.has(subsection.id);
                            
                            // Calculate global index for consistent top-to-bottom animation
                            const globalIndex = sectionIndices[subsection.id] || index;
                            
                            return (
                              <motion.button
                                key={subsection.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                  duration: 0.2,
                                  delay: isExpanded ? 0.04 * globalIndex : 0,
                                  ease: "easeOut"
                                }}
                                onClick={(e) => handleSubsectionClick(e, section.id, subsection.id)}
                                onKeyDown={(e) => handleKeyDown(e, section.id, subsection.id)}
                                className={cn(
                                  "w-full text-left px-2.5 py-1.5 text-xs rounded",
                                  "transition-colors duration-200 focus:outline-none",
                                  "focus-visible:ring-2 focus-visible:ring-blue-500",
                                  isSubActive
                                    ? "text-blue-600 bg-blue-50 font-medium"
                                    : isSubInView
                                      ? "text-blue-500 bg-blue-50/50"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                                aria-current={isSubActive ? "location" : undefined}
                              >
                                <span className="block leading-tight whitespace-normal">
                                  {resolveTitle(subsection.title)}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </motion.div>
      ) : (
        <motion.div
          key="toggle"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="fixed left-8 top-24 z-40"
        >
          {/* More obvious navigation toggle button - moved to the right */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="default"
              onClick={() => setIsCollapsed(false)}
              className="rounded-md shadow-md flex items-center gap-2 pr-3 pl-2.5 py-2"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
              <span className="text-sm font-medium hidden md:inline">Navigation</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}