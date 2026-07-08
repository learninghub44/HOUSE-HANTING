import { boolean, integer, numeric, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

/**
 * Identity (email, password, sessions) is fully managed by Neon Auth in the
 * `neon_auth` schema — we never store credentials ourselves. This table
 * holds only the app-specific fields for each Neon Auth user, keyed by
 * their Neon Auth user id (`neon_auth.user.id`).
 */
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(), // matches neon_auth.user.id
  role: text("role", { enum: ["tenant", "agent", "landlord", "admin"] }).notNull().default("tenant"),
  // Only meaningful for "agent" and "landlord" roles. An agent or landlord
  // can operate as a lone individual or register as a company/agency.
  accountType: text("account_type", { enum: ["individual", "company"] }),
  companyName: text("company_name"),
  companyRegistrationNo: text("company_registration_no"),
  bio: text("bio"),
  phone: text("phone"),
  responseTime: text("response_time"),
  // Listing credits purchased via Paystack. Each new property listing
  // consumes one credit; landlords/agents top up through /dashboard billing.
  listingCredits: integer("listing_credits").notNull().default(0),
  // Agents and landlord companies must be verified by an admin before their
  // listings show as "verified" on the site. Plain individual landlords
  // default to verified since there is no company/agency claim to check.
  verificationStatus: text("verification_status", {
    enum: ["unverified", "pending", "verified", "rejected"],
  })
    .notNull()
    .default("unverified"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  landlordId: text("landlord_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  // Set when an agent lists/manages this property on the landlord's behalf.
  // Null means the landlord (or company) posted and manages it directly.
  agentId: text("agent_id").references(() => profiles.id, { onDelete: "set null" }),
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
  status: text("status", { enum: ["Paid", "Pending", "Overdue", "Failed"] }).notNull().default("Pending"),
  // Listing package purchase details (null for non-billing payment rows).
  packageId: text("package_id"),
  credits: integer("credits").notNull().default(0),
  paystackReference: text("paystack_reference").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: text("subject").notNull(),
  reason: text("reason").notNull(),
  status: text("status", { enum: ["Open", "Resolved"] }).notNull().default("Open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: text("tenant_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("favorites_tenant_property_idx").on(table.tenantId, table.propertyId)],
);

// Single-row-per-key admin settings store, backing the toggles on /admin.
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: boolean("value").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
