import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeNinePage() {
  const typeData = await getTypeData('9');
  return <EnneagramTypePage typeData={typeData} typeNumber="9" />;
}