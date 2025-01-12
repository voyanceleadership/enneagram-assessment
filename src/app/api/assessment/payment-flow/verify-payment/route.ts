// src/app/api/assessment/payment-flow/verify-payment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { AssessmentStatus } from '@prisma/client';

export async function POST(req: Request) {
  console.log('Payment verification started');

  try {
    const { sessionId, amount, status } = await req.json();
    console.log('Verifying session:', sessionId);

    // Check for an existing payment with this session ID
    let payment = await prisma.payment.findUnique({
      where: { sessionId },
      select: {
        id: true,
        status: true,
        amount: true,
        assessment: {
          select: {
            id: true,
            status: true,
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
            analysis: {
              select: {
                content: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      console.log('Payment not found. Checking for pending assessment...');
      
      // Find the assessment using the payment's sessionId relationship
      const assessment = await prisma.assessment.findFirst({
        where: {
          payment: {
            sessionId
          }
        },
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
          analysis: {
            select: {
              content: true
            }
          }
        }
      });

      if (!assessment) {
        throw new Error('No assessment found associated with this payment session');
      }

      // Create payment record and update assessment in a transaction
      const result = await prisma.$transaction(async (prisma) => {
        const newPayment = await prisma.payment.create({
          data: {
            sessionId,
            amount: amount || 0,
            status: 'completed',
            assessment: {
              connect: {
                id: assessment.id
              }
            }
          },
          include: {
            assessment: {
              include: {
                userInfo: true,
                results: true,
                analysis: true
              }
            }
          }
        });

        // Update assessment status
        await prisma.assessment.update({
          where: { id: assessment.id },
          data: { status: 'PAID' as AssessmentStatus }
        });

        return newPayment;
      });

      payment = result;
      console.log('New payment created:', payment.id);
    } else if (payment.status !== 'completed') {
      // Update existing payment and assessment status atomically
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'completed' }
        }),
        prisma.assessment.update({
          where: { id: payment.assessment?.id },
          data: { status: 'PAID' as AssessmentStatus }
        })
      ]);
    }

    if (!payment.assessment) {
      throw new Error('Assessment not found for this payment');
    }

    // Ensure assessment status is updated before returning
    await prisma.assessment.update({
      where: { id: payment.assessment.id },
      data: { status: 'PAID' as AssessmentStatus }
    });

    const responseData = {
      success: true,
      data: {
        userInfo: {
          firstName: payment.assessment.userInfo.firstName,
          lastName: payment.assessment.userInfo.lastName,
          email: payment.assessment.userInfo.email,
        },
        results: payment.assessment.results.map(result => ({
          type: result.type,
          score: Math.round(result.score * 10) / 10,
        })),
        assessmentId: payment.assessment.id,
        status: 'PAID',
        analysis: payment.assessment.analysis?.content || null
      },
    };

    console.log('Sending response data:', JSON.stringify(responseData, null, 2));
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error during payment verification:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment',
    }, { status: 500 });
  }
}