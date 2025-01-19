// src/app/api/profile/type-selection/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { selectedType } = await request.json();
    
    // For now, we'll use a placeholder userId until authentication is implemented
    const tempUserId = process.env.NODE_ENV === 'development' ? 'dev-user' : 'temp-user';

    const selection = await prisma.userTypeSelection.upsert({
      where: {
        userId: tempUserId,
      },
      update: {
        selectedType,
        updatedAt: new Date(),
      },
      create: {
        userId: tempUserId,
        selectedType,
      },
    });

    return NextResponse.json({ success: true, data: selection });
  } catch (error) {
    console.error('Error saving type selection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save type selection' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // For now, we'll use a placeholder userId until authentication is implemented
    const tempUserId = process.env.NODE_ENV === 'development' ? 'dev-user' : 'temp-user';

    const selection = await prisma.userTypeSelection.findUnique({
      where: {
        userId: tempUserId,
      },
    });

    return NextResponse.json({ success: true, data: selection });
  } catch (error) {
    console.error('Error fetching type selection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch type selection' },
      { status: 500 }
    );
  }
}