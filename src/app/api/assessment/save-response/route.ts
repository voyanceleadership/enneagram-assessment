import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    const { userInfo, responses, assessmentType } = body;

    if (!userInfo || !responses || !assessmentType) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required data: userInfo, responses, or assessmentType' 
      }, { status: 400 });
    }

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
    const existingUser = await prisma.userInfo.findFirst({
      where: { email: userInfo.email }
    });

    let savedUserInfo;
    if (existingUser) {
      savedUserInfo = await prisma.userInfo.update({
        where: { id: existingUser.id },
        data: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
        }
      });
    } else {
      savedUserInfo = await prisma.userInfo.create({
        data: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
        }
      });
    }

    console.log('Saved user info:', savedUserInfo);

    // Create the assessment with assessmentType
    const assessment = await prisma.assessment.create({
      data: {
        userInfoId: savedUserInfo.id,
        assessmentType: assessmentType,
      },
    });

    // Create response data linked to the assessment
    const assessmentResponse = await prisma.assessmentResponse.create({
      data: {
        assessmentId: assessment.id,
        weighting: responses.weightingResponses,
        rankings: responses.rankings,
      },
    });

    // Create results linked to the assessment
    await prisma.result.createMany({
      data: Object.entries(responses.calculatedResults).map(([type, score]) => ({
        type,
        score: Number(score),
        assessmentId: assessment.id,
      })),
    });

    console.log('Created assessment response and results:', assessmentResponse);

    return NextResponse.json({ 
      success: true, 
      assessmentId: assessment.id,
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
