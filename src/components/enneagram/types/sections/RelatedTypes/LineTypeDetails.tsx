// src/components/enneagram/types/components/LineTypeDetails.tsx

import React from 'react';

interface LineTypeDetailsProps {
  details: {
    dynamics?: {
      healthy: string;
      average: string;
      unhealthy: string;
    }
  }
}

export function LineTypeDetails({ details }: LineTypeDetailsProps) {
  if (!details?.dynamics) return null;

  return (
    <div className="space-y-6">
      <div>
        <h5 className="text-lg font-medium mb-2">At Their Best</h5>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-700">{details.dynamics.healthy}</p>
        </div>
      </div>

      <div>
        <h5 className="text-lg font-medium mb-2">Average State</h5>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">{details.dynamics.average}</p>
        </div>
      </div>

      <div>
        <h5 className="text-lg font-medium mb-2">Under Stress</h5>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-gray-700">{details.dynamics.unhealthy}</p>
        </div>
      </div>
    </div>
  );
}