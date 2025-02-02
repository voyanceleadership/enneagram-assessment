import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeFourPage() {
  const typeData = await getTypeData('4');
  return <EnneagramTypePage typeData={typeData} typeNumber="4" />;
}