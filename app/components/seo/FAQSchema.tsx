export default function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",

    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Apakah Donara dibuat setiap hari?",

        acceptedAnswer: {
          "@type": "Answer",
          text: "Ya. Semua donat Donara dibuat fresh setiap hari menggunakan bahan berkualitas.",
        },
      },
      {
        "@type": "Question",
        name: "Dimana lokasi Donara?",

        acceptedAnswer: {
          "@type": "Answer",
          text: "Donara Street Food berlokasi di Jl. Nangka Raya No.21 Kranji Bekasi Barat.",
        },
      },
      {
        "@type": "Question",
        name: "Bagaimana cara memesan?",

        acceptedAnswer: {
          "@type": "Answer",
          text: "Pemesanan dapat dilakukan melalui WhatsApp yang tersedia pada website.",
        },
      },
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