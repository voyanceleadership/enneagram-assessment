import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { calculateAssessmentResults } from '@/components/assessment/EnneagramAssessment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    console.log('Verifying payment for session:', sessionId);

    console.log('Verifying payment for session:', sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Retrieved session from Stripe:', session);

    if (session.payment_status === 'paid') {
      const userEmail = session.customer_email;
      
      if (!userEmail) {
        return NextResponse.json({ 
          success: false, 
          error: 'No email found in payment session' 
        });
      }

      // Upsert user information into UserInfo table
      // First find the user
      const existingUser = await prisma.userInfo.findFirst({
        where: { email: userEmail }
      });

      let user;
      if (existingUser) {
        // Update existing user
        user = await prisma.userInfo.update({
          where: { id: existingUser.id },
          data: {
            firstName: session.metadata?.firstName || 'Unknown',
            lastName: session.metadata?.lastName || 'Unknown',
          }
        });
      } else {
        // Create new user
        user = await prisma.userInfo.create({
          data: {
            firstName: session.metadata?.firstName || 'Unknown',
            lastName: session.metadata?.lastName || 'Unknown',
            email: userEmail,
          }
        });
      }

      console.log('User info updated/created:', user);

      console.log('User upserted:', user);

      // Fetch the most recent assessment for the user
      const assessmentData = await prisma.assessmentResponse.findFirst({
        where: {
          userInfo: {
            email: userEmail
          }
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

      if (!assessmentData) {
        return NextResponse.json({ 
          success: false, 
          error: 'Assessment data not found' 
        });
      }

      // Calculate and save results if they don't exist or are incomplete
      let results = assessmentData.results;

      if (!results || results.length < 9) {
        console.log('Calculating results...');
        const scores = calculateAssessmentResults(
          assessmentData.weightingResponses,
          assessmentData.rankings
        );

        // Upsert results by deleting incomplete ones and recalculating
        await prisma.result.deleteMany({
          where: { assessmentId: assessmentData.id }
        });

        const resultsToCreate = Object.entries(scores).map(([type, score]) => ({
          type,
          score,
          assessmentId: assessmentData.id
        }));

        await prisma.result.createMany({
          data: resultsToCreate
        });

        // Fetch updated results
        results = await prisma.result.findMany({
          where: { assessmentId: assessmentData.id },
          select: { type: true, score: true }
        });

        console.log('Results calculated and saved.');
      }

      // Generate or fetch analysis if it doesn't exist
      let analysisContent = assessmentData.analysis?.content;

      if (!analysisContent) {
        console.log('Analysis missing, attempting to generate...');

        // Check if analysis exists after recalculating results
        const existingAnalysis = await prisma.analysis.findUnique({
          where: { assessmentId: assessmentData.id }
        });

        if (existingAnalysis) {
          analysisContent = existingAnalysis.content;
          console.log('Existing analysis found and reused.');
        } else {
          console.log('No analysis found. Sending request to generate.');

          try {
            const analysisResponse = await fetch(new URL('/api/assessment/analyze', req.url), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                assessmentId: assessmentData.id,
                scores: Object.fromEntries(results.map(r => [r.type, r.score])),
                responses: assessmentData.rankings
              })
            });
    
            console.log('Analysis API response status:', analysisResponse.status);
    
            if (analysisResponse.ok) {
              const analysisData = await analysisResponse.json();
              console.log('Analysis API success:', !!analysisData.success);
    
              if (analysisData.success && analysisData.analysis) {
                analysisContent = analysisData.analysis;
                console.log('Analysis content length:', analysisContent.length);
    
                // Save new analysis to Prisma
                await prisma.analysis.create({
                  data: {
                    content: analysisContent,
                    assessmentId: assessmentData.id
                  }
                });
                console.log('Analysis saved to database.');
              }
            } else {
              console.error('Failed to generate analysis:', await analysisResponse.text());
            }
          } catch (analysisError) {
            console.error('Error during analysis generation:', analysisError);
          }
        }
      }

      // Update the payment status for the assessment
      await prisma.assessmentResponse.update({
        where: { id: assessmentData.id },
        data: {
          isPaid: true,
          sessionId: sessionId
        }
      });

      // Format data for frontend (ResultsPage)
      const formattedData = {
        userInfo: {
          firstName: assessmentData.userInfo.firstName,
          lastName: assessmentData.userInfo.lastName,
          email: assessmentData.userInfo.email
        },
        results: results.map(result => ({
          type: result.type,
          score: result.score
        })),
        analysis: analysisContent || ''
      };

      console.log('Returning formatted data:', {
        resultsCount: formattedData.results.length,
        types: formattedData.results.map(r => r.type),
        hasAnalysis: !!formattedData.analysis
      });

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
