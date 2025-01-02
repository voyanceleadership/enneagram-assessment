'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResultsPage from '@/components/assessment/ResultsPage';

interface AssessmentData {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  results: {
    type: string;
    score: number;
  }[];
  analysis: {
    content: string;
  };
}

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
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

        if (data.success) {
          setPaymentVerified(true);
          setAssessmentData(data.data);
        } else {
          setError(data.error || 'Payment verification failed');
        }
      } catch (err) {
        setError('Error verifying payment');
        console.error('Payment verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleBack = () => {
    router.push('/assessment'); // or wherever you want to navigate back to
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Verifying your payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!paymentVerified || !assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Payment Not Verified</h2>
          <p className="text-gray-600">Unable to verify your payment. Please contact support.</p>
        </div>
      </div>
    );
  }

  // Format results for the ResultsPage component
  const sortedResults = assessmentData.results
    .map(result => [result.type, result.score] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return (
    <ResultsPage
      userInfo={assessmentData.userInfo}
      analysis={assessmentData.analysis.content}
      isAnalyzing={false}
      sortedResults={sortedResults}
      onBack={handleBack}
    />
  );
}