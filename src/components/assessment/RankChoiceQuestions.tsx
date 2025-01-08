// src/components/assessment/RankChoiceQuestions.tsx
import React, { useState } from 'react';
import { rankingQuestions } from '../../app/data/assessment/AssessmentQuestions';
import { Rankings } from './EnneagramAssessment';

interface RankChoiceQuestionsProps {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  rankings: Rankings;
  setRankings: (rankings: Rankings) => void;
  onComplete: () => void;
  onBack: () => void;
  assessmentId: string;
}

export default function RankChoiceQuestions({
  currentQuestionIndex,
  setCurrentQuestionIndex,
  rankings,
  setRankings,
  onComplete,
  onBack,
  assessmentId
}: RankChoiceQuestionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const currentQuestion = rankingQuestions[currentQuestionIndex];

  const handleCompletion = async () => {
    try {
      // First check if this is a paid assessment
      const paymentCheck = await fetch('/api/assessment/payment-flow/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId })
      });

      const { paid } = await paymentCheck.json();

      if (paid) {
        // Get the assessment with results
        const assessmentResponse = await fetch('/api/assessment/get-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assessmentId })
        });

        const assessmentData = await assessmentResponse.json();

        if (assessmentData.results) {
          // Trigger analysis generation
          await fetch('/api/assessment/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              assessmentId,
              scores: assessmentData.results.reduce((acc, result) => {
                acc[result.type] = Math.round(result.score * 10) / 10;
                return acc;
              }, {} as Record<string, number>)
            }),
          });
        }
      }

      // Continue with normal completion flow
      onComplete();
    } catch (error) {
      console.error('Error handling assessment completion:', error);
      onComplete(); // Still complete even if there's an error
    }
  };

  const getRankLabel = (optionIndex: number): string => {
    const currentRankings = rankings[currentQuestionIndex] || [];
    const rank = currentRankings.indexOf(optionIndex);
    return rank === -1 ? '' : `${rank + 1}`;
  };

  const handleRankingClick = (optionIndex: number) => {
    const currentRankings = rankings[currentQuestionIndex] || [];
    let newRankings = [...currentRankings];

    if (newRankings.includes(optionIndex)) {
      newRankings = newRankings.filter(index => index !== optionIndex);
    } else if (newRankings.length < 3) {
      newRankings.push(optionIndex);
    }

    setRankings(prev => ({
      ...prev,
      [currentQuestionIndex]: newRankings
    }));

    if (newRankings.length === 3) {
      if (currentQuestionIndex < rankingQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        handleCompletion();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  return (
    <div>
      {/* Question Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleRankingClick(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors relative
                  ${getRankLabel(index) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-center">
                  <p>{option.text}</p>
                  {getRankLabel(index) && (
                    <span className="ml-2 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
                      {getRankLabel(index)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 text-blue-600"
          >
            Previous
          </button>
          <button
            onClick={async () => {
              if (currentQuestionIndex < rankingQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
              } else {
                setIsSubmitting(true);
                await onComplete();
                setIsSubmitting(false);
              }
            }}
            disabled={!rankings[currentQuestionIndex]?.length || isSubmitting}
            className={`px-4 py-2 rounded-lg ${
              rankings[currentQuestionIndex]?.length === 3 && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === rankingQuestions.length - 1 
              ? (isSubmitting ? 'Submitting...' : 'Complete') 
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}