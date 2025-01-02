import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const userEmail = session.customer_email;
      
      if (!userEmail) {
        return NextResponse.json({ 
          success: false, 
          error: 'No email found in payment session' 
        });
      }

      // Fetch the assessment data with all related information
      const assessmentData = await prisma.assessmentResponse.findFirst({
        where: {
          email: userEmail
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          userInfo: true,
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

      // In the POST function, after fetching assessment data:
      console.log('Retrieved assessment data:', assessmentData);
      console.log('Assessment results:', assessmentData?.results);
      console.log('User info:', assessmentData?.userInfo);

      if (!assessmentData) {
        return NextResponse.json({ 
          success: false, 
          error: 'Assessment data not found' 
        });
      }

      // Update the payment status
      await prisma.assessmentResponse.update({
        where: {
          id: assessmentData.id
        },
        data: {
          isPaid: true,
          sessionId: sessionId
        }
      });

      // Format the data to match what ResultsPage expects
      const formattedData = {
        userInfo: {
          firstName: assessmentData.userInfo.firstName,
          lastName: assessmentData.userInfo.lastName,
          email: assessmentData.userInfo.email
        },
        results: assessmentData.results.map(result => ({
          type: result.type,
          score: result.score
        })),
        analysis: assessmentData.analysis?.content || ''
      };

      console.log('Returning formatted data:', formattedData); // Debug log

      return NextResponse.json({ 
        success: true,
        data: formattedData
      });
    }

    return NextResponse.json({ success: false, error: 'Payment not completed' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify payment' });
  }
}