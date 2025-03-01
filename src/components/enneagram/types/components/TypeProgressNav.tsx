// src/components/enneagram/types/components/TypeProgressNav.tsx
/**
 * TypeProgressNav Component
 * 
 * A horizontal scrollable navigation bar for mobile users,
 * showing all main sections with visual indicators for the active section.
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TypeSection } from '@/lib/enneagram/content/types';
import { theme } from '@/styles/theme';

interface TypeProgressNavProps {
  sections: TypeSection[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  typeNumber: string;
}

export default function TypeProgressNav({ 
  sections, 
  activeSection, 
  onSectionClick,
  typeNumber
}: TypeProgressNavProps) {
  // Resolve section titles that might be functions
  const resolveTitle = (title: string | ((typeNumber: string) => string)) => {
    return typeof title === 'function' ? title(typeNumber) : title;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-30 md:hidden">
      <div 
        className="py-3 px-4 flex overflow-x-auto space-x-3 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {sections.map((section) => {
          const isActive = activeSection === section.id || 
                           section.subsections?.some(sub => sub.id === activeSection);
          
          return (
            <button 
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`
                flex items-center justify-center px-3 py-1.5
                whitespace-nowrap text-sm font-medium rounded-full
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isActive 
                  ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500'}
              `}
            >
              {resolveTitle(section.title)}
              {section.subsections && section.subsections.length > 0 && (
                <ChevronRight className={`h-3 w-3 ml-1 transition-transform ${isActive ? 'rotate-90' : ''}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}