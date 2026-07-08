"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const LABELS: Record<string, string> = {
  require_admin_approval: "Require admin approval before publishing",
  enable_ai_assistant_prompts: "Enable AI assistant prompts",
  review_reported_listings_before_removal: "Review reported listings before removal",
};

export function SettingsPanel({ initialSettings }: { initialSettings: Record<string, boolean> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function toggle(key: string) {
    const next = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: next })); // optimistic
    setPendingKey(key);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: next }),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch {
      setSettings((prev) => ({ ...prev, [key]: !next })); // revert
      setError("Could not save that setting. Try again.");
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(settings).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between gap-4 rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
            {LABELS[key] ?? key}
            {pendingKey === key ? (
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
            ) : (
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggle(key)}
                className="h-4 w-4 rounded border-slate-300 text-accent"
              />
            )}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
