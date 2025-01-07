// ProgressIndicator.tsx
import React from 'react';

interface ProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const ProgressIndicator = ({ currentQuestion, totalQuestions }: ProgressIndicatorProps) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Question {currentQuestion} of {totalQuestions}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};