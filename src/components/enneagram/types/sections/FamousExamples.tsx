// src/components/enneagram/types/sections/FamousExamples.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import BulletList from '../components/BulletList';
import { TypeData } from '@/lib/enneagram/content/types';

interface FamousExamplesProps {
  typeData: TypeData;
}

// Component for displaying famous examples of the type
export default function FamousExamples({ typeData }: FamousExamplesProps) {
  return (
    <Card className="bg-white shadow-md border-0">
      <div className="p-6">
        <BulletList items={typeData.sections.famousExamples} />
      </div>
    </Card>
  );
}