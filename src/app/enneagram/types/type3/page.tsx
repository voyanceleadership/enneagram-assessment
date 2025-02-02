import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeThreePage() {
  const typeData = await getTypeData('3');
  return <EnneagramTypePage typeData={typeData} typeNumber="3" />;
}