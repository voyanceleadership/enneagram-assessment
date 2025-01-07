import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  console.log('Fetch-analysis API hit');

  try {
    const { assessmentId } = await req.json();
    console.log('Assessment ID received:', assessmentId);

    if (!assessmentId) {
      throw new Error('Assessment ID is missing');
    }

    // Check if analysis exists
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { assessmentId },
    });

    if (existingAnalysis) {
      console.log('Returning existing analysis from Prisma');
      return NextResponse.json({
        success: true,
        analysis: existingAnalysis.content,
      });
    }

    // Analysis not ready yet
    return NextResponse.json({
      success: false,
      message: 'Analysis not ready',
    });
  } catch (error) {
    console.error('Error during analysis fetch:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during analysis fetch.',
    });
  }
}
