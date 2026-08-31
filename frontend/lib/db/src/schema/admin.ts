import { pgTable, text, jsonb } from "drizzle-orm/pg-core";

export const adminSettings = pgTable("admin_settings", {
	id: text("id").primaryKey(), // e.g. "global"
	brandColor: text("brandColor").default("#a47148").notNull(),
	brandLogo: text("brandLogo"),
	supportedLanguages: jsonb("supportedLanguages").notNull(), // string[]
});
