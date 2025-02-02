// src/app/enneagram/types/type1/page.tsx
import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePageClient from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeOnePage() {
  const typeData = await getTypeData('1');
  return <EnneagramTypePageClient typeData={typeData} typeNumber="1" />;
}