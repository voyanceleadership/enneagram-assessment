'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResultsPage from '@/components/assessment/ResultsPage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type AssessmentStatus = 'STARTED' | 'COMPLETED' | 'PAID' | 'ANALYZED';

interface AssessmentData {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  results: Array<{
    type: string;
    score: number;
  }>;
  assessmentId: string;
  analysis?: string | null;
  status: AssessmentStatus;
}

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  // Debug effect
  useEffect(() => {
    console.log('State changed:', {
      isAnalyzing,
      hasAnalysis: !!assessmentData?.analysis,
      pollCount,
      assessmentId: assessmentData?.assessmentId,
      status: assessmentData?.status
    });
  }, [isAnalyzing, assessmentData, pollCount]);

  // Initial data fetch and verification
  useEffect(() => {
    let mounted = true;
    const sessionId = searchParams.get('session_id');
    const assessmentId = searchParams.get('assessmentId');

    if (!sessionId && !assessmentId) {
      setError('Invalid request parameters');
      return;
    }

    const fetchData = async () => {
      try {
        let response;
        
        if (sessionId) {
          response = await fetch('/api/assessment/payment-flow/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          });
        } else if (assessmentId) {
          response = await fetch('/api/assessment/fetch-assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentId }),
          });
        }

        if (!response) {
          throw new Error('No valid response received');
        }

        const data = await response.json();
        console.log('Assessment data received:', data);

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch assessment data');
        }

        // Verify paid status
        if (data.data.status !== 'PAID' && data.data.status !== 'ANALYZED') {
          throw new Error('Assessment payment required');
        }

        if (mounted) {
          setAssessmentData(data.data);
          
          // Only trigger analysis if not already analyzed
          if (data.data.status !== 'ANALYZED' && !data.data.analysis) {
            const analysisResponse = await fetch('/api/assessment/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                assessmentId: data.data.assessmentId,
                scores: Object.fromEntries(
                  data.data.results.map((r: { type: string; score: number }) => [r.type, r.score])
                )
              }),
            });

            if (!analysisResponse.ok) {
              console.warn('Initial analysis generation attempt failed, will poll');
            }
          } else {
            setIsAnalyzing(false);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error loading results');
          setIsAnalyzing(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  // Analysis polling effect
  useEffect(() => {
    if (!assessmentData?.assessmentId || !isAnalyzing || pollCount >= 15) {
      return;
    }

    let mounted = true;
    const pollInterval = setInterval(async () => {
      try {
        console.log(`Polling for analysis (attempt ${pollCount + 1})`);
        
        const response = await fetch('/api/assessment/fetch-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId: assessmentData.assessmentId
          }),
        });

        const data = await response.json();
        
        if (!mounted) return;

        if (response.ok && data.success && data.analysis) {
          console.log('Analysis received, stopping polling');
          clearInterval(pollInterval);
          setIsAnalyzing(false);
          setAssessmentData(prev => ({
            ...prev!,
            analysis: data.analysis,
            status: 'ANALYZED' as AssessmentStatus
          }));
        } else {
          setPollCount(count => {
            const newCount = count + 1;
            if (newCount >= 15) {
              clearInterval(pollInterval);
              setIsAnalyzing(false);
              setError('Unable to generate analysis at this time. Please try refreshing the page.');
            }
            return newCount;
          });
        }
      } catch (error) {
        console.error('Error polling for analysis:', error);
        if (mounted) {
          setPollCount(count => count + 1);
        }
      }
    }, 2000);

    return () => {
      mounted = false;
      clearInterval(pollInterval);
    };
  }, [assessmentData?.assessmentId, isAnalyzing, pollCount]);

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
    return null;
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
          isAnalyzing={isAnalyzing}
          sortedResults={sortedResults}
          onBack={() => router.push('/assessment')}
          assessmentId={assessmentData.assessmentId}
        />
      </div>
    </div>
  );
}