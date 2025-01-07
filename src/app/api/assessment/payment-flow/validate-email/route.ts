// src/app/api/assessment/payment-flow/validate-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { EmailValidationService } from '@/services/emailValidation';

const emailValidationService = new EmailValidationService();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const isValid = await emailValidationService.isEmailValid(email);
    
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Error in email validation route:', error);
    return NextResponse.json({ valid: false, error: 'Error validating email' }, { status: 500 });
  }
}