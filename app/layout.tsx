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

  console.log("SEO SETTINGS =>", seo);

  const siteTitle =
    seo?.site_title ||
    "Donara | Donat Lembut, Enak & Jajanan Murah Favorit";

  const description =
    seo?.meta_description ||
    "Nikmati donat lembut, empuk, dan fresh dari Donara. Cocok untuk camilan, ulang tahun, acara kantor, hingga snack box dengan harga terjangkau.";

  const keywords =
    seo?.keywords
      ?.split(",")
      .map((item: string) => item.trim()) || [];

  const siteUrl =
    seo?.canonical_url ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://donatku.vercel.app";

  return {
    title: siteTitle,

    description,

    keywords,

    robots: seo?.robots || "index,follow",

    verification: {
      google: seo?.google_verification || undefined,
    },

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
      siteName: "Donara",
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