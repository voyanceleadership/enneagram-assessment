// src/components/assessment/RankChoiceQuestions.tsx
import React from 'react';
import { rankingQuestions } from '../../app/data/assessment/AssessmentQuestions';
import { Rankings } from './EnneagramAssessment';

interface RankChoiceQuestionsProps {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  rankings: Rankings;
  setRankings: (rankings: Rankings) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function RankChoiceQuestions({
  currentQuestionIndex,
  setCurrentQuestionIndex,
  rankings,
  setRankings,
  onComplete,
  onBack
}: RankChoiceQuestionsProps) {
  const currentQuestion = rankingQuestions[currentQuestionIndex];

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
        onComplete();
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
            onClick={() => {
              if (currentQuestionIndex < rankingQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
              } else {
                onComplete();
              }
            }}
            disabled={!rankings[currentQuestionIndex]?.length}
            className={`px-4 py-2 rounded-lg ${
              rankings[currentQuestionIndex]?.length === 3
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === rankingQuestions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}