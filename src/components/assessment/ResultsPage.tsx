import React from 'react';
import { UserInfo } from '@/components/assessment/EnneagramAssessment';
import { TYPE_NAMES } from '@/app/data/constants/EnneagramData';

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
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    
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
        ${sortedResults.map(([type, score]) => 
          `<p style="margin: 5px 0; font-size: 1.1rem;">
            \<strong\>Type \${type}: \${TYPE_NAMES[type]}\</strong\> - \${Math.round(score)} points
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
      filename: 'enneagram-assessment-results.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().from(combinedContent).set(options).save();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Enneagram Results</h2>

      {/* User Info Section */}
      <div className="border-b pb-4 mb-6">
        <p><strong>Full Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Submission Date:</strong> {currentDate}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
          >
            Print Results
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
          >
            Download PDF
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedResults.map(([type, score], index) => (
          <div
            key={type}
            className={`flex justify-between items-center p-3 rounded-lg
              ${index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}
            `}
          >
            <span className="font-semibold">Type {type}: {TYPE_NAMES[type]}</span>
            <span className="text-blue-600 font-bold">{Math.round(score)} points</span>
          </div>
        ))}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          {isAnalyzing ? (
            <div className="text-center py-4">
              <p>Generating your personalized analysis...</p>
            </div>
          ) : (
            <div
              className="text-gray-700 leading-relaxed analysis-content"
              dangerouslySetInnerHTML={{ __html: analysis }}
            />
          )}
        </div>
      </div>
    </div>
  );
}