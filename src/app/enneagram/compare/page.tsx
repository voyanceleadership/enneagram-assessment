// src/app/enneagram/compare/page.tsx
// Server component that fetches data

import { Suspense } from 'react';
import ComparePageLayout from './ComparePageLayout';
import { getAllTypesData } from '@/lib/enneagram/content';
import { Card, CardContent } from '@/components/ui/card';

interface ComparePageProps {
  searchParams: { types?: string };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const typesData = await getAllTypesData();
  const preSelectedTypes = searchParams.types?.split(',').filter(Boolean) || [];

  return (
    <Suspense fallback={
      <div className="max-w-[90%] mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="h-96 flex items-center justify-center">
              Loading type data...
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <ComparePageLayout 
        typesData={typesData} 
        preSelectedTypes={preSelectedTypes}
      />
    </Suspense>
  );
}