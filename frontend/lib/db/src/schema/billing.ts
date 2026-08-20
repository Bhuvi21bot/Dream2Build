import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  plan: text("plan").default("free"), // using text for simplicity or custom enum
  status: text("status").default("active"),
  razorpaySubscriptionId: text("razorpay_subscription_id"),
  aiGenerationsUsed: integer("ai_generations_used").default(0),
  projectsUsed: integer("projects_used").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
