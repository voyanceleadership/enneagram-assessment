'use client';

export default function Results() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Results Page</h1>
      <p>If you can see this, the route is working.</p>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import ResultsPage from '@/components/assessment/ResultsPage';
// import { UserInfo } from '@/components/assessment/EnneagramAssessment';

// interface AssessmentData {
//   userInfo: UserInfo;
//   results: Array<{
//     type: string;
//     score: number;
//   }>;
//   analysis?: {
//     content: string;
//   };
// }

// export default function Results() {
//   const searchParams = useSearchParams();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

//   useEffect(() => {
//     const verifyPayment = async () => {
//       const sessionId = searchParams.get('session_id');
//       console.log('Processing session ID:', sessionId); // Debug log
      
//       if (!sessionId) {
//         setError('No session ID found');
//         setIsLoading(false);
//         return;
//       }

//       try {
//         console.log('Sending verification request...'); // Debug log
//         const response = await fetch('/api/assessment/payment-flow/verify-payment', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ sessionId }),
//         });

//         console.log('Verification response status:', response.status); // Debug log
//         const data = await response.json();
//         console.log('Verification response data:', data); // Debug log

//         if (data.success) {
//           if (!data.data?.userInfo || !data.data?.results) {
//             console.error('Missing required data in response:', data); // Debug log
//             setError('Incomplete assessment data received');
//             return;
//           }
//           setAssessmentData(data.data);
//           console.log('Assessment data set successfully:', data.data); // Debug log
//         } else {
//           setError(data.error || 'Payment verification failed');
//           console.error('Verification failed:', data.error); // Debug log
//         }
//       } catch (err) {
//         console.error('Payment verification error:', err);
//         setError('Error verifying payment. Please try refreshing the page.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     verifyPayment();
//   }, [searchParams]);

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold mb-2">Verifying your payment...</h2>
//             <p className="text-gray-600">Please wait while we confirm your payment.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
//             <p className="text-gray-600">{error}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!assessmentData) {
//     return (
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold mb-2">Payment Not Verified</h2>
//             <p className="text-gray-600">Unable to verify your payment. Please contact support.</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Transform results into the expected format
//   const sortedResults: [string, number][] = assessmentData.results
//     .map(result => [result.type, result.score])
//     .sort(([, a], [, b]) => b - a);

//   console.log('Rendering results with data:', { 
//     userInfo: assessmentData.userInfo,
//     resultsCount: sortedResults.length,
//     hasAnalysis: !!assessmentData.analysis
//   }); // Debug log

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <ResultsPage
//           userInfo={assessmentData.userInfo}
//           analysis={assessmentData.analysis?.content || ''}
//           isAnalyzing={false}
//           sortedResults={sortedResults}
//           onBack={() => window.history.back()}
//         />
//       </div>
//     </div>
//   );
// }