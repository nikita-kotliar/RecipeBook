import nodemailer from 'nodemailer';
import 'dotenv/config';

const transport = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
export async function sendMail(email, token) {
  const message = {
    to: email,
    from: process.env.MAIL_SENDER,
    subject: 'Your verification code',
    text: `Your verification code is: ${token}. It is valid for 1 hour.`,
  };

  await transport.sendMail(message);
}
