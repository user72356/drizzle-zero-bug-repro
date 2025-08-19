import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";

// Simple table demonstrating the bug
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    
    name: text("name").notNull(),
    
    // This is the problematic field - it should be string type in Zero schema
    // but drizzle-zero incorrectly maps PgDateString to "number"
    birthDate: date("birth_date", { mode: "string" }),
});

export type User = typeof users.$inferSelect;
