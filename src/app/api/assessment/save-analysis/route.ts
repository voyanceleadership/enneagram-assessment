import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { assessmentId, analysisContent } = await req.json();

    // Create or update the analysis
    const analysis = await prisma.analysis.upsert({
      where: {
        assessmentId: assessmentId,
      },
      update: {
        content: analysisContent,
      },
      create: {
        assessmentId: assessmentId,
        content: analysisContent,
      },
    });

    return NextResponse.json({ 
      success: true, 
      analysisId: analysis.id 
    });

  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save analysis' 
    }, { status: 500 });
  }
}