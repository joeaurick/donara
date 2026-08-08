import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  Eye,
} from "lucide-react";

import { FaInstagram } from "react-icons/fa";

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
    <div className="w-full rounded-3xl border border-pink-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-pink-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 text-white">
            <Eye className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">
              Website Preview
            </p>

            <h2 className="text-xl font-black text-slate-900">
              Live Preview
            </h2>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 sm:p-6">
        <div className="w-full max-w-none overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
          {/* Top */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {logo ? (
                <img
                  src={logo}
                  alt={businessName}
                  className="h-16 w-16 rounded-2xl border border-pink-100 object-cover shadow-sm sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-2xl sm:h-20 sm:w-20 sm:text-3xl">
                  🍩
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                  {businessName || "Nama Bisnis"}
                </h3>

                <p className="mt-1 text-sm font-medium text-pink-600 sm:text-base">
                  {tagline || "Tagline Bisnis"}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-3 py-2 text-xs font-medium text-slate-600">
                  <Clock3 className="h-3.5 w-3.5 text-pink-500" />
                  {openingHours || "Jam Operasional"}
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-pink-100 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {/* Alamat */}
              <div className="min-w-0 rounded-2xl border border-pink-100 bg-pink-50/40 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Alamat
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700 break-words">
                      {address || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="min-w-0 rounded-2xl border border-pink-100 bg-pink-50/40 p-4">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      WhatsApp
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700 break-all">
                      {phone || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="min-w-0 rounded-2xl border border-pink-100 bg-pink-50/40 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Email
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700 break-all">
                      {email || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="min-w-0 rounded-2xl border border-pink-100 bg-pink-50/40 p-4">
                <div className="flex items-start gap-3">
                  <FaInstagram className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Instagram
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700 break-all">
                      {instagram || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}