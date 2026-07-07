import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { inquiries, payments, properties, reports, users } from "./db/schema";

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

export async function getPropertiesByArea(area: string) {
  return db.select().from(properties).where(eq(properties.area, area));
}

export type NewProperty = {
  landlordId: string;
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

// ---------- Users ----------

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
  return user ?? null;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ?? null;
}

export type NewUser = {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: "tenant" | "landlord" | "admin";
};

export async function createUser(data: NewUser) {
  const [user] = await db
    .insert(users)
    .values({ ...data, email: data.email.toLowerCase() })
    .returning();
  return user;
}

export async function getAllUsers() {
  return db.select().from(users).orderBy(desc(users.createdAt));
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
      tenantName: users.name,
    })
    .from(inquiries)
    .innerJoin(properties, eq(inquiries.propertyId, properties.id))
    .innerJoin(users, eq(inquiries.tenantId, users.id))
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
