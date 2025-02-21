/**
 * @file page.tsx
 * @description Server Component that renders the Enneagram Type 3 page
 */

import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';
import { getTypeData } from '@/lib/enneagram/content/queries';
import { Metadata } from 'next';

// This makes Next.js understand this is a Server Component
export const dynamic = 'force-dynamic';

// Generate metadata for this page
export async function generateMetadata(): Promise<Metadata> {
  const typeData = await getTypeData('3');
  
  return {
    title: `Type 3: ${typeData.typeName} | Enneacademy`,
    description: typeData.briefDescription.summary
  };
}

// Server Component that loads and renders the Type 3 page
export default async function TypeThreePage() {
  // Fetch the data for Type 3
  const typeData = await getTypeData('3');
  
  // Render the type page with the fetched data
  return <EnneagramTypePage typeData={typeData} typeNumber="3" />;
}
