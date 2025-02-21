// src/components/enneagram/types/sections/TypeSummary.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import { TypeData } from '@/lib/enneagram/content/types';

interface TypeSummaryProps {
  typeData: TypeData;
}

// Component for displaying the concise type summary
export default function TypeSummary({ typeData }: TypeSummaryProps) {
  return (
    <Card className="bg-white shadow-md border-0">
      <div className="p-6">
        <div 
          className="prose max-w-none"
          style={{ color: theme.colors.text }}
        >
          {typeData.sections.typeSummary}
        </div>
      </div>
    </Card>
  );
}