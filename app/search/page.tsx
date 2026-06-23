import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/nav";
import { SearchPageContent } from "@/components/search-page-content";

export default function SearchPage() {
  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <Suspense fallback={<div className="container-page py-16 text-center text-sm text-slate-500">Loading search...</div>}>
          <SearchPageContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
