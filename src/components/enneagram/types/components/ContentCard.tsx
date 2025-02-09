//src/components/enneagram/types/components/ContentCard.tsx
import React from 'react';
import { theme } from '@/styles/theme';

interface ContentCardProps {
  summary: string;
  explanation: string;
}

export function ContentCard({ summary, explanation }: ContentCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-white">
        <span className="font-medium text-gray-800">{summary}</span>
      </div>
      <div className="p-4 bg-gray-50">
        <p className="text-gray-600">{explanation}</p>
      </div>
    </div>
  );
}