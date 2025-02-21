/**
 * @file page.tsx
 * @description Server Component that renders the Enneagram Type 5 page
 */

import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';
import { getTypeData } from '@/lib/enneagram/content/queries';
import { Metadata } from 'next';

// This makes Next.js understand this is a Server Component
export const dynamic = 'force-dynamic';

// Generate metadata for this page
export async function generateMetadata(): Promise<Metadata> {
  const typeData = await getTypeData('5');
  
  return {
    title: `Type 5: ${typeData.typeName} | Enneacademy`,
    description: typeData.briefDescription.summary
  };
}

// Server Component that loads and renders the Type 5 page
export default async function TypeFivePage() {
  // Fetch the data for Type 5
  const typeData = await getTypeData('5');
  
  // Render the type page with the fetched data
  return <EnneagramTypePage typeData={typeData} typeNumber="5" />;
}
