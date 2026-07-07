"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PendingProfile = {
  id: string;
  role: string;
  accountType: string | null;
  companyName: string | null;
  phone: string | null;
  createdAt: string | Date;
};

export function VerificationQueue({ pending }: { pending: PendingProfile[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function decide(userId: string, status: "verified" | "rejected") {
    setBusyId(userId);
    try {
      await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (pending.length === 0) {
    return <p className="mt-4 text-sm text-slate-500">No agent or company accounts are waiting for review.</p>;
  }

  return (
    <div className="mt-4 grid gap-3">
      {pending.map((profile) => (
        <div key={profile.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface p-3">
          <div>
            <p className="flex items-center gap-1.5 font-medium text-primary">
              {profile.accountType === "company" && <Building2 className="h-4 w-4 text-accent" />}
              {profile.companyName ?? profile.id}
            </p>
            <p className="text-sm text-slate-600">
              {profile.role} · {profile.accountType ?? "individual"}
              {profile.phone ? ` · ${profile.phone}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={busyId === profile.id}
              onClick={() => decide(profile.id, "verified")}
              className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" /> Approve
            </Button>
            <Button
              type="button"
              disabled={busyId === profile.id}
              onClick={() => decide(profile.id, "rejected")}
              className="h-9 gap-1.5 bg-rose-600 hover:bg-rose-700"
            >
              <X className="h-4 w-4" /> Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
