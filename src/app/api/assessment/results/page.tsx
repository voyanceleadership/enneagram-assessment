// src/app/assessment/results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResultsPage from '@/components/assessment/ResultsPage';
import { UserInfo } from '@/components/assessment/EnneagramAssessment';

interface AssessmentData {
  userInfo: UserInfo;
  results: Array<{
    type: string;
    score: number;
  }>;
  analysis?: {
    content: string;
  };
}

export default function Results() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found');
        setIsLoading(false);
        return;
      }

      try {
        // Use the assessment route to fetch results
        const response = await fetch(`/api/assessment/results?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch results');
        }

        if (!data.userInfo || !data.results) {
          throw new Error('Incomplete assessment data received');
        }

        // Ensure all types are present in results
        const allTypes = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
        const results = allTypes.map(type => {
          const existingResult = data.results.find(r => r.type === type);
          return existingResult || { type, score: 0 };
        });

        setAssessmentData({
          ...data,
          results,
          analysis: data.analysis || { content: '' }
        });
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'Error fetching results. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading your results...</h2>
            <p className="text-gray-600">Please wait while we fetch your assessment results.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !assessmentData) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
            <p className="text-gray-600">{error || 'Unable to load results'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sort results by score (highest to lowest)
  const sortedResults: [string, number][] = assessmentData.results
    .map(result => [result.type, result.score])
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ResultsPage
          userInfo={assessmentData.userInfo}
          analysis={assessmentData.analysis?.content || ''}
          isAnalyzing={false}
          sortedResults={sortedResults}
          onBack={() => window.history.back()}
        />
      </div>
    </div>
  );
}