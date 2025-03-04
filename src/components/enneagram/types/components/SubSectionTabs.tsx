// src/components/enneagram/types/components/SubSectionTabs.tsx
'use client';

import React, { useRef } from 'react';
import { theme } from '@/styles/theme';

export interface SubSection {
  id: string;
  title: string;
  color?: string;
  content: any;
}

interface SubSectionTabsProps {
  sections: SubSection[];
  activeTab: number;
  onTabChange: (index: number) => void;
  color?: string;
  equalWidth?: boolean;
  parentSectionId?: string; // Added to support anchor-based scrolling
}

/**
 * SubSectionTabs Component - Improved for proper highlighting
 * 
 * A tabbed navigation component that handles switching between subsections
 * with consistent style and interaction patterns.
 */
export default function SubSectionTabs({ 
  sections, 
  activeTab, 
  onTabChange,
  color = theme.colors.accent3,
  equalWidth = false,
  parentSectionId
}: SubSectionTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Get the active color for the selected tab
  const getActiveColor = (index: number) => {
    return sections[index]?.color || color;
  };
  
  // Handle tab click with added info
  const handleTabClick = (index: number) => {
    // Call the parent handler
    onTabChange(index);
    
    // Also update location hash for deep linking
    if (parentSectionId && sections[index]) {
      // Update URL without triggering page reload
      const newHash = `anchor-${parentSectionId}-${sections[index].id}`;
      if (history.pushState) {
        history.pushState(null, '', `#${newHash}`);
      } else {
        // Fallback for older browsers
        window.location.hash = newHash;
      }
    }
  };

  return (
    <div 
      className="flex border-t border-gray-200 bg-white"
      data-tabs-container
    >
      {sections.map((section, idx) => (
        <button
          key={idx}
          ref={el => tabRefs.current[idx] = el}
          onClick={() => handleTabClick(idx)}
          data-tab-id={section.id}
          data-tab-index={idx}
          data-parent-section={parentSectionId}
          className={`
            py-3 px-6 text-sm font-medium transition-all duration-300 relative
            ${equalWidth ? 'flex-1' : ''}
            ${activeTab === idx ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'}
          `}
          aria-selected={activeTab === idx}
          role="tab"
        >
          {/* Content */}
          <span className="relative z-10">{section.title}</span>
          
          {/* Active indicator - THINNER underline */}
          <div
            className="absolute inset-x-0 bottom-0 h-1 transform transition-transform duration-300 ease-in-out z-20"
            style={{
              backgroundColor: getActiveColor(idx),
              transform: `scaleX(${activeTab === idx ? 1 : 0})`
            }}
          />
          
          {/* Background highlight */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: `${getActiveColor(idx)}10`,
              opacity: activeTab === idx ? 1 : 0
            }}
          />
        </button>
      ))}

      {/* Bottom shadow for visual separation */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
        style={{ 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
        }}
      />
    </div>
  );
}