'use client';

import dynamic from 'next/dynamic';

const EnneagramAssessment = dynamic(
  () => import('@/components/assessment/EnneagramAssessment'),
  { ssr: false }
);

export default function AssessmentWrapper() {
  return <EnneagramAssessment />;
}