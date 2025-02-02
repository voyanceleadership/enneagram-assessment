import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeFivePage() {
  const typeData = await getTypeData('5');
  return <EnneagramTypePage typeData={typeData} typeNumber="5" />;
}