import { createClient } from "@/lib/supabase/server";

export default async function ReviewSchema() {
  const supabase = await createClient();

  const [{ data: reviews }, { data: business }] =
    await Promise.all([
      supabase
        .from("reviews")
        .select("*")
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("business_profile")
        .select("*")
        .eq("id", 1)
        .maybeSingle(),
    ]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const schemas = reviews.map((review) => ({
    "@context": "https://schema.org",

    "@type": "Review",

    author: {
      "@type": "Person",
      name: review.name,
    },

    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },

    reviewBody: review.comment,

    itemReviewed: {
      "@type": "Restaurant",
      name:
        business?.business_name ??
        "Donara Street Food",
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