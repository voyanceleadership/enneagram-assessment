import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { coupon } = await request.json();
    
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const normalizedCoupon = coupon.toUpperCase();
    
    // Find coupon in database
    const couponDetails = await prisma.coupon.findUnique({
      where: {
        code: normalizedCoupon
      }
    });

    if (!couponDetails) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
    }

    if (!couponDetails.active) {
      return NextResponse.json({ valid: false, error: 'Coupon is inactive' });
    }

    const currentDate = new Date();
    const expirationDate = new Date(couponDetails.expires);
    
    if (expirationDate < currentDate) {
      return NextResponse.json({ valid: false, error: 'Coupon has expired' });
    }

    if (couponDetails.uses <= 0) {
      return NextResponse.json({ valid: false, error: 'Coupon has no remaining uses' });
    }

    return NextResponse.json({
      valid: true,
      details: {
        discount: couponDetails.discount,
        usesRemaining: couponDetails.uses,
        expires: couponDetails.expires
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}