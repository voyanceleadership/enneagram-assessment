// src/components/enneagram/types/sections/TypeDescription.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import { TypeData } from '@/lib/types/types';

interface TypeDescriptionProps {
  typeData: TypeData;
}

// Component for displaying the detailed type description
export default function TypeDescription({ typeData }: TypeDescriptionProps) {
  return (
    <Card className="bg-white shadow-md border-0">
      <div className="p-6">
        <div 
          className="prose max-w-none"
          style={{ color: theme.colors.text }}
        >
          {typeData.sections.longDescription}
        </div>
      </div>
    </Card>
  );
}