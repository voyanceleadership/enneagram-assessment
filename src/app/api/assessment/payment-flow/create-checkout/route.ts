import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

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
    const body = await req.json();
    const { email, couponCode, assessmentId } = body;

    if (!email || !assessmentId) {
      return NextResponse.json({ error: 'Email and assessmentId are required' }, { status: 400 });
    }

    let finalAmount = ASSESSMENT_PRICE;
    let appliedCoupon = null;

    // Check if email is pre-validated (e.g., part of a special group)
    try {
      const validEmail = await prisma.validEmail.findUnique({
        where: { email }
      });

      if (validEmail) {
        return NextResponse.json({
          url: '/assessment/results',
          message: 'Email validated successfully'
        });
      }
    } catch (error) {
      console.error('Error checking valid email:', error);
    }

    // Handle coupon application logic
    if (couponCode) {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() }
        });

        if (!coupon) {
          return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
        }

        if (!coupon.active || coupon.uses <= 0 || new Date(coupon.expires) <= new Date()) {
          return NextResponse.json({ error: 'Coupon is no longer valid' }, { status: 400 });
        }

        const discountAmount = Math.round(ASSESSMENT_PRICE * (coupon.discount / 100));
        finalAmount = ASSESSMENT_PRICE - discountAmount;
        appliedCoupon = coupon;

        console.log(`Coupon applied: ${couponCode} - Discount: ${coupon.discount}%`);
      } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json({ error: 'Error validating coupon' }, { status: 500 });
      }
    }

    // Create Stripe checkout session
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
        couponCode: couponCode || 'NONE',
        originalPrice: ASSESSMENT_PRICE,
        discountApplied: appliedCoupon?.discount || 0,
        assessmentId  // Pass assessmentId to metadata for linking later
      }
    });

    // Save payment in Prisma linked to the assessment
    await prisma.payment.create({
      data: {
        sessionId: session.id,
        assessmentId,  // Link the payment to the assessment
        amount: finalAmount,
        status: 'pending',
      }
    });

    console.log('Stripe session created and linked to assessment:', session.id);

    return NextResponse.json({
      url: session.url,
      message: 'Checkout session created successfully'
    });

  } catch (err) {
    console.error('Error processing checkout:', err);
    return NextResponse.json({
      error: 'Failed to process checkout',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
}
