import { NextRequest, NextResponse } from 'next/server';
import { validEmails } from '@/app/data/validation/ValidEmails';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (validEmails.includes(email)) {
    return NextResponse.json({ valid: true });
  } else {
    return NextResponse.json({ valid: false });
  }
}