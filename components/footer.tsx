import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-primary text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold">House Hunt Kisii</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            A verified rental marketplace built for serious tenants, professional landlords, and cleaner property discovery across Kisii County.
          </p>
        </div>
        {[
          ["Explore", "Search", "Featured", "Areas"],
          ["Account", "Login", "Register", "Tenant dashboard"],
          ["Company", "KYC", "Landlords", "Support"],
        ].map(([title, ...items]) => (
          <div key={title}>
            <p className="font-semibold">{title}</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              {items.map((item) => (
                <Link key={item} href={item === "Search" ? "/search" : "/"} className="hover:text-white">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
