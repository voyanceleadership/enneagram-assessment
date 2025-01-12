// src/app/api/assessment/results/sendEmail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generatePDF } from '../generate-pdf/route';

export async function POST(req: NextRequest) {
  try {
    const { emails, message, analysisHtml, scores, userInfo } = await req.json();
    
    // Handle both single email string and array of emails
    const recipientEmails = Array.isArray(emails) ? emails : [emails];

    // Generate PDF first
    const pdf = await generatePDF({
      userInfo,
      analysis: analysisHtml,
      scores: scores
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      from: "support@voyanceleadership.com"
    });

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
          .message { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h1>Your Enneagram Assessment Results</h1>
            <p>Thank you for completing the Voyance Enneagram Assessment!</p>
            <p>We hope you enjoyed (and will continue to enjoy) this process of self-reflection.</p>
            <p>The Voyance Enneagram assessment is uniquely designed to provide clear, unambiguous results. For this reason, it's highly likely that your true personality type is one of your top two scores. We encourage you to read the profiles on these types and subjectively evaluate which one resonates the most.</p>
            <p>Your detailed results are attached to this email as a PDF. Please let us know if you have any questions.</p>
            <p>If you're interested in learning more, we offer a 3-hour Enneagram eCourse on our online learning platform. Please visit <a href="https://www.voyanceleadership.com/en-intro-course">our website</a> for more information.</p>
            ${message ? `
              <div class="message">
                <p><strong>Additional Message:</strong></p>
                <p>${message}</p>
              </div>
            ` : ''}
            <p style="text-align: center; margin-top: 40px;">
              If you have any questions, please reach out to 
              <a href="mailto:support@voyanceleadership.com">support@voyanceleadership.com</a>.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Voyance Leadership | <a href="http://www.voyanceleadership.com">voyanceleadership.com</a>
          </div>
        </div>
      </body>
    </html>`;

    // Send email with PDF attachment
    await transporter.sendMail({
      from: "Voyance Leadership <support@voyanceleadership.com>",
      to: recipientEmails.join(', '),
      cc: "support@voyanceleadership.com",
      subject: 'Your Enneagram Assessment Results',
      html: emailBody,
      attachments: [{
        filename: `enneagram-assessment-${userInfo.firstName.toLowerCase()}-${userInfo.lastName.toLowerCase()}.pdf`,
        content: pdf,
        contentType: 'application/pdf'
      }]
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