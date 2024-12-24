// src/components/assessment/LikertQuestions.tsx
import React from 'react';
import { assessmentQuestions } from '../../app/data/assessment/AssessmentQuestions';
import { WeightingResponses } from './EnneagramAssessment';

interface LikertQuestionsProps {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  weightingResponses: WeightingResponses;
  setWeightingResponses: (responses: WeightingResponses) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function LikertQuestions({
  currentQuestionIndex,
  setCurrentQuestionIndex,
  weightingResponses,
  setWeightingResponses,
  onComplete,
  onBack
}: LikertQuestionsProps) {
  const currentQuestion = assessmentQuestions.likertQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex / assessmentQuestions.likertQuestions.length) * 100;

  const handleSelection = (value: number) => {
    setWeightingResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    if (currentQuestionIndex < assessmentQuestions.likertQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-600">Part 1: General Patterns</p>
          <p className="text-sm text-gray-600">{currentQuestion.triadGroup}</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelection(option.value)}
                className={`w-full p-3 text-left rounded-lg border transition-colors
                  ${weightingResponses[currentQuestion.id] === option.value
                    ? 'bg-blue-50 border-blue-300'
                    : 'hover:bg-gray-50 border-gray-200'}`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-4 py-2 text-blue-600"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentQuestionIndex < assessmentQuestions.likertQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
              } else {
                onComplete();
              }
            }}
            disabled={!weightingResponses[currentQuestion.id]}
            className={`px-4 py-2 rounded-lg ${
              weightingResponses[currentQuestion.id]
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}