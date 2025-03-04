// src/components/enneagram/types/sections/TypeDescription.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import { TypeData } from '@/lib/enneagram/content/types';

interface TypeDescriptionProps {
  typeData: TypeData;
}

/**
 * TypeDescription Component - With simplified anchor handling
 * 
 * Displays the detailed description of an Enneagram type with consistent
 * anchor-based scrolling behavior.
 */
export default function TypeDescription({ typeData }: TypeDescriptionProps) {
  return (
    <div>
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
    </div>
  );
}