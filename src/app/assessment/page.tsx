// src/app/assessment/page.tsx
import { Metadata } from 'next';
import AssessmentWrapper from '@/components/assessment/AssessmentWrapper';
import { theme, styleUtils } from '@/styles/theme';

export const metadata: Metadata = {
  title: 'Enneagram Assessment | Voyance Leadership',
  description: 'Take our comprehensive Enneagram assessment to discover your type and gain personal insights.',
};

export default function AssessmentPage() {
  return (
    <div 
      className="min-h-screen py-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl text-center mb-8"
            style={{
              ...styleUtils.headingStyles,
              color: theme.colors.text
            }}
          >
            Enneagram Assessment
          </h1>
          
          <div className="mb-8">
            <p 
              className="text-lg text-center max-w-2xl mx-auto"
              style={{
                ...styleUtils.bodyStyles,
                color: theme.colors.text
              }}
            >
              Discover your Enneagram type and gain deeper insights into your core motivations, 
              strengths, and growth opportunities.
            </p>
          </div>

          <AssessmentWrapper />
        </div>
      </div>
    </div>
  );
}