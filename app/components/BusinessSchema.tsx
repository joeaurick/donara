import { getBusinessProfile } from "@/lib/business";

export default async function BusinessSchema() {
  const business = await getBusinessProfile();

  if (!business) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Bakery",

    "@id": process.env.NEXT_PUBLIC_SITE_URL,

    name: business.business_name,

    image: business.logo,

    logo: business.logo,

    description: business.description,

    email: business.email,

    telephone: business.phone,

    priceRange: business.price_range,

    url: process.env.NEXT_PUBLIC_SITE_URL,

    address: {
      "@type": "PostalAddress",

      streetAddress: business.address,

      addressLocality: business.city,

      addressRegion: business.province,

      postalCode: business.postal_code,

      addressCountry: business.country,
    },

    geo: {
      "@type": "GeoCoordinates",

      latitude: business.latitude,

      longitude: business.longitude,
    },

    openingHours: business.opening_hours,

    sameAs: [
      `https://instagram.com/${business.instagram.replace("@","")}`,
    ],
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