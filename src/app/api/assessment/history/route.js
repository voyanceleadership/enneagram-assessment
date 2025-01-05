// src/app/api/assessment-history/route.js
import { getAssessmentResults } from '@/utils/dataTransition';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const assessmentHistory = await getAssessmentResults(email);

    return NextResponse.json({
      success: true,
      data: assessmentHistory
    });
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}