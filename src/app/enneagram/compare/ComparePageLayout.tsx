// src/app/enneagram/compare/ComparePageLayout.tsx
// Client component wrapper with navbar

'use client';

import TypeComparisonPage from '@/components/enneagram/comparison/TypeComparisonPage';
import AssessmentNavbar from '@/components/assessment/AssessmentNavbar';
import { theme } from '@/styles/theme';

interface ComparePageLayoutProps {
  typesData: any;
  preSelectedTypes: string[];
}

export default function ComparePageLayout({ 
  typesData, 
  preSelectedTypes 
}: ComparePageLayoutProps) {
  return (
    <div className="min-h-screen px-4" style={{ backgroundColor: theme.colors.background }}>
      <AssessmentNavbar />
      <TypeComparisonPage 
        typesData={typesData} 
        preSelectedTypes={preSelectedTypes}
      />
    </div>
  );
}
