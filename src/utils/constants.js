import dotenv from 'dotenv';
dotenv.config()

export const PORT = process.env.PORT;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_SIGNING_SECRET = process.env.STRIPE_SIGNING_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const CLIENT_URL = process.env.CLIENT_URL;
export const API_URL = process.env.API_URL;
export const GOOGLE_USER = process.env.GOOGLE_USER;
export const GOOGLE_PASSWORD = process.env.GOOGLE_PASSWORD;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;