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
  )
    score += 20;
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
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-black text-pink-600">
        ⭐ SEO Score
      </h2>

      <div className="mb-8">

        <h1 className={`text-6xl font-black ${color()}`}>
          {score}/100
        </h1>

      </div>

      <div className="space-y-3 text-lg">

        <div className="flex justify-between">
          <span>Website Title</span>
          <span>{status(title.length >= 10 && title.length <= 60)}</span>
        </div>

        <div className="flex justify-between">
          <span>Meta Description</span>
          <span>{status(description.length >= 70 && description.length <= 160)}</span>
        </div>

        <div className="flex justify-between">
          <span>Keywords</span>
          <span>{status(keywords !== "")}</span>
        </div>

        <div className="flex justify-between">
          <span>Open Graph Image</span>
          <span>{status(ogImage !== "")}</span>
        </div>

        <div className="flex justify-between">
          <span>Favicon</span>
          <span>{status(favicon !== "")}</span>
        </div>

        <div className="flex justify-between">
          <span>Google Analytics</span>
          <span>{status(analytics !== "")}</span>
        </div>

      </div>

    </div>
  );
}