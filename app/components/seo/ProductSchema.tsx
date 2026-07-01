import { createClient } from "@/lib/supabase/server";

export default async function ProductSchema() {
  const supabase = await createClient();

  const [{ data: products }, { data: business }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("id"),

      supabase
        .from("business_profile")
        .select("*")
        .eq("id", 1)
        .single(),
    ]);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const schemas =
    (products ?? []).map((product) => ({
      "@context": "https://schema.org",
      "@type": "Product",

      name: product.name,

      image: product.image
        ? [product.image]
        : [],

      description: product.description,

      brand: {
        "@type": "Brand",
        name: business?.business_name ?? "Donara Street Food",
      },

      offers: {
        "@type": "Offer",

        price: product.price,

        priceCurrency: "IDR",

        availability:
          "https://schema.org/InStock",

        url: baseUrl,
      },

      aggregateRating: {
        "@type": "AggregateRating",

        ratingValue: product.rating || 5,

        reviewCount: 1,
      },
    }));

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}