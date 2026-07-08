import { desc, eq, sql } from "drizzle-orm";
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

/**
 * Property plus the landlord's public contact info. Identity (name, email)
 * lives in Neon Auth's managed `neon_auth.users_sync` table, which Neon
 * keeps in sync with the auth provider automatically — we only read from it.
 */
export async function getPropertyWithLandlord(id: string) {
  const result = await db.execute<{
    id: string;
    landlord_id: string;
    agent_id: string | null;
    title: string;
    location: string;
    area: string;
    type: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    size: string | null;
    status: "Available" | "Reserved" | "Occupied" | "Under Maintenance";
    verified: boolean;
    available: boolean;
    image: string;
    gallery: string[];
    amenities: string[];
    description: string;
    created_at: string;
    landlord_name: string | null;
    landlord_phone: string | null;
    landlord_response_time: string | null;
  }>(sql`
    select
      p.*,
      u.name as landlord_name,
      pr.phone as landlord_phone,
      pr.response_time as landlord_response_time
    from properties p
    inner join profiles pr on pr.id = p.landlord_id
    left join neon_auth.users_sync u on u.id = p.landlord_id
    where p.id = ${id}
    limit 1
  `);
  const row = result.rows[0];
  if (!row) return null;

  const { landlord_name, landlord_phone, landlord_response_time, landlord_id, agent_id, created_at, ...rest } = row;
  return {
    ...rest,
    landlordId: landlord_id,
    agentId: agent_id,
    createdAt: new Date(created_at),
    landlord: {
      name: landlord_name ?? "Landlord",
      phone: landlord_phone ?? "Not provided",
      responseTime: landlord_response_time ?? "Response time varies",
    },
  };
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

export async function createPropertyConsumingCredit(data: NewProperty & { creditHolderId?: string }) {
  const { creditHolderId, ...propertyData } = data;
  const payerId = creditHolderId ?? data.landlordId;
  return db.transaction(async (tx) => {
    const [profile] = await tx.select().from(profiles).where(eq(profiles.id, payerId));
    if (!profile || profile.listingCredits < 1) {
      return { ok: false as const, error: "insufficient_credits" as const };
    }

    const [property] = await tx.insert(properties).values(propertyData).returning();

    await tx
      .update(profiles)
      .set({ listingCredits: sql`${profiles.listingCredits} - 1` })
      .where(eq(profiles.id, payerId));

    return { ok: true as const, property };
  });
}

export async function updatePropertyStatus(id: string, status: "Available" | "Reserved" | "Occupied" | "Under Maintenance") {
  const [property] = await db
    .update(properties)
    .set({ status, available: status === "Available" })
    .where(eq(properties.id, id))
    .returning();
  return property;
}

export async function getRecommendedProperties(limit = 3) {
  return db
    .select()
    .from(properties)
    .where(eq(properties.status, "Available"))
    .orderBy(desc(properties.createdAt))
    .limit(limit);
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

export async function searchLandlords(query: string) {
  const term = `%${query.trim()}%`;
  const result = await db.execute<{ id: string; name: string | null; phone: string | null }>(sql`
    select pr.id, u.name, pr.phone
    from profiles pr
    left join neon_auth.users_sync u on u.id = pr.id
    where pr.role = 'landlord'
      and (u.name ilike ${term} or pr.phone ilike ${term})
    order by u.name
    limit 10
  `);
  return result.rows.map((row) => ({ id: row.id, name: row.name ?? "Unnamed landlord", phone: row.phone ?? "" }));
}

export async function getAllProfilesWithContact() {
  const result = await db.execute<{
    id: string;
    role: "tenant" | "agent" | "landlord" | "admin";
    name: string | null;
    email: string | null;
    created_at: string;
  }>(sql`
    select pr.id, pr.role, pr.created_at, u.name, u.email
    from profiles pr
    left join neon_auth.users_sync u on u.id = pr.id
    order by pr.created_at desc
  `);
  return result.rows.map((row) => ({
    id: row.id,
    role: row.role,
    name: row.name ?? "Unknown",
    email: row.email ?? "—",
    createdAt: new Date(row.created_at),
  }));
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

export async function getInquiriedPropertiesByTenant(tenantId: string) {
  const rows = await db
    .selectDistinctOn([properties.id], { property: properties })
    .from(inquiries)
    .innerJoin(properties, eq(inquiries.propertyId, properties.id))
    .where(eq(inquiries.tenantId, tenantId))
    .orderBy(properties.id, desc(inquiries.createdAt));
  return rows.map((row) => row.property);
}

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

// ---------- Payments / billing ----------

export async function getPaymentsByUser(userId: string) {
  return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
}

export async function getAllPayments() {
  return db.select().from(payments).orderBy(desc(payments.createdAt));
}

export async function getPaymentByReference(reference: string) {
  const [payment] = await db.select().from(payments).where(eq(payments.paystackReference, reference));
  return payment ?? null;
}

export type NewPendingPayment = {
  userId: string;
  item: string;
  amount: number;
  packageId: string;
  credits: number;
  paystackReference: string;
};

export async function createPendingPayment(data: NewPendingPayment) {
  const [payment] = await db
    .insert(payments)
    .values({ ...data, amount: data.amount.toString(), status: "Pending" })
    .returning();
  return payment;
}

/**
 * Marks a pending payment as paid and credits the buyer's listing balance,
 * in one transaction so a webhook retry can never double-credit.
 */
export async function markPaymentPaidAndGrantCredits(reference: string) {
  return db.transaction(async (tx) => {
    const [payment] = await tx.select().from(payments).where(eq(payments.paystackReference, reference));
    if (!payment) return null;
    if (payment.status === "Paid") return payment; // already processed, idempotent no-op

    const [updated] = await tx
      .update(payments)
      .set({ status: "Paid" })
      .where(eq(payments.id, payment.id))
      .returning();

    await tx
      .update(profiles)
      .set({ listingCredits: sql`${profiles.listingCredits} + ${payment.credits}` })
      .where(eq(profiles.id, payment.userId));

    return updated;
  });
}

export async function markPaymentFailed(reference: string) {
  const [payment] = await db
    .update(payments)
    .set({ status: "Failed" })
    .where(eq(payments.paystackReference, reference))
    .returning();
  return payment;
}

export async function consumeListingCredit(landlordId: string) {
  return db.transaction(async (tx) => {
    const [profile] = await tx.select().from(profiles).where(eq(profiles.id, landlordId));
    if (!profile || profile.listingCredits < 1) return false;

    await tx
      .update(profiles)
      .set({ listingCredits: sql`${profiles.listingCredits} - 1` })
      .where(eq(profiles.id, landlordId));

    return true;
  });
}

// ---------- Reports (admin moderation) ----------

export async function getReports() {
  return db.select().from(reports).orderBy(desc(reports.createdAt));
}

export async function resolveReport(id: string) {
  const [report] = await db.update(reports).set({ status: "Resolved" }).where(eq(reports.id, id)).returning();
  return report;
}
