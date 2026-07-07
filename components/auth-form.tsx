"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

const roleEnum = z.enum(["tenant", "agent", "landlord"]);
const accountTypeEnum = z.enum(["individual", "company"]);

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters"),
    role: roleEnum,
    accountType: accountTypeEnum.optional(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((d) => d.role === "tenant" || !!d.accountType, {
    message: "Choose whether this is an individual or company account",
    path: ["accountType"],
  })
  .refine((d) => d.accountType !== "company" || !!d.companyName?.trim(), {
    message: "Enter your company or agency name",
    path: ["companyName"],
  });

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const resetSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string().min(8, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  role?: "tenant" | "agent" | "landlord";
  accountType?: "individual" | "company";
  companyName?: string;
  phone?: string;
};

const dashboardByRole: Record<string, string> = {
  tenant: "/dashboard/tenant",
  agent: "/dashboard/agent",
  landlord: "/dashboard/landlord",
  admin: "/admin",
};

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/dashboard/tenant");

  const schema =
    mode === "login" ? loginSchema
    : mode === "register" ? registerSchema
    : mode === "forgot" ? forgotSchema
    : resetSchema;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: { email: "", password: "" },
  });

  const watchedRole = watch("role");
  const watchedAccountType = watch("accountType");
  const showAccountType = mode === "register" && (watchedRole === "agent" || watchedRole === "landlord");

  async function onSubmit(data: FormValues) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      if (mode === "register") {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const body = await response.json();
        if (!response.ok) {
          setServerError(body.error ?? "Something went wrong. Please try again.");
          return;
        }
        // Sign in right away so the new user lands in their dashboard.
        await authClient.signIn.email({ email: data.email!, password: data.password! });
        setRedirectTo(dashboardByRole[data.role ?? "tenant"]);
        setSubmitted(true);
      } else if (mode === "login") {
        const { error } = await authClient.signIn.email({ email: data.email!, password: data.password! });
        if (error) {
          setServerError(error.message ?? "Invalid email or password.");
          return;
        }
        const meResponse = await fetch("/api/profile/me");
        const me = await meResponse.json();
        setRedirectTo(dashboardByRole[me?.profile?.role ?? "tenant"]);
        setSubmitted(true);
      } else if (mode === "forgot") {
        await authClient.requestPasswordReset({ email: data.email!, redirectTo: "/reset-password" });
        setSubmitted(true);
      } else {
        // reset — Neon Auth reads the reset token from the URL automatically.
        await authClient.resetPassword({ newPassword: data.password! });
        setSubmitted(true);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const titles: Record<string, [string, string]> = {
    login: ["Welcome back", "Sign in to manage inquiries, favourites, and listings."],
    register: ["Create your account", "Join House Hunt Kisii as a tenant, agent, or landlord."],
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
        {mode === "forgot" ? (
          <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
            Continue
          </Link>
        ) : (
          <button
            onClick={() => router.push(redirectTo)}
            className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
          >
            Continue
          </button>
        )}
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
          <>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              I am joining as
              <select
                {...register("role")}
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm focus-ring"
              >
                <option value="">Select role</option>
                <option value="tenant">Tenant — looking for a home</option>
                <option value="agent">Agent — I list properties for landlords</option>
                <option value="landlord">Landlord — I own property to rent out</option>
              </select>
              {errors.role && <span className="text-xs text-rose-600">{errors.role.message}</span>}
            </label>

            {showAccountType && (
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Account type
                <select
                  {...register("accountType")}
                  className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm focus-ring"
                >
                  <option value="">Select account type</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company / agency</option>
                </select>
                {errors.accountType && <span className="text-xs text-rose-600">{errors.accountType.message}</span>}
              </label>
            )}

            {showAccountType && watchedAccountType === "company" && (
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Company / agency name
                <Input {...register("companyName")} placeholder="e.g. Kisii Prime Properties Ltd" />
                {errors.companyName && <span className="text-xs text-rose-600">{errors.companyName.message}</span>}
              </label>
            )}

            {showAccountType && (
              <p className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                Agent and company accounts are reviewed by our team before listings show as verified. You can still browse and set up your profile in the meantime.
              </p>
            )}

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Phone number
              <Input {...register("phone")} placeholder="+254 7XX XXX XXX" />
            </label>
          </>
        )}

        {serverError && <p className="text-sm text-rose-600">{serverError}</p>}

        <Button type="submit" className="mt-2" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait…"
            : mode === "login" ? "Sign in"
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
