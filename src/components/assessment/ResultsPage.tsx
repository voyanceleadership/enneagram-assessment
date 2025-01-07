import React, { useState, useEffect } from 'react';
import { UserInfo } from '@/components/assessment/EnneagramAssessment';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download } from 'lucide-react';

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
  userInfo: UserInfo;
  analysis: string;
  isAnalyzing: boolean;
  sortedResults: [string, number][];
  onBack: () => void;
}

export default function ResultsPage({
  userInfo,
  analysis,
  isAnalyzing,
  sortedResults,
  onBack
}: ResultsPageProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const processedResults = sortedResults.map(([type, score]) => ({
        type,
        typeName: TYPE_NAMES[type],
        score: Math.round(score)
      }));
      
      const combinedContent = document.createElement('div');
      combinedContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin-bottom: 5px; font-size: 2.2rem;">Enneagram Assessment Results</h1>
          <p style="margin: 0; font-size: 1rem; color: #555;">Comprehensive Assessment Breakdown</p>
        </div>
        
        <div style="text-align: left; margin-bottom: 30px;">
          <p><strong>Full Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</p>
          <p><strong>Email:</strong> ${userInfo.email}</p>
          <p><strong>Date of Submission:</strong> ${currentDate}</p>
        </div>

        <div style="border-bottom: 2px solid #ddd; margin-bottom: 30px;"></div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 10px;">Type Scores</h2>
          ${processedResults.map(({ type, typeName, score }) => 
            `<p style="margin: 5px 0; font-size: 1.1rem;">
              <strong>${typeName}</strong> - ${score} points
            </p>`
          ).join('')}
        </div>
        
        <div style="border-bottom: 2px solid #ddd; margin-bottom: 30px;"></div>

        <div id="analysis-section">
          <h2 style="font-size: 1.5rem; margin-bottom: 15px;">Analysis</h2>
          ${analysis || '<p>No analysis available.</p>'}
        </div>
      `;

      const options = {
        margin: [10, 10, 20, 10],
        filename: `enneagram-assessment-${userInfo.firstName}-${userInfo.lastName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          logging: true,
          allowTaint: true,
          useCORS: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().from(combinedContent).set(options).save();

    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError('There was an error generating your PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="bg-white shadow-lg relative">
          {isAnalyzing && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
              <div className="h-full bg-blue-600 animate-loading-bar"></div>
            </div>
          )}
          
          <CardHeader className="pb-0">
            <div className="space-y-6">
              {/* Header with name and download button */}
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Your Enneagram Results
                </h1>
                <Button
                  onClick={downloadPDF}
                  disabled={isAnalyzing || isGeneratingPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </Button>
              </div>

              {/* User Information */}
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
                      <span className="font-semibold">Date:</span> {currentDate}
                    </p>
                  </div>
                </div>
              </div>

              {pdfError && (
                <Alert variant="destructive">
                  <AlertDescription>{pdfError}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Results Section */}
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

              {/* Analysis Section */}
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

              {/* Back Button */}
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
      </div>
    </div>
  );
}