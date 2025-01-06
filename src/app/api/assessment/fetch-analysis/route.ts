import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RequestBody {
  email: string;
  assessmentId: string;
}

// Store analysis state and results in memory
const analysisCache = new Map<string, {
  inProgress: boolean;
  result?: string;
}>();

export async function POST(req: Request) {
  try {
    const { email, assessmentId }: RequestBody = await req.json();
    console.log('fetch-analysis route hit:', { email, assessmentId });

    // Check cache first
    const cached = analysisCache.get(assessmentId);
    if (cached?.result) {
      console.log('Returning cached analysis for:', assessmentId);
      return NextResponse.json({
        success: true,
        analysis: cached.result
      });
    }

    // If analysis is in progress, return status
    if (cached?.inProgress) {
      console.log('Analysis in progress for:', assessmentId);
      return NextResponse.json({
        success: false,
        error: 'Analysis in progress'
      });
    }

    // If no analysis exists or in progress, start new one
    console.log('Starting new analysis for:', assessmentId);
    analysisCache.set(assessmentId, { inProgress: true });

    // Get assessment and scores
    const assessment = await prisma.assessmentResponse.findFirst({
      where: {
        id: assessmentId,
        isPaid: true,
        userInfo: {
          email
        }
      },
      include: {
        results: true
      }
    });

    if (!assessment) {
      console.log('No paid assessment found for:', { email, assessmentId });
      analysisCache.delete(assessmentId);
      return NextResponse.json({
        success: false,
        error: 'No paid assessment found'
      });
    }

    // Format scores
    const scores = Object.fromEntries(
      assessment.results.map(r => [r.type, parseFloat(r.score.toString())])
    );

    // Generate analysis
    try {
      const analysisResponse = await fetch('http://localhost:3000/api/assessment/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores })
      });

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(analysisData.error || 'Failed to generate analysis');
      }

      // Cache the result
      analysisCache.set(assessmentId, {
        inProgress: false,
        result: analysisData.analysis
      });

      return NextResponse.json({
        success: true,
        analysis: analysisData.analysis
      });

    } catch (error) {
      // Clear cache on error
      analysisCache.delete(assessmentId);
      throw error;
    }

  } catch (error) {
    console.error('Error in fetch-analysis:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    });
  }
}