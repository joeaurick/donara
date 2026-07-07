import { createClient } from "@/lib/supabase/server";

export default async function OrganizationSchema() {
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

  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",

    "@type": "Organization",

    "@id": `${url}#organization`,

    name: business?.business_name,

    url,

    logo: business?.logo,

    image: business?.logo,

    email: business?.email,

    telephone: business?.phone,

    description: settings?.meta_description,

    sameAs: [
      business?.instagram
        ? `https://instagram.com/${business.instagram.replace("@", "")}`
        : "",
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