// src/components/enneagram/types/components/WingTypeDetails.tsx

import React from 'react';

interface WingTypeDetailsProps {
  details: {
    personality?: string;
    strengths?: string[];
    challenges?: string[];
  }
}

export function WingTypeDetails({ details }: WingTypeDetailsProps) {
  if (!details) return null;

  return (
    <div className="space-y-6">
      {details.personality && (
        <div>
          <h5 className="text-lg font-medium mb-2">Personality Blend</h5>
          <p className="text-gray-700">{details.personality}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-6">
        {details.strengths && details.strengths.length > 0 && (
          <div>
            <h5 className="text-lg font-medium mb-2">Strengths</h5>
            <ul className="list-disc pl-5 space-y-2">
              {details.strengths.map((strength, idx) => (
                <li key={idx} className="text-gray-700">{strength}</li>
              ))}
            </ul>
          </div>
        )}
        
        {details.challenges && details.challenges.length > 0 && (
          <div>
            <h5 className="text-lg font-medium mb-2">Challenges</h5>
            <ul className="list-disc pl-5 space-y-2">
              {details.challenges.map((challenge, idx) => (
                <li key={idx} className="text-gray-700">{challenge}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}