// src/app/api/assessment/start/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email } = await req.json();
    
    // Find existing user or create new one
    const existingUser = await prisma.userInfo.findFirst({
      where: { email }
    });

    let user;
    if (existingUser) {
      // Update existing user
      user = await prisma.userInfo.update({
        where: { id: existingUser.id },
        data: {
          firstName,
          lastName,
        }
      });
    } else {
      // Create new user
      user = await prisma.userInfo.create({
        data: {
          email,
          firstName,
          lastName
        }
      });
    }

    console.log('User info updated/created:', user);

    // Create a new assessment response linked to the user
    const assessment = await prisma.assessmentResponse.create({
      data: {
        userInfoId: user.id,  // Only need userInfoId since email comes from the relation
        weightingResponses: {},
        rankings: {}
      }
    });

    console.log('Assessment created:', assessment);

    return NextResponse.json({ 
      success: true, 
      assessmentId: assessment.id 
    });
  } catch (error) {
    console.error('Error starting assessment:', error);
    return NextResponse.json(
      { error: 'Failed to start assessment' },
      { status: 500 }
    );
  }
}