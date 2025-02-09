// src/components/enneagram/types/sections/TypeHeader.tsx
import React from 'react';
import { theme, styleUtils } from '@/styles/theme';
import TypeSymbol from '../components/TypeSymbol';

interface TypeHeaderProps {
  typeNumber: string;
  typeName: string;
  typeDigit: string;
}

// Component for displaying the type header with symbol and title
export default function TypeHeader({ typeNumber, typeName, typeDigit }: TypeHeaderProps) {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <TypeSymbol type={typeNumber} />
        <h1 
          className="text-4xl mb-2"
          style={{ 
            ...styleUtils.headingStyles,
            color: theme.colors.accent3
          }}
        >
          Type {typeDigit}: {typeName}
        </h1>
      </div>
    </div>
  );
}