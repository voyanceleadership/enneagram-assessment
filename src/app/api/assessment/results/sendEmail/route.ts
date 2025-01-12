// src/app/api/assessment/results/sendEmail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generatePDF } from '../generate-pdf/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received email request body:', body);
    const { emails, message, analysisHtml, scores, userInfo } = body;
    
    console.log('Emails to send to:', emails);
    // Handle both single email string and array of emails
    const recipientEmails = Array.isArray(emails) ? emails : [emails];
    console.log('Processed recipient emails:', recipientEmails);
    
    // More strict email validation
    const validEmails = recipientEmails.filter(email => {
      const trimmedEmail = email.trim();
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail);
    });

    if (validEmails.length === 0) {
      return NextResponse.json(
        { message: 'No valid email addresses provided', emails: recipientEmails },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdf = await generatePDF({
      userInfo,
      analysis: analysisHtml,
      scores
    });

    // Configure email transporter with better error handling
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      console.error('Missing email credentials');
      return NextResponse.json(
        { message: 'Email configuration error' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      from: process.env.EMAIL_FROM || "support@voyanceleadership.com",
      // Add timeout to prevent hanging
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      console.error('Transporter verification failed:', error);
      return NextResponse.json(
        { message: 'Email server configuration error' },
        { status: 500 }
      );
    }

    console.log('Sending email with message:', message); // Debug log

    // Send email with more detailed error handling
    try {
      await transporter.sendMail({
        from: `"Voyance Leadership" <${process.env.EMAIL_FROM || "support@voyanceleadership.com"}>`,
        to: validEmails.join(', '),
        cc: process.env.EMAIL_CC || "support@voyanceleadership.com",
        subject: 'Your Enneagram Assessment Results',
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              h1 { color: #333; text-align: center; }
              .content { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
              .footer { text-align: center; font-size: 12px; color: #777; margin-top: 30px; }
              .personal-message { 
                margin-bottom: 30px; 
                padding: 20px;
                background: #f8f9fa;
                border-left: 4px solid #6366f1;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              ${message ? `
                <div class="personal-message">
                  <p>${message}</p>
                </div>
              ` : ''}
              <div class="content">
                <h1>Your Enneagram Assessment Results</h1>
                <p>Thank you for completing the Voyance Enneagram Assessment!</p>
                <p>We hope you enjoyed (and will continue to enjoy) this process of self-reflection.</p>
                <p>The Voyance Enneagram assessment is uniquely designed to provide clear, unambiguous results. For this reason, it's highly likely that your true personality type is one of your top two scores. We encourage you to read the profiles on these types and subjectively evaluate which one resonates the most.</p>
                <p>Your detailed results are attached to this email as a PDF. Please let us know if you have any questions.</p>
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
        </html>
        `,
        attachments: [{
          filename: `enneagram-assessment-${userInfo.firstName.toLowerCase()}-${userInfo.lastName.toLowerCase()}.pdf`,
          content: pdf,
          contentType: 'application/pdf'
        }],
        // Add headers for better deliverability
        headers: {
          'priority': 'high',
          'x-msmail-priority': 'High',
          'importance': 'high'
        }
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    // Log successful send
    console.log('Email sent successfully to:', validEmails);

    return NextResponse.json({ 
      message: 'Email sent successfully!',
      recipients: validEmails 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in email route:', error);
    return NextResponse.json(
      { 
        message: 'Failed to send email.',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}