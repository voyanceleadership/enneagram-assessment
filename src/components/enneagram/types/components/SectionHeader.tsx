// src/components/enneagram/types/components/SectionHeader.tsx
import React from 'react';
import { theme, styleUtils } from '@/styles/theme';

interface SectionHeaderProps {
  sectionNumber: string;
  title: string;
  topOffset?: number;
  containerId?: string;
}

export default function SectionHeader({ 
  sectionNumber, 
  title, 
  topOffset = 0,
  containerId
}: SectionHeaderProps) {
  return (
    <div 
      className="w-full z-10 shadow-md sticky"
      style={{ 
        backgroundColor: 'white',
        borderLeft: `4px solid ${theme.colors.accent1}`,
        top: `${topOffset}px`,
        position: 'sticky'
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="py-6">
          <h2 
            className="text-2xl font-medium"
            style={{ color: theme.colors.text }}
          >
            <span 
              className="text-sm uppercase tracking-wider block mb-1"
              style={{ color: theme.colors.accent1 }}
            >
              Section {sectionNumber}
            </span>
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}