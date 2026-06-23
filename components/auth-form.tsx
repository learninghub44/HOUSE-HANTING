"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters").optional(),
});

type AuthValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const {
    register,
    formState: { errors },
  } = useForm<AuthValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const titles = {
    login: ["Welcome back", "Sign in to manage inquiries, favorites, and listings."],
    register: ["Create your account", "Join House Hunt Kisii as a tenant or landlord."],
    forgot: ["Recover access", "Enter your email and we will prepare a password reset flow."],
    reset: ["Set a new password", "Choose a secure password for your account."],
  };

  const [title, subtitle] = titles[mode];
  const showName = mode === "register";
  const showPassword = mode !== "forgot";

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <h1 className="font-serif text-3xl font-semibold text-primary">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      <form className="mt-6 grid gap-4">
        {showName ? (
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Full name
            <Input {...register("name")} placeholder="Jane Moraa" />
          </label>
        ) : null}
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email
          <Input {...register("email")} type="email" placeholder="you@example.com" />
          {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
        </label>
        {showPassword ? (
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Password
            <Input {...register("password")} type="password" placeholder="Minimum 8 characters" />
            {errors.password ? <span className="text-xs text-rose-600">{errors.password.message}</span> : null}
          </label>
        ) : null}
        <Button type="button" className="mt-2">
          {mode === "login" ? "Sign in" : mode === "forgot" ? "Send reset link" : mode === "reset" ? "Update password" : "Create account"}
        </Button>
      </form>
      <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-slate-600">
        {mode !== "login" ? <Link className="font-semibold text-accent" href="/login">Back to login</Link> : <Link className="font-semibold text-accent" href="/forgot-password">Forgot password?</Link>}
        {mode !== "register" ? <Link className="font-semibold text-accent" href="/register">Create account</Link> : null}
      </div>
    </div>
  );
}
