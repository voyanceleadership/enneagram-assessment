import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeTwoPage() {
  const typeData = await getTypeData('2');
  return <EnneagramTypePage typeData={typeData} typeNumber="2" />;
}