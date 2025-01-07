// src/app/api/admin/emails/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { EmailValidationService } from '@/services/emailValidation';

const emailValidationService = new EmailValidationService();

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();
    
    switch (type) {
      case 'single':
        const { email } = data;
        await emailValidationService.addValidEmail({
          email,
          source: 'manual'
        });
        return NextResponse.json({ success: true, message: 'Email added successfully' });
        
      case 'cohort':
        const { emails, cohortName, validUntil } = data;
        const cohort = await prisma.cohort.create({
          data: {
            name: cohortName,
            organizationId: 'manual', // You might want to make this configurable
            organizationName: 'Manual Entry',
            startDate: new Date(),
            endDate: validUntil ? new Date(validUntil) : null,
            active: true
          }
        });
        
        await emailValidationService.addCohortEmails({
          emails,
          cohortId: cohort.id,
          cohortName,
          validUntil: validUntil ? new Date(validUntil) : undefined
        });
        return NextResponse.json({ success: true, message: 'Cohort added successfully' });
        
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in admin emails route:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const emails = await prisma.validEmail.findMany({
      include: {
        cohort: true
      }
    });
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Error fetching emails' }, { status: 500 });
  }
}