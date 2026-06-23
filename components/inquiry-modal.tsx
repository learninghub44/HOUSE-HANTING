"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InquiryModal({ propertyTitle }: { propertyTitle: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="lg" className="w-full"><MessageSquare className="h-4 w-4" /> Send inquiry</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-premium">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-primary">Ask about this home</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-slate-500">{propertyTitle}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close inquiry"><X className="h-4 w-4" /></Button>
            </Dialog.Close>
          </div>
          <form className="mt-5 grid gap-4">
            <Input placeholder="Full name" />
            <Input placeholder="Phone number" />
            <textarea className="min-h-32 rounded-md border border-slate-200 p-3 text-sm focus-ring" defaultValue="Hello, I would like to schedule a viewing and confirm move-in requirements." />
            <Button type="button">Send inquiry</Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
