// src/app/api/assessment/fetch-analysis/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  console.log('Fetch-analysis API hit');

  try {
    const { assessmentId } = await req.json();
    console.log('Assessment ID received:', assessmentId);

    if (!assessmentId) {
      return NextResponse.json({
        success: false,
        error: 'Assessment ID is required'
      }, { status: 400 });
    }

    // Get assessment with analysis and payment information
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        analysis: true,
        payment: {
          select: {
            status: true
          }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({
        success: false,
        error: 'Assessment not found'
      }, { status: 404 });
    }

    // Check if payment is required
    const validStatuses = ['PAID', 'ANALYZED', 'ANALYZING'];
    if (!validStatuses.includes(assessment.status)) {
      console.log('Invalid status:', assessment.status);
      return NextResponse.json({
        success: false,
        error: 'Assessment payment required',
        status: assessment.status
      }, { status: 403 });
    }

    // If payment exists, verify its status
    if (assessment.payment && assessment.payment.status !== 'completed') {
      return NextResponse.json({
        success: false,
        error: 'Payment not completed',
        status: assessment.status
      }, { status: 403 });
    }

    // Check if analysis exists
    if (assessment.analysis) {
      console.log('Returning existing analysis');
      return NextResponse.json({
        success: true,
        analysis: assessment.analysis.content,
        status: assessment.status
      });
    }

    // Make sure analysis is actually being generated
    if (assessment.status === 'PAID') {
      // Trigger analysis generation if not already in progress
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/assessment/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId: assessment.id
          })
        });
      } catch (err) {
        console.error('Error triggering analysis:', err);
        // Continue execution - we still want to return the "in progress" response
      }
    }

    // Analysis not ready yet
    console.log('Analysis not ready for assessment:', assessmentId);
    return NextResponse.json({
      success: false,
      message: 'Analysis generation in progress',
      status: assessment.status
    });

  } catch (error) {
    console.error('Error during analysis fetch:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error fetching analysis',
      status: 'ERROR'
    }, { status: 500 });
  }
}