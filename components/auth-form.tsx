"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
  role: z.enum(["tenant", "landlord"]),
});

const loginSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
  role: z.enum(["tenant", "landlord"]).optional(),
});

const forgotSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email address"),
  password: z.string().optional(),
  role: z.enum(["tenant", "landlord"]).optional(),
});

const resetSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(8, "Use at least 8 characters"),
  confirm: z.string().min(8, "Confirm your password"),
  role: z.enum(["tenant", "landlord"]).optional(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type FormValues = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  role?: "tenant" | "landlord";
};

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const [submitted, setSubmitted] = useState(false);

  const schema =
    mode === "login" ? loginSchema
    : mode === "register" ? registerSchema
    : mode === "forgot" ? forgotSchema
    : resetSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(_data: FormValues) {
    // TODO: wire to backend API
    setSubmitted(true);
  }

  const titles: Record<string, [string, string]> = {
    login: ["Welcome back", "Sign in to manage inquiries, favourites, and listings."],
    register: ["Create your account", "Join House Hunt Kisii as a tenant or landlord."],
    forgot: ["Recover access", "Enter your email and we will send a password reset link."],
    reset: ["Set a new password", "Choose a secure password for your account."],
  };

  const [title, subtitle] = titles[mode];

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-card text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-semibold text-primary">
          {mode === "login" ? "Signed in" : mode === "forgot" ? "Reset link sent" : mode === "reset" ? "Password updated" : "Account created"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {mode === "forgot"
            ? "Check your inbox for the reset link."
            : "You can now access your dashboard."}
        </p>
        <Link href={mode === "forgot" ? "/login" : "/dashboard/tenant"} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          Continue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <h1 className="font-serif text-3xl font-semibold text-primary">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        {mode === "register" && (
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Full name
            <Input {...register("name")} placeholder="Jane Moraa" />
            {errors.name && <span className="text-xs text-rose-600">{errors.name.message}</span>}
          </label>
        )}

        {mode !== "reset" && (
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email
            <Input {...register("email")} type="email" placeholder="you@example.com" />
            {errors.email && <span className="text-xs text-rose-600">{errors.email.message}</span>}
          </label>
        )}

        {mode !== "forgot" && (
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Password
            <Input {...register("password")} type="password" placeholder="Minimum 8 characters" />
            {errors.password && <span className="text-xs text-rose-600">{errors.password.message}</span>}
          </label>
        )}

        {mode === "reset" && (
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Confirm password
            <Input {...register("confirm")} type="password" placeholder="Repeat your password" />
            {(errors as { confirm?: { message?: string } }).confirm && (
              <span className="text-xs text-rose-600">{(errors as { confirm?: { message?: string } }).confirm?.message}</span>
            )}
          </label>
        )}

        {mode === "register" && (
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            I am joining as
            <select
              {...register("role")}
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm focus-ring"
            >
              <option value="">Select role</option>
              <option value="tenant">Tenant — looking for a home</option>
              <option value="landlord">Landlord — listing a property</option>
            </select>
            {errors.role && <span className="text-xs text-rose-600">{errors.role.message}</span>}
          </label>
        )}

        <Button type="submit" className="mt-2">
          {mode === "login" ? "Sign in"
            : mode === "forgot" ? "Send reset link"
            : mode === "reset" ? "Update password"
            : "Create account"}
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-slate-600">
        {mode === "login" ? (
          <>
            <Link className="font-semibold text-accent hover:underline" href="/forgot-password">Forgot password?</Link>
            <Link className="font-semibold text-accent hover:underline" href="/register">Create account</Link>
          </>
        ) : (
          <Link className="font-semibold text-accent hover:underline" href="/login">Back to sign in</Link>
        )}
      </div>
    </div>
  );
}
