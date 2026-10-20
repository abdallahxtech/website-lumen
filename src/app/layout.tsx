import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { site } from "@/content/site";
import { organizationJsonLd } from "@/lib/seo";
import { usingFixtures } from "@/content/listings";

const display = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../fonts/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  fallback: ["Garamond", "Georgia", "serif"],
});
const body = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "../fonts/figtree-latin-wght-normal.woff2", weight: "300 900", style: "normal" }],
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
});
const label = localFont({
  variable: "--font-label",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/lexend-exa-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/lexend-exa-latin-400-normal.woff2", weight: "400", style: "normal" },
  ],
  fallback: ["Century Gothic", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Lumen Realty · Dubai Real Estate Brokerage", template: "%s · Lumen Realty" },
  description:
    "Lumen Realty is a Dubai real estate brokerage for buying, selling, renting and off-plan investment, with considered advice and transparent costs.",
  applicationName: "Lumen Realty",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Lumen Realty",
    locale: "en_AE",
    url: "/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Lumen Realty, Dubai" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  robots: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1D2F49",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${display.variable} ${body.variable} ${label.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {usingFixtures && <div role="note" className="label bg-[#8a3226] px-4 py-2 text-center text-white">Test mode: sample data shown, not real listings</div>}
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </body>
    </html>
  );
}
