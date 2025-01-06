'use client';

import { useEffect, useState, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [pollCount, setPollCount] = useState(0);

  // Separate function for polling
  const pollForAnalysis = useCallback(async (email: string, assessmentId: string) => {
    console.log(`Polling for analysis (attempt ${pollCount + 1})...`);

    try {
      const analysisResponse = await fetch('/api/assessment/fetch-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, assessmentId }),
      });

      const analysisData = await analysisResponse.json();
      console.log('Analysis response:', analysisData);

      if (analysisResponse.ok && analysisData.success && analysisData.analysis) {
        console.log('Analysis received successfully');
        setAssessmentData(prev => prev ? {
          ...prev,
          analysis: analysisData.analysis
        } : null);
        return true;
      }
      
      console.log('Analysis not ready yet...');
      return false;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      return false;
    }
  }, [pollCount]);

  // Effect for initial payment verification
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('No session ID found. Please try the assessment again.');
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log('Starting payment verification...');
        
        const response = await fetch('/api/assessment/payment-flow/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch results');
        }

        setAssessmentData(data.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error in payment verification:', err);
        setError('There was an error loading your results. Please try refreshing the page.');
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

// Separate effect for polling
useEffect(() => {
  if (!assessmentData || assessmentData.analysis || pollCount >= 15) {
    return;
  }

  const pollInterval = setInterval(async () => {
    console.log(`Polling attempt ${pollCount + 1} of 15...`);
    
    try {
      const pollResponse = await fetch('/api/assessment/fetch-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: assessmentData.userInfo.email,
          assessmentId: assessmentData.assessmentId
        }),
      });
  
      const pollData = await pollResponse.json();
      console.log('Poll response:', pollData);
      
      if (pollResponse.ok && pollData.success && pollData.analysis) {
        console.log('Analysis received, updating state');
        clearInterval(pollInterval);
        setAssessmentData(prev => ({
          ...prev!,
          analysis: pollData.analysis
        }));
      } else {
        console.log('Analysis not ready yet, incrementing poll count');
        setPollCount(count => count + 1);
      }
    } catch (pollError) {
      console.error('Error polling for analysis:', pollError);
      setPollCount(count => count + 1);
    }
  }, 2000);

  return () => {
    console.log('Cleaning up poll interval');
    clearInterval(pollInterval);
  };
}, [assessmentData, pollCount]);

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
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading your assessment results...</p>
        </div>
      </div>
    );
  }

  const sortedResults = assessmentData.results
    .map(result => [result.type, result.score] as [string, number])
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ResultsPage
          userInfo={assessmentData.userInfo}
          analysis={assessmentData.analysis || ''}
          isAnalyzing={!assessmentData.analysis}
          sortedResults={sortedResults}
          onBack={() => router.push('/assessment')}
        />
      </div>
    </div>
  );
}