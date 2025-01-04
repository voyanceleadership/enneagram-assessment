import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface Scores {
  [type: string]: number;
}

export async function POST(req: NextRequest) {
  try {
    const { email, analysisHtml, scores } = await req.json();

    // Ensure scores are typed correctly
    const typedScores: Record<string, number> = scores as Record<string, number>;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Sort and round scores
    const sortedScores = Object.entries(typedScores)
      .sort(([, a], [, b]) => (b as number) - (a as number))  // Explicit type casting
      .map(([type, score]) => ({
        type,
        score: Math.round(score as number),  // Type assertion to avoid 'unknown' error
      }));

    // Generate HTML for scores
    const scoresHtml = sortedScores
      .map(({ type, score }) => `
        <p style="margin: 5px 0; font-size: 16px;">
          <strong>Type ${type}</strong>: ${score} points
        </p>`)
      .join('');

    // PDF download button
    const pdfButtonHtml = `
      <div style="text-align: center; margin-top: 40px;">
        <a href="https://www.voyanceleadership.com/download-pdf/${email}" 
           style="background-color: #007BFF; color: white; padding: 12px 24px; font-size: 16px; 
                  border-radius: 5px; text-decoration: none; display: inline-block;">
          Download PDF
        </a>
      </div>
    `;

    // Full Email Body
    const emailBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; text-align: center; }
          .content { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <div style="text-align: center;">
              <img src="https://voyance-image-storage.s3.us-east-2.amazonaws.com/VL+Enneagram+Basic+Color+Names+Numbers.png" width="200" />
            </div>
            <h1>Your Enneagram Assessment Results</h1>
            <p>Thank you for completing the Voyance Enneagram Assessment! Below are your results.</p>
            
            <div style="margin-top: 30px;">
              <h2>Your Type Scores</h2>
              ${scoresHtml}
            </div>

            <div style="margin-top: 30px;">
              <h2>Analysis</h2>
              ${analysisHtml}
            </div>

            ${pdfButtonHtml}

            <p style="text-align: center; margin-top: 40px;">
              If you have any questions, please reach out to 
              <a href="mailto:support@voyanceleadership.com">support@voyanceleadership.com</a>.
            </p>
          </div>
          <div class="footer">
            © 2024 Voyance Leadership | <a href="http://www.voyanceleadership.com">voyanceleadership.com</a>
          </div>
        </div>
      </body>
    </html>`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: `${email}, support@voyanceleadership.com`,
      subject: 'Your Enneagram Assessment Results',
      html: emailBody,
    });

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email.', error },
      { status: 500 }
    );
  }
}
