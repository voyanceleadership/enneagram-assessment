'use client';

import React, { useState, useEffect } from 'react';
import { assessmentQuestions, rankingQuestions } from '@/app/data/assessment/AssessmentQuestions';
import { TYPE_NAMES } from '@/app/data/constants/EnneagramData';
import { calculateAssessmentResults } from '@/utils/calculateAssessmentResults';
import UserInfoForm from '@/components/forms/UserInfoForm';
import LikertQuestions from './LikertQuestions';
import RankChoiceQuestions from './RankChoiceQuestions';
import ResultsPage from './ResultsPage';
import PaymentPage from '@/components/payment/PaymentPage';
import { ProgressIndicator } from './ProgressIndicator';

// Update the UserInfo interface
export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
}

// Add a handleUserInfoSubmit function
const handleUserInfoSubmit = async () => {
  try {
    const response = await fetch('/api/assessment/save-response', {
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

    const data = await response.json();
    if (data.success) {
      setAssessmentId(data.assessmentId);
      setStep('likert');
      setCurrentQuestionIndex(0);
    } else {
      throw new Error(data.error || 'Failed to save user info');
    }
  } catch (err) {
    console.error('Error saving user info:', err);
    setError(err instanceof Error ? err.message : 'An error occurred');
  }
};

export type WeightingResponses = {
  [questionId: string]: number;
};

export type Rankings = {
  [questionIndex: number]: number[];
};

type AssessmentStep = 'userInfo' | 'likert' | 'ranking' | 'payment' | 'results';

export default function EnneagramAssessment() {
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
  const TOTAL_QUESTIONS = 48; // Total number of questions across all sections
  const LIKERT_QUESTIONS = 12; // Number of Likert questions

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
          assessmentType: 'standard',  // Add this line to specify the assessment type
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
  
      // Check payment status or bypass for validated users
      const checkoutResponse = await fetch('/api/assessment/payment-flow/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userInfo.email,
          assessmentId: data.assessmentId
        })
      });
  
      const checkoutResult = await checkoutResponse.json();
  
      // Sort results for display
      setSortedResults(
        Object.entries(calculatedResults)
          .sort(([, a], [, b]) => b - a) as [string, number][]
      );
  
      // Handle bypass flow - directly move to results
      if (checkoutResult.success && checkoutResult.bypass) {
        console.log('Bypassing payment, moving to results.');
        setIsAnalyzing(true);
        setStep('results');
      } else {
        // Continue to Stripe payment if bypass is not triggered
        setStep('payment');
      }
    } catch (err) {
      console.error('Error in handleMoveToPayment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred saving your assessment');
    }
  };  

  // Determine which component to render based on current step
  const renderCurrentStep = () => {
    switch (step) {
      case 'userInfo':
        return (
          <UserInfoForm
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            onNext={async () => {
              try {
                // First create initial assessment record
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
              assessmentId={assessmentId}  // Add this prop
            />
          </>
        );
      case 'payment':
        return (
          <PaymentPage
            userInfo={userInfo}
            assessmentId={assessmentId}
            onContinue={() => setStep('results')}
            onBack={() => setStep('ranking')}
          />
        );
      case 'results':
        return (
          <ResultsPage
            userInfo={userInfo}
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            sortedResults={sortedResults}
            onBack={() => setStep('payment')}
          />
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