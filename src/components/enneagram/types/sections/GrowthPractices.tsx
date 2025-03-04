// src/components/enneagram/types/sections/GrowthPractices.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import BulletList from '../components/BulletList';
import { TypeData } from '@/lib/enneagram/content/types';

interface GrowthPracticesProps {
  typeData: TypeData;
}

/**
 * GrowthPractices Component - With simplified anchor handling
 * 
 * Displays growth practices for the Enneagram type with consistent
 * anchor-based scrolling behavior.
 */
export default function GrowthPractices({ typeData }: GrowthPracticesProps) {
  return (
    <div>
      <Card className="bg-white shadow-md border-0">
        <div className="p-6">
          <BulletList items={typeData.sections.growthPractices} />
        </div>
      </Card>
    </div>
  );
}