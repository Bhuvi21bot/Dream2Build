import { betterAuth } from "better-auth";
import { pool } from "./db.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Trying both possible .env locations just in case
dotenv.config({ path: path.resolve(__dirname, '../../frontend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') }); // For the outer folder

export const auth = betterAuth({
  database: pool,
  baseURL: "http://localhost:5000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    },
  },
});
