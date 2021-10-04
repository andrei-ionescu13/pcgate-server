import nodemailer from 'nodemailer';
import { GMAIL_PASSWORD, GMAIL_USER } from '../constants.js';

export const sendEmail = (email, subject, text) => {
  nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD
    }
  });
}