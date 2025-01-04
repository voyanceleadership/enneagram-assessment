import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Read typing insights from markdown file
const insightsPath = path.resolve(process.cwd(), 'src/insights/typingInsights.md');
let typingInsights = '';

try {
  typingInsights = fs.readFileSync(insightsPath, 'utf8');
  console.log('Typing insights loaded successfully.');
} catch (error) {
  console.error('Failed to load typing insights:', error);
  typingInsights = 'No additional typing insights available.';
}

interface Scores {
  [key: string]: number;
}

interface RequestBody {
  scores: Scores;
  responses: any;
}

export async function POST(req: Request) {
  console.log('API route hit');
  try {
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('API Key first few chars:', process.env.OPENAI_API_KEY?.substring(0, 4));

    const { scores, responses }: RequestBody = await req.json();
    console.log('Received scores:', scores);

    // Sort scores to determine dominant and secondary types
    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([type, score]) => ({ type, score: score as number }));

    console.log('Sorted scores:', sortedScores);

    const prompt = `You are an Enneagram expert with over 2,000 hours of coaching experience. 
    Provide a detailed and structured analysis of Enneagram test results.
    
    **Assessment Scores (highest to lowest):** 
    Scores (sorted by highest):
    ${sortedScores.map(({ type, score }) => `Type ${type}: ${Math.round(score)}`).join('\n')}
    
    **Reference Typing Insights:**  
    ${typingInsights}
    
    **Analysis Requirements:** 
    1. Identify the dominant type with clear reasoning.
    2. Highlight overlapping traits but explain differences.
    3. Comment on wing influences (adjacent types only).
    4. Address mistyping risks.
    5. Provide growth recommendations.
    
    Return the analysis in plain HTML format without markdown code blocks, with the following structure:
    <h2>Core Type Analysis</h2>
    <hr>
    <p>[Core type explanation]</p>
    
    <h2>Wing Analysis</h2>
    <hr>
    <p>[Wing influences explanation]</p>
    
    <h2>Look-Alike Types</h2>
    <hr>
    <p>[Mistypes and similarities]</p>
    
    <h2>Developmental Paths</h2>
    <hr>
    <p>[Growth and integration paths]</p>
    
    Do not wrap the response in \`\`\`html or any markdown code block. Return raw HTML only.`;

    console.log('About to call OpenAI');
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert Enneagram consultant providing structured, accurate analysis." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1500,
      });

      console.log('OpenAI call successful');
      const content = completion.choices[0].message.content;

      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Format headings and sections using HTML
      const formattedAnalysis = content
        .replace(/\*\*Core Type Analysis\*\*/g, '<h2>Core Type Analysis</h2><hr>')
        .replace(/\*\*Wing Analysis\*\*/g, '<h2>Wing Analysis</h2><hr>')
        .replace(/\*\*Look-Alike Types\*\*/g, '<h2>Look-Alike Types</h2><hr>')
        .replace(/\*\*Developmental Paths\*\*/g, '<h2>Developmental Paths</h2><hr>')
        .replace(/\n/g, '<br>');

      return NextResponse.json({ analysis: formattedAnalysis });
    } catch (openaiError: any) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json({
        error: 'OpenAI API Error',
        details: openaiError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('General API route error:', error);
    return NextResponse.json({
      error: 'Analysis failed',
      details: error.message
    }, { status: 500 });
  }
}