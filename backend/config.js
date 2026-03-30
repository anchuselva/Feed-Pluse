import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedpulse',
  jwtSecret: process.env.JWT_SECRET || 'change_me_secret',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@feedpulse.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  port: Number(process.env.PORT) || 4000,
};
