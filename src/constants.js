import dotenv from 'dotenv';
dotenv.config()

export const PORT = process.env.PORT;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_SIGNING_SECRET = process.env.STRIPE_SIGNING_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;