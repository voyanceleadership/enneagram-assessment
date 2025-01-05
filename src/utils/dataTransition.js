// src/utils/dataTransition.js
import { prisma } from '../lib/prisma';
import { salesforceService } from '../services/salesforce';

export async function transitionAssessmentData(sessionId) {
  try {
    // Fetch temporary assessment data from Prisma
    const tempData = await prisma.temporaryAssessment.findUnique({
      where: { sessionId },
      include: {
        userInfo: true,
        responses: true
      }
    });

    if (!tempData) {
      throw new Error('No temporary assessment data found');
    }

    // Transform data for Salesforce
    const userData = {
      firstName: tempData.userInfo.firstName,
      lastName: tempData.userInfo.lastName,
      email: tempData.userInfo.email
    };

    const assessmentData = tempData.responses.map(response => ({
      questionNumber: response.questionNumber,
      answer: response.answer,
      type: response.questionType
    }));

    // Store in Salesforce
    const salesforceResult = await salesforceService.createAssessmentRecord(
      userData,
      assessmentData
    );

    // After successful Salesforce storage, clean up Prisma data
    await prisma.temporaryAssessment.delete({
      where: { sessionId }
    });

    return salesforceResult;
  } catch (error) {
    console.error('Error transitioning data:', error);
    throw error;
  }
}

export async function getAssessmentResults(email) {
  try {
    const sfResults = await salesforceService.getAssessmentHistory(email);
    return sfResults;
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    throw error;
  }
}