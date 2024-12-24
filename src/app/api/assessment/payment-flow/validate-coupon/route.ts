import { NextResponse } from 'next/server';
import validCoupons from '@/app/data/validation/ValidCoupons';

// Map valid coupons by code
const couponMap = validCoupons.reduce((acc, coupon) => {
  acc[coupon.code.toUpperCase()] = coupon;
  return acc;
}, {} as Record<string, typeof validCoupons[number]>);

// Handle POST requests
export async function POST(request: Request) {
  try {
    console.log("POST request received.");
    const body = await request.json();
    const { coupon } = body;

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const normalizedCoupon = coupon.toUpperCase();
    const couponDetails = couponMap[normalizedCoupon];

    if (!couponDetails) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
    }

    const currentDate = new Date();
    const expirationDate = new Date(couponDetails.expires);

    if (!couponDetails.active) {
      return NextResponse.json({ valid: false, error: 'Coupon is inactive' });
    }

    if (expirationDate < currentDate) {
      return NextResponse.json({ valid: false, error: 'Coupon has expired' });
    }

    if (couponDetails.uses <= 0) {
      return NextResponse.json({ valid: false, error: 'Coupon has no remaining uses' });
    }

    couponDetails.uses -= 1;

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

// Handle GET requests for debugging
export async function GET() {
  return NextResponse.json({ message: "GET request works. Use POST for coupon validation." });
}