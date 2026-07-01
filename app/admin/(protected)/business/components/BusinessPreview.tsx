type Props = {
  businessName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  openingHours: string;
  logo: string;
};

export default function BusinessPreview({
  businessName,
  tagline,
  address,
  phone,
  email,
  instagram,
  openingHours,
  logo,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-black text-pink-600">
        👀 Live Preview
      </h2>

      <div className="rounded-2xl border bg-gray-50 p-6">

        <div className="flex items-center gap-4">

          {logo ? (
            <img
              src={logo}
              alt={businessName}
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
              🍩
            </div>
          )}

          <div>

            <h3 className="text-2xl font-black">
              {businessName || "Nama Bisnis"}
            </h3>

            <p className="text-pink-600 font-medium">
              {tagline || "Tagline Bisnis"}
            </p>

            <p className="mt-1 text-gray-500">
              {openingHours || "Jam Operasional"}
            </p>

          </div>

        </div>

        <hr className="my-6" />

        <div className="space-y-3 text-gray-600">

          <p>📍 {address || "-"}</p>

          <p>📞 {phone || "-"}</p>

          <p>✉ {email || "-"}</p>

          <p>📷 {instagram || "-"}</p>

        </div>

      </div>

    </div>
  );
}