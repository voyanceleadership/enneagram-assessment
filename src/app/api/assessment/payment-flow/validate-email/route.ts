import { NextRequest, NextResponse } from 'next/server';
import { EmailValidationService } from '@/services/emailValidation';
import { prisma } from '@/lib/prisma';

const emailValidationService = new EmailValidationService();

export async function POST(req: NextRequest) {
  try {
    const { email, assessmentId } = await req.json();
    console.log('Received request:', { email, assessmentId });

    const isValid = await emailValidationService.isEmailValid(email);
    console.log('Email validation result:', isValid);
    
    if (isValid && assessmentId) {
      console.log('Starting post-validation process for:', assessmentId);

      // Update the assessment status
      const updatedAssessment = await prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          status: 'PAID'
        }
      });
      console.log('Updated assessment status:', updatedAssessment.status);

      // Create a $0 payment record
      const paymentRecord = await prisma.payment.create({
        data: {
          sessionId: `comp_${Date.now()}`,
          assessmentId,
          amount: 0,
          status: 'completed',
        }
      });
      console.log('Created payment record:', paymentRecord.id);

      // Return JSON to frontend for further processing (no redirect)
      return NextResponse.json({
        success: true,
        bypass: true,  // Inform the frontend to bypass Stripe
        assessmentId
      });
    }
    
    // If validation fails, return without bypass
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Error in email validation route:', error);
    return NextResponse.json({ 
      valid: false, 
      error: 'Error validating email' 
    }, { status: 500 });
  }
}
