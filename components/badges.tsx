"use client";

import { CheckCircle2, Clock3, ShieldCheck, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PaymentStatus, PropertyStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<PropertyStatus, string> = {
  Available: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Reserved: "border-amber-200 bg-amber-50 text-amber-700",
  Occupied: "border-slate-200 bg-slate-100 text-slate-700",
  "Under Maintenance": "border-blue-200 bg-blue-50 text-blue-700",
};

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  const Icon = status === "Under Maintenance" ? Wrench : status === "Available" ? CheckCircle2 : Clock3;
  return (
    <Badge className={cn("gap-1.5", statusStyles[status])}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status}
    </Badge>
  );
}

export function VerificationBadge({ verified }: { verified: boolean }) {
  return (
    <Badge className={verified ? "gap-1.5 border-blue-200 bg-blue-50 text-blue-700" : "gap-1.5 border-slate-200 bg-white text-slate-500"}>
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      {verified ? "Verified listing" : "Verification pending"}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    Paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Overdue: "border-rose-200 bg-rose-50 text-rose-700",
    Failed: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
}
