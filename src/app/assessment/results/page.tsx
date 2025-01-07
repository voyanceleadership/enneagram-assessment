'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResultsPage from '@/components/assessment/ResultsPage';
import { UserInfo } from '@/components/assessment/EnneagramAssessment';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AssessmentData {
  userInfo: UserInfo;
  results: Array<{
    type: string;
    score: number;
  }>;
  assessmentId: string;
  analysis?: string | null;
}

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  // Debug effect
  useEffect(() => {
    console.log('State changed:', {
      isPolling,
      hasAnalysis: !!assessmentData?.analysis,
      pollCount,
      assessmentId: assessmentData?.assessmentId
    });
  }, [isPolling, assessmentData, pollCount]);

  // Combined verification and data fetch
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('No session ID found');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/assessment/payment-flow/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();
        console.log('Payment verification response:', data);
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to verify payment');
        }

        if (!data.data?.userInfo || !data.data?.results || !data.data?.assessmentId) {
          throw new Error('Incomplete data received from server');
        }

        setAssessmentData(data.data);
        setIsPolling(true);  // Start polling for analysis
      } catch (err) {
        console.error('Error:', err);
        setError('Error loading results. Please try refreshing.');
      }
    };

    fetchData();
  }, [searchParams]);

  // Analysis polling effect
  useEffect(() => {
    if (!isPolling || !assessmentData?.assessmentId || assessmentData.analysis || pollCount >= 15) {
      setIsPolling(false);
      return;
    }

    console.log('Starting polling for analysis...');
    
    const pollInterval = setInterval(async () => {
      try {
        console.log(`Polling for analysis (attempt ${pollCount + 1})...`);
        
        const response = await fetch('/api/assessment/fetch-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId: assessmentData.assessmentId
          }),
        });

        const data = await response.json();
        console.log('Analysis poll response:', data);
        
        if (response.ok && data.success && data.analysis) {
          console.log('Analysis received, stopping polling');
          clearInterval(pollInterval);
          setIsPolling(false);
          setAssessmentData(prev => ({
            ...prev!,
            analysis: data.analysis
          }));
        } else {
          setPollCount(count => {
            const newCount = count + 1;
            if (newCount >= 15) {
              clearInterval(pollInterval);
              setIsPolling(false);
            }
            return newCount;
          });
        }
      } catch (error) {
        console.error('Error polling for analysis:', error);
        setPollCount(count => count + 1);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [isPolling, assessmentData?.assessmentId, assessmentData?.analysis, pollCount]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-4">
            <Button 
              onClick={() => router.push('/assessment')}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!assessmentData) {
    return null;  // Or minimal loading spinner if preferred
  }

  const sortedResults = assessmentData.results
    .map(result => [result.type, Math.round(result.score)] as [string, number])
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ResultsPage
          userInfo={assessmentData.userInfo}
          analysis={assessmentData.analysis || ''}
          isAnalyzing={isPolling}
          sortedResults={sortedResults}
          onBack={() => router.push('/assessment')}
        />
      </div>
    </div>
  );
}