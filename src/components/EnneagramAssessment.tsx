'use client';

import React, { useState, useEffect } from 'react';
import { assessmentQuestions, rankingQuestions } from '@/src/app/api/data/AssessmentQuestions.ts';
import { typeNames } from '@/app/data/EnneagramData';
import UserInfoForm from './UserInfoForm';
import LikertQuestions from './LikertQuestions';
import RankChoiceQuestions from './RankChoiceQuestions';
import ResultsPage from './ResultsPage';
import PaymentPage from './PaymentPage';

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export type WeightingResponses = {
  [questionId: string]: number;
};

export type Rankings = {
  [questionIndex: number]: number[];
};

type AssessmentStep = 'userInfo' | 'likert' | 'ranking' | 'payment' | 'results';

export default function EnneagramAssessment() {
  const [step, setStep] = useState<AssessmentStep>('userInfo');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [weightingResponses, setWeightingResponses] = useState<WeightingResponses>({});
  const [rankings, setRankings] = useState<Rankings>({});
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sortedResults, setSortedResults] = useState<[string, number][]>([]);

  // Calculate results function stays here as it's used by multiple components
  const calculateResults = () => {
    // ... existing calculation logic ...
  };

  // Determine which component to render based on current step
  const renderCurrentStep = () => {
    switch (step) {
      case 'userInfo':
        return (
          <UserInfoForm
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            onNext={() => setStep('likert')}
          />
        );
      case 'likert':
        return (
          <LikertQuestions
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            weightingResponses={weightingResponses}
            setWeightingResponses={setWeightingResponses}
            onComplete={() => setStep('ranking')}
            onBack={() => setStep('userInfo')}
          />
        );
      case 'ranking':
        return (
          <RankChoiceQuestions
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            rankings={rankings}
            setRankings={setRankings}
            onComplete={() => setStep('payment')}
            onBack={() => setStep('likert')}
          />
        );
      case 'payment':
        return (
          <PaymentPage
            userEmail={userInfo.email}
            onContinue={() => setStep('results')}
            onBack={() => setStep('ranking')}
          />
        );
      case 'results':
        return (
          <ResultsPage
            userInfo={userInfo}
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            sortedResults={sortedResults}
            onBack={() => setStep('payment')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {renderCurrentStep()}
    </div>
  );
}

// OLD CODE

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { assessmentQuestions, rankingQuestions, typeNames, triadDescriptions } from '../app/api/data/AssessmentQuestions';
// import html2pdf from 'html2pdf.js';

// interface UserInfo {
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// const cleanAnalysis = (text: any) => {
//   return (typeof text === 'string' ? text : '')
//     .replace(/```html|```/g, '')  // Strip code block markers
//     .replace(/\*\*(.*?)\*\*/g, '<h2>$1</h2>')  // Convert **bold** to <h2>
//     .trim();
// };

// type Rankings = {
//   [questionIndex: number]: number[];
// };

// type WeightingResponses = {
//   [questionId: string]: number;
// };

// export default function EnneagramAssessment() {
//   const [userInfo, setUserInfo] = useState<UserInfo>({
//     firstName: '',
//     lastName: '',
//     email: ''
//   });

//   const [step, setStep] = useState<'userInfo' | 'assessment' | 'complete'>('userInfo');
//   const [phase, setPhase] = useState<'likert' | 'ranking'>('likert');
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [weightingResponses, setWeightingResponses] = useState<WeightingResponses>({});
//   const [rankings, setRankings] = useState<Rankings>({});
//   const [isComplete, setIsComplete] = useState(false);
//   const [analysis, setAnalysis] = useState<string>('');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [sortedResults, setSortedResults] = useState<[string, number][]>([]);

//   const handleFormSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setStep('assessment');
//   };

//   const questions = phase === 'likert' 
//     ? assessmentQuestions.likertQuestions 
//     : rankingQuestions;
  
//   const currentQuestion = questions[currentQuestionIndex];
//   const currentTriad = currentQuestion?.triadGroup;

//   const handleLikertSelection = (value: number) => {
//     if (phase === 'likert') {
//       const question = assessmentQuestions.likertQuestions[currentQuestionIndex];
//       setWeightingResponses(prev => ({
//         ...prev,
//         [question.id]: value
//       }));

//       if (currentQuestionIndex < assessmentQuestions.likertQuestions.length - 1) {
//         setCurrentQuestionIndex(prev => prev + 1);
//       } else {
//         setPhase('ranking');
//         setCurrentQuestionIndex(0);
//       }
//     }
//   };

//   const handleRankingClick = (optionIndex: number) => {
//     if (phase === 'ranking') {
//       const currentRankings = rankings[currentQuestionIndex] || [];
//       let newRankings = [...currentRankings];

//       if (newRankings.includes(optionIndex)) {
//         newRankings = newRankings.filter(index => index !== optionIndex);
//       } else if (newRankings.length < 3) {
//         newRankings.push(optionIndex);
//       }

//       setRankings(prev => ({
//         ...prev,
//         [currentQuestionIndex]: newRankings
//       }));

//       if (newRankings.length === 3 && currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex(prev => prev + 1);
//       } else if (newRankings.length === 3 && currentQuestionIndex === questions.length - 1) {
//         setIsComplete(true);
//       }
//     }
//   };

//   const getRankLabel = (optionIndex: number): string => {
//     const currentRankings = rankings[currentQuestionIndex] || [];
//     const rank = currentRankings.indexOf(optionIndex);
//     return rank === -1 ? '' : `${rank + 1}`;
//   };

//   // UPDATED SCORING LOGIC - START
//   const calculateResults = () => {
//     console.log('calculateResults function triggered');
//     console.log('Ranking Questions Length:', rankingQuestions.length);    
//     console.log('Starting score calculation...');
//     console.log('Weighting responses:', weightingResponses);
//     console.log('Rankings:', rankings);
    
//     const typeScores: { [key: string]: number } = {};
    
//     // Initialize scores for all types
//     for (let i = 1; i <= 9; i++) {
//         typeScores[i.toString()] = 0;
//     }

//     // Constants for scoring
//     const pointsPerQuestion = 100/12; // 100/12 points possible per question
//     const secondPlaceMultiplier = 0.5; // Second place gets half points
    
//     // Calculate points without initial normalization
//     rankingQuestions.forEach((rankingQuestion, questionIndex) => {
//         // Get weight from Likert response (0-1)
//         const weight = weightingResponses[rankingQuestion.likertId] / 100;
//         const questionRankings = rankings[questionIndex] || [];
        
//         questionRankings.forEach((optionIndex, rankIndex) => {
//             const option = rankingQuestion.options[optionIndex];
//             const type = option.type;
            
//             if (rankIndex === 0) {
//                 // First choice gets full points * weight
//                 typeScores[type] += pointsPerQuestion * weight;
//             } else if (rankIndex === 1) {
//                 // Second choice gets half points * weight
//                 typeScores[type] += (pointsPerQuestion * secondPlaceMultiplier) * weight;
//             }
//             // Third choice gets no points
//         });
//     });

//     console.log('Final scores:', typeScores);
//     return typeScores;
// };
  
//   // UPDATED SCORING LOGIC - END

//   const generateAnalysis = async () => {
//     try {
//       const results = calculateResults();
//       const response = await fetch('/api/analyze', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           scores: results,
//           responses: {
//             weightingResponses,
//             rankings
//           }
//         })
//       });

//       const data = await response.json();
//       return cleanAnalysis(data.analysis);  // Clean response to remove markdown formatting
//     } catch (error) {
//       console.error('Error:', error);
//       return 'Unable to generate analysis at this time.';
//     }
//   };

//   useEffect(() => {
//     if (isComplete && analysis) {
//       const results = calculateResults();
//       fetch('/api/sendEmail', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: userInfo.email,
//           analysisHtml: cleanAnalysis(analysis),
//           scores: results,
//         }),
//       })
//       .then(res => res.json())
//       .then(data => console.log(data.message))
//       .catch(error => console.error('Failed to send email:', error));
//     }
//   }, [isComplete, analysis]);  

//   useEffect(() => {
//     if (isComplete) {
//       setIsAnalyzing(true);
//       generateAnalysis()
//         .then(result => {
//           setAnalysis(result);
//           setIsAnalyzing(false);
//         });
//     }
//   }, [isComplete]);
  
//   // NEW useEffect for sorting results
//   useEffect(() => {
//     if (isComplete) {
//       const results = calculateResults();
//       const sorted = Object.entries(results).sort(([, a], [, b]) => b - a);
//       setSortedResults(sorted);
//     }
//   }, [isComplete]);  

//   const downloadPDF = async () => {
//     const html2pdf = (await import('html2pdf.js')).default;
    
//     const currentDate = new Date();
//     const formattedDate = currentDate.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });

//     const combinedContent = document.createElement('div');
//     combinedContent.innerHTML = `
//       <div style="text-align: center; margin-bottom: 30px;">
//         <h1 style="margin-bottom: 5px; font-size: 2.2rem;">Enneagram Assessment Results</h1>
//         <p style="margin: 0; font-size: 1rem; color: #555;">Comprehensive Assessment Breakdown</p>
//       </div>
      
//       <div style="text-align: left; margin-bottom: 30px;">
//         <p><strong>Full Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</p>
//         <p><strong>Email:</strong> ${userInfo.email}</p>
//         <p><strong>Date of Submission:</strong> ${formattedDate}</p>
//       </div>

//       <div style="border-bottom: 2px solid #ddd; margin-bottom: 30px;"></div>
      
//       <div style="margin-bottom: 30px;">
//         <h2 style="font-size: 1.5rem; margin-bottom: 10px;">Type Scores</h2>
//         ${sortedResults.length > 0
//           ? sortedResults.map(([type, score]) => {
//               return `<p style="margin: 5px 0; font-size: 1.1rem;">
//                 <strong>Type ${type}: ${typeNames[type]}</strong> - ${Math.round(score)} points
//               </p>`;
//             }).join('')
//           : '<p>No scores available.</p>'
//         }
//       </div>
      
//       <div style="border-bottom: 2px solid #ddd; margin-bottom: 30px;"></div>

//       <div id="analysis-section">
//         <h2 style="font-size: 1.5rem; margin-bottom: 15px;">Analysis</h2>
//         ${analysis ? cleanAnalysis(analysis) : '<p>No analysis available.</p>'}
//       </div>
//     `;

//     const options = {
//       margin: [10, 10, 20, 10],
//       filename: 'enneagram-assessment-results.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//       pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
//     };

//     html2pdf().from(combinedContent).set(options).save();
// };
  
//   if (step === 'userInfo') {
//     return (
//       <div className="max-w-2xl mx-auto p-4 space-y-8">
//         <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
//           <h2 className="text-2xl font-bold mb-4">Start Your Enneagram Assessment</h2>
//           <form onSubmit={handleFormSubmit}>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full p-2 border rounded-lg"
//                   value={userInfo.firstName}
//                   onChange={(e) => setUserInfo(prev => ({
//                     ...prev,
//                     firstName: e.target.value
//                   }))}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full p-2 border rounded-lg"
//                   value={userInfo.lastName}
//                   onChange={(e) => setUserInfo(prev => ({
//                     ...prev,
//                     lastName: e.target.value
//                   }))}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   required
//                   className="w-full p-2 border rounded-lg"
//                   value={userInfo.email}
//                   onChange={(e) => setUserInfo(prev => ({
//                     ...prev,
//                     email: e.target.value
//                   }))}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
//               >
//                 Begin Assessment
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   }
  
//   if (isComplete) {
//     const results = calculateResults();
//     const sortedResults = Object.entries(results).sort(([, a], [, b]) => b - a);

//     const currentDate = new Date();
//     const formattedDate = currentDate.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });

//     return (
//       <div className="max-w-2xl mx-auto p-4">
//         <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          
//           <h2 className="text-2xl font-bold mb-4">Your Enneagram Results</h2>

//           {/* User Info Section */}
//           <div className="border-b pb-4 mb-6">
//             <p><strong>Full Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
//             <p><strong>Email:</strong> {userInfo.email}</p>
//             <p><strong>Submission Date:</strong> {formattedDate}</p>
//           </div>

//           <div className="flex justify-between items-center">
//             <div className="space-x-4">
//               <button
//                 onClick={() => window.print()}
//                 className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
//               >
//                 Print Results
//               </button>
//               <button
//                 onClick={downloadPDF}
//                 className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
//               >
//                 Download PDF
//               </button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {sortedResults.map(([type, score], index) => (
//               <div
//                 key={type}
//                 className={`flex justify-between items-center p-3 rounded-lg
//                   ${index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}
//                 `}
//               >
//                 <span className="font-semibold">Type {type}: {typeNames[type]}</span>
//                 <span className="text-blue-600 font-bold">{Math.round(score)} points</span>
//               </div>
//             ))}

//             <div className="mt-8 p-4 bg-gray-50 rounded-lg">
//               {isAnalyzing ? (
//                 <div className="text-center py-4">
//                   <p>Generating your personalized analysis...</p>
//                 </div>
//               ) : (
//                 <>
//                   <div
//                     id="analysis-content"
//                     className="text-gray-700 leading-relaxed analysis-content"
//                     dangerouslySetInnerHTML={{ __html: cleanAnalysis(analysis) }}
//                   />
//                   <div className="flex justify-center mt-6">
//                     <button
//                       onClick={() => window.print()}
//                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                       Print Results
//                     </button>
//                     <button
//                       onClick={downloadPDF}
//                       className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-4"
//                     >
//                       Download PDF
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
// } 

//   return (
//     <div className="max-w-2xl mx-auto p-4 space-y-8">
//       <div className="mb-8">
//         <div className="h-2 w-full bg-gray-200 rounded-full">
//           <div 
//             className="h-2 bg-blue-500 rounded-full transition-all duration-300"
//             style={{ 
//               width: `${phase === 'likert' 
//                 ? (currentQuestionIndex / assessmentQuestions.likertQuestions.length) * 100
//                 : ((assessmentQuestions.likertQuestions.length + currentQuestionIndex) / 
//                    (assessmentQuestions.likertQuestions.length + rankingQuestions.length)) * 100
//               }%` 
//             }}
//           />
//         </div>
//         <div className="flex justify-between items-center mt-2">
//           <p className="text-sm text-gray-600">
//             {phase === 'likert' ? 'Part 1: General Patterns' : 'Part 2: Specific Preferences'}
//           </p>
//           <p className="text-sm text-gray-600">{currentTriad}</p>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
//         {phase === 'likert' ? (
//           <div className="space-y-4">
//             <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
//             <div className="space-y-2">
//               {currentQuestion.options.map((option: any, index: number) => (
//                 <button
//                   key={index}
//                   onClick={() => handleLikertSelection(option.value)}
//                   className={`w-full p-3 text-left rounded-lg border transition-colors
//                     ${weightingResponses[currentQuestion.id] === option.value
//                       ? 'bg-blue-50 border-blue-300'
//                       : 'hover:bg-gray-50 border-gray-200'}`}
//                 >
//                   {option.text}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
//             <div className="space-y-2">
//               {currentQuestion.options.map((option: any, index: number) => (
//                 <div
//                   key={index}
//                   onClick={() => handleRankingClick(index)}
//                   className={`p-4 border rounded-lg cursor-pointer transition-colors relative
//                     ${getRankLabel(index) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
//                 >
//                   <div className="flex justify-between items-center">
//                     <p>{option.text}</p>
//                     {getRankLabel(index) && (
//                       <span className="ml-2 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
//                         {getRankLabel(index)}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="flex justify-between mt-8">
//   <button
//     onClick={() => {
//       if (currentQuestionIndex > 0) {
//         setCurrentQuestionIndex(prev => prev - 1);  // Go to previous question
//       } else if (phase === 'ranking') {
//         setPhase('likert');
//         setCurrentQuestionIndex(assessmentQuestions.likertQuestions.length - 1);  // Go to last likert question
//       } else if (phase === 'likert' && currentQuestionIndex === 0) {
//         setStep('userInfo');  // Go back to User Info form
//       }
//     }}
//     disabled={phase === 'likert' && currentQuestionIndex === 0 && step === 'userInfo'}
//     className="px-4 py-2 text-blue-600 disabled:text-gray-400"
//   >
//     Previous
//   </button>
//   <button
//     onClick={() => {
//       if (phase === 'likert') {
//         if (currentQuestionIndex < assessmentQuestions.likertQuestions.length - 1) {
//           setCurrentQuestionIndex(prev => prev + 1);
//         } else {
//           setPhase('ranking');
//           setCurrentQuestionIndex(0);
//         }
//       } else {
//         if (currentQuestionIndex < rankingQuestions.length - 1) {
//           setCurrentQuestionIndex(prev => prev + 1);
//         } else {
//           setIsComplete(true);
//         }
//       }
//     }}
//     disabled={
//       phase === 'likert' ? !weightingResponses[currentQuestion.id] : !rankings[currentQuestionIndex]?.length
//     }
//     className={`px-4 py-2 rounded-lg ${
//       (phase === 'likert' ? weightingResponses[currentQuestion.id] : rankings[currentQuestionIndex]?.length)
//         ? 'bg-blue-600 text-white hover:bg-blue-700'
//         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//     }`}
//   >
//     {phase === 'ranking' && currentQuestionIndex === rankingQuestions.length - 1
//       ? 'Complete'
//       : 'Next'}
//   </button>
// </div>
//       </div>
//     </div>
//   );
// }