// src/app/api/assessment/payment-flow/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import type { AssessmentStatus } from '@prisma/client';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_BASE_URL environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const ASSESSMENT_PRICE = 2999; // $29.99 in cents

export async function POST(req: NextRequest) {
  console.log('Received request in create-checkout route');

  const host = req.headers.get('host') || process.env.NEXT_PUBLIC_BASE_URL;
  const baseUrl = `http://${host}`;

  try {
    const { email, couponCode, assessmentId } = await req.json();

    if (!email || !assessmentId) {
      return NextResponse.json({ 
        success: false,
        error: 'Email and assessmentId are required' 
      }, { status: 400 });
    }

    // Check if assessment exists and get its current state
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

    // If already paid, return success
    if (assessment.status === 'PAID' || assessment.status === 'ANALYZED') {
      return NextResponse.json({
        success: true,
        data: { 
          assessmentId,
          status: assessment.status
        }
      });
    }

    // If payment is pending, return the existing session
    if (assessment.payment?.status === 'pending') {
      const session = await stripe.checkout.sessions.retrieve(assessment.payment.sessionId);
      if (session && !session.expired) {
        return NextResponse.json({
          success: true,
          url: session.url,
          message: 'Using existing checkout session'
        });
      }
    }

    let finalAmount = ASSESSMENT_PRICE;
    let appliedCoupon = null;

    // Check if email is pre-validated
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

    if (validEmail) {
      // Create payment record and update status atomically
      await prisma.$transaction([
        prisma.payment.create({
          data: {
            sessionId: `comp_${Date.now()}`,
            amount: 0,
            status: 'completed',
            assessment: {
              connect: {
                id: assessmentId
              }
            }
          }
        }),
        prisma.assessment.update({
          where: { id: assessmentId },
          data: { status: 'PAID' as AssessmentStatus }
        })
      ]);

      return NextResponse.json({
        success: true,
        data: {
          assessmentId,
          status: 'PAID'
        }
      });
    }

    // Handle coupon logic
    if (couponCode) {
      console.log('Processing coupon:', couponCode);
      const coupon = await prisma.coupon.findFirst({
        where: { 
          code: couponCode.toUpperCase(),
          active: true,
          expires: { gt: new Date() },
          uses: { gt: prisma.coupon.fields.usedCount }
        }
      });

      console.log('Found coupon:', coupon);

      if (!coupon) {
        return NextResponse.json({ 
          success: false,
          error: 'Invalid or expired coupon code' 
        }, { status: 400 });
      }

      const discountAmount = Math.round(ASSESSMENT_PRICE * (coupon.discount / 100));
      finalAmount = ASSESSMENT_PRICE - discountAmount;
      appliedCoupon = coupon;

      console.log('Calculated discount:', { discountAmount, finalAmount });

      // If 100% discount, handle like validated email
      if (finalAmount === 0) {
        console.log('Processing 100% discount for assessment:', assessmentId);

        try {
          await prisma.$transaction([
            prisma.assessment.update({
              where: { id: assessmentId },
              data: { status: 'PAID' as AssessmentStatus }
            }),
            prisma.payment.create({
              data: {
                sessionId: `coup_${Date.now()}`,
                amount: 0,
                status: 'completed',
                assessment: {
                  connect: {
                    id: assessmentId
                  }
                }
              }
            }),
            prisma.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } }
            }),
            prisma.couponUsage.create({
              data: {
                couponId: coupon.id,
                email
              }
            })
          ]);

          // Verify the status update
          const updatedAssessment = await prisma.assessment.findUnique({
            where: { id: assessmentId }
          });

          console.log('Coupon applied, assessment status:', updatedAssessment?.status);

          if (!updatedAssessment || updatedAssessment.status !== 'PAID') {
            throw new Error('Failed to update assessment status');
          }

          return NextResponse.json({
            success: true,
            data: { 
              assessmentId,
              status: 'PAID'
            }
          });
        } catch (error) {
          console.error('Error processing 100% discount:', error);
          throw error;
        }
      } else {
        // Track coupon usage for non-zero amount
        await prisma.$transaction([
          prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } }
          }),
          prisma.couponUsage.create({
            data: {
              couponId: coupon.id,
              email
            }
          })
        ]);
        
        // Create Stripe checkout session for non-zero amounts
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Enneagram Assessment Results',
                description: appliedCoupon
                  ? `${appliedCoupon.discount}% discount applied`
                  : 'Standard assessment'
              },
              unit_amount: finalAmount,
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${baseUrl}/assessment/results?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/assessment/cancelled`,
          customer_email: email,
          metadata: {
            assessmentId,
            couponCode: couponCode || 'NONE',
            originalPrice: ASSESSMENT_PRICE,
            discountApplied: appliedCoupon?.discount || 0
          }
        });

        // Create pending payment record
        await prisma.payment.create({
          data: {
            sessionId: session.id,
            amount: finalAmount,
            status: 'pending',
            assessment: {
              connect: {
                id: assessmentId
              }
            }
          }
        });

        console.log('Checkout session created:', session.id);

        return NextResponse.json({
          success: true,
          url: session.url,
          message: 'Checkout session created successfully'
        });
      }
    } else {
      // No coupon code - create regular Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Enneagram Assessment Results',
              description: 'Standard assessment'
            },
            unit_amount: ASSESSMENT_PRICE,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${baseUrl}/assessment/results?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/assessment/cancelled`,
        customer_email: email,
        metadata: {
          assessmentId,
          couponCode: 'NONE',
          originalPrice: ASSESSMENT_PRICE,
          discountApplied: 0
        }
      });

      // Create pending payment record
      await prisma.payment.create({
        data: {
          sessionId: session.id,
          amount: ASSESSMENT_PRICE,
          status: 'pending',
          assessment: {
            connect: {
              id: assessmentId
            }
          }
        }
      });

      console.log('Checkout session created:', session.id);

      return NextResponse.json({
        success: true,
        url: session.url,
        message: 'Checkout session created successfully'
      });
    }
  } catch (err) {
    console.error('Error processing checkout:', err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to process checkout'
    }, { status: 500 });
  }
}