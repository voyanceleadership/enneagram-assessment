// src/components/assessment/ResultsPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Mail } from 'lucide-react';
import { getTypeName } from '@/utils/calculateAssessmentResults'; // Adjust this path if needed

const TYPE_NAMES = {
  '1': 'Type 1: The Reformer',
  '2': 'Type 2: The Helper',
  '3': 'Type 3: The Achiever',
  '4': 'Type 4: The Individualist',
  '5': 'Type 5: The Investigator',
  '6': 'Type 6: The Loyalist',
  '7': 'Type 7: The Enthusiast',
  '8': 'Type 8: The Challenger',
  '9': 'Type 9: The Peacemaker'
};

interface ResultsPageProps {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  analysis: string;
  isAnalyzing: boolean;
  analysisTimedOut: boolean;
  sortedResults: [string, number][];
  onBack: () => void;
  assessmentId: string;
  onSendEmail: () => void;
  isSendingEmail: boolean;
  emailSent: boolean;
  emailError: string | null;
}

export default function ResultsPage({
  userInfo,
  analysis,
  isAnalyzing,
  analysisTimedOut,
  sortedResults,
  onBack,
  assessmentId,
  onSendEmail,
  isSendingEmail,
  emailSent,
  emailError
}: ResultsPageProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);
  
    try {
      const response = await fetch('/api/assessment/results/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInfo,
          scores: Object.fromEntries(sortedResults),
          analysis
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enneagram-assessment-${userInfo.firstName.toLowerCase()}-${userInfo.lastName.toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setPdfError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }; 

  return (
    <Card className="bg-white shadow-lg relative">
      {isAnalyzing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
          <div className="h-full bg-blue-600 animate-loading-bar"></div>
        </div>
      )}
      
      <CardHeader className="pb-0">
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Your Enneagram Results
            </h1>
            <div className="flex gap-2">
              {!isAnalyzing && analysis && !analysisTimedOut && (
                <Button
                  onClick={onSendEmail}
                  disabled={isSendingEmail}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {isSendingEmail ? 'Sending...' : emailSent ? 'Email Sent' : 'Send Results'}
                </Button>
              )}
              {(!isAnalyzing || analysisTimedOut) && (
                <Button
                  onClick={downloadPDF}
                  disabled={isGeneratingPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </Button>
              )}
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {userInfo.firstName} {userInfo.lastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {userInfo.email}
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-gray-700">
                  <span className="font-semibold">Date:</span> {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {(pdfError || emailError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {pdfError || emailError}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Type Scores</h2>
            <div className="space-y-3">
              {sortedResults.map(([type, score]) => (
                <div
                  key={type}
                  className="flex justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg">{TYPE_NAMES[type]}</span>
                  <span className="font-semibold text-lg">{Math.round(score)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analysis</h2>
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin-slow border-t-transparent"></div>
                  </div>
                </div>
                <p className="text-gray-600">Generating your personalized analysis...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: analysis }}
              />
            )}
          </div>

          <div className="mt-8">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-gray-300"
            >
              Back to Assessment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}