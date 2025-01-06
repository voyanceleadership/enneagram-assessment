import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface RequestBody {
  scores: {
    [key: string]: number;
  };
}

export async function POST(req: Request) {
  console.log('analyze route hit');
  try {
    const { scores }: RequestBody = await req.json();
    console.log('Received scores for analysis:', scores);

    if (!scores || Object.keys(scores).length === 0) {
      console.error('No scores provided in request');
      return NextResponse.json({
        error: 'No scores provided'
      }, { status: 400 });
    }

    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([type, score]) => ({ type, score }));

    console.log('Sorted scores for analysis:', sortedScores);

    const prompt = `As an Enneagram expert, please analyze these assessment results:

${sortedScores.map(({ type, score }) => `Type ${type}: ${Math.round(score)} points`).join('\n')}

Please structure your analysis with HTML formatting:

<h2>Core Type Analysis</h2>
- Explain key characteristics of their highest scoring types
- Discuss how these types manifest in behavior and thinking patterns

<h2>Wing Analysis</h2>
- Identify potential wing influences
- Explain how these wings might modify their core type
- Discuss the benefits and challenges of their wing combination

<h2>Growth Path</h2>
- Provide specific growth recommendations
- Identify potential stress and security points
- Suggest practical steps for personal development

<h2>Common Misidentifications</h2>
- Discuss any types with close scores
- Explain key differences between similar types
- Help clarify type patterns`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert Enneagram consultant providing structured, accurate analysis.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    console.log('Analysis generated successfully');

    return NextResponse.json({
      success: true,
      analysis: content
    });

  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate analysis' 
    }, { 
      status: 500 
    });
  }
}