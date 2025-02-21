// src/components/enneagram/types/sections/Misconceptions.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { theme, styleUtils } from '@/styles/theme';
import { TypeData } from '@/lib/enneagram/content/types';

interface MisconceptionsProps {
  typeData: TypeData;
}

// Component for displaying common misconceptions about the type
export default function Misconceptions({ typeData }: MisconceptionsProps) {
  return (
    <Card className="bg-white shadow-md border-0">
      <div className="p-6">
        <ul className="list-disc pl-6 space-y-4">
          {typeData.sections.misconceptions.map((misconception, idx) => (
            <li 
              key={idx}
              className="text-base"
              style={{ color: theme.colors.text }}
              dangerouslySetInnerHTML={{
                __html: misconception.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          ))}
        </ul>
      </div>
    </Card>
  );
}