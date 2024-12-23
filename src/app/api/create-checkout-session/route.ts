import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validCoupons } from '@/app/data/coupons';
import { validEmails } from '@/app/data/validEmails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function POST(req: NextRequest) {
  const { email, couponCode } = await req.json();

  // Bypass logic for valid coupon or email
  if (validCoupons.includes(couponCode) || validEmails.includes(email)) {
    return NextResponse.json({ url: '/assessment/results' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Enneagram Assessment Results',
            },
            unit_amount: 2000, // $20
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/results?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Error creating Stripe session:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}