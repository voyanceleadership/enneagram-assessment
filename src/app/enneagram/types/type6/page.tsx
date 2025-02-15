import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeSixPage() {
  const typeData = await getTypeData('6');
  return <EnneagramTypePage typeData={typeData} typeNumber="6" />;
}