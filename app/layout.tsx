import BusinessSchema from "@/app/components/BusinessSchema";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { getSeoSettings } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  const siteTitle =
    seo?.site_title ||
    "Donara Street Food | Donat Premium Fresh Bekasi";

  const description =
    seo?.meta_description ||
    "Donara Street Food menyediakan donat premium fresh setiap hari dengan topping melimpah di Bekasi Barat.";

  const keywords =
    seo?.keywords
      ?.split(",")
      .map((item: string) => item.trim()) || [];

  const siteUrl =
    seo?.canonical_url ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  return {
    title: siteTitle,

    description,

    keywords,

    robots:
      seo?.robots || "index,follow",

    alternates: {
      canonical: siteUrl,
    },

    icons: seo?.favicon
      ? {
          icon: seo.favicon,
          shortcut: seo.favicon,
          apple: seo.favicon,
        }
      : undefined,

    openGraph: {
      type: "website",

      locale: "id_ID",

      url: siteUrl,

      siteName: "Donara Street Food",

      title: siteTitle,

      description,

      images: seo?.og_image
        ? [
            {
              url: seo.og_image,
              width: 1200,
              height: 630,
              alt: siteTitle,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",

      title: siteTitle,

      description,

      images: seo?.og_image
        ? [seo.og_image]
        : [],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">

      <body className={jakarta.className}>

  <BusinessSchema />

  {children}

  <Toaster
    position="top-right"
    toastOptions={{
      duration: 2500,
      style: {
        borderRadius: "14px",
        background: "#ffffff",
        color: "#222",
        fontWeight: "600",
        padding: "14px 18px",
      },
    }}
  />

</body>

    </html>
  );
}