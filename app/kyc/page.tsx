import { AlertTriangle, CheckCircle2, Clock3, FileUp, ShieldCheck } from "lucide-react";
import { KycStatusBadge } from "@/components/badges";
import { Navigation } from "@/components/nav";
import { Button } from "@/components/ui/button";

export default function KycPage() {
  const states = [
    { title: "Verification Start", status: "Not Started" as const, icon: FileUp, copy: "Upload ID, landlord ownership documents, phone number, and property address evidence." },
    { title: "Verification Pending", status: "Pending" as const, icon: Clock3, copy: "Documents are queued for admin review with visibility into missing or unclear information." },
    { title: "Verification Approved", status: "Approved" as const, icon: CheckCircle2, copy: "Approved landlords receive verified badges on profiles and eligible property listings." },
    { title: "Verification Rejected", status: "Rejected" as const, icon: AlertTriangle, copy: "Rejected submissions show review notes and a direct path to resubmit corrected documents." },
  ];

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <section className="container-page py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">KYC UI</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold text-primary">Landlord verification flow</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">A complete state-driven interface for trust, document review, and listing verification.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {states.map((state) => {
              const Icon = state.icon;
              return (
                <article key={state.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-7 w-7 text-accent" />
                    <KycStatusBadge status={state.status} />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-primary">{state.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{state.copy}</p>
                  <div className="mt-5 rounded-md bg-surface p-4">
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-700"><ShieldCheck className="h-4 w-4 text-success" /> ID document</p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700"><ShieldCheck className="h-4 w-4 text-success" /> Property ownership proof</p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700"><ShieldCheck className="h-4 w-4 text-success" /> Contact verification</p>
                  </div>
                  <Button className="mt-5" variant={state.status === "Approved" ? "outline" : "default"}>{state.status === "Rejected" ? "Resubmit documents" : state.status === "Not Started" ? "Start verification" : "View details"}</Button>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
