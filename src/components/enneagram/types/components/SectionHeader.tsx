// src/components/enneagram/types/components/SectionHeader.tsx
/**
 * Simplified SectionHeader Component
 * 
 * A header component for sections that sticks to the top of the viewport
 * when scrolling and includes a "Back to Top" button.
 */

import React from 'react';
import { theme } from '@/styles/theme';
import { ArrowUp } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  topOffset?: number;
  containerId?: string;
}

export default function SectionHeader({ 
  title, 
  topOffset = 64, // Default to navbar height
  containerId
}: SectionHeaderProps) {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div 
      className="w-full z-10 shadow-sm sticky bg-white transition-all duration-300 hover:bg-gray-50"
      style={{ 
        borderLeft: `4px solid ${theme.colors.accent1}`,
        top: `${topOffset}px`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
      data-section-header
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-4 flex items-center">
          <h2 
            className="text-xl font-semibold"
            style={{ color: theme.colors.text }}
          >
            {title}
          </h2>
          
          <div className="ml-auto">
            <button 
              onClick={handleScrollToTop}
              className="text-gray-500 hover:text-gray-800 text-sm flex items-center transition-colors px-3 py-1 rounded-full hover:bg-gray-100"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}