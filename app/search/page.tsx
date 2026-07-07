import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/nav";
import { SearchPageContent } from "@/components/search-page-content";
import { AREA_INFO } from "@/lib/area-info";
import { getAllProperties } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const properties = await getAllProperties();
  const areaNames = AREA_INFO.map((area) => area.name);

  return (
    <>
      <Navigation />
      <main className="bg-surface">
        <Suspense fallback={<div className="container-page py-16 text-center text-sm text-slate-500">Loading search...</div>}>
          <SearchPageContent properties={properties} areaNames={areaNames} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
