import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const projects = pgTable("projects", {
	id: text("id").primaryKey(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	data: jsonb("data").notNull(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
