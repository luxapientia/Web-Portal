import formData from 'form-data';
import Mailgun from 'mailgun.js';

if (!process.env.MAILGUN_API_KEY) {
  throw new Error('MAILGUN_API_KEY is not set in environment variables');
}

if (!process.env.MAILGUN_DOMAIN) {
  throw new Error('MAILGUN_DOMAIN is not set in environment variables');
}

const mailgun = new Mailgun(formData);

// Initialize the client with proper typing
const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.mailgun.net', // Use EU endpoint if your domain is in EU region
});

const DOMAIN = process.env.MAILGUN_DOMAIN;
const FROM_EMAIL = `DoubleBubble <noreply@${DOMAIN}>`;

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailData) {
  try {
    if (!DOMAIN || !process.env.MAILGUN_API_KEY) {
      throw new Error('Mailgun configuration is missing');
    }

    // const messageData = {
    //   from: FROM_EMAIL,
    //   to,
    //   subject,
    //   text,
    //   html,
    // };

    // const response = await client.messages.create(DOMAIN, messageData);
    const response = await fetch("https://postal.bubble2025.com/api/v1/send/message", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Server-API-Key': process.env.POSTAL_API_KEY as string
      },
      body: JSON.stringify({
        to: to,
        from: 'OTP <otp@bubble2025.com>',
        subject: subject,
        text: text,
        html_body: html
      })
    })
    if (!response.ok) {
      return { success: false, error: "Failed to send email" };
    }
    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending email:', error);
    // Add more detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    return { success: false, error };
  }
}

export function generateVerificationEmailContent(code: string, expirySeconds: number = 30) {
  const text = `Your verification code is: ${code}. This code will expire in ${expirySeconds} seconds.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Double Bubble Email Verification</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="font-size: 16px; color: #666;">Your verification code is:</p>
        <h1 style="color: #0088cc; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">${code}</h1>
        <p style="color: #ff5722; font-size: 14px; font-weight: bold;">⚠️ This code will expire in ${expirySeconds} seconds!</p>
      </div>
      <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
        If you didn't request this code, please ignore this email.
      </p>
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          This email was sent by Double Bubble.<br/>
          Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return { text, html };
} 