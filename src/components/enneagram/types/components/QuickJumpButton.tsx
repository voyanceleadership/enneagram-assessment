// src/components/enneagram/types/components/QuickJumpButton.tsx
/**
 * QuickJumpButton Component
 * 
 * A floating button that expands to show a table of contents,
 * allowing users to quickly jump to any section of the page.
 */

import React, { useState, useEffect, useRef } from 'react';
import { List, X } from 'lucide-react';
import { TypeSection } from '@/lib/enneagram/content/types';
import { theme } from '@/styles/theme';

interface QuickJumpButtonProps {
  sections: TypeSection[];
  typeNumber: string;
  onSectionClick: (sectionId: string, subsectionId?: string) => void;
  activeSection: string;
}

export default function QuickJumpButton({ 
  sections, 
  typeNumber, 
  onSectionClick,
  activeSection
}: QuickJumpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Resolve section titles that might be functions
  const resolveTitle = (title: string | ((typeNumber: string) => string)) => {
    return typeof title === 'function' ? title(typeNumber) : title;
  };
  
  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="fixed bottom-20 right-6 z-50" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-blue-600 text-white p-3 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 bg-white rounded-lg shadow-xl border border-gray-200 w-72 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b">
            <h3 className="font-medium text-gray-900">Jump to Section</h3>
          </div>
          
          <div className="py-2 max-h-[70vh] overflow-y-auto">
            {sections.map(section => (
              <div key={section.id}>
                <button 
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                    ${activeSection === section.id ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
                  onClick={() => {
                    onSectionClick(section.id);
                    setIsOpen(false);
                  }}
                >
                  {resolveTitle(section.title)}
                </button>
                
                {/* Render subsections if they exist and the main section is active */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="pl-4 border-l border-gray-200 ml-4 mb-1">
                    {section.subsections.map(subsection => (
                      <button 
                        key={subsection.id}
                        className={`block w-full text-left px-3 py-1.5 text-sm 
                          ${activeSection === subsection.id ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                        onClick={() => {
                          onSectionClick(section.id, subsection.id);
                          setIsOpen(false);
                        }}
                      >
                        {resolveTitle(subsection.title)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}