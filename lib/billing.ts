export type ListingPackage = {
  id: "single" | "five" | "ten";
  label: string;
  credits: number;
  priceKes: number;
  blurb: string;
};

export const LISTING_PACKAGES: ListingPackage[] = [
  { id: "single", label: "1 Listing", credits: 1, priceKes: 200, blurb: "Try it out with a single property" },
  { id: "five", label: "5 Listings", credits: 5, priceKes: 500, blurb: "Best for individual landlords" },
  { id: "ten", label: "10 Listings", credits: 10, priceKes: 1500, blurb: "Best value for agents & companies" },
];

export function getListingPackage(id: string) {
  return LISTING_PACKAGES.find((pkg) => pkg.id === id) ?? null;
}
