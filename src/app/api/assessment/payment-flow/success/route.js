// src/app/api/payment-flow/success/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { salesforceService } from '@/services/salesforce';
import { calculateAssessmentResults } from '@/app/assessment/results/calculate';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    console.log('1. Payment success GET route called with sessionId:', sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session ID provided' },
        { status: 400 }
      );
    }

    // Get the full assessment data
    const assessmentResponse = await prisma.assessmentResponse.findFirst({
      where: { sessionId },
      include: {
        userInfo: true,
        results: true,
        analysis: true,
      }
    });

    console.log('2. Found assessment:', {
      id: assessmentResponse?.id,
      hasResults: assessmentResponse?.results?.length,
      hasAnalysis: !!assessmentResponse?.analysis
    });

    if (!assessmentResponse) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Calculate results if they don't exist
    if (!assessmentResponse.results || assessmentResponse.results.length === 0) {
      console.log('3. Calculating results...');
      const scores = calculateAssessmentResults(
        assessmentResponse.weightingResponses,
        assessmentResponse.rankings
      );

      console.log('4. Calculated scores:', scores);

      // Create results for all types including Type 9
      const resultsToCreate = Object.entries(scores).map(([type, score]) => ({
        type,
        score,
        assessmentId: assessmentResponse.id
      }));

      console.log('5. Creating results:', resultsToCreate);

      await prisma.result.createMany({
        data: resultsToCreate
      });
    }

    // Generate analysis if it doesn't exist
    if (!assessmentResponse.analysis) {
      console.log('6. Generating analysis...');
      try {
        const analysisResponse = await fetch(new URL('/api/assessment/analyze', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scores: Object.fromEntries(
              assessmentResponse.results.map(r => [r.type, r.score])
            ),
            responses: assessmentResponse.rankings
          })
        });

        console.log('7. Analysis API response status:', analysisResponse.status);

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          console.log('8. Got analysis response:', !!analysisData.analysis);

          await prisma.analysis.create({
            data: {
              content: analysisData.analysis,
              assessmentId: assessmentResponse.id
            }
          });
          console.log('9. Saved analysis to database');
        } else {
          console.error('Analysis API error:', await analysisResponse.text());
        }
      } catch (analysisError) {
        console.error('Error generating analysis:', analysisError);
      }
    }

    // Mark as paid
    await prisma.assessmentResponse.update({
      where: { id: assessmentResponse.id },
      data: { isPaid: true },
    });

    // Get the updated assessment with all data
    const updatedAssessment = await prisma.assessmentResponse.findUnique({
      where: { id: assessmentResponse.id },
      include: {
        userInfo: true,
        results: true,
        analysis: true,
      }
    });

    console.log('10. Final assessment data:', {
      hasResults: updatedAssessment?.results?.length,
      resultTypes: updatedAssessment?.results?.map(r => r.type),
      hasAnalysis: !!updatedAssessment?.analysis
    });

    const redirectUrl = `/assessment/results?session_id=${sessionId}`;
    return NextResponse.redirect(
      new URL(redirectUrl, request.url)
    );
  } catch (error) {
    console.error('Error handling payment success:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}