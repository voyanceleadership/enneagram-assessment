// src/app/api/assessment/payment-flow/validate-email/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { AssessmentStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { email, assessmentId } = await req.json();
    console.log('Received request:', { email, assessmentId });

    if (!email || !assessmentId) {
      return NextResponse.json({
        success: false,
        error: 'Email and assessmentId are required'
      }, { status: 400 });
    }

    const validEmail = await prisma.validEmail.findFirst({
      where: {
        email,
        active: true,
        OR: [
          { validUntil: null },
          { validUntil: { gt: new Date() } }
        ]
      }
    });

    console.log('Email validation result:', !!validEmail);

    if (validEmail) {
      console.log('Starting post-validation process for:', assessmentId);
      
      // Use transaction to ensure atomicity
      const result = await prisma.$transaction(async (prisma) => {
        // Update assessment status
        const assessment = await prisma.assessment.update({
          where: { id: assessmentId },
          data: { status: 'PAID' as AssessmentStatus }
        });
        
        console.log('Updated assessment status:', assessment.status);

        // Create payment record
        const payment = await prisma.payment.create({
          data: {
            sessionId: `val_${Date.now()}`,
            amount: 0,
            status: 'completed',
            assessment: {
              connect: {
                id: assessmentId
              }
            }
          }
        });

        console.log('Created payment record:', payment.id);

        return { assessment, payment };
      });

      return NextResponse.json({
        success: true,
        valid: true,
        data: {
          assessmentId,
          status: result.assessment.status
        }
      });
    }

    return NextResponse.json({
      success: true,
      valid: false
    });

  } catch (error) {
    console.error('Error validating email:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error validating email'
    }, { status: 500 });
  }
}