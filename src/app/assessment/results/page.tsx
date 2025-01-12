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
  const [analysisTimedOut, setAnalysisTimedOut] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Debug effect
  useEffect(() => {
    console.log('State changed:', {
      isAnalyzing,
      hasAnalysis: !!assessmentData?.analysis,
      pollCount,
      assessmentId: assessmentData?.assessmentId,
      status: assessmentData?.status,
      emailSent,
      analysisTimedOut
    });
  }, [isAnalyzing, assessmentData, pollCount, emailSent, analysisTimedOut]);

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
          
          // Only start analyzing if not already analyzed
          if (data.data.status === 'ANALYZED' || data.data.analysis) {
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

  // Trigger analysis if needed
  useEffect(() => {
    if (
      !assessmentData?.assessmentId || 
      !isAnalyzing || 
      pollCount > 0 || // Ensure triggerAnalysis runs only once by only triggering at the start
      assessmentData?.analysis || // Don't trigger if analysis exists
      !assessmentData?.results?.length // Don't trigger without results
    ) {
      return;
    }

    let mounted = true;

    const triggerAnalysis = async () => {
      try {
        console.log('Triggering analysis for:', assessmentData.assessmentId);
        console.log('Scores payload:', Object.fromEntries(
          assessmentData.results.map(r => ([r.type, Math.round(r.score * 10) / 10]))
        ));

        const response = await fetch('/api/assessment/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId: assessmentData.assessmentId,
            scores: Object.fromEntries(
              assessmentData.results.map(r => ([r.type, Math.round(r.score * 10) / 10]))
            )
          }),
        });

        if (response.ok) {
          if (mounted) {
            console.log('Analysis triggered successfully');
          }
        } else {
          console.warn('Analysis trigger failed:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error triggering analysis:', error);
      }
    };

    triggerAnalysis();

    return () => {
      mounted = false;
    };
  }, [assessmentData?.assessmentId, assessmentData?.results, assessmentData?.analysis, isAnalyzing, pollCount]);

  // Analysis polling effect
  useEffect(() => {
    console.log('Polling effect triggered with:', {
      assessmentId: assessmentData?.assessmentId,
      isAnalyzing,
      pollCount,
    });

    if (!assessmentData?.assessmentId || !isAnalyzing || pollCount >= 15) {
      return;
    }

    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const pollAnalysis = async () => {
      try {
        console.log(`Polling for analysis (attempt ${pollCount + 1})`);

        const response = await fetch('/api/assessment/fetch-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId: assessmentData.assessmentId,
          }),
        });

        const data = await response.json();

        if (!mounted) return;

        if (response.ok && data.success && data.analysis) {
          console.log('Analysis received, stopping polling');
          setIsAnalyzing(false);
          setAssessmentData(prev => ({
            ...prev!,
            analysis: data.analysis,
            status: 'ANALYZED',
          }));
          handleSendEmail();  // Add automatic email sending when analysis is ready
          return; // Stop further polling
        } else {
          console.warn('Analysis not ready, retrying...');
        }
      } catch (error) {
        console.error('Error polling for analysis:', error);
      }

      if (mounted) {
        const newCount = pollCount + 1;
        if (newCount >= 15) {
          console.error('Max polling attempts reached');
          setIsAnalyzing(false);
          setAnalysisTimedOut(true);
          
          // TODO: Generate fallback analysis based on highest score
          const fallbackAnalysis = "Placeholder: This will be replaced with type-specific analysis based on highest score.";
          
          setAssessmentData(prev => ({
            ...prev!,
            analysis: fallbackAnalysis,
            status: 'ANALYZED',
          }));
          
          setError('Analysis generation timed out. Showing general results based on your highest score.');
          return;
        }

        const delay = Math.min(1000 * Math.pow(1.5, newCount), 10000); // Exponential backoff
        timeoutId = setTimeout(() => {
          setPollCount(newCount);
        }, delay);
      }
    };

    // Start initial poll
    pollAnalysis();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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

  const handleSendEmail = async () => {
    if (!assessmentData?.analysis || isSendingEmail || emailSent) {
      console.log('Email send prevented due to conditions:', {
        hasAnalysis: !!assessmentData?.analysis,
        isSendingEmail,
        emailSent
      });
      return;
    }
  
    setIsSendingEmail(true);
    setEmailError(null);
  
    try {
      const sortedResults = assessmentData.results
        .map(result => [result.type, Math.round(result.score)] as [string, number])
        .sort(([, a], [, b]) => b - a);
  
      const response = await fetch('/api/assessment/results/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: assessmentData.userInfo.email,
          analysisHtml: assessmentData.analysis,
          scores: Object.fromEntries(sortedResults),
          userInfo: assessmentData.userInfo,
          assessmentId: assessmentData.assessmentId
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to send email');
      }
  
      setEmailSent(true);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError('Failed to send results email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleResendEmail = () => {
    setEmailError(null);
    setEmailSent(false);
    handleSendEmail();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ResultsPage
          userInfo={assessmentData.userInfo}
          analysis={assessmentData.analysis || ''}
          isAnalyzing={isAnalyzing}
          analysisTimedOut={analysisTimedOut}
          sortedResults={sortedResults}
          onBack={() => router.push('/assessment')}
          assessmentId={assessmentData.assessmentId}
          onSendEmail={handleResendEmail}
          isSendingEmail={isSendingEmail}
          emailSent={emailSent}
          emailError={emailError}
        />
      </div>
    </div>
  );
}