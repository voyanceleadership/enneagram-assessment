// src/components/enneagram/types/sections/GrowthPractices.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import BulletList from '../components/BulletList';
import { TypeData } from '@/lib/types/types';

interface GrowthPracticesProps {
  typeData: TypeData;
}

// Component for displaying growth practices for the type
export default function GrowthPractices({ typeData }: GrowthPracticesProps) {
  return (
    <Card className="bg-white shadow-md border-0">
      <div className="p-6">
        <BulletList items={typeData.sections.growthPractices} />
      </div>
    </Card>
  );
}