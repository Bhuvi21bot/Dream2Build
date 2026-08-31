import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { projects } from "./projects";

export const communityPosts = pgTable("community_posts", {
	id: text("id").primaryKey(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	projectId: text("projectId").references(() => projects.id, { onDelete: "set null" }),
	content: text("content").notNull(),
	tag: text("tag").notNull(),
	likes: integer("likes").default(0).notNull(),
	clones: integer("clones").default(0).notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
});
