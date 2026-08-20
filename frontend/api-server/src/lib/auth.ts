import { betterAuth } from "better-auth";
import { db } from "@workspace/db";

export const auth = betterAuth({
  database: {
    db: db,
    type: "postgres",
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5000",
  ],
});
