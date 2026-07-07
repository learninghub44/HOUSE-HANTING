import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How House Hunt Kisii collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <section className="container-page py-14">
          <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Legal</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-primary">Privacy Policy</h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: June 2026</p>

            <div className="mt-8 grid gap-7 text-slate-600">
              <div>
                <h2 className="text-lg font-semibold text-primary">1. Information we collect</h2>
                <p className="mt-2 leading-7">
                  We collect information you provide directly, such as your name, email address, phone number,
                  and account role (tenant or landlord) when you register. We also collect property details,
                  photos, and inquiry messages submitted through the platform.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">2. How we use your information</h2>
                <p className="mt-2 leading-7">
                  We use the information we collect to operate and improve House Hunt Kisii, including
                  displaying property listings, facilitating inquiries between tenants and landlords,
                  processing subscription payments, sending notifications about your account or listings,
                  and detecting fraudulent or abusive activity.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">3. Payments</h2>
                <p className="mt-2 leading-7">
                  Subscription and listing payments are processed through our payment partner. We store payment
                  references, amounts, and statuses for your account history; we do not store your mobile money
                  PIN or full payment credentials.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">4. Sharing of information</h2>
                <p className="mt-2 leading-7">
                  We do not sell your personal information. Limited information is shared with tenants and
                  landlords to facilitate inquiries (such as a landlord&apos;s response time and verification
                  status, or a tenant&apos;s inquiry message), and with service providers who help us operate
                  the platform (such as payments and hosting providers).
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">5. Data retention</h2>
                <p className="mt-2 leading-7">
                  We retain account and listing information for as long as your account is active, and for a
                  reasonable period afterward to comply with legal obligations, resolve disputes, and enforce
                  our agreements.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">6. Your rights</h2>
                <p className="mt-2 leading-7">
                  You may request access to, correction of, or deletion of your personal information by
                  contacting us. Note that some information, such as records required for legal compliance, may
                  be retained even after an account is closed.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">7. Contact us</h2>
                <p className="mt-2 leading-7">
                  If you have questions about this Privacy Policy or how your information is handled, please
                  contact us through the support channels listed on our website.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
