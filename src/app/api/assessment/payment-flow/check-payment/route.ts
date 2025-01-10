// src/app/api/assessment/payment-flow/check-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { AssessmentStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  console.log('Payment status check started');

  try {
    const { assessmentId } = await req.json();

    if (!assessmentId) {
      return NextResponse.json({ 
        success: false,
        error: 'Assessment ID is required' 
      }, { status: 400 });
    }

    // Get assessment with payment info
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        payment: true
      }
    });

    if (!assessment) {
      return NextResponse.json({ 
        success: false,
        error: 'Assessment not found' 
      }, { status: 404 });
    }

    // Check both assessment status and payment status
    const isPaid = assessment.status === 'PAID' || assessment.status === 'ANALYZED';
    const paymentStatus = assessment.payment?.status || 'none';

    const responseData = {
      success: true,
      data: {
        paid: isPaid,
        status: assessment.status,
        paymentStatus,
        assessmentId,
        amount: assessment.payment?.amount || 0,
        // Include payment timestamp if available
        paidAt: assessment.payment?.status === 'completed' 
          ? assessment.payment.createdAt 
          : null
      }
    };

    console.log('Payment check response:', responseData);
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Error checking payment status' 
    }, { status: 500 });
  }
}