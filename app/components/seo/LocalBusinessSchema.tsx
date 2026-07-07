import { createClient } from "@/lib/supabase/server";

export default async function LocalBusinessSchema() {
  const supabase = await createClient();

  const [{ data: business }, { data: settings }] =
    await Promise.all([
      supabase
        .from("business_profile")
        .select("*")
        .eq("id", 1)
        .maybeSingle(),

      supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle(),
    ]);

  const schema = {
    "@context": "https://schema.org",

    "@type": "Restaurant",

    name: business?.business_name,

    image: business?.logo,

    description: settings?.meta_description,

    telephone: business?.phone,

    email: business?.email,

    priceRange: business?.price_range,

    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000",

    address: {
      "@type": "PostalAddress",

      streetAddress: business?.address,

      addressLocality: "Bekasi",

      addressRegion: "Jawa Barat",

      postalCode: "17131",

      addressCountry: "ID",
    },

    openingHours: business?.opening_hours,

    sameAs: [
      business?.instagram
        ? `https://instagram.com/${business.instagram.replace("@", "")}`
        : "",
    ],

    hasMap: business?.maps_url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}