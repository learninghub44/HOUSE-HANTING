import { boolean, integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Identity (email, password, sessions) is fully managed by Neon Auth in the
 * `neon_auth` schema — we never store credentials ourselves. This table
 * holds only the app-specific fields for each Neon Auth user, keyed by
 * their Neon Auth user id (`neon_auth.user.id`).
 */
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(), // matches neon_auth.user.id
  role: text("role", { enum: ["tenant", "landlord", "admin"] }).notNull().default("tenant"),
  phone: text("phone"),
  responseTime: text("response_time"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  landlordId: text("landlord_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  location: text("location").notNull(),
  area: text("area").notNull(),
  type: text("type").notNull(),
  rent: integer("rent").notNull(),
  bedrooms: integer("bedrooms").notNull().default(1),
  bathrooms: integer("bathrooms").notNull().default(1),
  size: text("size"),
  status: text("status", { enum: ["Available", "Reserved", "Occupied", "Under Maintenance"] }).notNull().default("Available"),
  verified: boolean("verified").notNull().default(false),
  available: boolean("available").notNull().default(true),
  image: text("image").notNull(),
  gallery: text("gallery").array().notNull().default([]),
  amenities: text("amenities").array().notNull().default([]),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  tenantId: text("tenant_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  status: text("status", { enum: ["Sent", "Landlord replied", "Viewing requested", "Reserved", "Closed"] }).notNull().default("Sent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  item: text("item").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["Paid", "Pending", "Overdue"] }).notNull().default("Pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: text("subject").notNull(),
  reason: text("reason").notNull(),
  status: text("status", { enum: ["Open", "Resolved"] }).notNull().default("Open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
