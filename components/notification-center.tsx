import { Bell, CheckCircle2 } from "lucide-react";

export function NotificationCenter() {
  const notes = [
    "Viewing request received for Nyamataro one-bedroom.",
    "Listing approved and published in Kisii Town.",
    "Saved property price changed in Daraja Mbili.",
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><Bell className="h-5 w-5 text-accent" /> Notification Center</h2>
      <div className="mt-4 grid gap-3">
        {notes.map((note) => (
          <p key={note} className="flex gap-3 rounded-md bg-surface p-3 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {note}
          </p>
        ))}
      </div>
    </div>
  );
}
