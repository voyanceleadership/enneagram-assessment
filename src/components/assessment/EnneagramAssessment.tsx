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

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

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
          }
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
      console.log('Current state:', {
        weightingResponses,
        rankings,
        userInfo
      });
  
      // Calculate results using the imported function
      const calculatedResults = calculateAssessmentResults(weightingResponses, rankings);
      console.log('Calculated results:', calculatedResults);
  
      // Save assessment data with calculated results
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
          }
        }),
      });
  
      console.log('Save response status:', response.status);
      const data = await response.json();
      console.log('Save response data:', data);
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save assessment data');
      }
  
      if (data.success) {
        setAssessmentId(data.assessmentId);
        setSortedResults(
          Object.entries(calculatedResults)
            .sort(([, a], [, b]) => b - a) as [string, number][]
        );
        setStep('payment');
      } else {
        throw new Error(data.error || 'Failed to save assessment');
      }
    } catch (err) {
      console.error('Detailed error in handleMoveToPayment:', err);
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
            onNext={() => setStep('likert')}
          />
        );
      case 'likert':
        return (
          <LikertQuestions
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            weightingResponses={weightingResponses}
            setWeightingResponses={setWeightingResponses}
            onComplete={() => setStep('ranking')}
            onBack={() => setStep('userInfo')}
          />
        );
      case 'ranking':
        return (
          <RankChoiceQuestions
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            rankings={rankings}
            setRankings={setRankings}
            onComplete={handleMoveToPayment}
            onBack={() => setStep('likert')}
          />
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