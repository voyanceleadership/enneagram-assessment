import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    if (!body.userInfo || !body.responses) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required data: userInfo or responses' 
      }, { status: 400 });
    }

    const { userInfo, responses } = body;

    // Validate userInfo
    if (!userInfo.email || !userInfo.firstName || !userInfo.lastName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required user info fields' 
      }, { status: 400 });
    }

    // Validate responses
    if (!responses.weightingResponses || !responses.rankings || !responses.calculatedResults) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required response data' 
      }, { status: 400 });
    }

    console.log('Creating/updating user info for:', userInfo.email);
    
    // Create or update user info
    const savedUserInfo = await prisma.userInfo.upsert({
      where: {
        email: userInfo.email,
      },
      update: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
      },
      create: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
      },
    });

    console.log('Saved user info:', savedUserInfo);

    // Create assessment response - removed email field since it's connected through userInfo
    const assessmentResponse = await prisma.assessmentResponse.create({
      data: {
        userInfoId: savedUserInfo.id,  // This creates the connection to userInfo
        weightingResponses: responses.weightingResponses,
        rankings: responses.rankings,
        isPaid: false,
        results: {
          create: Object.entries(responses.calculatedResults).map(([type, score]) => ({
            type,
            score: Number(score),
          })),
        },
      },
      include: {
        results: true,
        userInfo: true,
      },
    });

    console.log('Created assessment response:', assessmentResponse);

    return NextResponse.json({ 
      success: true, 
      assessmentId: assessmentResponse.id 
    });

  } catch (error) {
    console.error('Detailed error saving assessment:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save assessment',
      details: error
    }, { status: 500 });
  }
}