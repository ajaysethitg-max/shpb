import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import { getSheetData, getSettings, siteUrl, sheetUrls } from "@/lib/store";
import { SheetProvider } from "@/components/SheetProvider";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingActions from "@/components/FloatingActions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });
const tiro = Tiro_Devanagari_Hindi({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-tiro",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const url = siteUrl(s);
  const title = [s.shop_name, s.tagline].filter(Boolean).join(" | ");
  const description = s.hero_text || s.tagline || s.shop_name;
  const image = s.og_image || s.hero_image || undefined;
  return {
    metadataBase: new URL(url),
    title: { default: title, template: `%s | ${s.shop_name}` },
    description,
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: s.shop_name,
      title,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    icons: s.logo_image ? { icon: s.logo_image, apple: s.logo_image } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#14100c",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const initial = await getSheetData();
  const settings = initial.settings;
  const url = siteUrl(settings);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.shop_name,
    description: settings.hero_text || settings.tagline,
    image: settings.og_image || settings.hero_image || undefined,
    url,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address ? { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "IN" } : undefined,
    openingHours: settings.hours || undefined,
    sameAs: settings.instagram ? [settings.instagram] : undefined,
  };

  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable} ${tiro.variable}`}>
      <body className="bg-cream-50 font-sans text-espresso-900 antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SheetProvider initial={initial} urls={sheetUrls()}>
          <CartProvider>
            <Header />
            <main id="main" className="min-h-[60vh]">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <FloatingActions />
          </CartProvider>
        </SheetProvider>
      </body>
    </html>
  );
}
