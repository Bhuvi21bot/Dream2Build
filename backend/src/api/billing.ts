import {
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { userTable } from "./auth";

// A plan mirrors a Razorpay Plan (created once via Razorpay dashboard
// or API, then referenced here). Keep priceInPaise as the source of
// truth for what you display to users; razorpayPlanId is what you
// pass to the Razorpay Subscriptions API.
export const plansTable = pgTable("plans", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(), // e.g. "pro-monthly"
    name: text("name").notNull(), // e.g. "Pro"
    priceInPaise: integer("price_in_paise").notNull(), // ₹499 -> 49900
    interval: text("interval").notNull(), // "monthly" | "yearly"
    razorpayPlanId: text("razorpay_plan_id").notNull(),
    isActive: integer("is_active").notNull().default(1), // 1 = true, 0 = false
});

export const insertPlanSchema = createInsertSchema(plansTable).omit({
    id: true,
});
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plansTable.$inferSelect;

export const subscriptionStatusEnum = pgEnum("subscription_status", [
    "created", // subscription created, awaiting first payment/auth
    "authenticated", // mandate authenticated, awaiting activation
    "active", // paying customer
    "pending", // payment retry in progress
    "halted", // payments failing repeatedly, access should be revoked
    "cancelled",
    "completed", // fixed-count subscription finished its cycles
]);

export const subscriptionsTable = pgTable("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
        .notNull()
        .references(() => plansTable.id),
    razorpaySubscriptionId: text("razorpay_subscription_id")
        .notNull()
        .unique(),
    razorpayCustomerId: text("razorpay_customer_id"),
    status: subscriptionStatusEnum("status").notNull().default("created"),
    currentStart: timestamp("current_start"),
    currentEnd: timestamp("current_end"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(
    subscriptionsTable,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;