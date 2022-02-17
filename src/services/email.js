import nodemailer from 'nodemailer';
import {
  GOOGLE_ACCESS_TOKEN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER
} from '../utils/constants.js';

export const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      type: 'OAuth2',
      user: GOOGLE_USER,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      accessToken: GOOGLE_ACCESS_TOKEN
    }
  });

  await transporter.sendMail({
    from: GOOGLE_USER,
    to: email,
    subject,
    text
  });
}