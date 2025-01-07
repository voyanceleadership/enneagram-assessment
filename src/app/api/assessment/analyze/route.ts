import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  console.log('Analysis generation started');

  try {
    const { assessmentId, scores } = await req.json();
    console.log('Processing analysis for assessment:', assessmentId, 'with scores:', scores);

    // Check if analysis already exists
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { assessmentId }
    });

    if (existingAnalysis) {
      console.log('Analysis already exists for assessment:', assessmentId);
      return NextResponse.json({
        success: true,
        analysis: existingAnalysis.content
      });
    }

    // Construct the prompt
    const prompt = `You are an Enneagram expert providing structured analysis.
    
    Analyze the following Enneagram test results:
    ${Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([type, score]) => `Type ${type}: ${score} points`)
      .join('\n')}
    
    Provide the analysis in this format:
    
    <h2>Core Type Analysis</h2>
    <p>[Core type explanation]</p>
    
    <h2>Wing Analysis</h2>
    <p>[Wing influences explanation]</p>
    
    <h2>Look-Alike Types</h2>
    <p>[Mistypes and similarities]</p>
    
    <h2>Developmental Paths</h2>
    <p>[Growth and integration paths]</p>`;

    console.log('Sending prompt to OpenAI');

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert Enneagram consultant providing structured, accurate analysis." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    console.log('Analysis generated, length:', content.length);

    // Format the content
    const formattedAnalysis = content.replace(/\n/g, '<br>');

    // Save to database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        content: formattedAnalysis,
        assessment: {
          connect: {
            id: assessmentId
          }
        }
      }
    });

    console.log('Analysis saved with ID:', savedAnalysis.id);

    // Update assessment status
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { status: 'ANALYZED' }
    });

    return NextResponse.json({
      success: true,
      analysis: formattedAnalysis
    });

  } catch (error) {
    console.error('Analysis generation error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate analysis'
    }, { 
      status: 500 
    });
  }
}