import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "House Hunt Kisii",
  description: "Premium verified rental marketplace for Kisii County.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
