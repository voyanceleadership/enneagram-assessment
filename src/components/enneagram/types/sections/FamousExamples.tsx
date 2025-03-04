// src/components/enneagram/types/sections/FamousExamples.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import BulletList from '../components/BulletList';
import { TypeData } from '@/lib/enneagram/content/types';

interface FamousExamplesProps {
  typeData: TypeData;
}

/**
 * FamousExamples Component - With simplified anchor handling
 * 
 * Displays famous examples of the Enneagram type with consistent
 * anchor-based scrolling behavior.
 */
export default function FamousExamples({ typeData }: FamousExamplesProps) {
  return (
    <div>
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <BulletList items={typeData.sections.famousExamples} />
        </div>
      </Card>
    </div>
  );
}