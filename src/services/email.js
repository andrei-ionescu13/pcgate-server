import nodemailer from 'nodemailer';
import { GMAIL_PASSWORD, GMAIL_USER } from '../utils/constants.js';

export const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: GMAIL_USER,
    to: email,
    subject,
    text
  });
}