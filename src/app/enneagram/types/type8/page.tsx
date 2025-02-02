import { getTypeData } from '@/lib/types/queries';
import EnneagramTypePage from '@/components/enneagram/types/EnneagramTypePage';

export default async function TypeEightPage() {
  const typeData = await getTypeData('8');
  return <EnneagramTypePage typeData={typeData} typeNumber="8" />;
}