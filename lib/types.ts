/**
 * Single source of truth for shared status/entity types, derived from the
 * real Drizzle schema. Replaces the old lib/data.ts mock type exports.
 */
import type { inquiries, payments, profiles, properties } from "./db/schema";

export type Property = typeof properties.$inferSelect;
export type PropertyStatus = Property["status"];

export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryStatus = Inquiry["status"];

export type Payment = typeof payments.$inferSelect;
export type PaymentStatus = Payment["status"];

export type Profile = typeof profiles.$inferSelect;
export type UserRole = Profile["role"];
export type VerificationStatus = Profile["verificationStatus"];

export type Area = {
  name: string;
  count: number;
};
