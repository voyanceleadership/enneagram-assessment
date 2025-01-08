// src/app/api/assessment/payment-flow/check-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { assessmentId } = await req.json();

    const payment = await prisma.payment.findFirst({
      where: { 
        assessmentId,
        status: 'completed'
      }
    });

    return NextResponse.json({ paid: !!payment });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({ paid: false, error: 'Error checking payment status' }, { status: 500 });
  }
}