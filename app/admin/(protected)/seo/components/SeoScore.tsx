"use client";

type Props = {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  favicon: string;
  analytics: string;
};

export default function SeoScore({
  title,
  description,
  keywords,
  ogImage,
  favicon,
  analytics,
}: Props) {
  let score = 0;

  if (title.length >= 10 && title.length <= 60) score += 20;

  if (
    description.length >= 70 &&
    description.length <= 160
  ) {
    score += 20;
  }

  if (keywords.trim() !== "") score += 20;
  if (ogImage.trim() !== "") score += 15;
  if (favicon.trim() !== "") score += 15;
  if (analytics.trim() !== "") score += 10;

  function status(ok: boolean) {
    return ok ? "✅" : "❌";
  }

  function color() {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-pink-600">
          ⭐ SEO Score
        </h2>

        <p className="mt-2 text-gray-500">
          Evaluasi kelengkapan pengaturan SEO website Donara.
        </p>
      </div>

      <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h1 className={`text-6xl font-black ${color()}`}>
            {score}/100
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Semakin tinggi skor, semakin siap website untuk optimasi SEO.
          </p>
        </div>

        <div className="mt-8 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
            <span className="font-medium text-gray-700">
              Website Title
            </span>

            <span>
              {status(
                title.length >= 10 && title.length <= 60
              )}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
            <span className="font-medium text-gray-700">
              Meta Description
            </span>

            <span>
              {status(
                description.length >= 70 &&
                  description.length <= 160
              )}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
            <span className="font-medium text-gray-700">
              Keywords
            </span>

            <span>
              {status(keywords.trim() !== "")}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
            <span className="font-medium text-gray-700">
              Open Graph Image
            </span>

            <span>
              {status(ogImage.trim() !== "")}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
            <span className="font-medium text-gray-700">
              Favicon
            </span>

            <span>
              {status(favicon.trim() !== "")}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
            <span className="font-medium text-gray-700">
              Google Analytics
            </span>

            <span>
              {status(analytics.trim() !== "")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}