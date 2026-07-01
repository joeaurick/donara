export default function SearchActionSchema() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",

    "@type": "WebSite",

    url,

    potentialAction: {
      "@type": "SearchAction",

      target: `${url}/?search={search_term_string}`,

      "query-input":
        "required name=search_term_string",
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