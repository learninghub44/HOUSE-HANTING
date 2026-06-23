import { AuthForm } from "@/components/auth-form";
import { Navigation } from "@/components/nav";

export default function ResetPasswordPage() {
  return (
    <>
      <Navigation />
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-surface px-4 py-12">
        <AuthForm mode="reset" />
      </main>
    </>
  );
}
