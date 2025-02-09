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

  // Calculate desired position - same logic for both scrolling and clicking
  const getDesiredPosition = (element: HTMLDivElement, tabsRect: DOMRect) => {
    return window.scrollY + element.getBoundingClientRect().top - tabsRect.top - tabsRect.height - 24;
  };

  useEffect(() => {
    const handleScroll = () => {
      const tabsContainer = tabsContainerRef.current;
      if (!tabsContainer) return;

      const tabsRect = tabsContainer.getBoundingClientRect();
      const currentScrollPosition = window.scrollY;

      // Find which section should be active based on current scroll position
      contentRefs.current.forEach((ref, index) => {
        if (ref) {
          const desiredPosition = getDesiredPosition(ref, tabsRect);
          // If we've scrolled past or very close to where clicking would take us
          if (Math.abs(currentScrollPosition - desiredPosition) < 10) {
            setActiveTab(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  const handleTabChange = (index: number) => {
    const element = contentRefs.current[index];
    const tabsContainer = tabsContainerRef.current;
    
    if (element && tabsContainer) {
      const tabsRect = tabsContainer.getBoundingClientRect();
      const scrollToPosition = getDesiredPosition(element, tabsRect);

      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
    }
  };

  return {
    activeTab,
    handleTabChange,
    contentRefs,
    tabsContainerRef
  };
}