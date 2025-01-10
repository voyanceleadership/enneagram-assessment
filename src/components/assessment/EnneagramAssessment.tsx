'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { assessmentQuestions, rankingQuestions } from '@/app/data/assessment/AssessmentQuestions';
import { TYPE_NAMES } from '@/app/data/constants/EnneagramData';
import { calculateAssessmentResults } from '@/utils/calculateAssessmentResults';
import UserInfoForm from '@/components/forms/UserInfoForm';
import LikertQuestions from './LikertQuestions';
import RankChoiceQuestions from './RankChoiceQuestions';
import ResultsPage from './ResultsPage';
import PaymentPage from '@/components/payment/PaymentPage';
import { ProgressIndicator } from './ProgressIndicator';

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
}

export type WeightingResponses = {
  [questionId: string]: number;
};

export type Rankings = {
  [questionIndex: number]: number[];
};

type AssessmentStep = 'userInfo' | 'likert' | 'ranking' | 'payment' | 'results';

export default function EnneagramAssessment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<AssessmentStep>('userInfo');
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [weightingResponses, setWeightingResponses] = useState<WeightingResponses>({});
  const [rankings, setRankings] = useState<Rankings>({});
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sortedResults, setSortedResults] = useState<[string, number][]>([]);
  const [error, setError] = useState<string | null>(null);
  const TOTAL_QUESTIONS = 48;
  const LIKERT_QUESTIONS = 12;

  // Check for returning paid user
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const assessmentId = searchParams.get('assessmentId');
    const verified = searchParams.get('verified');
    
    if (sessionId || (verified === 'true' && assessmentId)) {
      if (verified === 'true' && assessmentId) {
        setAssessmentId(assessmentId);
        setIsAnalyzing(true);
        setStep('results');
      } else if (sessionId) {
        router.push(`/assessment/results?session_id=${sessionId}`);
      }
    }
  }, [searchParams, router]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getCurrentQuestionNumber = () => {
    if (step === 'likert') {
      return currentQuestionIndex + 1;
    } else if (step === 'ranking') {
      return LIKERT_QUESTIONS + currentQuestionIndex + 1;
    }
    return 0;
  };

  const saveAssessmentData = async () => {
    try {
      const response = await fetch('/api/assessment/save-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInfo,
          responses: {
            weightingResponses,
            rankings
          },
          assessmentType: 'standard',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save assessment data');
      }
  
      const data = await response.json();
      if (data.success) {
        setAssessmentId(data.assessmentId);
        return true;
      } else {
        throw new Error(data.error || 'Failed to save assessment');
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const handleMoveToPayment = async () => {
    try {
      console.log('Starting handleMoveToPayment');
      
      const calculatedResults = calculateAssessmentResults(weightingResponses, rankings);
      
      // Save the final results
      const response = await fetch('/api/assessment/save-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInfo,
          responses: {
            weightingResponses,
            rankings,
            calculatedResults
          },
          assessmentType: 'standard',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save assessment data');
      }
  
      const data = await response.json();
      setAssessmentId(data.assessmentId);
      
      // Set sorted results
      setSortedResults(
        Object.entries(calculatedResults)
          .sort(([, a], [, b]) => b - a) as [string, number][]
      );
  
      // Check if email is validated
      const validateResponse = await fetch('/api/assessment/payment-flow/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userInfo.email,
          assessmentId: data.assessmentId
        })
      });
  
      const validateResult = await validateResponse.json();
  
      if (validateResult.success && validateResult.data?.status === 'PAID') {
        // If email is validated, go straight to results
        router.push(`/assessment/results?assessmentId=${data.assessmentId}`);
      } else {
        // If not validated, continue to payment
        setStep('payment');
      }
    } catch (err) {
      console.error('Error in handleMoveToPayment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred saving your assessment');
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'userInfo':
        return (
          <UserInfoForm
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            onNext={async () => {
              try {
                // Create initial assessment record
                const saveResponse = await fetch('/api/assessment/save-response', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userInfo,
                    responses: {
                      weightingResponses: {},
                      rankings: {}
                    },
                    assessmentType: 'standard',
                  }),
                });

                if (!saveResponse.ok) {
                  throw new Error('Failed to save initial assessment');
                }

                const saveData = await saveResponse.json();
                setAssessmentId(saveData.assessmentId);

                // Check if email is validated and process payment if it is
                const validateResponse = await fetch('/api/assessment/payment-flow/validate-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    email: userInfo.email,
                    assessmentId: saveData.assessmentId
                  })
                });

                const validateResult = await validateResponse.json();
                
                // Always continue to questions - payment status will be checked at the end
                setStep('likert');
                setCurrentQuestionIndex(0);
              } catch (err) {
                console.error('Error processing user info:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
              }
            }}
          />
        );
      case 'likert':
        return (
          <>
            <ProgressIndicator 
              currentQuestion={getCurrentQuestionNumber()}
              totalQuestions={TOTAL_QUESTIONS}
            />
            <LikertQuestions
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              weightingResponses={weightingResponses}
              setWeightingResponses={setWeightingResponses}
              onComplete={() => {
                setStep('ranking');
                setCurrentQuestionIndex(0);
              }}
              onBack={handlePrevious}
            />
          </>
        );
      case 'ranking':
        return (
          <>
            <ProgressIndicator 
              currentQuestion={getCurrentQuestionNumber()}
              totalQuestions={TOTAL_QUESTIONS}
            />
            <RankChoiceQuestions
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              rankings={rankings}
              setRankings={setRankings}
              onComplete={handleMoveToPayment}
              onBack={handlePrevious}
              assessmentId={assessmentId}
            />
          </>
        );
      case 'payment':
        return (
          <PaymentPage
            userInfo={userInfo}
            assessmentId={assessmentId}
            onContinue={() => {
              router.push(`/assessment/results?assessmentId=${assessmentId}`);
            }}
            onBack={() => setStep('ranking')}
          />
        );
      case 'results':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <ResultsPage
                userInfo={userInfo}
                analysis={analysis}
                isAnalyzing={isAnalyzing}
                sortedResults={sortedResults}
                onBack={() => setStep('payment')}
                assessmentId={assessmentId}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      {renderCurrentStep()}
    </div>
  );
}