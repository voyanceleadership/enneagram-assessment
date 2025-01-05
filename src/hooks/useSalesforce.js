// src/hooks/useSalesforce.js
import { useState } from 'react';

export function useSalesforce() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const completeAssessment = async (sessionId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to save assessment to Salesforce');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAssessmentHistory = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/assessment/history?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessment history');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    completeAssessment,
    getAssessmentHistory,
    isLoading,
    error
  };
}