import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        assessment: {
          select: {
            id: true,
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
            }
          }
        }
      }
    });

    if (!payment) {
      console.log('Payment not found. Creating new payment record.');
      
      // Find the assessment associated with this session
      const assessment = await prisma.assessment.findFirst({
        where: { 
          payment: { 
            sessionId 
          } 
        },
        select: {
          id: true,
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
          }
        }
      });

      if (!assessment) {
        throw new Error('No associated assessment found for session');
      }

      // Create a new payment record
      payment = await prisma.payment.create({
        data: {
          sessionId,
          amount,
          status,
          assessment: {
            connect: {
              id: assessment.id
            }
          }
        },
        select: {
          id: true,
          assessment: {
            select: {
              id: true,
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
              }
            }
          }
        }
      });

      // Update assessment status
      await prisma.assessment.update({
        where: { id: assessment.id },
        data: { status: 'PAID' }
      });

      console.log('New payment created:', payment.id);
    }

    if (!payment.assessment) {
      throw new Error('Assessment not found for this payment');
    }

    // Trigger analysis generation without awaiting the response
    fetch('http://localhost:3000/api/assessment/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        assessmentId: payment.assessment.id,
        scores: payment.assessment.results.reduce((acc, result) => {
          acc[result.type] = Math.round(result.score * 10) / 10;
          return acc;
        }, {} as Record<string, number>)
      }),
    }).catch(error => {
      console.error('Error triggering analysis:', error);
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