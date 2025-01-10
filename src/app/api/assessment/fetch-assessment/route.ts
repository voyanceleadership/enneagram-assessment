// src/app/api/assessment/fetch-assessment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { assessmentId } = await req.json();
    console.log('Fetching assessment:', assessmentId);

    if (!assessmentId) {
      return NextResponse.json({
        success: false,
        error: 'Assessment ID is required'
      }, { status: 400 });
    }

    // Get complete assessment data
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        userInfo: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        results: {
          select: {
            type: true,
            score: true
          }
        },
        payment: {
          select: {
            status: true,
            amount: true,
            createdAt: true
          }
        },
        analysis: {
          select: {
            content: true
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

    // Verify payment status
    if (assessment.status !== 'PAID' && assessment.status !== 'ANALYZED') {
      return NextResponse.json({
        success: false,
        error: 'Assessment payment required'
      }, { status: 403 });
    }

    const responseData = {
      success: true,
      data: {
        assessmentId: assessment.id,
        status: assessment.status,
        userInfo: assessment.userInfo,
        results: assessment.results.map(result => ({
          type: result.type,
          score: Math.round(result.score * 10) / 10,
        })),
        analysis: assessment.analysis?.content || null
      }
    };

    console.log('Sending assessment data:', {
      id: assessment.id,
      status: assessment.status,
      hasAnalysis: !!assessment.analysis
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error fetching assessment'
    }, { status: 500 });
  }
}