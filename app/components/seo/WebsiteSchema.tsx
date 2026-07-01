import { createClient } from "@/lib/supabase/server";

export default async function WebsiteSchema() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",

    "@type": "WebSite",

    "@id": `${url}#website`,

    url,

    name: data?.site_title,

    description: data?.meta_description,

    inLanguage: "id-ID",

    publisher: {
      "@id": `${url}#organization`,
    },
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