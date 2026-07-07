import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { inquiries, payments, profiles, properties, reports } from "./db/schema";

// ---------- Properties ----------

export async function getAllProperties() {
  return db.select().from(properties).orderBy(desc(properties.createdAt));
}

export async function getPropertyById(id: string) {
  const [property] = await db.select().from(properties).where(eq(properties.id, id));
  return property ?? null;
}

export async function getPropertiesByLandlord(landlordId: string) {
  return db.select().from(properties).where(eq(properties.landlordId, landlordId)).orderBy(desc(properties.createdAt));
}

export async function getPropertiesByAgent(agentId: string) {
  return db.select().from(properties).where(eq(properties.agentId, agentId)).orderBy(desc(properties.createdAt));
}

export async function getPropertiesByArea(area: string) {
  return db.select().from(properties).where(eq(properties.area, area));
}

export type NewProperty = {
  landlordId: string;
  agentId?: string;
  title: string;
  location: string;
  area: string;
  type: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: string;
  image: string;
  gallery?: string[];
  amenities?: string[];
  description?: string;
};

export async function createProperty(data: NewProperty) {
  const [property] = await db.insert(properties).values(data).returning();
  return property;
}

export async function updatePropertyStatus(id: string, status: "Available" | "Reserved" | "Occupied" | "Under Maintenance") {
  const [property] = await db
    .update(properties)
    .set({ status, available: status === "Available" })
    .where(eq(properties.id, id))
    .returning();
  return property;
}

export async function getAreaCounts() {
  const rows = await db.select({ area: properties.area }).from(properties);
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.area, (counts.get(row.area) ?? 0) + 1);
  }
  return counts;
}

// ---------- Profiles ----------
// Identity (name, email, password) lives in Neon Auth's `neon_auth` schema.
// `profiles` only holds the app-specific fields (role, phone, response time),
// keyed by the Neon Auth user id.

export async function getProfile(userId: string) {
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId));
  return profile ?? null;
}

export type NewProfile = {
  id: string; // Neon Auth user id
  role: "tenant" | "agent" | "landlord" | "admin";
  accountType?: "individual" | "company";
  companyName?: string;
  companyRegistrationNo?: string;
  bio?: string;
  phone?: string;
  responseTime?: string;
};

export async function createProfile(data: NewProfile) {
  // Agents and landlord companies start out "pending" so an admin can vet
  // them before their listings show as verified. Everyone else (tenants,
  // individual landlords) has nothing to vet, so they're just "unverified"
  // by default (harmless — it only matters for the company/agent badge).
  const verificationStatus =
    (data.role === "agent" || (data.role === "landlord" && data.accountType === "company"))
      ? "pending"
      : "unverified";

  const [profile] = await db
    .insert(profiles)
    .values({ ...data, verificationStatus })
    .onConflictDoNothing({ target: profiles.id })
    .returning();
  return profile;
}

export async function getAllProfiles() {
  return db.select().from(profiles).orderBy(desc(profiles.createdAt));
}

// ---------- Verification (admin review of agents & landlord companies) ----------

export async function getPendingVerifications() {
  return db.select().from(profiles).where(eq(profiles.verificationStatus, "pending")).orderBy(desc(profiles.createdAt));
}

export async function setVerificationStatus(userId: string, status: "verified" | "rejected" | "pending" | "unverified") {
  const [profile] = await db.update(profiles).set({ verificationStatus: status }).where(eq(profiles.id, userId)).returning();
  return profile;
}

// ---------- Inquiries ----------

export async function createInquiry(propertyId: string, tenantId: string, message: string) {
  const [inquiry] = await db.insert(inquiries).values({ propertyId, tenantId, message }).returning();
  return inquiry;
}

export async function getInquiriesByTenant(tenantId: string) {
  return db
    .select({
      id: inquiries.id,
      message: inquiries.message,
      status: inquiries.status,
      createdAt: inquiries.createdAt,
      propertyTitle: properties.title,
    })
    .from(inquiries)
    .innerJoin(properties, eq(inquiries.propertyId, properties.id))
    .where(eq(inquiries.tenantId, tenantId))
    .orderBy(desc(inquiries.createdAt));
}

export async function getInquiriesForLandlord(landlordId: string) {
  return db
    .select({
      id: inquiries.id,
      message: inquiries.message,
      status: inquiries.status,
      createdAt: inquiries.createdAt,
      propertyTitle: properties.title,
      tenantId: inquiries.tenantId,
    })
    .from(inquiries)
    .innerJoin(properties, eq(inquiries.propertyId, properties.id))
    .where(eq(properties.landlordId, landlordId))
    .orderBy(desc(inquiries.createdAt));
}

// ---------- Payments ----------

export async function getPaymentsByUser(userId: string) {
  return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
}

export async function getAllPayments() {
  return db.select().from(payments).orderBy(desc(payments.createdAt));
}

// ---------- Reports (admin moderation) ----------

export async function getReports() {
  return db.select().from(reports).orderBy(desc(reports.createdAt));
}

export async function resolveReport(id: string) {
  const [report] = await db.update(reports).set({ status: "Resolved" }).where(eq(reports.id, id)).returning();
  return report;
}
