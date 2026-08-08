import {
  CheckCircle2,
  XCircle,
  Gauge,
  Sparkles,
} from "lucide-react";
import { ReactNode } from "react";

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

  const score = Math.round((filled / checks.length) * 100);

  function getColor() {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  }

  function getRingColor() {
    if (score >= 90) return "ring-green-200 bg-green-50";
    if (score >= 70) return "ring-yellow-200 bg-yellow-50";
    return "ring-red-200 bg-red-50";
  }

  function getText() {
    if (score >= 90) return "Sangat Baik";
    if (score >= 70) return "Cukup";
    return "Perlu Dilengkapi";
  }

  return (
    <div className="rounded-3xl border border-pink-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-pink-50 bg-gradient-to-r from-pink-50/70 to-orange-50/40 px-6 py-5 md:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20">
            <Gauge className="h-5 w-5" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-600 ring-1 ring-pink-100">
              <Sparkles className="h-3.5 w-3.5" />
              Profile Health
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
              Business Score
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Nilai kelengkapan profil bisnis Donara berdasarkan data yang sudah
              Anda isi.
            </p>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-40 w-40 items-center justify-center rounded-full ring-8 ${getRingColor()}`}
          >
            <div>
              <div className={`text-5xl font-black ${getColor()}`}>
                {score}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                / 100
              </div>
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-sm font-semibold text-slate-700">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                score >= 90
                  ? "bg-green-500"
                  : score >= 70
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            {getText()}
          </div>
        </div>

        {/* Checklist */}
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
    </div>
  );
}

function Item({
  ok,
  children,
}: {
  ok: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-pink-50 bg-pink-50/30 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">
        {children}
      </span>

      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          ok
            ? "bg-green-50 text-green-600 ring-1 ring-green-100"
            : "bg-red-50 text-red-500 ring-1 ring-red-100"
        }`}
      >
        {ok ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}

        {ok ? "Lengkap" : "Kosong"}
      </div>
    </div>
  );
}