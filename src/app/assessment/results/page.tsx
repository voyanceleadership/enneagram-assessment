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
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/assessment/payment-flow/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();
        console.log('Received data:', data); // Debug log

        if (data.success) {
          setAssessmentData(data.data);
        } else {
          setError(data.error || 'Payment verification failed');
        }
      } catch (err) {
        setError('Error verifying payment');
        console.error('Payment verification error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Verifying your payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Payment Not Verified</h2>
            <p className="text-gray-600">Unable to verify your payment. Please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform results into the expected format
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