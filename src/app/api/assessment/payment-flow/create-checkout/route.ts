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
  try {
    const body = await req.json();
    const { email, couponCode } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let finalAmount = ASSESSMENT_PRICE;
    let appliedCoupon = null;

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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/results?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/cancelled`,
      customer_email: email,
      metadata: {
        couponCode: couponCode || 'NONE',
        originalPrice: ASSESSMENT_PRICE,
        discountApplied: appliedCoupon?.discount || 0
      }
    });

    console.log('Stripe session created:', session.id);
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

// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { prisma } from '@/lib/prisma';

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error('Missing STRIPE_SECRET_KEY environment variable');
// }

// if (!process.env.NEXT_PUBLIC_BASE_URL) {
//   throw new Error('Missing NEXT_PUBLIC_BASE_URL environment variable');
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2024-12-18.acacia',
// });

// const ASSESSMENT_PRICE = 2999; // $29.99 in cents

// export async function POST(req: NextRequest) {
//   console.log('Received request in create-checkout route');
//   console.log('Stripe API Key being used:', process.env.STRIPE_SECRET_KEY?.substring(0, 8) + '...');
//   console.log('Environment check:');
//   console.log('- STRIPE_SECRET_KEY prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 7));
//   // Remove the apiVersion log since it's not accessible this way
//   console.log('- Stripe Client initialized:', !!stripe);

//   try {
//     const body = await req.json();
//     console.log('Request body:', body);
//     const { email, couponCode } = body;

//     if (!email) {
//       return NextResponse.json({ error: 'Email is required' }, { status: 400 });
//     }

//     // Check valid emails
//     try {
//       const validEmail = await prisma.validEmail.findUnique({
//         where: { email }
//       });

//       if (validEmail) {
//         return NextResponse.json({ 
//           url: '/assessment/results',
//           message: 'Email validated successfully' 
//         });
//       }
//     } catch (error) {
//       console.error('Error checking valid email:', error);
//       // Continue with payment flow if email check fails
//     }

//     // Handle coupon if provided
//     if (couponCode) {
//       try {
//         const coupon = await prisma.coupon.findUnique({
//           where: { code: couponCode.toUpperCase() }
//         });

//         if (!coupon) {
//           return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
//         }

//         if (!coupon.active) {
//           return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 });
//         }

//         if (new Date(coupon.expires) <= new Date()) {
//           return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
//         }

//         if (coupon.uses <= 0) {
//           return NextResponse.json({ error: 'This coupon has no remaining uses' }, { status: 400 });
//         }

//         // If it's a 100% discount coupon
//         if (coupon.discount === 100) {
//           try {
//             // Decrement coupon uses and record usage in a transaction
//             await prisma.$transaction([
//               prisma.coupon.update({
//                 where: { id: coupon.id },
//                 data: { uses: { decrement: 1 } }
//               }),
//               prisma.couponUsage.create({
//                 data: {
//                   couponId: coupon.id,
//                   email
//                 }
//               })
//             ]);

//             return NextResponse.json({ 
//               url: '/assessment/results',
//               message: 'Free access granted with coupon' 
//             });
//           } catch (error) {
//             console.error('Transaction error:', error);
//             return NextResponse.json({ error: 'Error processing coupon' }, { status: 500 });
//           }
//         }

//         // Calculate discounted price
//         const discountAmount = Math.round(ASSESSMENT_PRICE * (coupon.discount / 100));
//         const finalAmount = ASSESSMENT_PRICE - discountAmount;

//         try {
//           // Create Stripe session with discounted price
//           const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [{
//               price_data: {
//                 currency: 'usd',
//                 product_data: {
//                   name: 'Enneagram Assessment Results',
//                   description: `${coupon.discount}% discount applied`
//                 },
//                 unit_amount: finalAmount,
//               },
//               quantity: 1,
//             }],
//             mode: 'payment',
//             success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/results?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/cancelled`,
//             customer_email: email,
//             metadata: {
//               couponCode: couponCode,
//               originalPrice: ASSESSMENT_PRICE,
//               discount: coupon.discount
//             }
//           });

//           // Decrement coupon uses and record usage in a transaction
//           await prisma.$transaction([
//             prisma.coupon.update({
//               where: { id: coupon.id },
//               data: { uses: { decrement: 1 } }
//             }),
//             prisma.couponUsage.create({
//               data: {
//                 couponId: coupon.id,
//                 email
//               }
//             })
//           ]);

//           return NextResponse.json({ 
//             url: session.url,
//             message: 'Checkout session created successfully'
//           });
//         } catch (stripeError) {
//           console.error('Stripe session creation error:', stripeError);
//           return NextResponse.json({ 
//             error: 'Error creating payment session. Please try again.' 
//           }, { status: 500 });
//         }
//       } catch (couponError) {
//         console.error('Coupon processing error:', couponError);
//         return NextResponse.json({ 
//           error: 'Error processing coupon. Please try again.' 
//         }, { status: 500 });
//       }
//     }

//     // No valid coupon - create regular price session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'Enneagram Assessment Results'
//           },
//           unit_amount: ASSESSMENT_PRICE,
//         },
//         quantity: 1,
//       }],
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/results?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/cancelled`,
//       customer_email: email,
//       metadata: {
//         originalPrice: ASSESSMENT_PRICE
//       }
//     });

//     return NextResponse.json({ 
//       url: session.url,
//       message: 'Checkout session created successfully'
//     });

//   } catch (err) {
//     console.error('Error creating checkout session:', err);
//     return NextResponse.json({
//       error: 'Failed to create checkout session. Please try again.',
//       details: err instanceof Error ? err.message : 'Unknown error'
//     }, { status: 500 });
//   }
// }