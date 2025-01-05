import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateAssessmentResults } from '@/app/assessment/results/calculate';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    console.log('Payment success route triggered. Session ID:', sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session ID provided' },
        { status: 400 }
      );
    }

    const assessmentResponse = await prisma.assessmentResponse.findFirst({
      where: { sessionId },
      include: {
        userInfo: true,
        results: true,
        analysis: true,
      }
    });

    if (!assessmentResponse) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    console.log('Assessment found. Marking as paid...');
    await prisma.assessmentResponse.update({
      where: { id: assessmentResponse.id },
      data: { isPaid: true }
    });

    // Decrement coupon usage only after payment success
    if (assessmentResponse.sessionId && assessmentResponse.metadata?.couponCode !== 'NONE') {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: assessmentResponse.metadata.couponCode }
        });

        if (coupon) {
          await prisma.$transaction([
            prisma.coupon.update({
              where: { id: coupon.id },
              data: { uses: { decrement: 1 } }
            }),
            prisma.couponUsage.create({
              data: {
                couponId: coupon.id,
                email: assessmentResponse.userInfo.email
              }
            })
          ]);
          console.log(`Coupon ${coupon.code} decremented after successful payment.`);
        }
      } catch (couponError) {
        console.error('Error decrementing coupon:', couponError);
      }
    }

    const redirectUrl = `/assessment/results?session_id=${sessionId}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));

  } catch (error) {
    console.error('Error handling payment success:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { salesforceService } from '@/services/salesforce';
// import { calculateAssessmentResults } from '@/app/assessment/results/calculate';

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const sessionId = searchParams.get('session_id');
//     console.log('1. Payment success GET route called with sessionId:', sessionId);

//     if (!sessionId) {
//       return NextResponse.json(
//         { success: false, error: 'No session ID provided' },
//         { status: 400 }
//       );
//     }

//     // Retrieve the assessment with full related data
//     const assessmentResponse = await prisma.assessmentResponse.findFirst({
//       where: { sessionId },
//       include: {
//         userInfo: true,
//         results: true,
//         analysis: true,
//       }
//     });

//     console.log('2. Found assessment:', {
//       id: assessmentResponse?.id,
//       hasResults: assessmentResponse?.results?.length,
//       hasAnalysis: !!assessmentResponse?.analysis
//     });

//     if (!assessmentResponse) {
//       return NextResponse.json(
//         { success: false, error: 'Assessment not found' },
//         { status: 404 }
//       );
//     }

//     // Calculate and save results if not already created
//     if (!assessmentResponse.results || assessmentResponse.results.length === 0) {
//       console.log('3. Calculating results...');
//       const scores = calculateAssessmentResults(
//         assessmentResponse.weightingResponses,
//         assessmentResponse.rankings
//       );

//       console.log('4. Calculated scores:', scores);

//       // Prepare result records to create
//       const resultsToCreate = Object.entries(scores).map(([type, score]) => ({
//         type,
//         score,
//         assessmentId: assessmentResponse.id
//       }));

//       console.log('5. Creating results:', resultsToCreate);

//       await prisma.result.createMany({
//         data: resultsToCreate
//       });

//       console.log('6. Results created successfully.');
//     }

//     // Generate or fetch analysis if not already present
//     if (!assessmentResponse.analysis) {
//       console.log('7. Generating or fetching analysis...');

//       // Check if analysis already exists (double check after new results are created)
//       const existingAnalysis = await prisma.analysis.findUnique({
//         where: { assessmentId: assessmentResponse.id }
//       });

//       if (existingAnalysis) {
//         console.log('8. Analysis already exists, skipping regeneration.');
//       } else {
//         console.log('9. No analysis found, generating...');

//         try {
//           const analysisResponse = await fetch(new URL('/api/assessment/analyze', request.url), {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               assessmentId: assessmentResponse.id,
//               scores: Object.fromEntries(
//                 assessmentResponse.results.map(r => [r.type, r.score])
//               ),
//               responses: assessmentResponse.rankings
//             })
//           });

//           console.log('10. Analysis API response status:', analysisResponse.status);

//           if (analysisResponse.ok) {
//             const analysisData = await analysisResponse.json();
//             console.log('11. Received analysis response:', !!analysisData.analysis);

//             // Save the new analysis to Prisma
//             await prisma.analysis.create({
//               data: {
//                 content: analysisData.analysis,
//                 assessmentId: assessmentResponse.id
//               }
//             });
//             console.log('12. Analysis saved to database.');
//           } else {
//             console.error('Analysis API error:', await analysisResponse.text());
//           }
//         } catch (analysisError) {
//           console.error('Error generating analysis:', analysisError);
//         }
//       }
//     }

//     // Mark the assessment as paid
//     await prisma.assessmentResponse.update({
//       where: { id: assessmentResponse.id },
//       data: { isPaid: true },
//     });

//     // Fetch updated assessment (ensures results and analysis are fresh)
//     const updatedAssessment = await prisma.assessmentResponse.findUnique({
//       where: { id: assessmentResponse.id },
//       include: {
//         userInfo: true,
//         results: true,
//         analysis: true,
//       }
//     });

//     console.log('13. Final assessment data:', {
//       hasResults: updatedAssessment?.results?.length,
//       resultTypes: updatedAssessment?.results?.map(r => r.type),
//       hasAnalysis: !!updatedAssessment?.analysis
//     });

//     // Redirect to results page after successful processing
//     const redirectUrl = `/assessment/results?session_id=${sessionId}`;
//     return NextResponse.redirect(
//       new URL(redirectUrl, request.url)
//     );

//   } catch (error) {
//     console.error('Error handling payment success:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
