"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, MessageSquare, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inquirySchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z.string().min(9, "Enter a valid phone number"),
  message: z.string().min(10, "Add a little more detail"),
});

type InquiryValues = z.infer<typeof inquirySchema>;

export function InquiryModal({ propertyTitle }: { propertyTitle: string }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "Hello, I would like to schedule a viewing and confirm move-in requirements.",
    },
  });

  async function onSubmit(values: InquiryValues) {
    setLoading(true);
    setError("");
    try {
      // TODO: replace with POST /api/inquiries once the backend is connected.
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.log("Inquiry captured locally (no backend yet):", { propertyTitle, ...values });
      setSubmitted(true);
    } catch {
      setError("Could not send your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setSubmitted(false);
      setError("");
      reset();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button size="lg" className="w-full"><MessageSquare className="h-4 w-4" /> Send inquiry</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-premium">
          {submitted ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <Dialog.Title className="text-xl font-semibold text-primary">Inquiry sent</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-slate-600">
                The landlord for &quot;{propertyTitle}&quot; will be notified. Replies will appear in your inquiry history.
              </Dialog.Description>
              <Dialog.Close asChild>
                <Button className="mt-5">Done</Button>
              </Dialog.Close>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Dialog.Title className="text-xl font-semibold text-primary">Ask about this home</Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-slate-500">{propertyTitle}</Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" aria-label="Close inquiry"><X className="h-4 w-4" /></Button>
                </Dialog.Close>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Full name
                  <Input {...register("name")} placeholder="Full name" />
                  {errors.name && <span className="text-xs text-rose-600">{errors.name.message}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Phone number
                  <Input {...register("phone")} type="tel" placeholder="+254 7XX XXX XXX" />
                  {errors.phone && <span className="text-xs text-rose-600">{errors.phone.message}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Message
                  <textarea
                    {...register("message")}
                    className="min-h-32 rounded-md border border-slate-200 p-3 text-sm focus-ring"
                  />
                  {errors.message && <span className="text-xs text-rose-600">{errors.message.message}</span>}
                </label>
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <Button type="submit" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send inquiry"}
                </Button>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
