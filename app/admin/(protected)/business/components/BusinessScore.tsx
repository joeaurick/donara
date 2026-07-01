type Props = {
  businessName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  openingHours: string;
  mapsUrl: string;
  mapsEmbed: string;
  logo: string;
};

export default function BusinessScore({
  businessName,
  tagline,
  address,
  phone,
  email,
  instagram,
  openingHours,
  mapsUrl,
  mapsEmbed,
  logo,
}: Props) {
  const checks = [
    businessName,
    tagline,
    address,
    phone,
    email,
    instagram,
    openingHours,
    mapsUrl,
    mapsEmbed,
    logo,
  ];

  const filled = checks.filter(
    (item) => (item ?? "").trim() !== ""
  ).length;

  const score = Math.round(
    (filled / checks.length) * 100
  );

  function getColor() {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  }

  function getText() {
    if (score >= 90) return "Sangat Baik";
    if (score >= 70) return "Cukup";
    return "Perlu Dilengkapi";
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-8 text-3xl font-black text-pink-600">
        📊 Business Score
      </h2>

      <div className="text-center">

        <div className={`text-7xl font-black ${getColor()}`}>
          {score}
        </div>

        <p className="mt-2 text-lg font-semibold">
          {getText()}
        </p>

      </div>

      <div className="mt-8 space-y-3">

        <Item ok={!!businessName}>Nama Bisnis</Item>
        <Item ok={!!tagline}>Tagline</Item>
        <Item ok={!!address}>Alamat</Item>
        <Item ok={!!phone}>WhatsApp</Item>
        <Item ok={!!email}>Email</Item>
        <Item ok={!!instagram}>Instagram</Item>
        <Item ok={!!openingHours}>Jam Operasional</Item>
        <Item ok={!!mapsUrl}>Maps URL</Item>
        <Item ok={!!mapsEmbed}>Maps Embed</Item>
        <Item ok={!!logo}>Logo</Item>

      </div>

    </div>
  );
}

function Item({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">

      <span>{children}</span>

      <span
        className={
          ok
            ? "font-bold text-green-600"
            : "font-bold text-red-500"
        }
      >
        {ok ? "✓" : "✕"}
      </span>

    </div>
  );
}