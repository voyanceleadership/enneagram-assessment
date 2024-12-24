import { Metadata } from 'next';
import AssessmentWrapper from '@/components/assessment/AssessmentWrapper';

export const metadata: Metadata = {
  title: 'Enneagram Assessment | Voyance Leadership',
  description: 'Take our comprehensive Enneagram assessment to discover your type and gain personal insights.',
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Enneagram Assessment
        </h1>
        <AssessmentWrapper />
      </div>
    </div>
  );
}