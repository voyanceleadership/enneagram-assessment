// src/components/enneagram/types/components/SubsectionHeader.tsx
import React from 'react';
import { theme, styleUtils } from '@/styles/theme';

interface SubsectionHeaderProps {
  title: string;
}

export default function SubsectionHeader({ title }: SubsectionHeaderProps) {
  return (
    <div 
      className="sticky w-full bg-white shadow-sm"
      style={{ 
        top: '80px', // Adjusted to match exactly where the main header ends
        borderLeft: `3px solid ${theme.colors.accent3}`,
        zIndex: 4
      }}
    >
      <div className="py-6 px-4">
        <h3 
          className="text-lg font-medium"
          style={{ color: theme.colors.accent3 }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}