// src/components/enneagram/types/components/SectionHeader.tsx
/**
 * Enhanced SectionHeader Component
 * 
 * Changes:
 * - Added "Back to Top" button
 * - Improved visual design with larger text and better spacing
 * - Added subtle hover effect on the header
 * - FIXED: Enhanced visual separation with shadow
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
  topOffset = 0,
  containerId
}: SectionHeaderProps) {
  return (
    <div 
      className="w-full z-10 shadow-sm sticky bg-white transition-all duration-300 hover:bg-gray-50"
      style={{ 
        borderLeft: `4px solid ${theme.colors.accent1}`,
        top: `${topOffset}px`,
        // FIXED: Added enhanced box-shadow for better visual separation when scrolling
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
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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