// SectionHeader.tsx
import React from 'react';
import { theme } from '@/styles/theme';

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
      className="w-full z-10 shadow-sm sticky bg-white"
      style={{ 
        borderLeft: `4px solid ${theme.colors.accent1}`,
        top: `${topOffset}px`
      }}
      data-section-header
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="py-3">
          <h2 
            className="text-lg font-medium"
            style={{ color: theme.colors.text }}
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}