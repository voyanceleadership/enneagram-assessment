import { NextRequest, NextResponse } from 'next/server';
import { validCoupons } from '@/app/data/validation/Coupons';

export async function POST(req: NextRequest) {
  const { couponCode } = await req.json();

  if (validCoupons.includes(couponCode)) {
    return NextResponse.json({ valid: true });
  } else {
    return NextResponse.json({ valid: false });
  }
}