import { NextResponse } from 'next/server';

// Mock coupon database
const validCoupons = {
  FREEACCESS: true,
  DISCOUNT50: true,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coupon } = body;

    if (validCoupons[coupon]) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}