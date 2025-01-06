import React, { useState } from 'react';
import { UserInfo } from '@/components/assessment/EnneagramAssessment';
import { TYPE_NAMES } from '@/app/data/constants/EnneagramData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
              <strong>Type ${type}: ${typeName}</strong> - ${score} points
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
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-0">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Your Enneagram Results
              </h1>

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
                  <div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span> {currentDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.print()}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Print Results
                </Button>
                <Button
                  onClick={downloadPDF}
                  disabled={isAnalyzing || isGeneratingPDF}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-gray-300"
                >
                  Back
                </Button>
              </div>

              {pdfError && (
                <Alert variant="destructive">
                  <AlertDescription>{pdfError}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* Results Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Type Scores</h2>
              <div className="space-y-3">
                {sortedResults.map(([type, score]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        Type {type}: {TYPE_NAMES[type]}
                      </h3>
                    </div>
                    <span className="text-lg font-bold text-gray-700">
                      {Math.round(score)} points
                    </span>
                  </div>
                ))}
              </div>

              {/* Analysis Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Detailed Analysis
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Generating your personalized analysis...</p>
                    </div>
                  ) : analysis ? (
                    <div
                      className="prose max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: analysis }}
                    />
                  ) : (
                    <p className="text-gray-600">Analysis generation in progress...</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .card,
          .card * {
            visibility: visible;
          }
          .card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}