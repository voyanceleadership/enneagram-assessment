import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    console.log('Starting payment verification for session:', sessionId);

    // Verify Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      console.log('Payment not completed for session:', sessionId);
      return NextResponse.json({ 
        success: false, 
        error: 'Payment has not been completed' 
      });
    }

    const userEmail = session.customer_email;
    if (!userEmail) {
      console.log('No email found in session:', sessionId);
      return NextResponse.json({ 
        success: false, 
        error: 'No email address found in payment session' 
      });
    }

    // Fetch user and assessment
    const user = await prisma.userInfo.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      console.log('User not found for email:', userEmail);
      return NextResponse.json({ 
        success: false, 
        error: 'User information not found' 
      });
    }

    const assessment = await prisma.assessmentResponse.findFirst({
      where: { userInfoId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { 
        results: true
      }
    });

    if (!assessment) {
      console.log('Assessment not found for user:', user.id);
      return NextResponse.json({ 
        success: false, 
        error: 'Assessment data not found' 
      });
    }

    // Update assessment payment status
    await prisma.assessmentResponse.update({
      where: { id: assessment.id },
      data: { 
        isPaid: true, 
        sessionId
      }
    });

    // Trigger initial analysis generation
    console.log('Triggering initial analysis generation');
    try {
      await fetch('http://localhost:3000/api/assessment/fetch-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          assessmentId: assessment.id
        })
      });
      console.log('Analysis generation triggered');
    } catch (error) {
      console.error('Error triggering analysis generation:', error);
      // Don't return error - we'll let polling handle retries
    }

    console.log('Payment verification completed successfully');

    return NextResponse.json({ 
      success: true, 
      data: {
        userInfo: user,
        results: assessment.results.map(r => ({
          type: r.type,
          score: parseFloat(r.score.toString())
        })),
        assessmentId: assessment.id
      }
    });

  } catch (error) {
    console.error('Error during payment verification:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'An error occurred during payment verification' 
    });
  }
}