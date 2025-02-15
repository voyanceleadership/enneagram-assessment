import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeSevenPage() {
  const typeData = await getTypeData('7');
  return <EnneagramTypePage typeData={typeData} typeNumber="7" />;
}