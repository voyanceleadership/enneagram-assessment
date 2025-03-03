// src/hooks/useSubSectionTabs.ts
import { useState, useEffect, useRef } from 'react';
import type { SubSection } from '@/components/enneagram/types/components/SubSectionTabs';

interface UseSubSectionTabsOptions {
  sections: SubSection[];
  sectionId: string;
}

export function useSubSectionTabs({ 
  sections, 
  sectionId,
}: UseSubSectionTabsOptions) {
  const [activeTab, setActiveTab] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const isScrolling = useRef(false);

  // Completely revised scroll position calculation with consistent approach
  const getDesiredPosition = (element: HTMLDivElement, tabsRect: DOMRect) => {
    // Fixed navbar height
    const navbarHeight = 64;
    
    // Get tabs height
    const tabsHeight = tabsRect.height;
    
    // Apply consistent, larger offset for all tabs
    const extraPadding = 75; // Increased for both sections
    
    // Get the element's position
    const elementTop = element.getBoundingClientRect().top;
    
    // Calculate position with improved offsets
    return window.pageYOffset + elementTop - navbarHeight - tabsHeight - extraPadding;
  };

  // Improved scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      // Skip if we're currently scrolling programmatically
      if (isScrolling.current) return;
      
      const tabsContainer = tabsContainerRef.current;
      if (!tabsContainer) return;

      const tabsRect = tabsContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Figure out which section is most visible in the viewport
      let bestTab = activeTab;
      let maxVisibleArea = 0;
      
      contentRefs.current.forEach((ref, index) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        
        // Calculate how much of the section is visible in viewport
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);
        
        // If this section has more visible area, it becomes the active tab
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          bestTab = index;
        }
      });
      
      // Update active tab if needed
      if (bestTab !== activeTab) {
        setActiveTab(bestTab);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab, sections]);

  // Improved tab change handler
  const handleTabChange = (index: number) => {
    // Set active tab immediately for responsive UI
    setActiveTab(index);
    
    const element = contentRefs.current[index];
    const tabsContainer = tabsContainerRef.current;
    
    if (element && tabsContainer) {
      const tabsRect = tabsContainer.getBoundingClientRect();
      
      // Get the appropriate scroll position
      const scrollToPosition = getDesiredPosition(element, tabsRect);
      
      // Set flag to prevent scroll tracking during programmatic scroll
      isScrolling.current = true;
      
      // Perform scroll
      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
      
      // Reset flag after scroll animation completes
      setTimeout(() => {
        isScrolling.current = false;
      }, 500); // Typical scroll animation duration
    }
  };

  return {
    activeTab,
    handleTabChange,
    contentRefs,
    tabsContainerRef
  };
}