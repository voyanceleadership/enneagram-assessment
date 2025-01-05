// src/app/api/complete-assessment/route.js
import { transitionAssessmentData } from '@/utils/dataTransition';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Transition data from Prisma to Salesforce
    const result = await transitionAssessmentData(sessionId);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error completing assessment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}