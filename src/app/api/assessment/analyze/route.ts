// src/app/api/assessment/analyze/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';
import { Prisma } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Keep track of ongoing analysis requests
const ongoingAnalyses = new Map<string, Promise<any>>();

export async function POST(req: Request) {
  try {
    const { assessmentId } = await req.json();
    console.log('Analysis generation started');

    if (!assessmentId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Assessment ID is required' 
      }, { status: 400 });
    }

    // Check if there's an ongoing analysis for this assessment
    if (ongoingAnalyses.has(assessmentId)) {
      console.log('Analysis already in progress for:', assessmentId);
      return NextResponse.json({
        success: false,
        message: 'Analysis generation in progress'
      });
    }

    // Get the assessment and check if analysis already exists
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        results: {
          select: {
            type: true,
            score: true
          }
        },
        analysis: true,
        userInfo: true // Include user info for personalization
      }
    });

    if (!assessment) {
      return NextResponse.json({ 
        success: false, 
        error: 'Assessment not found' 
      }, { status: 404 });
    }

    // If analysis exists, return it
    if (assessment.analysis) {
      return NextResponse.json({
        success: true,
        analysis: assessment.analysis.content
      });
    }

    // Convert results to scores object and ensure proper rounding
    const scores = Object.fromEntries(
      assessment.results.map(result => [
        result.type, 
        Number((result.score * 10).toFixed(1)) / 10
      ])
    );

    console.log('Processing analysis for assessment:', assessmentId, 'with scores:', scores);

    // Start analysis generation and store the promise
    const analysisPromise = (async () => {
      try {
        // Generate the prompt with more structured analysis requirements
        const prompt = `As an Enneagram expert, provide a detailed analysis for this person's assessment results:

        Test Results:
        ${Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .map(([type, score]) => `Type ${type}: ${score} points`)
          .join('\n')}
        
        Please provide a comprehensive analysis in HTML format with these sections:
        
        <h2>Core Type Analysis</h2>
        <p>[Analyze the top scoring type(s) and what this means for the person's core motivations and fears]</p>
        
        <h2>Wing Analysis</h2>
        <p>[Examine the adjacent types to the core type and their influence on the personality]</p>
        
        <h2>Look-Alike Types</h2>
        <p>[Discuss possible mistypes, especially for close scoring types, and explain key differences]</p>
        
        <h2>Growth Path</h2>
        <p>[Provide specific growth recommendations and integration paths based on the type patterns]</p>
        
        <h2>Stress Response</h2>
        <p>[Explain typical stress reactions and coping mechanisms for the core type]</p>

        Important guidelines:
        - Use clear, engaging language
        - Provide specific examples
        - Focus on personal growth opportunities
        - Format in proper HTML with paragraphs and sections
        - Keep advice practical and actionable`;

        console.log('Sending prompt to OpenAI');

        // Make the OpenAI API call with enhanced parameters
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert Enneagram consultant providing structured, accurate analysis. Your responses should be detailed, personal, and actionable while maintaining professionalism and academic rigor."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.6,
          max_tokens: 2000,
          presence_penalty: 0.1, // Slight penalty for repetition
          frequency_penalty: 0.1, // Slight penalty for frequent token use
        });

        const content = completion.choices[0].message.content;
        
        if (!content) {
          throw new Error('No content received from OpenAI');
        }

        console.log('Analysis generated, length:', content.length);

        // Format the analysis with improved HTML handling
        const formattedAnalysis = content
          .replace(/\n\n/g, '</p><p>') // Convert double newlines to paragraph breaks
          .replace(/\n/g, '<br>') // Convert single newlines to line breaks
          .replace(/<p><h2>/g, '<h2>') // Fix paragraph/header nesting
          .replace(/<\/h2><\/p>/g, '</h2>'); // Fix paragraph/header nesting

          try {
            // Use transaction with pessimistic locking
            const result = await prisma.$transaction(async (tx) => {
              // Lock the assessment record first
              const lockedAssessment = await tx.assessment.findUnique({
                where: { id: assessmentId },
                include: { analysis: true },
                for: 'update'  // Add pessimistic lock
              });
          
              // Check again if analysis exists after getting lock
              if (lockedAssessment?.analysis) {
                return lockedAssessment.analysis;
              }
          
              // Create analysis if it doesn't exist
              const analysis = await tx.analysis.create({
                data: {
                  content: formattedAnalysis,
                  assessmentId
                }
              });
          
              // Update assessment status
              await tx.assessment.update({
                where: { id: assessmentId },
                data: { 
                  status: 'ANALYZED'
                }
              });
          
              return analysis;
            }, {
              isolationLevel: Prisma.TransactionIsolationLevel.Serializable // Ensure serializable isolation
            });
          
            return result.content;
          } catch (error) {
            // If we hit a unique constraint error, it means another process created the analysis
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
              const existingAnalysis = await prisma.analysis.findUnique({
                where: { assessmentId }
              });
              if (existingAnalysis) {
                return existingAnalysis.content;
              }
            }
            // Log the specific error for debugging
            console.error('Error in analysis generation:', error);
            throw error;
          }
      } catch (error) {
        // Log the specific error for debugging
        console.error('Error in analysis generation:', error);
        throw error; // Re-throw to be caught by outer try-catch
      } finally {
        // Always clean up the ongoing analysis reference
        ongoingAnalyses.delete(assessmentId);
      }
    })();

    // Store the promise for tracking
    ongoingAnalyses.set(assessmentId, analysisPromise);

    // Wait for analysis to complete
    const formattedAnalysis = await analysisPromise;

    return NextResponse.json({
      success: true,
      analysis: formattedAnalysis
    });

  } catch (error) {
    console.error('Analysis generation error:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to generate analysis';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('OpenAI')) {
        errorMessage = 'Error communicating with analysis service';
        statusCode = 503;
      } else if (error.message.includes('Prisma')) {
        errorMessage = 'Database error occurred';
        statusCode = 500;
      }
      // Log the full error for debugging
      console.error('Detailed error:', error.message);
    }

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: statusCode });
  }
}