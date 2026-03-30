// Simple SMTP test script for local debugging
// Usage (PowerShell):
//  $env:SMTP_HOST="smtp.example.com"; $env:SMTP_PORT="587"; $env:SMTP_USER="user"; $env:SMTP_PASS="pass"; $env:CONTACT_TO_EMAIL="you@example.com"; node test-smtp.js

import nodemailer from 'nodemailer';

async function run() {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    console.error('Missing environment variables. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    const info = await transporter.sendMail({
      from: `${SMTP_USER}`,
      to: CONTACT_TO_EMAIL,
      subject: 'Test email from portfolio SMTP test',
      text: 'This is a test message sent from test-smtp.js',
    });
    console.log('Test email sent:', info.messageId || info.response);
  } catch (err) {
    console.error('Failed to send test email:', err);
    process.exit(2);
  }
}

run();
