import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/nav";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern use of House Hunt Kisii.",
};

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <section className="container-page py-14">
          <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Legal</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-primary">Terms of Use</h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: June 2026</p>

            <div className="mt-8 grid gap-7 text-slate-600">
              <div>
                <h2 className="text-lg font-semibold text-primary">1. Acceptance of terms</h2>
                <p className="mt-2 leading-7">
                  By creating an account or using House Hunt Kisii, you agree to these Terms of Use. If you do
                  not agree, please do not use the platform.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">2. Accounts and roles</h2>
                <p className="mt-2 leading-7">
                  House Hunt Kisii supports tenant, landlord, and admin accounts. Landlord accounts are subject
                  to review before listings are published. You are responsible for keeping your
                  account credentials secure and for the accuracy of information you provide.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">3. Listings</h2>
                <p className="mt-2 leading-7">
                  Landlords are responsible for the accuracy of their property listings, including rent,
                  availability, amenities, and photos. Listings found to be fraudulent, duplicated, or
                  materially misleading may be hidden, rejected, or removed at our discretion.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">4. Inquiries and conduct</h2>
                <p className="mt-2 leading-7">
                  Tenants and landlords agree to communicate respectfully through the platform. House Hunt
                  Kisii is a discovery and verification platform; we are not a party to any tenancy agreement
                  formed between a tenant and landlord, and we do not guarantee the outcome of any inquiry,
                  viewing, or rental arrangement.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">5. Subscriptions and payments</h2>
                <p className="mt-2 leading-7">
                  Landlord subscription plans (Free, Premium, Gold) unlock different listing limits and
                  features. Payments are processed through our payment partner and are non-refundable except
                  where required by law.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">6. Prohibited use</h2>
                <p className="mt-2 leading-7">
                  You may not use House Hunt Kisii to post false listings, duplicate or scrape content, harass
                  other users, or attempt to circumvent verification or security measures.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">7. Termination</h2>
                <p className="mt-2 leading-7">
                  We may suspend or terminate accounts that violate these terms, including repeated fraudulent
                  listings or abusive conduct toward other users.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">8. Changes to these terms</h2>
                <p className="mt-2 leading-7">
                  We may update these Terms of Use from time to time. Continued use of the platform after
                  changes take effect constitutes acceptance of the revised terms.
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
