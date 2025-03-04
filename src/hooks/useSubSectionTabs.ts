// src/hooks/useSubSectionTabs.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SubSection } from '@/components/enneagram/types/components/SubSectionTabs';

interface UseSubSectionTabsOptions {
  sections: SubSection[];
  sectionId: string;
}

/**
 * useSubSectionTabs Hook - Improved for sidebar navigation
 * 
 * A custom hook that manages tabbed navigation within sections,
 * ensuring correct tab highlighting when navigating from sidebar.
 */
export function useSubSectionTabs({ 
  sections, 
  sectionId,
}: UseSubSectionTabsOptions) {
  const [activeTab, setActiveTab] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const isScrolling = useRef(false);
  
  // Create mapping from section ID to index for quicker lookups
  const sectionIdToIndex = useRef<Record<string, number>>({});
  
  useEffect(() => {
    // Build the section ID to index mapping
    const mapping: Record<string, number> = {};
    sections.forEach((section, index) => {
      mapping[section.id] = index;
    });
    sectionIdToIndex.current = mapping;
  }, [sections]);
  
  // Function to set active tab by ID instead of index
  const setActiveTabById = useCallback((id: string) => {
    const index = sectionIdToIndex.current[id];
    if (index !== undefined) {
      setActiveTab(index);
    }
  }, []);
  
  // Track active tab based on scroll position
  useEffect(() => {
    // Skip if we're in the middle of a programmatic scroll
    if (isScrolling.current) return;
    
    const handleScroll = () => {
      // Only check scroll position if we aren't currently scrolling programmatically
      if (isScrolling.current) return;
      
      // Check if we have content refs
      if (!contentRefs.current.length) return;
      
      // Get tabs container position if it exists
      const tabsContainer = tabsContainerRef.current;
      const tabsHeight = tabsContainer ? tabsContainer.getBoundingClientRect().height : 0;
      const offset = 64 + tabsHeight + 20; // Navbar + tabs + padding
      
      // Find which section is most visible
      for (let i = 0; i < contentRefs.current.length; i++) {
        const ref = contentRefs.current[i];
        if (!ref) continue;
        
        const rect = ref.getBoundingClientRect();
        
        // If the element is sufficiently visible
        if (rect.top <= offset && rect.bottom > offset) {
          if (i !== activeTab) {
            setActiveTab(i);
          }
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check on mount
    setTimeout(handleScroll, 200);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab]);

  // Handle tab change from UI
  const handleTabChange = useCallback((index: number) => {
    // Set active tab immediately for responsive UI
    setActiveTab(index);
    
    // Get the content element we want to scroll to
    const ref = contentRefs.current[index];
    if (!ref) return;
    
    // Mark that we're about to scroll programmatically
    isScrolling.current = true;
    
    // Get tabs container position if it exists
    const tabsContainer = tabsContainerRef.current;
    const tabsHeight = tabsContainer ? tabsContainer.getBoundingClientRect().height : 0;
    const offset = 64 + tabsHeight + 16; // Navbar + tabs + padding
    
    // Calculate scroll position
    const rect = ref.getBoundingClientRect();
    const scrollPosition = window.pageYOffset + rect.top - offset;
    
    // Perform scroll
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
    
    // Clear the scrolling flag after scroll animation is likely finished
    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, []);

  return {
    activeTab,
    handleTabChange,
    contentRefs,
    tabsContainerRef,
    setActiveTabById
  };
}