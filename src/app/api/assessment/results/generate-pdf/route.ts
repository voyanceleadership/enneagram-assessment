// src/app/api/assessment/results/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const getTypeName = (type: string): string => {
  const TYPE_NAMES: Record<string, string> = {
    '1': 'The Reformer',
    '2': 'The Helper',
    '3': 'The Achiever',
    '4': 'The Individualist',
    '5': 'The Investigator',
    '6': 'The Loyalist',
    '7': 'The Enthusiast',
    '8': 'The Challenger',
    '9': 'The Peacemaker'
  };
  return TYPE_NAMES[type] || 'Unknown';
};

export const generatePDF = async ({ userInfo, analysis, scores }): Promise<Buffer> => {
  try {
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 40px;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2 { 
              color: #333; 
            }
            h1 {
              text-align: center;
              font-size: 24px;
              margin-bottom: 40px;
            }
            h2 {
              font-size: 20px;
              margin-top: 30px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .user-info {
              background: #f8f8f8;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .score-item {
              display: flex;
              justify-content: space-between;
              padding: 12px;
              margin: 8px 0;
              background: #f8f8f8;
              border-radius: 6px;
            }
            .analysis-content {
              line-height: 1.6;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Enneagram Assessment Results</h1>
            </div>

            <div class="user-info">
              <p><strong>Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</p>
              <p><strong>Email:</strong> ${userInfo.email}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>

            <h2>Type Scores</h2>
            ${Object.entries(scores)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([type, score]) => `
                <div class="score-item">
                  <span>Type ${type}: ${getTypeName(type)}</span>
                  <span style="font-weight: bold">${Math.round(score as number)} points</span>
                </div>
              `).join('')}

            <h2>Analysis</h2>
            <div class="analysis-content">
              ${analysis}
            </div>

            <div class="footer">
              © ${new Date().getFullYear()} Voyance Leadership<br>
              www.voyanceleadership.com
            </div>
          </div>
        </body>
      </html>
    `;

    // Generate PDF
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.setContent(content);
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      printBackground: true
    });
    
    await browser.close();
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export async function POST(req: NextRequest) {
  try {
    const { userInfo, analysis, scores } = await req.json();
    const pdf = await generatePDF({ userInfo, analysis, scores });

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=enneagram-assessment-${userInfo.firstName.toLowerCase()}-${userInfo.lastName.toLowerCase()}.pdf`
      }
    });
  } catch (error) {
    console.error('Error handling PDF generation request:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}